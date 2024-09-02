import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'auth',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [AuthService],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
  authForm!: FormGroup;
  isLoginMode = true;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fullName: [''],
    });

    if (!this.isLoginMode) {
      this.authForm.get('fullName')?.setValidators([Validators.required]);
    } else {
      this.authForm.get('fullName')?.clearValidators();
    }
    this.authForm.get('fullName')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.authForm.valid) {
      if (this.isLoginMode) {
        this.login();
      } else {
        this.register();
      }
    }
  }

  login() {
    const { email, password } = this.authForm.value;
    this.authService.login(email, password).subscribe(
      () => {
        console.log('Logiran')
        this.errorMessage = '';
        this.router.navigate(['/main']);
      },
      (error) => {
        console.error('Login failed', error);
        this.errorMessage =
          'Login failed. Please check your credentials and try again.';
      }
    );
  }

  register() {
    const { fullName, email, password } = this.authForm.value;
    this.authService.signup(fullName, email, password).subscribe(
      (response) => {
        console.log('Registration successful', response);
        this.errorMessage = '';
        this.isLoginMode = true;
        this.initForm(); // Reset the form
      },
      (error) => {
        console.error('Registration failed', error);
        this.errorMessage = 'Registration failed. Please try again.';
      }
    );
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.initForm();
  }
}
