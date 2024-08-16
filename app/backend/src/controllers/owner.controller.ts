import express from 'express'
import CompanyM from '../models/company'

export class OwnerController{
    createAppointment = async (req: express.Request, res: express.Response)=>{
        const companyName: string = req.body.company;
        const appointment = JSON.parse(req.body.appointment);
        console.log("Entered backend.");
        console.log(req.body.appointment);
        CompanyM.findOne({ name: companyName }).then(company => {
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

    }
}