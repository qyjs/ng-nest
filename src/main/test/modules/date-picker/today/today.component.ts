import { Component } from '@angular/core';
import { XAddDays } from '@ng-nest/ui/core';

@Component({
  selector: 'ex-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.scss']
})
export class ExTodayComponent {
  modelDate: any;

  modelDatetime: any;

  modelRangeDate: any;

  modelRangeDatetime: any;

  preset = [
    'yesterday',
    'today',
    'tomorrow',
    {
      label: '7天后',
      func: () => {
        return XAddDays(new Date(), 7);
      }
    }
  ];

  presetRange = [
    'lastWeek',
    'thisWeek',
    'nextWeek',
    // 'lastMonth',
    'thisMonth',
    // 'nextMonth',
    // 'lastYear',
    'thisYear',
    // 'nextYear',
    {
      label: '5天内',
      func: () => {
        let now = new Date();
        return [now, XAddDays(new Date(), 5)];
      }
    }
  ];

  change(value: any) {
    console.log(value);
  }
}
