import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { authValidator } from '../validators/auth.validators';
import { AuthService } from '../../../services/auth.services';
import { User } from '../../../models/product.type';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  regForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  returnUrl: string = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.regForm = this.fb.group({
      userName: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
          authValidator.noWhiteSpace,
        ],
        authValidator.usernameExistAsync,
      ],
      email: ['', [Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.route.queryParams.subscribe((params) => {
      this.returnUrl = params['returnUrl'] || '/';
    });
  }

  signUp() {
    if (this.regForm.invalid) return;

    this.isSubmitting = true;
    this.error = null;

    const { userName, password, email } = this.regForm.value;

    this.authService
      .login({ username: userName, password })
      .subscribe({
        next: (user: User) => {
          console.log({user});
          
          this.authService.setUser(user);
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (err) => {
          this.error =
            'Signup failed: ' + (err.error?.message || 'Please try again');
          this.isSubmitting = false;
        },
      });
  }
}
