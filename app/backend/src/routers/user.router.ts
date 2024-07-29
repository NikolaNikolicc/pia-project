import express from 'express'
import { UserController } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.route('/saveUser').post(
    (req, res)=> new UserController().saveUser(req, res)
);

userRouter.route('/getUserByEmail').post(
    (req, res)=> new UserController().getUserByEmail(req, res)
);

userRouter.route('/getUserByUsername').post(
    (req, res)=> new UserController().getUserByUsername(req, res)
);

export default userRouter;