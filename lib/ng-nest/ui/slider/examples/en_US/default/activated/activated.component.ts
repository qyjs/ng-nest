import { Component } from '@angular/core';
import { XSliderComponent } from '@ng-nest/ui/slider';

@Component({
  selector: 'ex-activated',
  standalone: true,
  imports: [XSliderComponent],
  templateUrl: './activated.component.html'
})
export class ExActivatedComponent {
  data = [
    'User Management',
    'Configuration Management',
    'Role Management',
    'Tasks',
    'Work',
    'Messages',
    'Processes',
    'News'
  ];
}
