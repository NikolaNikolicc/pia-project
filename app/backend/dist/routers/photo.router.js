"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const photo_controller_1 = require("../controllers/photo.controller");
const photoRouter = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
photoRouter.route('/savePhoto').post(upload.single('imageBlob'), // This middleware handles the file upload
(req, res) => new photo_controller_1.PhotoController().savePhoto(req, res));
photoRouter.route('/savePhotos').post(upload.array("images"), (req, res) => new photo_controller_1.PhotoController().savePhotos(req, res));
photoRouter.route('/getUserPhoto').post((req, res) => new photo_controller_1.PhotoController().getUserPhoto(req, res));
exports.default = photoRouter;
