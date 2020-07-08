import { Injectable } from '@angular/core';
import { GeneralService } from '../general.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  constructor(private generalService: GeneralService) {}

  createBills(workspace_id: number, expnese_group_ids: any[]): Observable<any> {
    return this.generalService.post(
      `/workspaces/${workspace_id}/netsuite/bills/trigger/`, {
        expense_group_ids: expnese_group_ids
      }
    );
  }

  getBills(workspace_id: number, limit: number, offset: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/netsuite/bills/?limit=${limit}&offset=${offset}`, {});
  }
}
