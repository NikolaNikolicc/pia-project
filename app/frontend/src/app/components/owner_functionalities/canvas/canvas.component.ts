import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { SharedVariablesService } from 'src/app/services/shared-variables.service';

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

declare var bootstrap: any;

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  @ViewChild('gardenCanvas', { static: true }) gardenCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('errorModal') modalError!: ElementRef;
  private context!: CanvasRenderingContext2D;
  selectedAction: string = 'square';
  drawing: boolean = false;
  startX: number = 0;
  startY: number = 0;
  error: string = "";

  // shapes: GardenShape[] = [];

  constructor(public sharedVariableService: SharedVariablesService){

  }

  ngOnInit() {
    this.context = this.gardenCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.drawGardenLayout();
  }

  showErrorModal(){
    const modalNative: HTMLElement = this.modalError.nativeElement;
      const modal = new bootstrap.Modal(modalNative, {
        backdrop: 'static', // Prevents closing when clicking outside
        keyboard: false, // Prevents closing with the escape key
      });
      modal.show();
  }

  drawGardenLayout() {
    this.context.clearRect(0, 0, this.gardenCanvas.nativeElement.width, this.gardenCanvas.nativeElement.height);

    this.sharedVariableService.shapes.forEach(shape => {
      switch (shape.type) {
        case 'square':
        case 'rectangle':
          this.drawRectangle(shape.x, shape.y, shape.width, shape.height, shape.color);
          break;
        case 'circle':
          this.drawCircle(shape.x, shape.y, shape.radius, shape.color);
          break;
      }
    });
  }

  drawRectangle(x: number, y: number, width: number, height: number, color: string) {
    this.context.fillStyle = color;
    this.context.fillRect(x, y, width, height);
  }

  drawCircle(x: number, y: number, radius: number, color: string) {
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, Math.PI * 2);
    this.context.fill();
  }

  rotateShape(x: number, y: number) {
    this.sharedVariableService.shapes.forEach(shape => {
        if (shape.type !== 'circle' && x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height) {
            // Type assertion to allow swapping width and height
            const tempWidth = (shape as Rectangle).width;
            const tempHeight = (shape as Rectangle).height;
            (shape as Rectangle).width = (shape as Rectangle).height;
            (shape as Rectangle).height = tempWidth;
            if(this.isOverlapping(shape)){
              (shape as Rectangle).width = tempWidth;
              (shape as Rectangle).height = tempHeight;
            }
        }
    });

    this.drawGardenLayout(); // Redraw the canvas with the rotated shape
}

  onMouseDown(event: MouseEvent) {
    this.startX = event.offsetX;
    this.startY = event.offsetY;

    if (this.selectedAction === 'remove') {
        this.removeShape(this.startX, this.startY); // Call removeShape when removing
    } else if (this.selectedAction === 'rotate') {
        this.rotateShape(this.startX, this.startY); // Call rotateShape when rotating
    } else {
        this.drawing = true; // Start drawing if it's not remove or rotate action
    }
}


  onMouseUp(event: MouseEvent) {
    if (!this.drawing) return;
    this.drawing = false;

    let shape: GardenShape;

    switch (this.selectedAction) {
      case 'square':
        shape = {
          type: 'square',
          x: this.startX,
          y: this.startY,
          width: 50,
          height: 50,
          color: 'green',
        } as SmallGreenSquare;
        break;

      case 'rectangle':
        shape = {
          type: 'rectangle',
          x: this.startX,
          y: this.startY,
          width: 200,
          height: 100,
          color: 'blue',
        } as LargeBlueRectangle;
        break;

      case 'small-rectangle':
        shape = {
          type: 'rectangle',
          x: this.startX,
          y: this.startY,
          width: 50,
          height: 25,
          color: 'gray',
        } as SmallGrayRectangle;
        break;

      case 'circle':
        shape = {
          type: 'circle',
          x: this.startX,
          y: this.startY,
          radius: 100,
          color: 'blue',
        } as LargeBlueCircle;
        break;

      case 'small-circle':
        shape = {
          type: 'circle',
          x: this.startX,
          y: this.startY,
          radius: 25,
          color: 'brown',
        } as SmallBrownCircle;
        break;

      default:
        throw new Error("Unknown shape type");
    }

    // Check if the shape goes out of canvas boundaries
    if (!this.isWithinBounds(shape)) {
      console.error("Shape goes out of canvas bounds. Drawing cancelled.");
      return;
    }

    // Check for overlap
    if (!this.isOverlapping(shape)) {
      this.sharedVariableService.shapes.push(shape);
      this.drawGardenLayout();
    } else {
      console.error("Shape overlaps with an existing shape. Drawing cancelled.");
    }
}


  isWithinBounds(shape: GardenShape): boolean {
    const canvasWidth = this.gardenCanvas.nativeElement.width;
    const canvasHeight = this.gardenCanvas.nativeElement.height;

    if (shape.type === 'circle') {
      return (
        shape.x - shape.radius >= 0 &&
        shape.x + shape.radius <= canvasWidth &&
        shape.y - shape.radius >= 0 &&
        shape.y + shape.radius <= canvasHeight
      );
    } else if (shape.type === 'square' || shape.type === 'rectangle') {
      return (
        shape.x >= 0 &&
        shape.y >= 0 &&
        shape.x + shape.width <= canvasWidth &&
        shape.y + shape.height <= canvasHeight
      );
    }
    return false;
  }

  isOverlapping(newShape: GardenShape): boolean {
    let filteredShapes = this.sharedVariableService.shapes.filter(shape=>shape !== newShape)
    return filteredShapes.some(existingShape => {
      if (newShape.type === 'circle' && existingShape.type === 'circle') {
        const dx = newShape.x - existingShape.x;
        const dy = newShape.y - existingShape.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < newShape.radius + existingShape.radius;
      } else if (newShape.type !== 'circle' && existingShape.type !== 'circle') {
        return (
          newShape.x < existingShape.x + existingShape.width &&
          newShape.x + newShape.width > existingShape.x &&
          newShape.y < existingShape.y + existingShape.height &&
          newShape.y + newShape.height > existingShape.y
        );
      } else if (newShape.type === 'circle' && existingShape.type !== 'circle') {
        return this.rectCircleColliding(newShape, existingShape as Rectangle);
      } else if (newShape.type !== 'circle' && existingShape.type === 'circle') {
        return this.rectCircleColliding(existingShape, newShape as Rectangle);
      }
      return false;
    });
  }

  rectCircleColliding(circle: Circle, rect: Rectangle): boolean {
    const distX = Math.abs(circle.x - rect.x - rect.width / 2);
    const distY = Math.abs(circle.y - rect.y - rect.height / 2);

    if (distX > rect.width / 2 + circle.radius) { return false; }
    if (distY > rect.height / 2 + circle.radius) { return false; }

    if (distX <= rect.width / 2) { return true; }
    if (distY <= rect.height / 2) { return true; }

    const dx = distX - rect.width / 2;
    const dy = distY - rect.height / 2;
    return (dx * dx + dy * dy <= (circle.radius * circle.radius));
  }

  removeShape(x: number, y: number) {
    this.sharedVariableService.shapes = this.sharedVariableService.shapes.filter(shape => {
        if (shape.type === 'circle') {
            const dx = x - shape.x;
            const dy = y - shape.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance > shape.radius; // Keep the shape if click is outside the circle
        } else {
            return (
                x < shape.x || 
                x > shape.x + shape.width || 
                y < shape.y || 
                y > shape.y + shape.height
            ); // Keep the shape if click is outside the rectangle/square
        }
    });

    this.drawGardenLayout(); // Redraw the canvas without the removed shape
}
onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];

    // Check if the file type is JSON
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      this.error = 'Invalid file type. Please upload a JSON file.';
      this.showErrorModal();
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const shapesConfig: GardenShape[] = JSON.parse(content);
        this.loadShapesFromConfig(shapesConfig);
      } catch (error) {
        console.error('Invalid JSON format:', error);
      }
    };

    reader.readAsText(file);
  }
}

loadShapesFromConfig(shapesConfig: GardenShape[]) {
  this.sharedVariableService.shapes = [];
  shapesConfig.forEach(shape => {
    if (this.isWithinBounds(shape) && !this.isOverlapping(shape)) {
      this.sharedVariableService.shapes.push(shape);
    } else {
      console.error('Shape either out of bounds or overlapping:', shape);
    }
  });

  this.drawGardenLayout();
}

loadJsonConfig() {
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  fileInput.click();
}


}