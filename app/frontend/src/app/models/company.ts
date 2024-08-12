import { contactPerson } from "./contact-person";
import { Decorator } from "./decorator";
import { Service } from "./service";

export class Company{
    name: string = "";
    address: string = "";
    location: string = "";
    contactPerson: contactPerson = new contactPerson();
    vacationPeriodStart: Date = new Date();
    vacationPeriodEnd: Date = new Date();
    decorators: Decorator[] = [];
    services: Service[] = [];
}