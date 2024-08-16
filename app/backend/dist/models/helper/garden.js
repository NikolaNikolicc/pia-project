"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const service_1 = __importDefault(require("./service"));
const gardenSchema = new mongoose_1.default.Schema({
    squareMeters: { type: Number, default: 0 },
    gardenType: { type: String, default: "private" },
    areaPoolFountain: { type: Number, default: 0 },
    areaGreen: { type: Number, default: 0 },
    areaFurniture: { type: Number, default: 0 },
    tableCount: { type: Number, default: 0 },
    description: { type: String, default: "" },
    services: [service_1.default],
    design: { type: String, default: "" },
}, { versionKey: false,
    _id: false // This prevents Mongoose from creating an _id field for this subdocument
});
exports.default = gardenSchema;
