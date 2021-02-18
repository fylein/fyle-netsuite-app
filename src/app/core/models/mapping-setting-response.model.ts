/* tslint:disable */

import { MappingSetting } from "./mapping-setting.model";

export class MappingSettingResponse {
    count: number;
    next: string;
    previous: string;
    results: MappingSetting[];
}
