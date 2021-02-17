/* tslint:disable */
import { User } from "./user.model";

// TODO: Use something for serialization / deserialization
export class Workspace {
    id?: number;
    name: string;
    user: User[];
    fyle_org_id: string;
    ns_account_id: string;
    last_synced_at?: Date;
    created_at?: Date;
    updated_at?: Date;
  }
  