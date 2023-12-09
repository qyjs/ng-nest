import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { XCrumbComponent } from '@ng-nest/ui/crumb';
import { XTagComponent } from '@ng-nest/ui/tag';

@Component({
  selector: 'ex-custom',
  standalone: true,
  imports: [CommonModule, XCrumbComponent, XTagComponent],
  templateUrl: './custom.component.html'
})
export class ExCustomComponent {
  data = ['Home', 'User Manager', 'User List', 'User Detail'];
}
