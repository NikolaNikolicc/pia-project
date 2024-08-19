import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { SharedVariablesService } from 'src/app/services/shared-variables.service';
import { Subscription } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit, OnDestroy {

  private yaxisSubscription!: Subscription;
  private chart: Chart | undefined;

  constructor(private sharedVariablesService: SharedVariablesService) {}

  ngOnInit(): void {
    this.yaxisSubscription = this.sharedVariablesService.yaxisbarchart$.subscribe((data) => {
      this.createBarChart(data);
    });
  }

  createBarChart(data: number[]): void {
    const ctx = document.getElementById('myBarChart') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy(); // Destroy the previous chart before creating a new one
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
          label: 'Jobs Completed',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          tooltip: {
            enabled: false
          },
          datalabels: {
            anchor: 'center',  // Adjust this to 'start' or 'center' depending on preference
            align: 'end',    // Align to the top of the bar
            offset: 0,       // Offset the label slightly for better visibility
            color: 'orange',
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  }


  ngOnDestroy(): void {
    if (this.yaxisSubscription) {
      this.yaxisSubscription.unsubscribe(); // Unsubscribe to avoid memory leaks
    }
  }
}
