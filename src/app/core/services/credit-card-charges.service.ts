import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root',
})
export class CreditCardChargesService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) {}

  createCreditCardCharges(expenseGroupIds: number[]) {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(
      `/workspaces/${workspaceId}/netsuite/credit_card_charges/trigger/`, {
        expense_group_ids: expenseGroupIds
      }
    );
  }
}
