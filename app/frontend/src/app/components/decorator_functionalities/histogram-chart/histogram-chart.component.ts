import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { SharedVariablesService } from 'src/app/services/shared-variables.service';
import { Subscription } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-histogram-chart',
  templateUrl: './histogram-chart.component.html',
  styleUrls: ['./histogram-chart.component.css']
})
export class HistogramChartComponent implements OnInit, OnDestroy {

  private dayValuesSubscription!: Subscription;
  private valuesCountSubscription!: Subscription;
  private chart: Chart | undefined;

  constructor(private sharedVariablesService: SharedVariablesService) {}

  ngOnInit(): void {
    this.dayValuesSubscription = this.sharedVariablesService.histogramDayValues$.subscribe((labels) => {
      this.valuesCountSubscription = this.sharedVariablesService.histogramValuesCount$.subscribe((data) => {
        this.createHistogram(labels, data);
      });
    });
  }

  createHistogram(labels: string[], data: number[]): void {
    const ctx = document.getElementById('myHistogram') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy(); // Destroy the previous chart before creating a new one
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Frequency',
          data: data,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          },
          x: {
            beginAtZero: true,
            grid: {
              display: false
            }
          }
        },
        plugins: {
          tooltip: {
            enabled: true
          },
          datalabels: {
            anchor: 'center',  
            align: 'top',    
            offset: 0,       
            color: 'purple',
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  }

  ngOnDestroy(): void {
    if (this.dayValuesSubscription) {
      this.dayValuesSubscription.unsubscribe();
    }
    if (this.valuesCountSubscription) {
      this.valuesCountSubscription.unsubscribe();
    }
  }
}
