/* tslint:disable */
// TODO: Use something for serialization / deserialization
export class MappingDestination {
  id: number;
  attribute_type: string;
  display_name: string;
  value: string;
  destination_id: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  // Having any here is ok, since different destination attributes have different keys
  detail: any[];
}
