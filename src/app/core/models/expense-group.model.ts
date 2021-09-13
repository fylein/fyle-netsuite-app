/* tslint:disable */
// TODO: Use something for serialization / deserialization
import { ExpenseGroupDescription } from './expense-group-description.model';
import { NetSuiteResponseLog } from './netsuite-response-log.model';

export type ExpenseGroup = {
  id: number;
  fyle_group_id: string;
  fund_source: string;
  description: ExpenseGroupDescription;
  response_logs: NetSuiteResponseLog;
  export_type: string;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  expenses: number[];
};
