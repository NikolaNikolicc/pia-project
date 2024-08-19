import mongoose from "mongoose";

const maintenanceTaskSchema = new mongoose.Schema(
    {
        decoratorId: { type: String, default: "" },
        estimatedCompletionTime: { type: Date, default: new Date() },
        startDate: {type: Date, default: new Date()},
        status: { type: String, default: "" },
        comment: { type: String, default: "" },
      },
    {   versionKey: false,
        _id: false // This prevents Mongoose from creating an _id field for this subdocument
    } 
);

export default maintenanceTaskSchema;