import mongoose from "mongoose";
import serviceSchema  from "./service";

const gardenSchema = new mongoose.Schema(
    {
        squareMeters: { type: Number, default: 0 },
        gardenType: { type: String, default: "private" },
        areaPoolFountain: { type: Number, default: 0 },
        areaGreen: { type: Number, default: 0 },
        areaFurniture: { type: Number, default: 0 },
        tableCount: { type: Number, default: 0 },
        description: { type: String, default: "" },
        services: [serviceSchema], // Adjust Service[] to match your actual Service schema
        design: { type: String, default: "" },
        numberPoolFountain: {type: String, default: 0},
      },
    {   versionKey: false,
        _id: false // This prevents Mongoose from creating an _id field for this subdocument
    } 
);

export default gardenSchema;