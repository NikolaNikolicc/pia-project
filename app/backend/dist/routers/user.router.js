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
exports.default = userRouter;
