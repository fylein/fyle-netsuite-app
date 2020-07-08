import { Injectable } from '@angular/core';
import { GeneralService } from './general.service'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  constructor(private generalService: GeneralService) { }

  createWorkspace(): Observable<any> {
    return this.generalService.post('/workspaces/', {});
  }

  getWorkspaces(): Observable<any> {
    return this.generalService.get('/workspaces/', {});
  }
}
