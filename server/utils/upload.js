const multer = require("multer");

// diskStorage with no destination => OS temp dir. Controllers upload the temp
// file to Cloudinary and then remove it (see removeTempFile below).
const storage = multer.diskStorage({});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

// Broad allowlist for chat attachments; blocks executables/scripts implicitly.
const ATTACHMENT_TYPES = [
  ...IMAGE_TYPES,
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "application/pdf",
  "text/plain",
  "application/zip",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const makeFilter = (allowed) => (req, file, cb) => {
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error(`Unsupported file type: ${file.mimetype}`));
};

// Profile pictures: images only.
const imageUpload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: makeFilter(IMAGE_TYPES),
});

// Message attachments: up to 10 files.
const attachmentUpload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE, files: 10 },
  fileFilter: makeFilter(ATTACHMENT_TYPES),
});

module.exports = { imageUpload, attachmentUpload };
