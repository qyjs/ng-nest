import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { XSliderSelectComponent } from '@ng-nest/ui/slider-select';

@Component({
  selector: 'ex-vertical',
  standalone: true,
  imports: [FormsModule, XSliderSelectComponent],
  templateUrl: './vertical.component.html',
  styleUrls: ['./vertical.component.scss']
})
export class ExVerticalComponent {
  model1 = 60;
}
