import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  router = inject(Router) as Router;
  auth = inject(AuthService);

  login() {
    this.auth.login(this.email, this.password).subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.error = '';
        this.router.navigate(['/']);
      } else {
        this.error = 'Email ou mot de passe incorrect.';
      }
    });
  }
}
