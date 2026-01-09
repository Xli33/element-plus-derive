export {}

// 扩展vue组件实例属性，避免打包时ts报错
declare module 'vue' {
  interface ComponentCustomProperties {
    $message: any
  }
}
