/* eslint-disable */

import { getToken, setToken, removeToken, setTokenReset } from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    token: getToken() ? getToken().split(",") : getToken(),
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
};

const actions = {
  // user login
  async login({}, userInfo) {
    const { username, password } = userInfo;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        appcode: "IDENTITY",
      },
      body: JSON.stringify({ username, password }),
    };
    let res = await fetch(
      "https://api.identity.service.dienmaycholon.vn/Identity/Login/Password",
      options
    );
    const data = await res.json();
    if (data.data.accessToken) {
      setToken(data.data.accessToken);
      setTokenReset(data.data.refreshToken);
    }
    return data;
  },

  // user logout
  logout({ commit }) {
    removeToken();
    resetRouter();
    commit("RESET_STATE");
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
