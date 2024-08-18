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
  private addressSource = new BehaviorSubject<string>(''); // Default value can be empty or any initial address
  address$ = this.addressSource.asObservable();
  // canvas variables
  shapes: GardenShape[] = [];
  gardenType: String = "";
  numberOfWaterSurfaces: number = 0;

  constructor() { }

  get address(): string {
    return this.addressSource.value;
  }

  set address(newAddress: string) {
    this.addressSource.next(newAddress);
  }

}
