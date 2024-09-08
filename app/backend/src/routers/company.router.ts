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
companyRouter.route('/updateAppointment').post(
    (req, res)=> new CompanyController().updateAppointment(req, res)
);
companyRouter.route('/updateVacation').post(
    (req, res)=> new CompanyController().updateVacation(req, res)
);

export default companyRouter;