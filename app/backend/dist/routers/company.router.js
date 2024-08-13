"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const company_controller_1 = require("../controllers/company.controller");
const companyRouter = express_1.default.Router();
companyRouter.route('/saveCompany').post((req, res) => new company_controller_1.CompanyController().saveCompany(req, res));
companyRouter.route('/getCompanyByName').post((req, res) => new company_controller_1.CompanyController().getCompanyByName(req, res));
companyRouter.route('/getAllCompanies').post((req, res) => new company_controller_1.CompanyController().getAllCompanies(req, res));
exports.default = companyRouter;
