export type SetProgressionStatus =
  | 'growth'
  | 'regrowth'
  | 'uptick'
  | 'steady'
  | 'fluctuation'
  | 'backslide'
  | 'rehab'
;

type SetInvalidityStatus =
  | 'zero'
  | 'invalid';

export type SetValidityStatus =
  | SetInvalidityStatus
  | 'valid';

export type SetStatus = SetProgressionStatus
  | SetInvalidityStatus
  | 'first';
