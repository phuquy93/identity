import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
import { getToken, getTokenReset, setToken, setTokenReset } from "@/utils/auth";

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.headers["Cache-Control"] = "no-cache";
axios.defaults.headers["Pragma"] = "no-cache";

// create an axios instance
const service = axios.create({
  baseURL: "https://api.identity.service.dienmaycholon.vn",
  timeout: 5000,
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      config.headers["token"] = getToken();
      config.headers["Authorization"] = "Bearer " + getToken();
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response;
    if (res.status !== 200) {
      Message({
        message: res.message || "Error",
        type: "error",
        duration: 5 * 1000,
      });
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  async (error) => {
    console.log(error);

    if (error.response && error.response.status === 401) {
      const refreshToken = getTokenReset();
      if (refreshToken) {
        try {
          const res = await axios.post(
            "https://api.identity.service.dienmaycholon.vn/Identity/RefreshToken",
            {
              deviceCode: null,
              refreshToken: refreshToken,
              twoStepCode: null,
            }
          );

          if (res.data && res.data.data) {
            const { accessToken, refreshToken: newRefreshToken } =
              res.data.data;
            setToken(accessToken);
            setTokenReset(newRefreshToken);

            Message({
              message: "Đã lấy lại token, vui lòng thao tác lại!",
              type: "success",
              duration: 2000,
            });

            return Promise.resolve();
          }
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError);
        }
      }
    }

    Message({
      message: error.response?.data?.error?.message || "Lỗi kết nối server",
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
