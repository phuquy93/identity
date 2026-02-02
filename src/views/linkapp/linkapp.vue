<template>
  <div>
    <form class="el-form ad-form-query el-form--inline">
      <div class="el-form-item el-form-item--mini">
        <div class="el-form-item__content" style="margin-left: 10px">
          <div class="el-input">
            <el-select placeholder="Tùy chọn" v-model="platform">
              <el-option label="Web" :value="1"></el-option>
              <el-option label="Android" :value="2"></el-option>
              <el-option label="IOS" :value="3"></el-option>
            </el-select>
          </div>
        </div>
        <div class="el-form-item__content" style="margin-left: 10px">
          <div class="el-input">
            <el-select placeholder="Tùy chọn" v-model="appCode">
              <el-option label="PREORDER" :value="'PREORDER'"></el-option>
              <el-option label="DELIVERY" :value="'DELIVERY'"></el-option>
              <el-option label="BAOHANH" :value="'BAOHANH'"></el-option>
              <el-option label="DMCLSUPER" :value="'DMCLSUPER'"></el-option>
            </el-select>
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
            <i class="el-icon-search"></i><span>Tìm kiếm</span>
          </button>
        </div>
      </div>
    </form>
    <el-table :data="lists" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="Id" />
      <el-table-column prop="link" label="Link app" />
      <el-table-column prop="platform" label="Hệ điều hành">
        <template #default="{ row }">
          {{ formatPlatform(row.platform) }}
        </template>
      </el-table-column>
      <el-table-column prop="code" label="Code" />
      <el-table-column prop="appCode" label="Mã code" />
      <el-table-column label="Thao tác" width="300">
        <template #default="{ row }">
          <el-button
            size="small"
            type="primary"
            @click="copyText(row.link)"
            icon="el-icon-tickets"
            >Coppy link app</el-button
          >
          <el-button
            size="small"
            type="primary"
            @click="copyText(row.linkApple, row.code)"
            :loading="loadingBtn"
            icon="el-icon-tickets"
            >Coppy link apple</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getListLinkApp, coppyLinkApple } from "@/api/identity";

export default {
  name: "ViewLinkapp",
  data() {
    return {
      platform: 3,
      appCode: "PREORDER",
      lists: null,
      loading: false,
      loadingBtn: false,
    };
  },
  methods: {
    async handleSearch() {
      this.loading = true;
      try {
        const res = await getListLinkApp({
          platform: this.platform,
          appCode: this.appCode,
        });
        if (res.data && res.data.data) {
          this.lists = [res.data.data];
        } else {
          this.lists = null;
        }
      } finally {
        this.loading = false;
      }
    },
    formatPlatform(platform) {
      if (platform == 1) return "Web";
      if (platform == 2) return "Android";
      if (platform == 3) return "IOS";
      return platform;
    },
    async copyText(text, code) {
      if (!text) {
        this.$message.warning("Không có liên kết để copy");
        return;
      }
      if (code) {
        this.loadingBtn = true;
        try {
          const res = await coppyLinkApple({ code });
          if (res.data.meta.success) {
            this.copyToClipboard(text);
          } else {
            this.$message.warning("Không có liên kết để copy");
            return;
          }
        } finally {
          this.loadingBtn = false;
        }
      } else {
        this.copyToClipboard(text);
      }
    },
    copyToClipboard(text) {
      // Fallback method - works on both HTTP and HTTPS
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      textArea.style.opacity = "0";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (successful) {
          this.$message.success("Đã copy thành công");
        } else {
          this.$message.warning("Không thể copy tự động");
        }
      } catch (err) {
        document.body.removeChild(textArea);
        this.$message.error("Copy thất bại: " + err.message);
      }
    },
  },
};
</script>
