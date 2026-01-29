<template>
  <div>
    <form class="el-form ad-form-query el-form--inline">
      <div class="el-form-item el-form-item--mini">
        <div class="el-form-item__content" style="margin-left: 10px">
          <div class="el-input">
            <input
              type="text"
              autocomplete="off"
              placeholder="Nhập mã nhân viên"
              class="el-input__inner"
              v-model="code"
            />
          </div>
        </div>
        <div class="el-form-item__content" style="margin-left: 10px">
          <div class="el-input">
            <input
              type="text"
              autocomplete="off"
              placeholder="Nhập dữ liệu"
              class="el-input__inner"
              v-model="name"
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
      <el-table-column prop="code" label="Mã nhân viên" />
      <el-table-column prop="name" label="Tên nhân viên">
        <template #default="{ row }">
          {{ row.account ? row.account.name : row.name }}
        </template>
      </el-table-column>
      <el-table-column prop="site" label="Chi nhánh">
        <template #default="{ row }">
          {{ row.site ? row.site.name + " - " + row.site.code : "" }}
        </template>
      </el-table-column>
      <el-table-column label="Thao tác">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="logItem(row)"
            icon="el-icon-tickets"
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

    <el-dialog
      title="Chi tiết"
      :visible="dialogVisible"
      @update:visible="dialogVisible = $event"
      width="70%"
      v-if="detail != null && dialogVisible"
    >
      <table class="detail-table">
        <tbody>
          <tr>
            <th width="25%">Id</th>
            <th width="25%">Mã nhân viên</th>
            <th width="15%">Nhân viên</th>
            <th width="15%">Chi nhánh</th>
          </tr>
          <tr>
            <td>{{ detail.id }}</td>
            <td>{{ detail.code }}</td>
            <td>
              <span v-if="detail.account && !!detail.account.avatarLink">
                <img
                  :src="detail.account.avatarLink"
                  alt=""
                  style="
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    vertical-align: middle;
                  "
                />
              </span>
              {{ detail.account ? detail.account.name : detail.name }}
            </td>
            <td>
              {{
                detail.site ? detail.site.name + " - " + detail.site.code : ""
              }}
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <th width="25%">Dữ liệu nhân viên</th>
          </tr>
          <tr>
            <td v-if="!!detailData.length">
              <div
                v-for="d in detailData"
                :key="d.id"
                style="
                  background-color: rgb(236, 245, 255);
                  padding: 5px 10px;
                  border-radius: 5px;
                  margin-top: 10px;
                "
              >
                <p>
                  FieldCode: <span>{{ d.fieldCode }}</span>
                </p>
                <p style="margin-top: 10px">
                  FieldValue: <span>{{ d.fieldValue }}</span>
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            @click="handleResetPassword"
            v-if="returnUser()?.scope.search('admin') != -1"
            >Đặt dữ liệu nhân viên</el-button
          >
          <el-button @click="dialogVisible = false">Đóng</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Password Reset Dialog -->
    <el-dialog
      title="Đặt dữ liệu nhân viên"
      :visible="resetPasswordDialogVisible"
      @update:visible="resetPasswordDialogVisible = $event"
      @close="resetForm"
      width="40%"
      append-to-body
    >
      <el-form
        label-width="120px"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="Mã trường" prop="fieldCode">
          <el-input v-model="ruleForm.fieldCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="Dữ liệu" prop="fieldValue">
          <el-input v-model="ruleForm.fieldValue"></el-input>
        </el-form-item>

        <el-form-item>
          <div
            class="dialog-footer"
            style="display: flex; justify-content: flex-end"
          >
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
              :loading="loading"
              >Xác nhận</el-button
            >
            <el-button @click="resetForm" :loading="loading">Đóng</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getListExtention,
  staffData,
  extentionDataChange,
} from "@/api/identity";

export default {
  name: "ViewStaff",
  data() {
    return {
      page: 1,
      code: "",
      name: "",
      lists: null,
      inforpage: null,
      loading: false,
      dialogVisible: false,
      detail: null,
      detailData: [],
      resetPasswordDialogVisible: false,

      ruleForm: {
        fieldCode: "staffData",
        fieldValue: "",
      },
      rules: {
        fieldValue: [
          {
            required: true,
            message: "Dữ liệu không được để trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList(this.page);
  },
  methods: {
    handleResetPassword() {
      this.resetForm();
      this.resetPasswordDialogVisible = true;
    },
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
    handleSearch() {
      this.page = 1;
      this.getList(this.page);
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getList(this.page);
    },
    async getList(page) {
      this.loading = true;
      try {
        const res = await getListExtention({
          page: page,
          code: this.code,
          name: this.name,
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
    async logItem(item) {
      this.detail = item;
      this.dialogVisible = true;
      this.detailData = [];
      if (this.returnUser()?.scope.search("admin") != -1) {
        const res = await staffData(item.id);
        if (res.data && res.data.data) {
          this.detailData = res.data.data;
        }
      }
    },
    resetForm() {
      this.ruleForm.fieldCode = "staffData";
      this.ruleForm.fieldValue = "";
      this.resetPasswordDialogVisible = false;
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true;
            extentionDataChange({
              id: this.detail.id,
              fieldCode: this.ruleForm.fieldCode,
              fieldValue: this.ruleForm.fieldValue,
            }).then(() => {
              this.$message({
                type: "success",
                message: "Đặt dữ liệu thành công!",
              });
              this.resetForm();
              this.dialogVisible = false;
              this.detail = null;
            });
          } finally {
            this.loading = false;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
.dialog-footer button {
  margin-left: 10px;
}
</style>
