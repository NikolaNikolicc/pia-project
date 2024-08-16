"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
const company_1 = __importDefault(require("../models/company"));
class CompanyController {
    constructor() {
        this.saveCompany = (req, res) => {
            let company = req.body.company;
            new company_1.default(company).save().then(ok => {
                console.log("Company stored succesfully.");
                res.json({ message: "ok" });
            }).catch(err => {
                console.log(err);
            });
        };
        this.getAllCompanies = (req, res) => {
            company_1.default.find().then(ok => res.json({ message: JSON.stringify(ok) })).catch(err => console.log("Something went wrong, can't find companies."));
        };
        this.updateAppointment = (req, res) => {
            const appointment = JSON.parse(req.body.appointment);
            const companyName = req.body.company;
            company_1.default.findOne({ name: companyName }).then(company => {
                if (company) {
                    // Assuming appointmentId is zero-based, otherwise adjust by subtracting 1
                    const index = appointment.appointmentId;
                    // Check if the appointment exists at the given index
                    if (index > 0 && index <= company.appointments.length) {
                        company.appointments[index - 1] = appointment;
                        // Save the updated company
                        company.save().then(() => res.json({ message: "ok" })).catch(err => {
                            console.error("Error saving company:", err);
                            res.status(500).json({ message: "Error saving company" });
                        });
                    }
                    else {
                        res.status(404).json({ message: "Appointment not found" });
                    }
                }
                else {
                    res.status(404).json({ message: "Company not found" });
                }
            }).catch(err => {
                console.error("Something went wrong, can't find companies:", err);
                res.status(500).json({ message: "Error finding company" });
            });
        };
        this.getCompanyByName = (req, res) => {
            let companyName = req.body.companyName;
            company_1.default.findOne({ name: companyName }).then(company => {
                if (company) {
                    res.json({ message: JSON.stringify(company) });
                }
                else {
                    res.json({ message: "Company with this name has not been found." });
                }
            }).catch(err => console.log(err));
        };
    }
}
exports.CompanyController = CompanyController;
