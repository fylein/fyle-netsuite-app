import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

const FYLE_URL = environment.fyle_url;
const FYLE_CLIENT_ID = environment.fyle_client_id;
const CALLBACK_URI = environment.callback_uri;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {
    if(this.authService.isLoggedIn()){
      router.navigate(['/workspaces']);
    }
  }

  login() {
    window.location.href =
      FYLE_URL +
      '/app/developers/#/oauth/authorize?' +
      'client_id=' +
      FYLE_CLIENT_ID +
      '&redirect_uri=' +
      CALLBACK_URI +
      '&response_type=code';
  }

  ngOnInit() {}
}
