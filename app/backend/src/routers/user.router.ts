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

userRouter.route('/login').post(
    (req, res)=> new UserController().login(req, res)
);

userRouter.route('/changePassword').post(
    (req, res)=> new UserController().changePassword(req, res)
);

userRouter.route('/getAllPendingUsers').post(
    (req, res)=> new UserController().getAllPendingUsers(req, res)
);

userRouter.route('/updateUserStatus').post(
    (req, res)=> new UserController().updateUserStatus(req, res)
);

export default userRouter;