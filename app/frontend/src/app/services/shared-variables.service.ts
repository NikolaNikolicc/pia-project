import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface BaseShape {
  x: number;
  y: number;
  color: string;
}

interface Square extends BaseShape {
  type: 'square';
  width: number;
  height: number;
}

interface Rectangle extends BaseShape {
  type: 'rectangle';
  width: number;
  height: number;
}

interface Circle extends BaseShape {
  type: 'circle';
  radius: number;
}

// Define the specific shapes
interface SmallGreenSquare extends Square {
  type: 'square';
  color: 'green';
  width: 50;
  height: 50;
}

interface LargeBlueRectangle extends Rectangle {
  type: 'rectangle';
  color: 'blue';
  width: 200;
  height: 100;
}

interface LargeBlueCircle extends Circle {
  type: 'circle';
  color: 'blue';
  radius: 100;
}

interface SmallBrownCircle extends Circle {
  type: 'circle';
  color: 'brown';
  radius: 25;
}

interface SmallGrayRectangle extends Rectangle {
  type: 'rectangle';
  color: 'gray';
  width: 50;
  height: 25;
}

// Union type for all possible shapes
type GardenShape = SmallGreenSquare | LargeBlueRectangle | LargeBlueCircle | SmallBrownCircle | SmallGrayRectangle;

@Injectable({
  providedIn: 'root'
})
export class SharedVariablesService {

  sessionID: string = "";
  // address for map
  private addressSource = new BehaviorSubject<string>(''); // Default value can be empty or any initial address
  address$ = this.addressSource.asObservable();
  // canvas variables
  shapes: GardenShape[] = [];
  gardenType: String = "";
  numberOfWaterSurfaces: number = 0;
  // bar chart
  private yaxisbarchartSource = new BehaviorSubject<number[]>([]);
  yaxisbarchart$ = this.yaxisbarchartSource.asObservable();
  // pie chart
  pieChartDecoratorsSource = new BehaviorSubject<string[]>([]);
  pieChartDecorators$ = this.pieChartDecoratorsSource.asObservable();
  pieChartValuesSource = new BehaviorSubject<number[]>([]);
  pieChartValues$ = this.pieChartValuesSource.asObservable();
  histogramDayValuesSource = new BehaviorSubject<string[]>([]);
  histogramDayValues$ = this.histogramDayValuesSource.asObservable();
  histogramValuesCountSource = new BehaviorSubject<number[]>([]);
  histogramValuesCount$ = this.histogramValuesCountSource.asObservable();

  constructor() { }

  get histogramValuesCount(): number[] {
    return this.histogramValuesCountSource.value;
  }

  set histogramValuesCount(newData: number[]) {
    this.histogramValuesCountSource.next(newData);
  }

  get histogramDayValues(): string[] {
    return this.histogramDayValuesSource.value;
  }

  set histogramDayValues(newData: string[]) {
    this.histogramDayValuesSource.next(newData);
  }

  get pieChartValues(): number[] {
    return this.pieChartValuesSource.value;
  }

  set pieChartValues(newData: number[]) {
    this.pieChartValuesSource.next(newData);
  }
  
  get pieChartDecorators(): string[] {
    return this.pieChartDecoratorsSource.value;
  }

  set pieChartDecorators(newData: string[]) {
    this.pieChartDecoratorsSource.next(newData);
  }

  get yaxisbarchart(): number[] {
    return this.yaxisbarchartSource.value;
  }

  set yaxisbarchart(newData: number[]) {
    this.yaxisbarchartSource.next(newData);
  }

  get address(): string {
    return this.addressSource.value;
  }

  set address(newAddress: string) {
    this.addressSource.next(newAddress);
  }

}
