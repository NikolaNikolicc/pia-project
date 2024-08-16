import { Garden } from "./garden";
import { MaintenanceTask } from "./maintenance-task";

export class Appointment{
    ownerId: string = "";
    status: string = "pending";
    decoratorComment: string = "";
    ownerComment: string = "";
    score: number = 0;
    decoratorID: string = "";
    datetimeScheduled: Date = new Date();
    datetimeFinished: Date = new Date();
    datetimeLastTimeServiced: Date = new Date();
    garden: Garden = new Garden();
    maintenanceTasks: MaintenanceTask[] = [];
}