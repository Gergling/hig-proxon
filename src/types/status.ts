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

export type SetProgressionStatusFirst = 'first';

// TODO: Check if this is *really* being used.
export type SetStatus = SetProgressionStatus
  | SetInvalidityStatus
  | SetProgressionStatusFirst;
