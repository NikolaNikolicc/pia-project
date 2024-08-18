import mongoose, { Schema } from "mongoose";
import gardenSchema from "./garden";
import maintenanceTaskSchema from "./maintenance-task";

const appointmentSchema = new Schema(
  {
    appointmentId: {type: Number},
    ownerId: { type: String, required: true },
    status: { type: String, default: "pending" },
    decoratorComment: { type: String, default: "" },
    ownerComment: { type: String, default: "" },
    score: { type: Number, default: 0 },
    decoratorID: { type: String, default: "" },
    datetimeScheduled: { type: Date, default: new Date() },
    datetimeFinished: { type: Date, default: new Date() },
    datetimeCreated: { type: Date, default: new Date() },
    datetimeLastTimeServiced: { type: Date, default: new Date() },
    garden: { type: gardenSchema, default: () => ({}) }, // Assuming GardenSchema is defined elsewhere
    maintenanceTasks: { type: [maintenanceTaskSchema], default: [] }, // Assuming MaintenanceTaskSchema is defined elsewhere
    photosUploaded: {type: Boolean},
    maintenanceScheduled: {type: Boolean},
  },
  {
    versionKey: false,
    _id: false // Prevents Mongoose from creating an _id field for this subdocument
  }
);

export default appointmentSchema;
