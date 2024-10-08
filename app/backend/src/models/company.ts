import mongoose from "mongoose";
import serviceSchema  from "./helper/service";
import contactPersonSchema from "./helper/contact-person";
import appointmentSchema from "./helper/appointment";

const companySchema = new mongoose.Schema(
    {
        name: String,
        address: String,
        contactPerson: contactPersonSchema,
        vacationPeriodStart: Date,
        vacationPeriodEnd: Date,
        companyAvgScore: Number,
        services: [serviceSchema],
        appointments: [appointmentSchema]
    },{
        versionKey:false  
    }
);

export default mongoose.model("CompanyModel", companySchema, 'companies');