export type SetProgressionStatus
  = 'fluctuation'
  | 'rehab'
  | 'growth'
  | 'regrowth'
  | 'uptick'
  | 'steady'
  | 'backslide';

  export type SetStatus = SetProgressionStatus
  | 'zero'
  | 'invalid'
  | 'first';