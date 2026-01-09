/// <reference types="vite/client" />

// declare interface Obj {
//   [x: string]: any
// }

declare module '../public/locale/*' {
  const lang: Record<string, any>
  export default lang
}

declare type nullish = undefined | null
