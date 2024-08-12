import mongoose from "mongoose";

const decoratorSchema = new mongoose.Schema(
    {
        userId: String,
        companyId: String
    },{
        versionKey:false  
    }
);

export default mongoose.model("DecoratorModel", decoratorSchema, 'decorators'); // Default export for the model