# Lesson 07 — Reactive Forms

> **Course:** Angular Fundamentals · **Time:** 60 minutes
> **🔗 Official Docs:** [Reactive Forms](https://angular.dev/guide/forms/reactive-forms) · [Validation](https://angular.dev/guide/forms/form-validation)

---

## 🎯 Learning Objectives

- [ ] Build forms with `FormGroup` and `FormControl`
- [ ] Apply built-in validators and display errors
- [ ] Create custom validators with typed error keys
- [ ] Handle async validators for server-side checks

---

## 📖 Concepts

### Setup

```typescript
// Import ReactiveFormsModule or individual classes
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
```

### `FormControl` and `FormGroup`

```typescript
@Component({
    selector:   'app-login',
    standalone: true,
    imports:    [ReactiveFormsModule],
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
            <div class="field">
                <label for="email">Email</label>
                <input id="email" type="email" formControlName="email" class="input"
                       [class.invalid]="isInvalid('email')">
                @if (isInvalid('email')) {
                    <span class="error-msg" role="alert">
                        @if (form.get('email')?.errors?.['required']) { Email is required }
                        @if (form.get('email')?.errors?.['email'])    { Invalid email format }
                    </span>
                }
            </div>

            <div class="field">
                <label for="password">Password</label>
                <input id="password" type="password" formControlName="password" class="input"
                       [class.invalid]="isInvalid('password')">
                @if (isInvalid('password')) {
                    <span class="error-msg" role="alert">
                        @if (form.get('password')?.errors?.['required'])  { Password is required }
                        @if (form.get('password')?.errors?.['minlength']) {
                            Minimum {{ form.get('password')?.errors?.['minlength'].requiredLength }} characters
                        }
                    </span>
                }
            </div>

            <button type="submit" [disabled]="form.invalid || isSubmitting">
                {{ isSubmitting ? 'Signing in…' : 'Sign in' }}
            </button>
        </form>
    `
})
export class LoginFormComponent {
    private fb = inject(FormBuilder);
    isSubmitting = false;

    form = this.fb.group({
        email:    ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]]
    });

    isInvalid(field: string): boolean {
        const control = this.form.get(field)!;
        return control.invalid && (control.dirty || control.touched);
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();  // Show all errors if user clicked submit
            return;
        }

        this.isSubmitting = true;
        console.log(this.form.value);  // { email: '...', password: '...' }
    }
}
```

### Custom Validators

```typescript
import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validator factory — returns a ValidatorFn
export function passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value as string;
        if (!value) return null;

        const hasUpper   = /[A-Z]/.test(value);
        const hasLower   = /[a-z]/.test(value);
        const hasNumber  = /\d/.test(value);
        const hasSpecial = /[!@#$%^&*]/.test(value);

        const strength = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

        return strength < 3
            ? { passwordStrength: { required: 3, actual: strength } }
            : null;
    };
}

// Cross-field validator — passwords match
export function passwordMatchValidator(fg: AbstractControl): ValidationErrors | null {
    const pw  = fg.get('password')?.value;
    const cpw = fg.get('confirmPassword')?.value;
    return pw && cpw && pw !== cpw ? { passwordMismatch: true } : null;
}

// Usage
form = this.fb.group({
    password:        ['', [Validators.required, Validators.minLength(8), passwordStrengthValidator()]],
    confirmPassword: ['', Validators.required]
}, { validators: passwordMatchValidator });
```

### Async Validators — Server-Side Checks

```typescript
import { AsyncValidatorFn } from '@angular/forms';
import { of, switchMap, debounceTime, first } from 'rxjs';

// Check if email already exists on the server
export function uniqueEmailValidator(userService: UserService): AsyncValidatorFn {
    return (control: AbstractControl) =>
        of(control.value).pipe(
            debounceTime(500),
            switchMap(email => userService.checkEmailAvailable(email)),
            first()   // Complete the observable (required for async validators)
        );
}

// Usage
email: ['', [Validators.required, Validators.email], [uniqueEmailValidator(this.userService)]]
```

### FormArray — Dynamic Fields

```typescript
// src/app/components/tags-form/tags-form.component.ts
import { FormArray, FormControl } from '@angular/forms';

@Component({
    selector: 'app-tags-form',
    standalone: true,
    imports: [ReactiveFormsModule],
    template: `
        <div formArrayName="tags">
            @for (_ of tagsArray.controls; let i = $index; track i) {
                <div class="tag-row">
                    <input [formControlName]="i" class="input" placeholder="Tag name">
                    <button type="button" (click)="removeTag(i)">×</button>
                </div>
            }
        </div>
        <button type="button" (click)="addTag()">+ Add tag</button>
    `
})
export class TagsFormComponent {
    private fb = inject(FormBuilder);

    form = this.fb.group({
        tags: this.fb.array([this.fb.control('', Validators.required)])
    });

    get tagsArray(): FormArray { return this.form.get('tags') as FormArray; }

    addTag():             void { this.tagsArray.push(this.fb.control('', Validators.required)); }
    removeTag(i: number): void { this.tagsArray.removeAt(i); }
}
```

---

## ✅ Milestone Checklist

- [ ] I built a form with `FormGroup` and `FormBuilder`
- [ ] I display field errors only after the user has interacted (touched/dirty)
- [ ] I wrote a custom synchronous cross-field validator
- [ ] I understand `FormArray` for dynamic field lists

## ➡️ Next Unit

[Lesson 08 — Pipes, Directives & Template Utilities](./lesson_08.md)
