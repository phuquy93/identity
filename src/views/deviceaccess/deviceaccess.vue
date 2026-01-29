<template>
  <div>
    <form class="el-form ad-form-query el-form--inline">
      <div class="el-form-item el-form-item--mini">
        <div class="el-form-item__content" style="margin-left: 10px">
          <div class="el-input">
            <input
              type="text"
              autocomplete="off"
              placeholder="Nhập mã app"
              class="el-input__inner"
              v-model="appCode"
            />
          </div>
        </div>
        <div class="el-form-item__content" style="margin-left: 10px">
          <div class="el-input">
            <input
              type="text"
              autocomplete="off"
              placeholder="Nhập mã truy cập"
              class="el-input__inner"
              v-model="deviceCode"
            />
          </div>
        </div>
        <div class="el-form-item__content" style="margin-left: 10px">
          <div class="el-input">
            <input
              type="text"
              autocomplete="off"
              placeholder="Nhập mã nhân viên"
              class="el-input__inner"
              v-model="staffCode"
            />
          </div>
        </div>
      </div>

      <div class="el-form-item el-form-item--mini">
        <div class="el-form-item__content">
          <button
            type="button"
            class="el-button el-button--primary"
            @click="handleSearch"
            style="position: relative"
          >
            <i class="el-icon-search"></i><span>Tìm</span>
          </button>
        </div>
      </div>
    </form>
    <el-table :data="lists" border style="width: 100%" v-loading="loading">
      <el-table-column prop="deviceCode" label="Mã truy cập" />
      <el-table-column prop="appCode" label="Mã ứng dụng" />
      <el-table-column prop="created_at" label="Ngày tạo">
        <template #default="{ row }">
          {{ formatDate(row.createAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="staffCode" label="Mã nhân viên" />
      <el-table-column prop="deviceName" label="Tên nhân viên" />
      <el-table-column prop="approveState" label="Trạng thái">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.approveState)">
            {{ formatStatus(row.approveState) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Thao tác">
        <template #default="{ row }">
          <el-button type="primary" @click="logItem(row)" icon="el-icon-tickets"
            >Chi tiết</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <template v-if="inforpage != null">
      <el-pagination
        layout="total, prev, pager, next"
        :total="inforpage.total"
        :page-size="inforpage.size"
        :current-page="page"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </template>
    <!-- Popup -->
    <el-dialog
      title="Chi tiết"
      :visible="dialogVisible"
      @update:visible="dialogVisible = $event"
      width="50%"
      v-if="detail != null && dialogVisible"
    >
      <table class="detail-table">
        <tr>
          <th width="25%">Id</th>
          <th width="25%">Mã truy cập</th>
          <th width="15%">Mã app</th>
          <th width="15%">Mã nhân viên</th>
        </tr>
        <tr>
          <td>{{ detail.id }}</td>
          <td>{{ detail.deviceCode }}</td>
          <td>{{ detail.appCode }}</td>
          <td>{{ detail.staffCode }}</td>
        </tr>
        <tr>
          <th colspan="2">Tên nhân viên</th>
          <th colspan="2">Trạng thái</th>
        </tr>
        <tr>
          <td colspan="2">{{ detail.deviceName }}</td>
          <td colspan="2">
            <el-tag :type="getStatusType(detail.approveState)">
              {{ formatStatus(detail.approveState) }}
            </el-tag>
          </td>
        </tr>
      </table>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            v-if="returnUser()?.scope.search('admin') != -1"
            :loading="loading"
            class="el-button el-button--primary"
            icon="el-icon-check"
            @click="handleAccept('duyet')"
            >Duyệt</el-button
          >
          <el-button
            v-if="returnUser()?.scope.search('admin') != -1"
            :loading="loading"
            class="el-button el-button--danger"
            icon="el-icon-close"
            @click="handleAccept('tuchoi')"
            >Từ chối</el-button
          >
          <el-button @click="dialogVisible = false" :loading="loading"
            >Đóng</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getListDeviceAccess, deviceaccessAccept } from "@/api/identity";

export default {
  name: "ViewDeviceaccess",
  data() {
    return {
      page: 1,
      appCode: "",
      deviceCode: "",
      staffCode: "",
      loading: false,
      lists: null,
      inforpage: null,
      token: this.$store.state.user.token,
      dialogVisible: false,
      detail: null,
    };
  },
  created() {
    this.getList(this.page);
  },
  methods: {
    returnUser() {
      return this.parseJwt(this.$store.state.user.token[0]);
    },
    parseJwt(token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );

        return JSON.parse(jsonPayload);
      } catch (e) {
        return null;
      }
    },
    async getList(page) {
      this.loading = true;
      try {
        const res = await getListDeviceAccess({
          page: page,
          appCode: this.appCode,
          deviceCode: this.deviceCode,
          staffCode: this.staffCode,
        });
        if (res.data && res.data.data) {
          this.lists = res.data.data;
          this.inforpage = res.data.meta;
        } else {
          this.lists = null;
          this.inforpage = null;
        }
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      this.page = 1;
      this.getList(this.page);
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getList(this.page);
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
    },
    getStatusType(state) {
      if (state == -1) return "danger";
      if (state == 2) return "success";
      if (state == 1) return "warning";
      return "info";
    },
    formatStatus(state) {
      if (state == -1) return "Từ chối";
      if (state == 2) return "Đã duyệt";
      if (state == 1) return "Chờ xử lý";
      return state;
    },
    logItem(row) {
      this.detail = row;
      this.dialogVisible = true;
    },
    handleAccept(type) {
      const message =
        type === "duyet"
          ? "Bạn có chắc chắn muốn duyệt?"
          : "Bạn có chắc chắn muốn từ chối?";
      this.$confirm(message, "Thông báo", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(async () => {
          this.loading = true;
          try {
            const res = await deviceaccessAccept({
              id: this.detail.id,
              type: type,
            });
            if (res.data.data) {
              this.$message({
                type: "success",
                message:
                  type === "duyet"
                    ? "Duyệt thành công!"
                    : "Từ chối thành công!",
              });
              this.dialogVisible = false;
              this.getList(this.page);
            }
          } finally {
            this.loading = false;
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.detail-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
.detail-table th,
.detail-table td {
  border: 1px solid #ebeef5;
  padding: 12px 10px;
  text-align: left;
  color: #606266;
  font-size: 14px;
}
.detail-table th {
  background-color: #fafafa;
  font-weight: 700;
  color: #303133;
}
</style>
