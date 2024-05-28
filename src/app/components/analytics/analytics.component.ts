import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
  priorityData: { category: string; value: number }[] = [
    { category: 'High Priority', value: 232 },
    { category: 'Medium Priority', value: 20 },
    { category: 'Low Priority', value: 10 },
  ];
  categoriesData: { category: string; value: number }[] = [
    { category: 'Work', value: 43 },
    { category: 'Personal', value: 22 },
    { category: 'Sleep', value: 60 },
    { category: 'Exercise', value: 22 },
  ];
  durationsData: { category: string; value: number }[] = [
    { category: 'Task 1', value: 60 },
    { category: 'Task 2', value: 90 },
    { category: 'Task 3', value: 120 },
  ];
  @ViewChild('categoriesPieCanvas')
  categoriesPieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoriesBarCanvas')
  categoriesBarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoriesLineCanvas')
  categoriesLineCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('durationsPieCanvas')
  durationsPieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('durationsBarCanvas')
  durationsBarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('durationsLineCanvas')
  durationsLineCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('priorityPieCanvas')
  priorityPieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('priorityBarCanvas')
  priorityBarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('priorityLineCanvas')
  priorityLineCanvas!: ElementRef<HTMLCanvasElement>;
  chartsRendered: boolean = false;
  constructor() {}
  ngAfterViewInit() {}
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
      this.chartsRendered = false;
      this.renderChart();
    } else {
      console.warn('Please select both a dataset and a chart type');
    }
  }
  renderChart(): void {
    let dataSet: { category: string; value: number }[];
    switch (this.selectedDataSet) {
      case 'categories':
        dataSet = this.categoriesData;
        break;
      case 'durations':
        dataSet = this.durationsData;
        break;
      case 'priority':
        dataSet = this.priorityData;
        break;
      default:
        dataSet = [];
    }
    const labels = dataSet.map((item) => item.category);
    const data = dataSet.map((item) => item.value);
    if (this.selectedDataSet === 'categories') {
      this.renderCategoryChart(labels, data);
    } else if (this.selectedDataSet === 'durations') {
      this.renderDurationChart(labels, data);
    } else if (this.selectedDataSet === 'priority') {
      this.renderPriorityChart(labels, data);
    }
  }
  renderCategoryChart(labels: string[], data: number[]): void {
    const canvas = this.getCanvasElement(this.selectedChartType, 'categories');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      this.renderChartOnCanvas(ctx, labels, data);
    }
  }
  renderDurationChart(labels: string[], data: number[]): void {
    const canvas = this.getCanvasElement(this.selectedChartType, 'durations');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      this.renderChartOnCanvas(ctx, labels, data);
    }
  }
  renderPriorityChart(labels: string[], data: number[]): void {
    const canvas = this.getCanvasElement(this.selectedChartType, 'priority');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      this.renderChartOnCanvas(ctx, labels, data);
    }
  }
  getCanvasElement(chartType: ChartType, dataSet: string): HTMLCanvasElement {
    let canvas: HTMLCanvasElement;
    switch (chartType) {
      case 'pie':
        canvas =
          dataSet === 'categories'
            ? this.categoriesPieCanvas.nativeElement
            : dataSet === 'durations'
            ? this.durationsPieCanvas.nativeElement
            : dataSet === 'priority'
            ? this.priorityPieCanvas.nativeElement
            : null!;
        break;
      case 'bar':
        canvas =
          dataSet === 'categories'
            ? this.categoriesBarCanvas.nativeElement
            : dataSet === 'durations'
            ? this.durationsBarCanvas.nativeElement
            : dataSet === 'priority'
            ? this.priorityBarCanvas.nativeElement
            : null!;
        break;
      case 'line':
        canvas =
          dataSet === 'categories'
            ? this.categoriesLineCanvas.nativeElement
            : dataSet === 'durations'
            ? this.durationsLineCanvas.nativeElement
            : dataSet === 'priority'
            ? this.priorityLineCanvas.nativeElement
            : null!;
        break;
      default:
        throw new Error('Invalid chart type');
    }
    if (!canvas) {
      throw new Error('Canvas element not found');
    }
    return canvas;
  }
  renderChartOnCanvas(
    ctx: CanvasRenderingContext2D,
    labels: string[],
    data: number[]
  ): void {
    new Chart(ctx, {
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
    });
  }
}
