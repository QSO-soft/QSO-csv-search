export interface Settings {
  fieldToSearch: string;

  fieldsToReceive: string[];

  filters: { useFilter: boolean } & Record<string, Filter>;

  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
}

export type MoreOrLessString = `>${number}` | `<${number}`;
export type IncludesString = `in=${string}`;
export type NotEmptyString = '!null';

export type Filter = string | MoreOrLessString | IncludesString | NotEmptyString | boolean | number | null;
export interface Search {
  value_to_search: string;
}
export interface NotFound extends Search {
  field_to_search: string;
}

export interface Duplicate {
  duplicated_value: string;
}
