<template>
  <div>
    <form class="el-form ad-form-query el-form--inline">
      <div class="el-form-item el-form-item--mini">
        <div class="el-form-item__content" style="margin-left: 10px">
          <div class="el-input">
            <input
              type="text"
              autocomplete="off"
              placeholder="Nhập nhân viên"
              class="el-input__inner"
              v-model="staffCode"
            />
          </div>
        </div>
        <div class="el-form-item__content" style="margin-left: 10px">
          <div class="el-input">
            <el-select placeholder="Tùy chọn" v-model="approveState">
              <el-option label="Chờ xử lý" :value="1"></el-option>
              <el-option label="Đã duyệt" :value="2"></el-option>
              <el-option label="Từ chối" :value="-1"></el-option>
            </el-select>
          </div>
        </div>
      </div>

      <div class="el-form-item el-form-item--mini">
        <div class="el-form-item__content">
          <button
            :loading="loading"
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
      <el-table-column prop="staffCode" label="Mã nhân viên" />
      <el-table-column prop="siteCode" label="Chi nhánh" />
      <el-table-column prop="staffCodeupdateAt" label="Ngày update">
        <template #default="{ row }">
          {{ formatDate(row.updateAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="approveState" label="Trạng thái">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.approveState)">
            {{ formatStatus(row.approveState) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="avatarImageUrl" label="Ảnh">
        <template #default="{ row }">
          <el-image
            style="width: 100px; height: 100px"
            :src="row.avatarImageUrl"
            :preview-src-list="[row.avatarImageUrl]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="Thao tác" width="250px">
        <template #default="{ row }">
          <div
            v-if="
              row.approveState === 1 &&
              returnUser()?.scope.search('admin') != -1
            "
          >
            <el-input
              type="text"
              placeholder="Lý do từ chối"
              v-model="row.note"
              style="margin-bottom: 5px"
            ></el-input>
            <div style="display: flex; gap: 5px">
              <el-button
                size="mini"
                type="success"
                icon="el-icon-check"
                @click="handleAction(row, 'duyet')"
                >Duyệt</el-button
              >
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-close"
                @click="handleAction(row, 'tu_choi')"
                >Từ chối</el-button
              >
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getListImages, avatarRequestAction } from "@/api/identity";

export default {
  name: "ViewImages",
  data() {
    return {
      staffCode: "",
      approveState: 1,
      page: 1,
      size: 10,
      loading: false,
      lists: [],
      inforpage: null,
    };
  },
  created() {
    this.getListImages(this.page);
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
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    },
    formatStatus(status) {
      if (status === 1) {
        return "Chờ xử lý";
      } else if (status === 2) {
        return "Đã duyệt";
      } else if (status === -1) {
        return "Từ chối";
      }
    },
    getStatusType(status) {
      if (status === 1) {
        return "warning";
      } else if (status === 2) {
        return "success";
      } else if (status === -1) {
        return "danger";
      }
    },
    async getListImages(page) {
      this.loading = true;
      try {
        const res = await getListImages({
          page: page,
          staffCode: this.staffCode,
          approveState: this.approveState,
          size: this.size,
        });
        if (res.data && res.data.data) {
          this.lists = res.data.data.map((item) => ({
            ...item,
            note: "",
          }));
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
      this.getListImages(this.page);
    },
    async handleAction(row, type) {
      if (type === "tu_choi" && !row.note) {
        this.$message.warning("Vui lòng nhập lý do từ chối");
        return;
      }

      this.loading = true;
      try {
        const res = await avatarRequestAction({
          id: row.id,
          type: type,
        });
        if (res.data) {
          this.$message.success("Thao tác thành công");
          this.getListImages(this.page);
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
