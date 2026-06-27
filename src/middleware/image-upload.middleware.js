import multer from "multer";

const storage = multer.memoryStorage();

// File filter to accept only images and PDFs
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "application/pdf"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only images and PDF files are allowed"));
    }
};

export const uploadFile = multer({
    storage,
    fileFilter
});