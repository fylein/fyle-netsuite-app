/* tslint:disable */
// TODO: Use something for serialization / deserialization

export interface ExpenseGroupSetting {
  id: number;
  reimbursable_expense_group_fields: string[];
  corporate_credit_card_expense_group_fields: string[];
  expense_state: string;
  export_date_type: string;
  created_at: Date;
  updated_at: Date;
  workspace: number;
}
