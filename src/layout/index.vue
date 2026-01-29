<template>
  <div :class="classObj" class="app-wrapper">
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div class="fixed-header">
        <navbar />
      </div>
      <div class="app-container"><app-main /></div>
    </div>
  </div>
</template>

<script>
import { Sidebar, AppMain, Navbar } from "./components";
export default {
  name: "Layout-index",
  components: {
    Sidebar,
    AppMain,
    Navbar,
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
  },
};
</script>

