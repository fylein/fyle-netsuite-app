/* eslint-disable */
// TODO: Use something for serialization / deserialization
export type NetSuiteCredentials = {
  id?: number;
  ns_account_id: string;
  ns_token_id: string;
  ns_token_secret: string;
  created_at?: Date;
  updated_at?: Date;
  workspace?: number;
}
