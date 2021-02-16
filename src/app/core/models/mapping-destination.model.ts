/* tslint:disable */
// TODO: Use something for serialization / deserialization
export class MappingDestination {
  id: number;
  attribute_type: string;
  display_name: string;
  value: string;
  destination_id: string;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  // Having any here is ok, since different destination attributes has different keys
  detail: any[];
}
