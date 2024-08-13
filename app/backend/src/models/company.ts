import mongoose from "mongoose";
import serviceSchema  from "./helper/service";
import contactPersonSchema from "./helper/contact-person";

const companySchema = new mongoose.Schema(
    {
        name: String,
        address: String,
        contactPerson: contactPersonSchema,
        vacationPeriodStart: Date,
        vacationPeriodEnd: Date,
        services: [serviceSchema]
    },{
        versionKey:false  
    }
);

export default mongoose.model("CompanyModel", companySchema, 'companies');