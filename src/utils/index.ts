export const classPrefix: [string?] = []

export const useClass = (name: string) =>
  classPrefix[0] ? classPrefix[0].replace(/\B([A-Z])/g, '-$1').toLowerCase() + '-' + name : name
