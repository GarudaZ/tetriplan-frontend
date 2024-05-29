import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import firebase from 'firebase/compat/app';
import { Chart, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
})
export class AnalyticsComponent implements AfterViewInit {
  selectedDataSet: string | null = null;
  selectedChartType: ChartType = 'pie';
  chartConfigurations: { dataset: string; chartType: ChartType }[] = [];
  user: firebase.User | null = null;

  taskData: any[] = [];
  chartInstances: Chart[] = [];

  @ViewChildren('chartCanvas') chartCanvases!: QueryList<ElementRef<HTMLCanvasElement>>;

  constructor(
    private renderer: Renderer2,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngAfterViewInit() {
    this.authService.getUserInfo().subscribe((user) => {
      this.user = user;
      if (this.user) {
        let username = this.user.uid;
        let apiUrl = `https://tetriplan.onrender.com/api/users/${username}/tasks`;
        this.fetchTaskData(apiUrl);
      }
    });
  }

  fetchTaskData(apiUrl: string): void {
    this.http.get<any>(apiUrl).subscribe(
      (data) => {
        this.taskData = data.tasks;
        console.log(this.taskData);
      },
      (error) => {
        console.error('Error fetching task data:', error);
      }
    );
  }

  onDatasetChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.selectedDataSet = target.value;
    }
  }

  onChartTypeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.selectedChartType = target.value as ChartType;
    }
  }

  onRenderClick(): void {
    if (this.selectedDataSet && this.selectedChartType) {
      this.chartConfigurations.unshift({
        dataset: this.selectedDataSet,
        chartType: this.selectedChartType,
      });
      this.renderCharts();
    } else {
      console.warn('Please select both a dataset and a chart type');
    }
  }

  renderCharts(): void {
    this.chartInstances.forEach(chart => chart.destroy());
    this.chartInstances = [];

    setTimeout(() => {
      this.chartConfigurations.forEach((config, index) => {
        const canvasElement = this.chartCanvases.toArray()[index].nativeElement;
        const ctx = canvasElement.getContext('2d');
        if (!ctx) {
          console.warn('Canvas context not available');
          return;
        }

        const dataSet = this.getDataSet(config.dataset);
        const labels = dataSet.map((item) => item.taskName);
        let data: number[];
        let label: string;
        let options: any;

        if (config.chartType === 'pie') {
          // Calculate percentages for pie chart
          const total = dataSet.reduce((acc, cur) => acc + cur.value, 0);
          data = dataSet.map((item) => (item.value / total) * 100);
          label = '% of Total Tasks';
          options = {
            // Add options for pie chart here
          };
        } else {
          // For other chart types, use original values
          data = dataSet.map((item) => item.value);
          label = 'Task Name';
          options = {
            scales: {
              y: {
                title: {
                  display: true,
                  text: config.chartType === 'line' ? 'minutes spent' : 'Task Name',
                },
              },
            },
          };
        }

        const chart = new Chart(ctx, {
          type: config.chartType,
          data: {
            labels,
            datasets: [
              {
                label,
                data,
                backgroundColor: [
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 99, 132, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
              },
            ],
          },
          options,
        });

        this.chartInstances.push(chart);
      });
    }, 0);
  }

  getTitleCase(dataset: string): string {
    switch(dataset) {
      case 'categories':
        return 'Task Categories';
      case 'durations':
        return 'Task Durations';
      case 'priority':
        return 'Task Priority';
      default:
        return dataset;
    }
  }

  private getDataSet(selectedDataSet: string): { taskName: string; value: number }[] {
    switch (selectedDataSet) {
      case 'categories':
        return this.processData(this.taskData, 'category');
      case 'durations':
        // Use task names instead of durations for durations dataset
        return this.processData(this.taskData, 'taskName');
      case 'priority':
        return this.processData(this.taskData, 'priority');
      default:
        return [];
    }
  }

  private processData(data: any[], property: string): { taskName: string; value: number }[] {
    const aggregatedData: { [key: string]: number } = {};
    data.forEach((task) => {
      const value = task[property];
      if (value) {
        if (aggregatedData[value]) {
          aggregatedData[value] += task.duration;
        } else {
          aggregatedData[value] = task.duration;
        }
      }
    });
    return Object.keys(aggregatedData).map((key) => ({
      taskName: key,
      value: aggregatedData[key],
    }));
  }
}
