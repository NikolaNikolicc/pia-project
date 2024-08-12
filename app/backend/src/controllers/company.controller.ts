import express from 'express'
import CompanyM from '../models/company';

export class CompanyController{

    saveCompany = (req: express.Request, res: express.Response)=>{
        let company = req.body.company;
        new CompanyM(company).save().then(ok=>{
                console.log("User stored succesfully.");
                res.json({message:"ok"});
            }).catch(err=>{
                console.log(err);
            })
    }

}