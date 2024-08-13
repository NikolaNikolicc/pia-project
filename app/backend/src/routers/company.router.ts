import express from 'express'
import { CompanyController } from '../controllers/company.controller';

const companyRouter = express.Router();

companyRouter.route('/saveCompany').post(
    (req, res)=> new CompanyController().saveCompany(req, res)
);
companyRouter.route('/getCompanyByName').post(
    (req, res)=> new CompanyController().getCompanyByName(req, res)
);
companyRouter.route('/getAllCompanies').post(
    (req, res)=> new CompanyController().getAllCompanies(req, res)
);

export default companyRouter;