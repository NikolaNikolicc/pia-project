"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const garden_1 = __importDefault(require("./garden"));
const maintenance_task_1 = __importDefault(require("./maintenance-task"));
const appointmentSchema = new mongoose_1.Schema({
    appointmentId: { type: Number },
    ownerId: { type: String, required: true },
    status: { type: String, default: "pending" },
    decoratorComment: { type: String, default: "" },
    ownerComment: { type: String, default: "" },
    score: { type: Number, default: 0 },
    decoratorID: { type: String, default: "" },
    datetimeScheduled: { type: Date, default: new Date() },
    datetimeFinished: { type: Date, default: new Date() },
    datetimeCreated: { type: Date, default: new Date() },
    datetimeLastTimeServiced: { type: Date, default: new Date() },
    garden: { type: garden_1.default, default: () => ({}) },
    maintenanceTasks: { type: [maintenance_task_1.default], default: [] } // Assuming MaintenanceTaskSchema is defined elsewhere
}, {
    versionKey: false,
    _id: false // Prevents Mongoose from creating an _id field for this subdocument
});
exports.default = appointmentSchema;
