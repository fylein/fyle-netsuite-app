/* tslint:disable */
import { MappingRow } from "./mapping-row.model";
import { MappingSetting } from "./mapping-setting.model";

// TODO: Use something for serialization / deserialization
export class MappingModal {
  workspaceId: number;
  rowElement?: MappingRow;
  setting?: MappingSetting;
}
