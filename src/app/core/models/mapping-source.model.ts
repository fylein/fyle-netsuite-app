/* tslint:disable */
// TODO: Use something for serialization / deserialization
export class MappingSource {
  id: number;
  attribute_type: string;
  display_name: string;
  value: string;
  source_id: number;
  auto_mapped: boolean;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  // Having any here is ok, since different source attributes have different keys
  detail: any[];
}
