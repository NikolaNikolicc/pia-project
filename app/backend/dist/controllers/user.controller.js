"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_1 = __importDefault(require("../models/user"));
const photo_controller_1 = require("./photo.controller");
class UserController {
    constructor() {
        this.getAllPendingUsers = (req, res) => {
            user_1.default.find({ pendingApproval: 0 }).then(ok => res.json({ message: JSON.stringify(ok) }));
        };
        this.updateUserStatus = (req, res) => {
            const user = JSON.parse(req.body.user);
            user_1.default.updateOne({ username: user.username }, { $set: { pendingApproval: user.pendingApproval, comment: user.comment } }).then(ok => res.json({ message: "ok" })).catch(err => {
                console.log(err);
                res.json({ message: "error" });
            });
        };
        this.saveProfileUpdate = (req, res) => {
            const user = JSON.parse(req.body.user);
            user_1.default.updateOne({ username: user.username }, { $set: { name: user.name, surname: user.surname, address: user.address, phone: user.phone, email: user.email, creditCard: user.creditCard } }).then(ok => res.json({ message: "ok" })).catch(err => {
                console.log(err);
                res.json({ message: "error" });
            });
        };
        this.changePassword = (req, res) => {
            let user = req.body;
            user_1.default.updateOne({ username: user.username }, { $set: { password: user.password } }).then(ok => res.json({ message: "ok" })).catch(err => {
                console.log(err);
                res.json({ message: "error" });
            });
        };
        this.login = (req, res) => {
            let user = req.body;
            console.log(user);
            user_1.default.findOne({ username: user.username, password: user.password, userType: user.userType }).then(user => {
                if (user) {
                    res.json({ message: JSON.stringify(user) });
                }
                else {
                    res.json({ message: "User with this username has not been found." });
                }
            }).catch(err => {
                console.log(err);
                res.json({ message: "User with this username has not been found." });
            });
        };
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
        this.getInfoForThisUsernames = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const usernames = JSON.parse(req.body.usernames);
                const users = yield Promise.all(usernames.map((username) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const user = yield user_1.default.findOne({ username: username });
                        return user ? user : null;
                    }
                    catch (err) {
                        console.log(`User ${username} not found in database.`);
                        return null;
                    }
                })));
                // Filter out null values in case some users were not found
                const filteredUsers = users.filter(user => user !== null);
                res.json({ message: JSON.stringify(filteredUsers) });
            }
            catch (err) {
                console.error("An error occurred:", err);
                res.status(500).json({ message: "An error occurred while fetching users." });
            }
        });
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
