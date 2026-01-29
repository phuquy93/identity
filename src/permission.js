import router from "./router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { getToken } from "@/utils/auth";

import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false });

const whiteList = ["/login"];

router.beforeEach(async (to, from, next) => {
  NProgress.start();

  const hasToken = getToken();

  // set page title
  document.title = getPageTitle(to.meta.title);

  if (hasToken) {
    if (to.path === "/login") {
      next({ path: "/deviceaccess" });
      NProgress.done();
    } else {
      next();
    }
  } else {
    // Nếu ko có token vào login thì qua trang login
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      // Nếu ko có token vào trang khác sẽ đá về login
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
