"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const service_1 = __importDefault(require("./helper/service"));
const contact_person_1 = __importDefault(require("./helper/contact-person"));
const appointment_1 = __importDefault(require("./helper/appointment"));
const companySchema = new mongoose_1.default.Schema({
    name: String,
    address: String,
    contactPerson: contact_person_1.default,
    vacationPeriodStart: Date,
    vacationPeriodEnd: Date,
    companyAvgScore: Number,
    services: [service_1.default],
    appointments: [appointment_1.default]
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model("CompanyModel", companySchema, 'companies');
