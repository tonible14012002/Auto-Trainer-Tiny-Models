export interface FilterValues {
  showLoadedOnly: boolean;
  searchQuery: string;
}

export const DEFAULT_FILTER_VALUES: FilterValues = {
  showLoadedOnly: false,
  searchQuery: "",
};