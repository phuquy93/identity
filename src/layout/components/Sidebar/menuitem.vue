<template>
  <div>
    <el-submenu :index="item.path" v-if="item.children.length > 1">
      <!-- eslint-disable -->
      <template slot="title">
        <i :class="item.meta.icon"></i>
        <span>{{ item.meta.title }}</span>
      </template>
      <el-menu-item :index="o.path" v-for="(o, i) in item.children" :key="i">
        <router-link :to="item.path">
          <i :class="o.meta.icon"></i>
          {{ o.meta.title }}
        </router-link>
      </el-menu-item>
    </el-submenu>
    <el-menu-item :index="item.path" v-else-if="!item.is_hide">
      <router-link :to="item.path">
        <i :class="item.meta.icon"></i>
        <span>{{ item.meta.title }}</span>
      </router-link>
    </el-menu-item>
  </div>
</template>

<script>
export default {
  name: "SiderbarItem",
  props: ["item", "basePath"],
};
</script>

<style></style>
