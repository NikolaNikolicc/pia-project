"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const userRouter = express_1.default.Router();
userRouter.route('/saveUser').post((req, res) => new user_controller_1.UserController().saveUser(req, res));
userRouter.route('/getUserByEmail').post((req, res) => new user_controller_1.UserController().getUserByEmail(req, res));
userRouter.route('/getUserByUsername').post((req, res) => new user_controller_1.UserController().getUserByUsername(req, res));
userRouter.route('/login').post((req, res) => new user_controller_1.UserController().login(req, res));
userRouter.route('/changePassword').post((req, res) => new user_controller_1.UserController().changePassword(req, res));
userRouter.route('/getAllPendingUsers').post((req, res) => new user_controller_1.UserController().getAllPendingUsers(req, res));
userRouter.route('/updateUserStatus').post((req, res) => new user_controller_1.UserController().updateUserStatus(req, res));
userRouter.route('/saveProfileUpdate').post((req, res) => new user_controller_1.UserController().saveProfileUpdate(req, res));
exports.default = userRouter;
