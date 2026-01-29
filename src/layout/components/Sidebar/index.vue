<template>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="menuActive"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="true"
        mode="vertical"
        :collapse="!sidebar.opened"
      >
        <SidebarItem
          v-for="(route, i) in routes"
          :key="i"
          :item="route"
          :basePath="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import SidebarItem from "./menuitem.vue";
export default {
  name: "Component-siderbar",
  components: { SidebarItem },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    menuActive() {
      return this.$route.path;
    },
    routes() {
      return this.$router.options.routes.filter((o) => !o.hidden);
    },
    variables() {
      return {
        menuBg: "#304156",
        menuText: "#bfcbd9",
        menuActiveText: "#03a9f4",
      };
    },
  },
};
</script>
