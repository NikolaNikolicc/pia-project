"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_1 = __importDefault(require("../models/user"));
const photo_controller_1 = require("./photo.controller");
class UserController {
    constructor() {
        this.getUserByUsername = (req, res) => {
            let username = req.body.username;
            user_1.default.findOne({ username: username }).then(user => {
                if (user) {
                    res.json({ message: JSON.stringify(user) });
                }
                else {
                    res.json({ message: "User with this username has not been found." });
                }
            }).catch(err => console.log(err));
        };
        this.getUserByEmail = (req, res) => {
            let email = req.body.email;
            user_1.default.findOne({ email: email }).then(user => {
                if (user) {
                    res.json({ message: JSON.stringify(user) });
                }
                else {
                    res.json({ message: "User with this email has not been found." });
                }
            }).catch(err => console.log(err));
        };
        this.saveUser = (req, res) => {
            let user = req.body;
            new user_1.default(user).save().then(ok => {
                console.log("User stored succesfully.");
                res.json({ message: "ok" });
            }).catch(err => {
                console.log(err);
            });
        };
        new photo_controller_1.PhotoController(); // in case first user doesn't want to upload photo we need to create default directory by creating photo controller and its constructor
    }
}
exports.UserController = UserController;
