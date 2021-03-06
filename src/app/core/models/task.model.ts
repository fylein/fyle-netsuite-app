/* tslint:disable */
// TODO: Use something for serialization / deserialization
import { MappingError } from './mapping-error.model';

export type Task = {
  id: number;
  task_id: string;
  expense_group: number;
  detail: MappingError[];
  status: string;
  type: string;
  bill: number;
  expense_report: number;
  journal_entry: number;
  vendor_payment: number;
  created_at: Date;
  updated_at: Date;
  workspace: number;
};
