import mongoose from "mongoose";
import serviceSchema  from "./helper/service";
import contactPersonSchema from "./helper/contact-person";

const decoratorSchema = new mongoose.Schema(
    {
        userId: String,
        companyId: String
    },{
        versionKey:false  
    }
);

const companySchema = new mongoose.Schema(
    {
        name: String,
        address: String,
        contactPerson: contactPersonSchema,
        vacationPeriodStart: Date,
        vacationPeriodEnd: Date,
        decorators: [decoratorSchema],
        services: [serviceSchema]
    },{
        versionKey:false  
    }
);

export default mongoose.model("CompanyModel", companySchema, 'companies');