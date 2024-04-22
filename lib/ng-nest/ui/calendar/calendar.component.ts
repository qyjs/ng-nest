import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnDestroy,
  inject,
  computed,
  signal
} from '@angular/core';
import { XCalendarPrefix, XCalendarProperty } from './calendar.property';
import { XIsEmpty } from '@ng-nest/ui/core';
import { DatePipe, LowerCasePipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { XI18nService, XI18nDirective, zh_CN } from '@ng-nest/ui/i18n';
import { XLinkComponent } from '@ng-nest/ui/link';
import { XDatePickerComponent, XPickerDateComponent, XPickerMonthComponent } from '@ng-nest/ui/date-picker';
import { XButtonComponent, XButtonsComponent } from '@ng-nest/ui/button';
import { XRadioComponent } from '@ng-nest/ui/radio';
import { XTooltipDirective } from '@ng-nest/ui/tooltip';
import { takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import type { XCalendarNode } from './calendar.property';
import type { XI18nCalendar } from '@ng-nest/ui/i18n';

@Component({
  selector: `${XCalendarPrefix}`,
  standalone: true,
  imports: [
    NgClass,
    NgTemplateOutlet,
    DatePipe,
    FormsModule,
    XLinkComponent,
    XTooltipDirective,
    XRadioComponent,
    XDatePickerComponent,
    XPickerDateComponent,
    XPickerMonthComponent,
    XButtonComponent,
    XButtonsComponent,
    XI18nDirective
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe, LowerCasePipe]
})
export class XCalendarComponent extends XCalendarProperty implements OnDestroy {
  private _unSubject = new Subject<void>();
  private datePipe = inject(DatePipe);
  private lowerCasePipe = inject(LowerCasePipe);
  private i18n = inject(XI18nService);
  datetime = signal(new Date());
  activatedDate = signal(new Date());
  radioDataBase = [
    { label: '', id: 'month' },
    { label: '', id: 'year' }
  ];
  modelSignal = signal(this.model());

  locale = toSignal(
    this.i18n.localeChange.pipe(
      map((x) => x.calendar as XI18nCalendar),
      takeUntil(this._unSubject)
    ),
    { initialValue: zh_CN.calendar }
  );
  radioData = computed(() => {
    return this.radioDataBase.map((x) => {
      x.label = (this.locale() as any)[x.id];
      return x;
    });
  });
  classMapSignal = computed(() => ({
    [`${XCalendarPrefix}-${this.displayType()}`]: !XIsEmpty(this.displayType())
  }));
  monthData = computed(() => {
    let dt: { [property: string]: XCalendarNode[] } = {};
    for (let key in this.data()) {
      let month = this.datePipe.transform(key, 'yyyy-MM') as string;
      let value = '';
      this.data()[key].forEach((x) => {
        value += `${x.id}${x.label} <br/>`;
      });
      let item = { id: key, label: value };
      if (dt[month]) {
        dt[month] = [...dt[month], item];
      } else {
        dt[month] = [item];
      }
    }

    return dt;
  });

  ngOnDestroy() {
    this._unSubject.next();
    this._unSubject.unsubscribe();
  }

  action(next: number) {
    let datetime = new Date(this.datetime().getTime());
    if (this.modelSignal() === 'month') {
      datetime.setMonth(datetime.getMonth() + next);
    } else if (this.modelSignal() === 'year') {
      datetime.setFullYear(datetime.getFullYear() + next);
    }
    this.datetime.set(datetime);
  }

  getLocaleMonth(date: Date) {
    return (this.locale() as any)[this.lowerCasePipe.transform(this.datePipe.transform(date, 'LLLL') as string)];
  }

  dateOnChange(date: Date) {
    if (this.datePipe.transform(date, 'yyyy-MM-dd') !== this.datePipe.transform(this.activatedDate(), 'yyyy-MM-dd')) {
      this.activatedDate.set(date);
      this.dateChange.emit(this.activatedDate());
    }
  }

  rangeOnChange(range: Date[]) {
    this.rangeChange.emit(range);
  }

  getDate(date: Date): XCalendarNode[] {
    if (this.data) {
      return this.data()?.[this.datePipe.transform(date, 'yyyy-MM-dd') as string];
    } else {
      return [];
    }
  }

  getMonth(date: Date): XCalendarNode[] {
    return this.monthData()?.[this.datePipe.transform(date, 'yyyy-MM') as string];
  }
}
