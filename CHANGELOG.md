# Changelog

## [0.4.0](https://github.com/Xli33/element-plus-derive/compare/v0.3.0...v0.4.0) (2026-11-22)

### ⚠ BREAKING CHANGES

* **type:** 使用element-plus的type，不再从主入口导出额外的`EpdCheckValue` `EpdSelectValue` ([9e319b8](https://github.com/Xli33/element-plus-derive/commit/9e319b8696107c6a79e6255358869710fbc92cb7))

### Features

* **locale:** 优化语言配置，传入语言包无需放在`d`节点下 ([549672e](https://github.com/Xli33/element-plus-derive/commit/549672e0a017ed43b66d78cd8644148691a17f51))
* **style:** 优化`PageTable` `ToggleColumn`样式 ([2a8c918](https://github.com/Xli33/element-plus-derive/commit/2a8c918a9d67f89109706cc09c2fc15fe35d7a95))

### Bug Fixes

* **install:** 修复多次安装同一个epDerive时，组件name的前缀会重复叠加 ([781bd05](https://github.com/Xli33/element-plus-derive/commit/781bd058b53a10a7d938681efc4a50e1c1e3d671))
* **table-cache-cols:** 适配高版本element-plus ([4664e66](https://github.com/Xli33/element-plus-derive/commit/4664e66eda6592eae7fc7cb50d013cc10497d261))

## [0.3.0](https://github.com/Xli33/element-plus-derive/compare/v0.2.0...v0.3.0) (2026-11-15)

### ⚠ BREAKING CHANGES

* 调整`CurdTable` `MCalendar`的en-US翻译 ([4ecc569](https://github.com/Xli33/element-plus-derive/commit/4ecc5694249adf77a05480c22379a4f97ca7fbdc))
* 简化ToggleColumn，去除title prop与全选文案，默认展示Menu图标 ([9372a53](https://github.com/Xli33/element-plus-derive/commit/9372a53d3ae0ec6f118606122084c2c18d014235))
* 默认组件前缀设为`Epd`，对应class前缀名`epd` ([e591a55](https://github.com/Xli33/element-plus-derive/commit/e591a55a552ad995aaca35346d873df057cb9644))
* 统一适配以`Epd`前缀导出 ([02587ba](https://github.com/Xli33/element-plus-derive/commit/02587bae5bf8dee0f17c9fecb4c8e4d5be8d720e))
* 优化AllCheckbox，去除prop：hideAll，单向数据流改造 ([f1771e1](https://github.com/Xli33/element-plus-derive/commit/f1771e1f5a6c21fdb945d66a4893a891c5eeb66f))
* 优化MCalendar的css var前缀，适配自定义类前缀 ([8c61fc9](https://github.com/Xli33/element-plus-derive/commit/8c61fc93413d938612a6dd23530b26e412c22b8d))
* 原`page-table-`类前缀改为`pagetable-` ([a26a991](https://github.com/Xli33/element-plus-derive/commit/a26a991f9bd7dc514894d99f3712bb139d986423))

### Features

* 新增ConfigProvider组件，提供局部国际化支持 ([d8a8d08](https://github.com/Xli33/element-plus-derive/commit/d8a8d08fd7bfe4ac8628a6136cd4d6cd0f0e0190))
* 优化ElColumn的列作用域插槽，新增列参数 ([a6c4e68](https://github.com/Xli33/element-plus-derive/commit/a6c4e686c993855d964a77488c045479eb571a27))
* **Combi:** `<Combi>`适配`<el-input-number>` ([9d581c2](https://github.com/Xli33/element-plus-derive/commit/9d581c29e4bfd23a7ba02aa588fb57f766e499e2))

### Bug Fixes

* 优化Combi适配表单组件 ([941a38b](https://github.com/Xli33/element-plus-derive/commit/941a38b517675ec2cd0453dc699ab86bc707a28b))

## [0.2.0](https://github.com/Xli33/element-plus-derive/compare/v0.1.0...v0.2.0) (2026-05-01)

### ⚠ BREAKING CHANGES

* 指令名统一以 `v` 起头，便于识别区分，并添加具体类型声明 ([4ef18ed](https://github.com/Xli33/element-plus-derive/commit/4ef18ed2c73768c50b13018b0083c8ca0216177e))

## [0.1.0](https://github.com/Xli33/element-plus-derive/compare/v0.0.6...v0.1.0) (2026-04-20)

### ⚠ BREAKING CHANGES

* 优化CurdTable的`beforeAdd`与`beforeRemove`，不再返回Promise，通过传参回调执行新增or删除，避免实际场景可能产生永远pending的Promise ([2725ce7](https://github.com/Xli33/element-plus-derive/commit/2725ce728b453d3da56f23378e7fb71304f501b5))

## [0.0.6](https://github.com/Xli33/element-plus-derive/compare/v0.0.5...v0.0.6) (2026-04-13)

### Features

* **borderless:** 优化MCalendar样式，不再显示多余边框 ([130ee2c](https://github.com/Xli33/element-plus-derive/commit/130ee2cf5f1332828d6dfa6691d3478fb94d918e))

## [0.0.5](https://github.com/Xli33/element-plus-derive/compare/v0.0.4...v0.0.5) (2026-04-12)

### Features

* **Drawer:** 统一Drawer的默认关闭行为，点击遮罩与关闭icon时效果与取消按钮一致 ([5e65135](https://github.com/Xli33/element-plus-derive/commit/5e65135077aa139a71e0c52044b70ea93e551a40))
* **theme:** `MCalendar`与`PageTable`适配暗色模式 ([f73bc96](https://github.com/Xli33/element-plus-derive/commit/f73bc96f5c2530b5fc34f59239b7bb0b8e3b1714))

## [0.0.4](https://github.com/Xli33/element-plus-derive/compare/v0.0.3...v0.0.4) (2026-03-15)

### Bug Fixes

* 优化PageTable工具样式 ([459edb1](https://github.com/Xli33/element-plus-derive/commit/459edb1c2282c877c6ab0e33de1176c0a0fd7ccd))

## [0.0.3](https://github.com/Xli33/element-plus-derive/compare/v0.0.2...v0.0.3) (2026-01-31)

### Features

* `CurdTable` 支持传递 el-table 的所有prop ([f17a2ae](https://github.com/Xli33/element-plus-derive/commit/f17a2aef31158e1ec9966c3ca9a3627fba318b13))
* 新增 table-cache-cols.ts，让el-table支持将列宽缓存至本地 ([82be76d](https://github.com/Xli33/element-plus-derive/commit/82be76d3e99c13c49d3ab495fa6fade587ff78a6))
* **CurdTable.vue:** 支持设置自带功能列的`prop` ([b6a90a7](https://github.com/Xli33/element-plus-derive/commit/b6a90a7d394ebfb2cb92b5bc3ceb439b66b313e2))
* **ToggleColumn.vue:** 新增prop：`minVisible` 与 `realtime` ([e1a9cb3](https://github.com/Xli33/element-plus-derive/commit/e1a9cb38da841ba7118f17b21b6cb8bf6635f355))

### Bug Fixes

* **ToggleColumn.vue:** 当获取的本地数据中无有效 `visible` 属性时，列应该可见 ([0a594fc](https://github.com/Xli33/element-plus-derive/commit/0a594fcf95201af38b20ff6e052aaed8ba48e7bd))
* **v-el-select:** 优化指令 `v-el-select` ，全选功能跟随 `multiple` 状态 ([cd3eef4](https://github.com/Xli33/element-plus-derive/commit/cd3eef4cb99ba47ba82694e6573fcab924d33ae6))

## [0.0.2](https://github.com/Xli33/element-plus-derive/compare/v0.0.1...v0.0.2) (2026-01-10)

### Features

* **AllCheckbox:** 优化样式 ([29cf3d7](https://github.com/Xli33/element-plus-derive/commit/29cf3d709aadbeb6b52ad5e86f51acd1c4045cc2))

## 0.0.1 (2026-01-09)
