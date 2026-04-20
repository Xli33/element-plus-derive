<template>
  <el-container style="height: 100vh">
    <el-aside width="200px">
      <el-menu default-active="AllCheckboxDemo">
        <el-menu-item v-for="(item, key) in map" :key="key" :index="key" @click="changeMenu(key)">
          <span>{{ key }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <component :is="current"></component>
    </el-main>
  </el-container>
</template>

<script setup lang="tsx">
import { shallowRef } from 'vue'
import AllCheckboxDemo from './views/AllCheckbox/demo.vue'
import CacheSelectDemo from './views/CacheSelect/demo.vue'
import CombiDemo from './views/Combi/demo.vue'
import CurdTableDemo from './views/CurdTable/demo.vue'
import DrawerDemo from './views/Drawer/demo.vue'
import ElColumnDemo from './views/ElColumn/demo.vue'
import MCalendarDemo from './views/MCalendar/demo.vue'
import ModalFooterDemo from './views/ModalFooter/demo.vue'
import PageTableDemo from './views/PageTable/demo.vue'
import RemoteSelectDemo from './views/RemoteSelect/demo.vue'
// import ToggleColumnDemo from './views/ToggleColumn/demo.vue';

const map = {
  AllCheckboxDemo,
  CacheSelectDemo,
  CombiDemo,
  CurdTableDemo,
  DrawerDemo,
  ElColumnDemo,
  MCalendarDemo,
  ModalFooterDemo,
  PageTableDemo,
  RemoteSelectDemo
  // ToggleColumnDemo
}

const current = shallowRef(AllCheckboxDemo)

const changeMenu = (menuName: keyof typeof map) => {
  current.value = map[menuName]
}
</script>

<style lang="scss">
body {
  margin: 0;
  // text-align: center;
}

.el-card__header p {
  vertical-align: top;

  > span {
    vertical-align: middle;
  }
}

.el-select-dropdown {
  max-height: 320px;
}

.block {
  margin: 10px;
}

.el-table--small {
  font-size: 14px;

  .el-table__cell {
    padding-left: 6px;
    padding-right: 6px;
  }
}
</style>
