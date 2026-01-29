<template>
  <!--  eslint-disable -->
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page.sync="currentPage"
    :page-sizes="[10, 15, 20]"
    layout="total,sizes, prev, pager, next"
    :total="total"
    :page-size.sync="pageSize"
  >
  </el-pagination>
</template>

<script>
export default {
  name: "MyPagination",
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
    };
  },
  props: ["total"],
  methods: {
    handleSizeChange(val) {
      this.$emit("pagination", { page: this.currentPage, limit: val });
    },
    handleCurrentChange(val) {
      this.$emit("pagination", { page: val, limit: this.pageSize });
    },
  },
};
</script>

<style>
</style>