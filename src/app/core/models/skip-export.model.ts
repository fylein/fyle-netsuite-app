/* tslint:disable */

export type SkipExport = {
  condition: string;
  operator: string;
  values: string[];
  rank: number;
  join_by: 'AND' | 'OR';
  is_custom: boolean;
};
