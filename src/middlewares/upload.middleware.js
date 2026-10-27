const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4 } = require("uuid");

const UPLOAD_DIR = path.join(__dirname, "../../uploads");

// check if the upload directory exists, if not create it
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const id = v4();
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${id}${ext}`);
    },
});

const filter = (req, file, cb) => {
    // Accept only certain file types (e.g., images and PDFs)
    const allowedTypes = /jpeg|jpg|png|webp|pdf/;
    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Error: File type not supported!"));
    }
};

const upload = multer({
    storage: storage,
    limits: { files: 10, fileSize: 400 * 1024 }, // Limit file size to 400kb
    fileFilter: filter,
});

module.exports = upload;
