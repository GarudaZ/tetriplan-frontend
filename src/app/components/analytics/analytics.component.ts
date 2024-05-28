import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import firebase from 'firebase/compat/app';
Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
})
export class AnalyticsComponent implements AfterViewInit {
  selectedDataSet: string | null = null;
  selectedChartType: ChartType = 'pie';
  chartsRendered = false;
  user: firebase.User | null = null;

  // ngOnInit(): void {

  // }
  // apiUrl =
  // 'https://tetriplan.onrender.com/api/users'; // need to change this so import the logged in users details

  taskData: any[] = [];

  @ViewChild('categoriesPieCanvas', { static: false })
  categoriesPieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoriesBarCanvas', { static: false })
  categoriesBarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoriesLineCanvas', { static: false })
  categoriesLineCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('durationsPieCanvas', { static: false })
  durationsPieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('durationsBarCanvas', { static: false })
  durationsBarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('durationsLineCanvas', { static: false })
  durationsLineCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('priorityPieCanvas', { static: false })
  priorityPieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('priorityBarCanvas', { static: false })
  priorityBarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('priorityLineCanvas', { static: false })
  priorityLineCanvas!: ElementRef<HTMLCanvasElement>;

  chartInstances: { [key: string]: Chart | null } = {
    categoriesPie: null,
    categoriesBar: null,
    categoriesLine: null,
    durationsPie: null,
    durationsBar: null,
    durationsLine: null,
    priorityPie: null,
    priorityBar: null,
    priorityLine: null,
  };

  constructor(
    private renderer: Renderer2,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngAfterViewInit() {
    this.authService.getUserInfo().subscribe((user) => {
      this.user = user;
      if (this.user) {
        // this.loadListTasks(this.user.uid);
        let username = this.user.uid;
        let apiUrl = `https://tetriplan.onrender.com/api/users/${username}/tasks`; // need to change this so import the logged in users details
        this.fetchTaskData(apiUrl);
      }
    });
  }

  fetchTaskData(apiUrl: string): void {
    this.http.get<any>(apiUrl).subscribe(
      (data) => {
        this.taskData = data.tasks;
        console.log(this.taskData);

        this.renderChart();
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
      this.renderChart();
    } else {
      console.warn('Please select both a dataset and a chart type');
    }
  }

  renderChart(): void {
    console.log('Rendering chart...');

    const dataSet = this.getDataSet();
    const labels = dataSet.map((item) => item.category);
    const data = dataSet.map((item) => item.value);
    console.log('Labels:', labels);
    console.log('Data:', data);

    const canvas = this.getCanvasElement();
    if (!canvas) {
      console.warn('Canvas element not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('Canvas context not available');
      return;
    }

    const chartKey = `${this.selectedDataSet}${this.selectedChartType}`;
    if (this.chartInstances[chartKey]) {
      this.chartInstances[chartKey]?.destroy();
    }

    const options = {
      scales: {
        y: {
          title: {
            display: true,
          },
        },
      },
    };

    this.chartInstances[chartKey] = new Chart(ctx, {
      type: this.selectedChartType,
      data: {
        labels,
        datasets: [
          {
            label: 'Tasks',
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
      options: options,
    });
  }

  private getDataSet(): { category: string; value: number }[] {
    switch (this.selectedDataSet) {
      case 'categories':
        return this.processData(this.taskData, 'category');
      case 'durations':
        return this.processData(this.taskData, 'duration');
      case 'priority':
        return this.processData(this.taskData, 'priority');
      default:
        return [];
    }
  }

  private processData(
    data: any[],
    property: string
  ): { category: string; value: number }[] {
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
      category: key,
      value: aggregatedData[key],
    }));
  }

  private getCanvasElement(): HTMLCanvasElement | null {
    const canvasId = `${this.selectedDataSet}-${this.selectedChartType}-canvas`;
    const canvasElement = this.renderer.selectRootElement(`#${canvasId}`, true);
    if (canvasElement instanceof HTMLCanvasElement) {
      return canvasElement;
    } else {
      console.warn('Canvas element not found');
      return null;
    }
  }
}
