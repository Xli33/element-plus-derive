# Changelog


## [0.2.0](https://github.com/Xli33/element-plus-derive/compare/v0.1.0...v0.2.0) (2026-05-01)


### ⚠ BREAKING CHANGES

* 指令名统一以 `v` 起头，便于识别区分，并添加具体类型声明

* 指令名统一以 `v` 起头，便于识别区分，并添加具体类型声明 ([4ef18ed](https://github.com/Xli33/element-plus-derive/commit/4ef18ed2c73768c50b13018b0083c8ca0216177e))

## [0.1.0](https://github.com/Xli33/element-plus-derive/compare/v0.0.6...v0.1.0) (2026-04-20)


### ⚠ BREAKING CHANGES

* 优化CurdTable的`beforeAdd`与`beforeRemove`，不再返回Promise，通过传参回调执行新增or删除，避免实际场景可能产生永远pending的Promise

### Features

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
