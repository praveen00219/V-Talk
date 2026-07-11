import React, { useEffect, useState } from "react";
import { getOtherUser } from "../HelperFunction/chat.Helper";
import { decryptMessageText } from "../HelperFunction/e2ee.Helper";

// Renders a message's text, decrypting E2EE content client-side.
// text state: undefined = decrypting, null = can't decrypt, string = plaintext
const EncryptedText = ({ message, chat, loggedUser }) => {
  const [text, setText] = useState(
    message.encrypted ? undefined : message.content
  );

  useEffect(() => {
    if (!message.encrypted) {
      setText(message.content);
      return;
    }
    let alive = true;
    const otherUser =
      chat && !chat.isGroupChat ? getOtherUser(loggedUser, chat.users) : null;
    decryptMessageText(loggedUser._id, otherUser, message).then((plaintext) => {
      if (alive) {
        setText(plaintext);
      }
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message._id, message.content, message.encrypted]);

  if (message.encrypted && text === undefined) {
    return <span className="opacity-50">🔒 …</span>;
  }
  if (message.encrypted && text === null) {
    return (
      <em className="opacity-80">
        🔒 Couldn't decrypt this message on this device
      </em>
    );
  }
  return <>{text}</>;
};

export default EncryptedText;
