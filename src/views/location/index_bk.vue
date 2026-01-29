<template>
  <div>
    <p style="font-size: 12px; margin-bottom: 5px; color: red">
      <strong id="token_status">Hệ thống chưa sẵn sàng</strong>
    </p>
    <form class="el-form ad-form-query el-form--inline">
      <div class="el-form-item el-form-item--mini">
        <div class="el-form-item__content">
          <div class="el-input el-input--mini">
            <input
              type="text"
              autocomplete="off"
              placeholder="Tiêu đề"
              class="el-input__inner"
              v-model="title"
            />
          </div>
        </div>
        <div class="el-form-item__content" style="margin-left: 10px">
          <div class="el-input el-input--mini">
            <el-select placeholder="Tùy chọn" v-model="status">
              <el-option label="Chưa xem" :value="0"></el-option>
              <el-option label="Đã xem" :value="1"></el-option>
            </el-select>
          </div>
        </div>
        <div class="el-form-item__content" style="margin-left: 10px">
          <div class="el-input el-input--mini">
            <el-date-picker
              type="date"
              placeholder="Từ ngày"
              v-model="date_start"
            ></el-date-picker>
          </div>
        </div>
        <div class="el-form-item__content" style="margin-left: 10px">
          <div class="el-input el-input--mini">
            <el-date-picker
              type="date"
              placeholder="Đến ngày"
              v-model="date_end"
            ></el-date-picker>
          </div>
        </div>
      </div>

      <div class="el-form-item el-form-item--mini">
        <div class="el-form-item__content">
          <button
            type="button"
            class="el-button el-button--primary el-button--mini"
            @click="handleSearch"
            style="position: relative"
          >
            <i class="el-icon-search"></i><span>Tìm</span>
          </button>
        </div>
      </div>
    </form>
    <p style="font-size: 14px; margin-bottom: 5px">
      <Strong>Tổng: {{ inforpage ? inforpage.total : 0 }}</Strong>
    </p>
    <el-table :data="lists" border style="width: 100%" v-loading="loading">
      <el-table-column label="ID">
        <template #default="{ row }">
          <strong style="color: #03a9f4; cursor: pointer">{{ row.id }}</strong>
          <div>
            <button
              type="button"
              class="el-button el-button--primary el-button--mini"
              @click="handleDetail(row)"
            >
              Chi tiết
            </button>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="title" label="Tiêu đề" />
      <el-table-column prop="toId" label="Nhóm nhận tin" />
      <el-table-column prop="fromId" label="Tên người gửi" />
      <el-table-column prop="created_at" label="Time">
        <template #default="{ row }">
          {{ row.readable_updated_at }}
        </template>
      </el-table-column>
    </el-table>
    <template v-if="inforpage != null">
      <VuePagination
        :page-count="inforpage.total_pages"
        :page-range="3"
        :margin-pages="2"
        :click-handler="handleCurrentChange"
        :prev-text="'Prev'"
        :next-text="'Next'"
        :container-class="'pagination'"
        :page-class="'page-item'"
        v-model="page"
      >
      </VuePagination>
    </template>
    <!-- eslint-disable -->
    <el-dialog
      title="Chi tiết"
      :visible.sync="dialogVisible"
      width="50%"
      v-if="detail != null"
    >
      <el-row style="margin-bottom: 30px">
        <el-col :span="7"><strong>ID</strong></el-col>
        <el-col :span="17" style="color: rgb(3, 169, 244)">{{
          detail.id
        }}</el-col>
      </el-row>
      <el-row style="margin-bottom: 30px">
        <el-col :span="7"><strong>Tiêu đề</strong></el-col>
        <el-col :span="17">{{ detail.title }}</el-col>
      </el-row>
      <el-row style="margin-bottom: 30px">
        <el-col :span="7"><strong>Tiêu đề phụ</strong></el-col>
        <el-col :span="17">{{ detail.subTitle }}</el-col>
      </el-row>
      <el-row style="margin-bottom: 30px">
        <el-col :span="7"><strong>Nhóm nhận tin</strong></el-col>
        <el-col :span="17">{{ detail.toId }}</el-col>
      </el-row>
      <el-row style="margin-bottom: 30px">
        <el-col :span="7"><strong>Tên người gửi</strong></el-col>
        <el-col :span="17">{{ detail.fromId }}</el-col>
      </el-row>
      <el-row style="margin-bottom: 30px">
        <el-col :span="7"><strong>Đã gửi</strong></el-col>
        <el-col :span="17">{{ detail.readable_updated_at }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="7">Nội dung</el-col>
        <el-col :span="17">{{ detail.content }}</el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button
          :loading="loading"
          class="el-button el-button--primary"
          v-if="
            detail.toId.search('_thunganchinhanh') > -1 &&
            detail.status == 0 &&
            show_checked
          "
          @click="handleChecked(detail.id)"
          >Đã xem</el-button
        >
        <el-button @click="dialogVisible = false" :loading="loading"
          >Đóng</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { Message } from "element-ui";
import Toast from "../../utils/toast";

const firebaseConfig = {
  apiKey: "AIzaSyBybXVFqAgaUaVQFAzmMURY2Vr8chUmDPw",
  appId: "1:338654189304:web:06207aa1b23282f4c9cd0d",
  messagingSenderId: "338654189304",
  projectId: "dmclmobileapp",
  authDomain: "dmclmobileapp.firebaseapp.com",
  databaseURL: "https://dmclmobileapp.firebaseio.com",
  storageBucket: "dmclmobileapp.appspot.com",
  measurementId: "G-LG7B1Q7LJ4",
};
// eslint-disable-next-line
const app = initializeApp(firebaseConfig);
// let statusDk = localStorage.getItem("vue_admin_status_dk");
let datamew = localStorage.getItem("vue_admin_token").split(",");
let index = 0;
datamew = [...datamew, "all"];

const messaging = getMessaging();

onMessage(messaging, (payload) => {
  Toast.success(JSON.stringify(payload));
  console.log("Message received. ", payload);
});

getToken(messaging, {
  vapidKey:
    "BMaESjdyXISGbQmjrtM5MqXOYRPgHh__zCrXYDylQiGdKcweWkaP4WbzPK8f9tAIfVVJPXRLevThyWV9x2-bV2Q",
})
  .then((currentToken) => {
    if (currentToken) {
      console.log("Token started: " + currentToken);
      localStorage.setItem("tokenNoti", currentToken);
      document.getElementById("token_status").innerText =
        "Hệ thống đã sẵn sàng";
      document.getElementById("token_status").style.color = "green";
      dangky(currentToken);
    } else {
      // Show permission request UI
      console.log(
        "No registration token available. Request permission to generate one."
      );
    }
  })
  .catch((err) => {
    console.log("An error occurred while retrieving token. ", err);
  });
function dangky(token) {
  if (index < datamew.length) {
    actiondangky(token);
  }
}
function actiondangky(token) {
  fetch("https://apiat.stdmcl.com:11443/api/v1/notice/addtopicgroup", {
    method: "post",
    body: JSON.stringify({
      tokens: token,
      topic: datamew[index],
    }),
  })
    .then((response) => response.json())
    .then(() => {
      index++;
      dangky(token);
    })
    .catch(() => {
      index++;
      dangky(token);
    });
  // fetch(
  //   "https://iid.googleapis.com/iid/v1/" +
  //     token +
  //     "/rel/topics/" +
  //     datamew[index],
  //   {
  //     method: "POST",
  //     headers: new Headers({
  //       Authorization:
  //         "key=AAAATtlc1vg:APA91bEkJBDCwl08yElFgZcJJd9BC-ZYcWi-NO55LThSv0Io4WKtm_sTE0kxQ4ySj2E7Oj1_UN0R7WuAkYNtffjX3oXqYuMeq17Ujyin1xVtZ5QJKgEEjuETTldTfZ4JwIp6znrUmLu9",
  //     }),
  //   }
  // )
  //   .then((response) => {
  //     if (response.status < 200 || response.status >= 400) {
  //       throw (
  //         "Error subscribing to topic: " +
  //         response.status +
  //         " - " +
  //         response.text()
  //       );
  //     }
  //     console.log('Subscribed to "' + datamew[index] + '"');
  //     // localStorage.setItem("vue_admin_status_dk", 2);
  //     index++;
  //     dangky(token);
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });
}

export default {
  name: "View-so-immediate",
  data() {
    return {
      lists: null,
      page: 1,
      inforpage: null,
      loading: true,
      title: "",
      dialogVisible: false,
      detail: null,
      status: 0,
      date_start: new Date(new Date().setDate(new Date().getDate() - 2)),
      date_end: new Date(),
      show_checked: true,
    };
  },
  created() {
    this.$store
      .dispatch("noti/getList", {
        page: 1,
        title: this.title,
        status: this.status,
        date_start: this.date_start,
        date_end: this.date_end,
      })
      .then((res) => {
        this.lists = res.data;
        this.inforpage = res.meta.pagination;
        this.loading = false;
      })
      .catch(() => {
        Message({
          message: "Không thể kết nối đến serve!!",
          type: "error",
          duration: 5 * 1000,
        });
      });
  },
  computed: {
    store() {
      return this.$store.state.user.store;
    },
    token() {
      return this.$store.state.user.token;
    },
  },
  methods: {
    handleSearch() {
      this.handleCurrentChange(1);
    },
    handleChecked(id) {
      this.loading = true;
      this.$store
        .dispatch("noti/handleChecked", {
          id: id,
          cid_user: window.localStorage.getItem("vue_admin_name"),
        })
        .then((res) => {
          if (res.status == 200) {
            this.loading = false;
            this.show_checked = false;
          } else {
            Message({
              message: "Cập nhật thất bại!!",
              type: "error",
              duration: 5 * 1000,
            });
            this.loading = false;
          }
        })
        .catch(() => {
          Message({
            message: "Không thể kết nối đến serve!!",
            type: "error",
            duration: 5 * 1000,
          });
        });
    },
    handleCurrentChange(e) {
      this.loading = true;
      this.$store
        .dispatch("noti/getList", {
          page: e,
          title: this.title,
          status: this.status,
          date_start: this.date_start,
          date_end: this.date_end,
        })
        .then((res) => {
          this.lists = res.data;
          this.page = e;
          this.inforpage = res.meta.pagination;
          this.loading = false;
        })
        .catch(() => {
          Message({
            message: "Không thể kết nối đến serve!!",
            type: "error",
            duration: 5 * 1000,
          });
        });
    },
    handleDetail(detail) {
      this.dialogVisible = true;
      this.detail = detail;
    },
  },
};
</script>

