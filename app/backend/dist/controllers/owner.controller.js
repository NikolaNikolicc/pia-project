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
exports.OwnerController = void 0;
const company_1 = __importDefault(require("../models/company"));
class OwnerController {
    constructor() {
        this.createAppointment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const companyName = req.body.company;
            const appointment = JSON.parse(req.body.appointment);
            console.log("Entered backend.");
            console.log(req.body.appointment);
            company_1.default.findOne({ name: companyName }).then(company => {
                if (!company) {
                    res.status(404).json({ message: `Company with name ${companyName} not found.` });
                    return;
                }
                // Add the new appointment to the company's appointments array
                company.appointments.push(appointment);
                // Save the updated company document
                company.save().then(() => {
                    console.log("Appointment added successfully.");
                    res.json({ message: "ok" });
                }).catch(err => {
                    console.error("Error saving appointment:", err);
                    res.status(500).json({ message: "Error saving appointment", error: err.message });
                });
            }).catch(err => {
                console.error("Error finding company:", err);
                res.status(500).json({ message: "Error finding company", error: err.message });
            });
        });
    }
}
exports.OwnerController = OwnerController;
