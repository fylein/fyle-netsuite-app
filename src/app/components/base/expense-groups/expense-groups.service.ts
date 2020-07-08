import { Injectable } from '@angular/core';
import { GeneralService } from '../general.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseGroupsService {
  constructor(private generalService: GeneralService) {}

  getExpenseGroups(workspace_id: number, limit: number, offset: number, state: string): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspace_id}/fyle/expense_groups/?limit=${limit}&offset=${offset}&state=${state}`, 
      {}
    );
  }
  
  getExpensesByExpenseGroupId(workspace_id: number, expense_group_id:number) {
    return this.generalService.get(`/workspaces/${workspace_id}/fyle/expense_groups/${expense_group_id}/expenses/`, {});
  }

  getExpensesGroupById(workspace_id: number, expense_group_id:number) {
    return this.generalService.get(`/workspaces/${workspace_id}/fyle/expense_groups/${expense_group_id}/`, {});
  }

  syncExpenseGroups(workspace_id: number): Observable<any> {
    return this.generalService.post(`/workspaces/${workspace_id}/fyle/expense_groups/trigger/`, {});
  }
}
