import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnDestroy,
  inject,
  PLATFORM_ID,
  viewChild,
  computed,
  signal,
  effect
} from '@angular/core';
import { XAlertPrefix, XAlertProperty } from './alert.property';
import { XFadeAnimation, XIsEmpty } from '@ng-nest/ui/core';
import { of, Subject, Subscription } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { XIconComponent } from '@ng-nest/ui/icon';
import { XOutletDirective } from '@ng-nest/ui/outlet';
import { XButtonComponent } from '@ng-nest/ui/button';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { XResizableDirective } from '@ng-nest/ui/resizable';
import { NgClass, NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import type { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: `${XAlertPrefix}`,
  standalone: true,
  imports: [
    NgClass,
    NgTemplateOutlet,
    DragDropModule,
    XIconComponent,
    XButtonComponent,
    XOutletDirective,
    XResizableDirective
  ],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [XFadeAnimation]
})
export class XAlertComponent extends XAlertProperty implements OnDestroy {
  alert = viewChild.required<CdkDrag>('alert');
  styleHide = signal(false);
  classMapSignal = computed(() => ({
    [`${XAlertPrefix}-${this.type()}`]: !XIsEmpty(this.type()),
    [`x-${this.effect()}`]: !XIsEmpty(this.effect()),
    [`${XAlertPrefix}-icon-medium`]: !XIsEmpty(this.title()) && !XIsEmpty(this.content()) && !XIsEmpty(this.showIcon()),
    [`${XAlertPrefix}-draggable`]: this.draggable()
  }));

  private _unSubject = new Subject<void>();
  private _durationSubscription?: Subscription;
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    super();
    effect(() => this.setDuration());
  }

  ngOnDestroy() {
    this._unSubject.next();
    this._unSubject.complete();
  }

  setDuration() {
    if (this.duration() && this.isBrowser) {
      this._durationSubscription?.unsubscribe();
      this._durationSubscription = of(true)
        .pipe(delay(this.duration()), takeUntil(this._unSubject))
        .subscribe(() => {
          this.onClose();
        });
    }
  }

  onClose() {
    if (this.manual()) {
      this.close?.emit();
    } else {
      this.styleHide.set(true);
    }
  }

  onCloseAnimationDone() {
    if (this.hide()) {
      this.close?.emit();
    }
  }
}
