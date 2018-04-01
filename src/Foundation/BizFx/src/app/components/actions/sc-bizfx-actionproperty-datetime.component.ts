import { Component, Input, Output, EventEmitter, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { NgbInputDatepicker, NgbDateStruct, NgbTimeStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import { ScBizFxProperty, NgbDateScParserFormatter } from '@sitecore/bizfx';


@Component({
  selector: 'sc-bizfx-actionproperty-datetime',
  styles: [`
    :host {
      display: flex;
    }

    .date-picker {
      flex: 1 1 100%;
    }

    .date-picker .input-group {
      width: auto;
    }

    .time-picker {
      flex: 1 1 auto;
      margin-left: 15px;
    }
    .date-picker-expand {
      height: 260px;
    }
  `],
  template: `
    <div class="date-picker" [ngClass]="{'date-picker-expand':isExpanded}">
      <label for="property-datepicker-{{property.Name}}">{{property.DisplayName}}</label>
      <div class="input-group">
        <input class="form-control" id="property-datepicker-{{property.Name}}" [(ngModel)]="date" (ngModelChange)="onChange(true)"
          name="dp" (click)="toggleCalendar(d)" ngbDatepicker #d="ngbDatepicker" navigation="arrows" novalidate>
        <span class="input-group-btn">
          <button scIconButton="secondary" id="calendar" type="button" (click)="toggleCalendar(d)">
            <sc-icon icon="calendar" size="small"></sc-icon>
          </button>
        </span>
      </div>
    </div>
    <div class="time-picker">
      <ngb-timepicker [(ngModel)]="time" (ngModelChange)="onChange(false)"></ngb-timepicker>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScBizFxActionPropertyDateTimeComponent),
      multi: true
    },
    {provide: NgbDateParserFormatter, useClass: NgbDateScParserFormatter}
  ]
})

export class ScBizFxActionPropertyDateTimeComponent implements ControlValueAccessor, OnInit {
  @Input() dateTime: Date;
  @Input() property: ScBizFxProperty;
  date: NgbDateStruct;
  time: NgbTimeStruct;
  isExpanded: boolean;

  ngOnInit(): void {
    const dateTime = new Date(this.property.Value);
    this.date = { day: dateTime.getDate(), month: dateTime.getMonth() + 1, year: dateTime.getFullYear() };
    this.time = { hour: dateTime.getHours() || 0, minute: dateTime.getMinutes() || 0, second: dateTime.getSeconds() || 0 };
    this.isExpanded = false;
  }

  propagateChange: any = () => { };

  writeValue() { }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }

  toggleCalendar(calendar: NgbInputDatepicker) {
    this.isExpanded = ! this.isExpanded;
    calendar.toggle();
  }

  onChange(adjustHeight) {
    const {
      date,
      time
    } = this;

    if (date && time) {
      const {
        day,
        month,
        year
      } = date;

      const {
        hour,
        minute,
        second
      } = time;

      this.dateTime = new Date(year, (month - 1), day, hour, minute, second);
    } else if (date && !time) {
      this.time = { hour: 0, minute: 0, second: 0 };
    } else {
      this.dateTime = null;
    }
    if (adjustHeight) {
      this.isExpanded = ! this.isExpanded;
    }
    this.propagateChange(this.dateTime);
  }
}