import mongoose from "mongoose";

const contactPersonSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true }
    },
    {   versionKey: false,
        _id: false // This prevents Mongoose from creating an _id field for this subdocument
    } 
);

export default contactPersonSchema;