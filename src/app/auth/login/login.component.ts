import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      router.navigate(['/workspaces']);
    }
  }

  login() {
    this.authService.redirectToLogin();
  }

  // eslint-disable-next-line
  ngOnInit() {}
}
