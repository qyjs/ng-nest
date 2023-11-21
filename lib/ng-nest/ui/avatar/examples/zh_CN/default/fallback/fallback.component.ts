import { Component } from '@angular/core';
import { XAvatarComponent } from '@ng-nest/ui/avatar';

@Component({
  selector: 'ex-fallback',
  standalone: true,
  imports: [XAvatarComponent],
  templateUrl: './fallback.component.html',
  styleUrls: ['./fallback.component.scss']
})
export class ExFallbackComponent {}
