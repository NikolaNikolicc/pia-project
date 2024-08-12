"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const contactPersonSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true }
}, { versionKey: false,
    _id: false // This prevents Mongoose from creating an _id field for this subdocument
});
exports.default = contactPersonSchema;
