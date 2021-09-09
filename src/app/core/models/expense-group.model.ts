/* tslint:disable */
// TODO: Use something for serialization / deserialization
import { ExpenseGroupDescription } from './expense-group-description.model';
import { NetSuiteErrorLog } from './netsuite-error-log.model';

export type ExpenseGroup = {
  id: number;
  fyle_group_id: string;
  fund_source: string;
  description: ExpenseGroupDescription;
  response_logs: NetSuiteErrorLog;
  export_type: string;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  expenses: number[];
};
