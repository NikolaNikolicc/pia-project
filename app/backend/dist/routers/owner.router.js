"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const owner_controller_1 = require("../controllers/owner.controller");
const ownerRouter = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
ownerRouter.route('/createAppointment').post((req, res) => new owner_controller_1.OwnerController().createAppointment(req, res));
exports.default = ownerRouter;
