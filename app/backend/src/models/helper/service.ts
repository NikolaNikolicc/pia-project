import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true }
    },
    {   versionKey: false,
        _id: false // This prevents Mongoose from creating an _id field for each service
    } 
);

export default serviceSchema;