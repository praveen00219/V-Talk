// End-to-end encryption helpers (1-on-1 chats).
//
// Each user gets an ECDH P-256 keypair generated in this browser. The private
// key is non-extractable and lives only in this browser's IndexedDB; the
// public key (JWK JSON) is uploaded to the server. Both chat partners derive
// the same AES-GCM 256 key from ECDH(myPrivate, theirPublic), so no key
// exchange messages are needed. The server and database only ever see
// base64 ciphertext + iv.
import axios from "axios";
import SERVER_ACCESS_BASE_URL from "../config/serverConfig";

const DB_NAME = "vtalk-e2ee";
const STORE = "keys";

const openDb = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const idbGet = async (key) => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE, "readonly").objectStore(STORE).get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const idbSet = async (key, value) => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db
      .transaction(STORE, "readwrite")
      .objectStore(STORE)
      .put(value, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// in-memory caches (cleared on page reload)
let keyPairCache = null; // { userId, privateKey, publicJwk }
const chatKeyCache = new Map(); // `${otherUserId}:${theirJwk}` -> AES-GCM CryptoKey
const plaintextCache = new Map(); // messageId -> decrypted text

const toBase64 = (buffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buffer)));
const fromBase64 = (text) =>
  Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

// load (or create) this browser's keypair for the logged-in user
export const getOrCreateKeyPair = async (userId) => {
  if (keyPairCache && keyPairCache.userId === userId) {
    return keyPairCache;
  }
  const stored = await idbGet(`keypair:${userId}`);
  if (stored && stored.privateKey && stored.publicJwk) {
    keyPairCache = { userId, ...stored };
    return keyPairCache;
  }
  const pair = await window.crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    false, // private key is non-extractable: it can never leave this browser
    ["deriveKey"]
  );
  const publicJwk = await window.crypto.subtle.exportKey("jwk", pair.publicKey);
  await idbSet(`keypair:${userId}`, { privateKey: pair.privateKey, publicJwk });
  keyPairCache = { userId, privateKey: pair.privateKey, publicJwk };
  return keyPairCache;
};

// make sure the server has this browser's public key (idempotent)
export const ensureE2EEKeys = async (user) => {
  if (!user || !user._id || !window.crypto || !window.crypto.subtle) {
    return null;
  }
  const pair = await getOrCreateKeyPair(user._id);
  const serialized = JSON.stringify(pair.publicJwk);
  if (user.publicKey !== serialized) {
    await axios({
      method: "PUT",
      url: `${SERVER_ACCESS_BASE_URL}/api/user/publickey`,
      data: { publicKey: serialized },
    });
  }
  return pair;
};

// derive (and cache) the shared AES-GCM key for a 1-on-1 chat partner
const deriveChatKey = async (userId, otherUser) => {
  const cacheKey = `${otherUser._id}:${otherUser.publicKey}`;
  if (chatKeyCache.has(cacheKey)) {
    return chatKeyCache.get(cacheKey);
  }
  const pair = await getOrCreateKeyPair(userId);
  const theirPublicKey = await window.crypto.subtle.importKey(
    "jwk",
    JSON.parse(otherUser.publicKey),
    { name: "ECDH", namedCurve: "P-256" },
    false,
    []
  );
  const chatKey = await window.crypto.subtle.deriveKey(
    { name: "ECDH", public: theirPublicKey },
    pair.privateKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
  chatKeyCache.set(cacheKey, chatKey);
  return chatKey;
};

// encrypt outgoing text for a chat partner -> { content, iv } (both base64)
export const encryptTextForUser = async (userId, otherUser, text) => {
  const chatKey = await deriveChatKey(userId, otherUser);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    chatKey,
    new TextEncoder().encode(text)
  );
  return { content: toBase64(ciphertext), iv: toBase64(iv) };
};

// decrypt a message for display; returns the plaintext, or null when it can't
// be decrypted (missing keys, or it was encrypted for a different device)
export const decryptMessageText = async (userId, otherUser, message) => {
  if (!message.encrypted) {
    return message.content;
  }
  if (plaintextCache.has(message._id)) {
    return plaintextCache.get(message._id);
  }
  try {
    if (!otherUser || !otherUser.publicKey || !message.iv) {
      return null;
    }
    const chatKey = await deriveChatKey(userId, otherUser);
    const buffer = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromBase64(message.iv) },
      chatKey,
      fromBase64(message.content)
    );
    const text = new TextDecoder().decode(buffer);
    plaintextCache.set(message._id, text);
    return text;
  } catch (error) {
    return null;
  }
};
