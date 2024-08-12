import express from 'express'
import { CompanyController } from '../controllers/company.controller';

const companyRouter = express.Router();

companyRouter.route('/saveCompany').post(
    (req, res)=> new CompanyController().saveCompany(req, res)
);


export default companyRouter;