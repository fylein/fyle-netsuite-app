import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css'],
})
export class CallbackComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute,
    private authService: AuthService) {
    if(this.authService.isLoggedIn()){
      router.navigate(['/workspaces']);
    }
    this.route.queryParams.subscribe(params => {
      if (params.code) {
        this.authService.login(params.code).subscribe(
          response => {
            localStorage.setItem('email', response.user.email);
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('refresh_token', response.refresh_token);
            forkJoin([
              this.authService.setUserProfile(),
              this.authService.getClusterDomain(),
            ]).subscribe(responses => {
              localStorage.setItem('user', JSON.stringify(responses[0]));
              localStorage.setItem('clusterDomain', responses[1]);
              this.router.navigate(['/workspaces']);
            });
          },
          error => {
            this.router.navigate(['auth/login']).then(function() {
              window.location.reload();
            });
          }
        );
      } else if (params.error) {
        this.router.navigate(['auth/login']).then(function() {
          window.location.reload();
        });
      }
    });
  }

  ngOnInit() {}
}
