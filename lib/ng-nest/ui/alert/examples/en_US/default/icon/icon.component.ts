import { Component } from '@angular/core';
import { XAlertComponent } from '@ng-nest/ui/alert';

@Component({
  selector: 'ex-icon',
  standalone: true,
  imports: [XAlertComponent],
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class ExIconComponent {}
