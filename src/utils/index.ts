// export const classPrefix: [string?] = []

type UseClass = ((name: string) => string) & { prefix: string }

export const useClass: UseClass = (name: string) =>
  useClass.prefix ? useClass.prefix.replace(/\B([A-Z])/g, '-$1').toLowerCase() + '-' + name : name
useClass.prefix = 'Epd' // 默认组件前缀

// config-provider调用vue provide时的key
export const CPKey = Symbol('epd-c-p')
