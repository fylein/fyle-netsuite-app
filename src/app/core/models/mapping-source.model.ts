/* tslint:disable */
// TODO: Use something for serialization / deserialization
export class MappingSource {
  id: number;
  attribute_type: string;
  display_name: string;
  value: string;
  source_id: number;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  // Having any here is ok, since different destination attributes has different keys
  detail: any[];
}
