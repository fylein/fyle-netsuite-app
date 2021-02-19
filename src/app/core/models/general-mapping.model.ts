/* tslint:disable */
// TODO: Use something for serialization / deserialization
export type GeneralMapping = {
  id?: number;
  location_id: string;
  location_name: string;
  location_level: string;
  accounts_payable_id: string;
  accounts_payable_name: string;
  reimbursable_account_id: string;
  reimbursable_account_name: string;
  default_ccc_account_id: string;
  default_ccc_account_name: string;
  vendor_payment_account_id: string;
  vendor_payment_account_name: string;
  default_ccc_vendor_id: string;
  default_ccc_vendor_name: string;
  created_at?: Date;
  updated_at?: Date;
  workspace?: number;
};
