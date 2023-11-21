import { Component } from '@angular/core';
import { XAlertComponent } from '@ng-nest/ui/alert';

@Component({
  selector: 'ex-default',
  standalone: true,
  imports: [XAlertComponent],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class ExDefaultComponent {}
