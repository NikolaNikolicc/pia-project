import express from 'express'
import { UserController } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.route('/saveUser').post(
    (req, res)=> new UserController().saveUser(req, res)
);

export default userRouter;