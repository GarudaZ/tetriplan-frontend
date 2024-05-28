import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';

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

  priorityData = [
    { category: 'High Priority', value: 232 },
    { category: 'Medium Priority', value: 20 },
    { category: 'Low Priority', value: 10 },
  ];
  categoriesData = [
    { category: 'Work', value: 43 },
    { category: 'Personal', value: 22 },
    { category: 'Sleep', value: 60 },
    { category: 'Exercise', value: 22 },
  ];
  durationsData = [
    { category: 'Task 1', value: 60 },
    { category: 'Task 2', value: 90 },
    { category: 'Task 3', value: 120 },
  ];

  @ViewChild('categoriesPieCanvas', { static: false }) categoriesPieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoriesBarCanvas', { static: false }) categoriesBarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoriesLineCanvas', { static: false }) categoriesLineCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('durationsPieCanvas', { static: false }) durationsPieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('durationsBarCanvas', { static: false }) durationsBarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('durationsLineCanvas', { static: false }) durationsLineCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('priorityPieCanvas', { static: false }) priorityPieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('priorityBarCanvas', { static: false }) priorityBarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('priorityLineCanvas', { static: false }) priorityLineCanvas!: ElementRef<HTMLCanvasElement>;

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

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    // ViewChild elements are available here
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
  
    // Custom options to include axis labels
    const options = {
      scales: {
        y: {
          title: {
            display: true,
            text: 'Minutes'
          }
        }
      }
    };
  
    this.chartInstances[chartKey] = new Chart(ctx, {
      type: this.selectedChartType,
      data: {
        labels,
        datasets: [
          {
            label: 'Task Distribution',
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
      options: options // Include the options here
    });
  }
  
  private getDataSet(): { category: string; value: number }[] {
    switch (this.selectedDataSet) {
      case 'categories':
        return this.categoriesData;
      case 'durations':
        return this.durationsData;
      case 'priority':
        return this.priorityData;
      default:
        return [];
    }
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
