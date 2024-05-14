import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnInit,
  AfterViewInit,
  OnDestroy,
  inject,
  viewChild,
  signal
} from '@angular/core';
import {
  XControlProperty,
  XFormControlOption,
  XFormControlComponent,
  XFormControlType,
  XCascadeControl,
  XCascadeControlOption,
  XInputControl,
  XInputControlOption,
  XSelectControl,
  XSelectControlOption,
  XCheckboxControl,
  XCheckboxControlOption,
  XRadioControl,
  XRadioControlOption,
  XDatePickerControlOption,
  XDatePickerControl,
  XInputNumberControl,
  XInputNumberControlOption,
  XSwitchControl,
  XSwitchControlOption,
  XRateControl,
  XRateControlOption,
  XSliderSelectControl,
  XSliderSelectControlOption,
  XTimePickerControl,
  XTimePickerControlOption,
  XColorPickerControl,
  XColorPickerControlOption,
  XFormControl,
  XFindControl,
  XFindControlOption,
  XTextareaControlOption,
  XTextareaControl,
  XAutoCompleteControl,
  XAutoCompleteControlOption
} from './form.property';
import {
  FormControlName,
  Validators,
  UntypedFormControl,
  ValidatorFn,
  ControlValueAccessor,
  FormControlStatus,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { XIsEmpty, XIsFunction } from '@ng-nest/ui/core';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { XI18nForm, XI18nService, zh_CN } from '@ng-nest/ui/i18n';
import { XFormInputValidator } from '@ng-nest/ui/base-form';
import { XInputComponent } from '@ng-nest/ui/input';
import { XSelectComponent } from '@ng-nest/ui/select';
import { XCascadeComponent } from '@ng-nest/ui/cascade';
import { XCheckboxComponent } from '@ng-nest/ui/checkbox';
import { XColorPickerComponent } from '@ng-nest/ui/color-picker';
import { XDatePickerComponent } from '@ng-nest/ui/date-picker';
import { XInputNumberComponent } from '@ng-nest/ui/input-number';
import { XRadioComponent } from '@ng-nest/ui/radio';
import { XRateComponent } from '@ng-nest/ui/rate';
import { XSliderSelectComponent } from '@ng-nest/ui/slider-select';
import { XSwitchComponent } from '@ng-nest/ui/switch';
import { XTimePickerModule } from '@ng-nest/ui/time-picker';
import { XTextareaComponent } from '@ng-nest/ui/textarea';
import { XFindComponent } from '@ng-nest/ui/find';
import { XAutoCompleteComponent } from '@ng-nest/ui/auto-complete';
import { XFormComponent } from './form.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'x-control',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    XInputComponent,
    XSelectComponent,
    XCascadeComponent,
    XCheckboxComponent,
    XColorPickerComponent,
    XDatePickerComponent,
    XInputNumberComponent,
    XRadioComponent,
    XRateComponent,
    XSliderSelectComponent,
    XSwitchComponent,
    XTimePickerModule,
    XTextareaComponent,
    XFindComponent,
    XAutoCompleteComponent
  ],
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class XControlComponent extends XControlProperty implements OnInit, AfterViewInit, OnDestroy {
  private i18n = inject(XI18nService);
  private _sharedProps = signal(['span', 'direction', 'justify', 'align', 'labelWidth', 'labelAlign']);
  private _changeProps = signal(['label', ...this._sharedProps()]);
  private _control = signal<XFormControlType | null>(null);
  private _validatorFns = signal<ValidatorFn[]>([]);
  private _formControl = signal<UntypedFormControl | null>(null);
  private _unSubject = new Subject<void>();

  form = inject(XFormComponent);
  formControl = viewChild(FormControlName);
  locale = toSignal(this.i18n.localeChange.pipe(map((x) => x.form as XI18nForm)), { initialValue: zh_CN.form });

  ngOnInit() {
    this.option.update((x) => ({ ...x }));
    this.setProps();
    if (XIsEmpty(this.option().label)) {
      this.option.update((x) => {
        x.label = '';
        return x;
      });
    }
    this.option.update((x) => {
      x.label = `${this.option().label}${this.form.labelSuffix}`;
      return x;
    });
    this._control.set(this.createControl(this.option()));
    this._formControl.set(
      new UntypedFormControl(this._control()!.value, {
        nonNullable: this._control()!.nonNullable
      })
    );
    this.setValidators();
    this._formControl()!
      .statusChanges.pipe(takeUntil(this._unSubject))
      .subscribe((x) => {
        this.setMessages(x);
      });
    this._control()!.setValidators = () => this.setValidators();
    this.form.formGroup().addControl(this._control()!.id, this._formControl());
    this.option().change = () => {
      this._changeProps().forEach((x: string) => {
        if (this.formControl()?.valueAccessor && this.option()[x]) {
          (this.formControl()!.valueAccessor as any)[x] = this.option()[x];
        }
      });
      this.form.controlComponents()[this._control()!.id].formControlChanges();
    };
  }

  ngAfterViewInit() {
    Object.assign(this.formControl()!.valueAccessor!, this._control() as ControlValueAccessor);
    this.form.controlTypes()[this._control()!.id] = this._control;
    this.form.controlComponents()[this._control()!.id] = this.formControl()!.valueAccessor as XFormControlComponent;
    this.form.controlComponents()[this._control()!.id].formControlChanges();
  }

  ngOnDestroy() {
    this._unSubject.next();
    this._unSubject.unsubscribe();
  }

  setValidators() {
    this._validatorFns.set([]);
    if (this._control()!.disabled || this.form.disabled()) {
      this._formControl()!.disable();
    } else {
      this._formControl()!.enable();
    }
    if (this._control()!.required && !this.form.disabled()) {
      this._validatorFns.update((x) => [...x, Validators.required]);
    }
    if (this._control()!.pattern) {
      this.setPattern();
    }
    if (XIsFunction(this._control()!.inputValidator)) {
      this._validatorFns.update((x) => [...x, XFormInputValidator(this._control()!.inputValidator!)]);
    }
    this._formControl()!.setValidators(this._validatorFns());
    this._formControl()!.updateValueAndValidity();
  }

  setProps() {
    for (let prop of this._sharedProps()) {
      if (XIsEmpty(this.option()[prop])) {
        this.option()[prop] = (this.form as any)[prop];
      }
    }
  }

  setPattern() {
    const pattern = this._control()!.pattern;
    if (Array.isArray(pattern)) {
      for (const pt of pattern) {
        this._validatorFns.update((x) => [...x, Validators.pattern(pt)]);
      }
    } else {
      this._validatorFns.update((x) => [...x, Validators.pattern(pattern as RegExp)]);
    }
  }

  getPatternMsg(pattern: string) {
    const controlPattern = this._control()!.pattern;
    if (Array.isArray(controlPattern)) {
      return (this._control()!.message as Array<any>)[controlPattern.findIndex((x) => String(x) === pattern)];
    } else {
      return this._control()!.message;
    }
  }

  setMessages(state: FormControlStatus) {
    let control: XFormControl = this._formControl()!;
    if (state === 'INVALID' && this._formControl()!.errors !== null) {
      let messages: string[] = [];
      for (const key in control.errors) {
        const label = this._control()!.label || this._control()!.id;
        if (key === 'required') {
          messages = [...messages, `${label} ${this.locale().required || 'required'}`];
        } else if (key === 'pattern') {
          messages = [...messages, `${label} ${this.getPatternMsg(control.errors[key].requiredPattern)}`];
        } else if (key === 'inputValidator') {
          messages = [...messages, `${label} ${this._control()!.message}`];
        }
      }
      control.messages = messages;
    } else if (state === 'VALID') {
      control.messages = [];
    }
  }

  createControl(option: XFormControlOption) {
    switch (option.control) {
      case 'input':
        return new XInputControl(option as XInputControlOption);
      case 'select':
        return new XSelectControl(option as XSelectControlOption);
      case 'checkbox':
        return new XCheckboxControl(option as XCheckboxControlOption);
      case 'radio':
        return new XRadioControl(option as XRadioControlOption);
      case 'switch':
        return new XSwitchControl(option as XSwitchControlOption);
      case 'rate':
        return new XRateControl(option as XRateControlOption);
      case 'date-picker':
        return new XDatePickerControl(option as XDatePickerControlOption);
      case 'time-picker':
        return new XTimePickerControl(option as XTimePickerControlOption);
      case 'input-number':
        return new XInputNumberControl(option as XInputNumberControlOption);
      case 'slider-select':
        return new XSliderSelectControl(option as XSliderSelectControlOption);
      case 'cascade':
        return new XCascadeControl(option as XCascadeControlOption);
      case 'color-picker':
        return new XColorPickerControl(option as XColorPickerControlOption);
      case 'textarea':
        return new XTextareaControl(option as XTextareaControlOption);
      case 'find':
        return new XFindControl(option as XFindControlOption);
      case 'auto-complete':
        return new XAutoCompleteControl(option as XAutoCompleteControlOption);
      default:
        return new XInputControl(option as XInputControlOption);
    }
  }
}
