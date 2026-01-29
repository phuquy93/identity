<template>
  <el-card header="Đổi mật khẩu">
    <el-form
      ref="form"
      :model="form"
      label-width="150px"
      :rules="rules"
      style="max-width: 500px"
    >
      <el-form-item label="Mật khẩu cũ" prop="oldPassword">
        <el-input v-model="form.oldPassword" show-password></el-input>
      </el-form-item>
      <el-form-item label="Mật khẩu mới" prop="newPassword">
        <el-input v-model="form.newPassword" show-password></el-input>
      </el-form-item>
      <el-form-item label="Xác nhận mật khẩu" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="loading"
          >Đổi mật khẩu</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { changePassword } from "@/api/identity";

export default {
  name: "ChangePassword",
  data() {
    const validateConfirm = (rule, value, callback) => {
      if (value !== this.form.newPassword) {
        callback(new Error("Mật khẩu xác nhận không khớp!"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      form: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      rules: {
        oldPassword: [
          {
            required: true,
            message: "Vui lòng nhập mật khẩu cũ",
            trigger: "blur",
          },
        ],
        newPassword: [
          {
            required: true,
            message: "Vui lòng nhập mật khẩu mới",
            trigger: "blur",
          },
          {
            min: 6,
            message: "Mật khẩu phải từ 6 ký tự trở lên",
            trigger: "blur",
          },
        ],
        confirmPassword: [
          {
            required: true,
            message: "Vui lòng nhập xác nhận mật khẩu",
            trigger: "blur",
          },
          { validator: validateConfirm, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          try {
            let res = await changePassword({
              oldPassword: this.form.oldPassword,
              newPassword: this.form.newPassword,
            });
            if (res.status == 200 && res.data.data) {
              this.$message.success("Đổi mật khẩu thành công!");
              this.form.oldPassword = "";
              this.form.newPassword = "";
              this.form.confirmPassword = "";
            } else {
              this.$message.error("Đổi mật khẩu thất bại!");
            }
          } catch (error) {
            console.error(error);
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
