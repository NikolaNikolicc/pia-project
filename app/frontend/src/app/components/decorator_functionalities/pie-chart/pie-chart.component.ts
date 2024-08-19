import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { SharedVariablesService } from 'src/app/services/shared-variables.service';
import { Subscription } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit, OnDestroy {

  private pieChartValuesSubscription!: Subscription;
  private pieChartDecoratorsSubscription!: Subscription;
  private chart: Chart | undefined;

  constructor(private sharedVariablesService: SharedVariablesService) {}

  ngOnInit(): void {
    this.pieChartValuesSubscription = this.sharedVariablesService.pieChartValues$.subscribe((values) => {
      this.pieChartDecoratorsSubscription = this.sharedVariablesService.pieChartDecorators$.subscribe((decorators) => {
        this.createPieChart(decorators, values);
      });
    });
  }

  createPieChart(labels: string[], data: number[]): void {
    const ctx = document.getElementById('myPieChart') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy(); // Destroy the previous chart before creating a new one
    }

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Jobs Distribution',
          data: data,
          backgroundColor: this.generateBackgroundColors(labels.length),
          borderColor: this.generateBorderColors(labels.length),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          datalabels: {
            color: 'grey',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          legend: {
            position: 'top',
            align: 'center',
            labels: {
              padding: 20,
              boxWidth: 20,
              font: {
                size: 14
              }
            }
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  }

  generateBackgroundColors(length: number): string[] {
    // Generate a list of colors for the background
    const colors = [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)',
    ];
    return Array.from({ length }, (_, i) => colors[i % colors.length]);
  }

  generateBorderColors(length: number): string[] {
    // Generate a list of colors for the border
    const colors = [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
    ];
    return Array.from({ length }, (_, i) => colors[i % colors.length]);
  }

  ngOnDestroy(): void {
    if (this.pieChartValuesSubscription) {
      this.pieChartValuesSubscription.unsubscribe();
    }
    if (this.pieChartDecoratorsSubscription) {
      this.pieChartDecoratorsSubscription.unsubscribe();
    }
  }
}
