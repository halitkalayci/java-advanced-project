import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiInput),
      multi: true
    }
  ],
  template: `
    <div class="space-y-1">
      <label *ngIf="label" [for]="inputId" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {{ label }}
        <span *ngIf="required" class="text-red-500">*</span>
      </label>
      <input
        [id]="inputId"
        [type]="type"
        [placeholder]="placeholder"
        [value]="value"
        [disabled]="isDisabled"
        [class]="inputClasses()"
        (input)="onInput($event)"
        (blur)="onBlur()"
        (focus)="onFocus()"
      />
      <p *ngIf="error" class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
      <p *ngIf="helper && !error" class="text-sm text-slate-500 dark:text-slate-400">{{ helper }}</p>
    </div>
  `,
})
export class UiInput implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' = 'text';
  @Input() required = false;
  @Input() error = '';
  @Input() helper = '';
  @Input() inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

  value = '';
  isDisabled = false;
  isFocused = false;

  @Output() valueChange = new EventEmitter<string>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();

  private onChange = (value: string) => {};
  private onTouched = () => {};

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

  onFocus() {
    this.isFocused = true;
    this.focus.emit();
  }

  onBlur() {
    this.isFocused = false;
    this.onTouched();
    this.blur.emit();
  }

  inputClasses() {
    const baseClasses = 'w-full h-10 rounded-xl px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed';
    const normalClasses = 'border border-slate-300 bg-white/50 text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:placeholder:text-slate-500';
    const errorClasses = 'border-red-300 bg-red-50/50 text-red-900 placeholder:text-red-400 focus:ring-red-500 dark:border-red-700 dark:bg-red-900/10 dark:text-red-100';
    
    return `${baseClasses} ${this.error ? errorClasses : normalClasses}`;
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
