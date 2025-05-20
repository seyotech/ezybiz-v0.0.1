import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { authValidator } from '../validators/auth.validators';
import { AuthService } from '../../../services/auth.services';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  regForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  returnUrl: string = '/';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.regForm = this.formBuilder.group({
      userName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          authValidator.noWhiteSpace,
        ],
        authValidator.usernameExistAsync,
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Get returnUrl from route query
    // this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    this.route.queryParams.subscribe((params) => {
      this.returnUrl = params['returnUrl'] || '/';
    });
  }

  signIn() {
    if (this.regForm.invalid) return;

    this.isSubmitting = true;
    this.error = null;

    const { userName, password } = this.regForm.value;

    this.authService
      .login({ username: userName, password })
      .subscribe({
        next: (user) => {
          this.authService.setUser(user);
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (err) => {
          this.error =
            'Login failed: ' + (err.error?.message || 'Invalid credentials');
          this.isSubmitting = false;
        },
      });
  }
}
