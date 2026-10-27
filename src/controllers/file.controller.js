const fs = require("fs/promises");
const fsSync = require("fs");
const path = require("path");
const { successResponse, errorResponse } = require("../utils/response.util");

const UPLOAD_DIR = path.join(__dirname, "../../uploads");

async function listFile(req, res, next) {
    const files = await fs.readdir(UPLOAD_DIR, { withFileTypes: true });
    console.log('files', files);
    return successResponse(res, "Files retrieved successfully", files);
}

async function uploadFile(req, res, next) {
    try {
        console.log(req.file);

        if (!req.file) {
            return errorResponse(res, "No file uploaded", 400);
        }

        return successResponse(
            res,
            "File uploaded successfully",
            {
                filename: req.file.originalname,
                saveName: req.file.filename,
                mimetype: req.file.mimetype,
                size: req.file.size,
                path: req.file.path,
            },
            201,
        );
    } catch (error) {
        next(error);
    }
}

module.exports = {
    listFile,
    uploadFile,
};
