import express from 'express';
import multer from 'multer';
import { OwnerController } from '../controllers/owner.controller';

const ownerRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

ownerRouter.route('/createAppointment').post(
    (req, res) => new OwnerController().createAppointment(req, res)
);


export default ownerRouter;
