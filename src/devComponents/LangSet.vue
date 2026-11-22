<template>
  <el-select v-model="AppLocale.value" style="width: 200px" @change="change">
    <el-option
      v-for="(item, index) in langs"
      :key="index"
      :label="item.label"
      :value="item.value"></el-option>
  </el-select>
</template>

<script setup lang="ts">
// import { $i18n } from '@/locale/i18n'
import { i18n } from '@/i18n'
import { AppLocale } from '@/store'

// $i18n.i18n = i18n

const langs = [
  {
    label: '简体中文',
    value: 'zh-CN'
  },
  {
    label: 'English',
    value: 'en-US'
  }
] as const

const change = (val: (typeof langs)[number]['value']) => (i18n.global.locale.value = val)
</script>
