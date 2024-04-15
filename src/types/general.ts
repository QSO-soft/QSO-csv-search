export interface Settings {
  fieldToSearch: string;

  fieldsToReceive: string[];

  filters: { useFilter: boolean } & Record<string, Filter>;

  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
}

export type MoreOrLessString = `>${number}` | `<${number}`;
export type Filter = string | MoreOrLessString | boolean | number | null;
export interface Search {
  value_to_search: string;
}
export interface NotFound extends Search {
  field_to_search: string;
}

export interface Duplicate {
  duplicated_value: string;
}
