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

photoRouter.route('/savePhotos').post(
    upload.array("images"),
    (req, res) => new PhotoController().savePhotos(req, res)
);

photoRouter.route('/getUserPhoto').post(
    (req, res) => new PhotoController().getUserPhoto(req, res)
);

photoRouter.route('/getPhotos').post(
    (req, res) => new PhotoController().getPhotos(req, res)
);

export default photoRouter;
