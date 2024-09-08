import express from 'express'
import CompanyM from '../models/company';
import company from '../models/company';

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
    updateVacation = (req: express.Request, res: express.Response)=> {
        const company = JSON.parse(req.body.company)
        
        CompanyM.updateOne({name: company.name}, {vacationPeriodEnd: company.vacationPeriodEnd, vacationPeriodStart: company.vacationPeriodStart}).then(
            ok=>res.json({message: "ok"})
        ).catch(err=>console.log(err))
    }

    getAllCompanies = (req: express.Request, res: express.Response)=>{
        CompanyM.find().then(
            ok => res.json({message: JSON.stringify(ok)})
        ).catch(err=>console.log("Something went wrong, can't find companies."));
    }

    updateAppointment = (req: express.Request, res: express.Response) => {
        const appointment = JSON.parse(req.body.appointment);
        const companyName = req.body.company;
        CompanyM.findOne({ name: companyName }).then(
            company => {
                if (company) {
                    // Assuming appointmentId is zero-based, otherwise adjust by subtracting 1
                    const index = appointment.appointmentId;
                    // Check if the appointment exists at the given index
                    if (index > 0 && index <= company.appointments.length) {
                        company.appointments[index - 1] = appointment;
    
                        // Save the updated company
                        CompanyM.updateOne({name: companyName}, {appointments: company.appointments}).then(
                            () => res.json({ message: "ok" })
                        ).catch(err => {
                            console.error("Error saving company:", err);
                            res.status(500).json({ message: "Error saving company" });
                        });
                    } else {
                        res.status(404).json({ message: "Appointment not found" });
                    }
                } else {
                    res.status(404).json({ message: "Company not found" });
                }
            }
        ).catch(err => {
            console.error("Something went wrong, can't find companies:", err);
            res.status(500).json({ message: "Error finding company" });
        });
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