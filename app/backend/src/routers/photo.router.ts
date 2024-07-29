import express from 'express';
import multer from 'multer';
import { PhotoController } from '../controllers/photo.controller';

const photoRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

photoRouter.route('/savePhoto').post(
    upload.single('imageBlob'), // This middleware handles the file upload
    (req, res) => new PhotoController().savePhoto(req, res)
);

export default photoRouter;
