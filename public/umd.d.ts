import type { App } from 'vue'

declare global {
  interface Window {
    epDerive: {
      install(
        app: App,
        opt?: {
          prefix?: string
          i18n?: any
          msg?: Record<string, any>
          msgPrefix?: string
        }
      ): void
    }
  }
}
