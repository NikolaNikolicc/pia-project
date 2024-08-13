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
