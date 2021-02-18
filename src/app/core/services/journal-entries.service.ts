import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root',
})
export class JournalEntriesService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) {}

  createJournalEntries(expneseGroupIds: number[]) {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(
      `/workspaces/${workspaceId}/netsuite/journal_entries/trigger/`, {
        expense_group_ids: expneseGroupIds
      }
    );
  }
}
