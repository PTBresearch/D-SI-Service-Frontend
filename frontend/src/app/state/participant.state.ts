export enum DataStateEnum {
  LOADING,
  LOADED,
  ERROR,
  EMPTY
}

export interface AppDataState<T>{
  dataState? : DataStateEnum,
  data? : T,
  errorMessage? : string
}
