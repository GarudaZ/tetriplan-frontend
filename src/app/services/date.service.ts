import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  private selectedDateSource = new BehaviorSubject<NgbDateStruct | null>(null);
  selectedDate$ = this.selectedDateSource.asObservable();

  setSelectedDate(date: NgbDateStruct | null) {
    this.selectedDateSource.next(date);
  }
}
