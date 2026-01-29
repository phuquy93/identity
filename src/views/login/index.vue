x`
<template>
  <div class="container-login100">
    <div class="wrap-login100">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        class="login100-form validate-form"
        auto-complete="on"
        label-position="left"
      >
        <div style="width: 100%; padding: 10%; background: #eee">
          <span class="login100-form-title p-b-34"> ĐĂNG NHẬP HỆ THỐNG </span>
          <el-form-item prop="username">
            <el-input
              placeholder="Username"
              auto-complete="on"
              prefix-icon="el-icon-user"
              v-model="ruleForm.username"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="Password"
              show-password
              auto-complete="on"
              v-model="ruleForm.password"
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            style="width: 100%; margin-bottom: 30px"
            @click.prevent="handleLogin('ruleForm')"
            >Đăng nhập</el-button
          >
        </div>
      </el-form>
      <div
        class="login100-more"
        style="
          background-image: url('/qr-code-concept-illustration_114360-5773.avif');
        "
      ></div>
    </div>
  </div>
</template>

<script>
import { Message } from "element-ui";

export default {
  name: "View-login",
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            trigger: "blur",
            message: "Tên đăng nhập không để trống",
          },
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            message: "Mật khẩu không để trống",
          },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
    };
  },

  methods: {
    handleLogin(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;

          this.$store
            .dispatch("user/login", this.ruleForm)
            .then((res) => {
              if (res.data.accessToken) {
                window.location.href = "/deviceaccess";
              }
              this.loading = false;
            })
            .catch(() => {
              Message({
                message: "Tên đăng nhập hoặc mật khẩu không đúng!!",
                type: "error",
                duration: 5 * 1000,
              });
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
;
