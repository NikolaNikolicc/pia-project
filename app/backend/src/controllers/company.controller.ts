import express from 'express'
import CompanyM from '../models/company';

export class CompanyController{

    saveCompany = (req: express.Request, res: express.Response)=>{
        let company = req.body.company;
        new CompanyM(company).save().then(ok=>{
                console.log("Company stored succesfully.");
                res.json({message:"ok"});
            }).catch(err=>{
                console.log(err);
            })
    }

    getAllCompanies = (req: express.Request, res: express.Response)=>{
        CompanyM.find().then(
            ok => res.json({message: JSON.stringify(ok)})
        ).catch(err=>console.log("Something went wrong, can't find companies."));
    }

    getCompanyByName = (req: express.Request, res: express.Response)=>{
        let companyName = req.body.companyName;
        CompanyM.findOne({name: companyName}).then(
            company=>{
                if(company){
                    res.json({message: JSON.stringify(company)})
                }else{
                    res.json({message: "Company with this name has not been found."})
                }
            }
        ).catch(err=>console.log(err));
    }

}