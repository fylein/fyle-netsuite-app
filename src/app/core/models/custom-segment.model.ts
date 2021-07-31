/* eslint-disable */
// TODO: Use something for serialization / deserialization
export type CustomSegment = {
  id?: number;
  name?: string;
  segment_type: string;
  script_id: string;
  internal_id: string;
  created_at?: Date;
  updated_at?: Date;
  workspace?: number;
};
