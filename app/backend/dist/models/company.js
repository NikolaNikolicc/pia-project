"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const service_1 = __importDefault(require("./helper/service"));
const contact_person_1 = __importDefault(require("./helper/contact-person"));
const decoratorSchema = new mongoose_1.default.Schema({
    userId: String,
    companyId: String
}, {
    versionKey: false
});
const companySchema = new mongoose_1.default.Schema({
    name: String,
    address: String,
    contactPerson: contact_person_1.default,
    vacationPeriodStart: Date,
    vacationPeriodEnd: Date,
    decorators: [decoratorSchema],
    services: [service_1.default]
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model("CompanyModel", companySchema, 'companies');
