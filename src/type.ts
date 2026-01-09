export interface Obj {
  [x: string]: any
}

export type BtnType =
  | ''
  | 'default'
  | 'text'
  | 'warning'
  | 'primary'
  | 'success'
  | 'info'
  | 'danger'
  | undefined

export type BtnSize = '' | 'small' | 'default' | 'large' | undefined
