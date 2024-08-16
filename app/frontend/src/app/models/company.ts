import { Decorator } from "./decorator";
import { Appointment } from "./helper/appointment";
import { contactPerson } from "./helper/contact-person";
import { Service } from "./helper/service";

export class Company{
    name: string = "";
    address: string = "";
    contactPerson: contactPerson = new contactPerson();
    vacationPeriodStart: Date = new Date();
    vacationPeriodEnd: Date = new Date();
    companyAvgScore: number = 0;
    services: Service[] = [];
    apppointments: Appointment[] = [];
    // helpers
    decs: Decorator[] = [];
}