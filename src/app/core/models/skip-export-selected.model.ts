/* tslint:disable */

export type SkipExportSelected = {
  count: number;
  results: [
    {
      condition: string;
      operator: string;
      values: Array<any>;
      rank: number;
      join_by: string;
      is_custom: boolean;
    },
    {
      condition: string;
      operator: string;
      values: Array<any>;
      rank: number;
      join_by: string;
      is_custom: boolean;
    }
  ];
};
