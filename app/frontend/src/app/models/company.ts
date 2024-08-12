import { contactPerson } from "./helper/contact-person";
import { Decorator } from "./decorator";
import { Service } from "./helper/service";

export class Company{
    name: string = "";
    address: string = "";
    contactPerson: contactPerson = new contactPerson();
    vacationPeriodStart: Date = new Date();
    vacationPeriodEnd: Date = new Date();
    decorators: Decorator[] = [];
    services: Service[] = [];
}