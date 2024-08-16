import { Service } from "./service";

export class Garden{
    squareMeters: number = 0;
    gardenType: String = "private";
    areaPoolFountain: number = 0;
    areaGreen: number = 0;
    areaFurniture: number = 0;
    tableCount: number = 0;
    description: string = "";
    services: Service[] = [];
    design: string = "";
}