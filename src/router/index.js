import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
    meta: { title: "Login" },
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },
  // {
  //     path: '/location',
  //     component: Layout,
  //     name: 'Location',
  //     meta: { title: 'Danh sách thông báo', icon: 'el-icon-location' },
  //     children: [
  //         {
  //             path: '/location',
  //             name: 'Location',
  //             component: () => import('@/views/location/index_bk.vue'),
  //             meta: {
  //                 title: 'Danh sách thông báo'
  //             }
  //         },
  //     ]
  // },
  {
    is_hide: true,
    path: "/changepassword",
    component: Layout,
    name: "Changepassword",
    meta: {
      title: "Đổi mật khẩu",
      icon: "el-icon-setting",
    },
    children: [
      {
        path: "/changepassword",
        name: "Changepassword",
        component: () => import("@/views/changepassword/changepassword.vue"),
        meta: {
          title: "Đổi mật khẩu",
        },
      },
    ],
  },
  {
    path: "/deviceaccess",
    component: Layout,
    name: "Deviceaccess",
    meta: {
      title: "Phiên truy cập thiết bị",
      icon: "el-icon-setting",
    },
    children: [
      {
        path: "/deviceaccess",
        name: "Deviceaccess",
        component: () => import("@/views/deviceaccess/deviceaccess.vue"),
        meta: {
          title: "Phiên truy cập thiết bị",
        },
      },
    ],
  },
  {
    path: "/linkapp",
    component: Layout,
    name: "Linkapp",
    meta: {
      title: "Link tải app",
      icon: "el-icon-position",
    },
    children: [
      {
        path: "/linkapp",
        name: "Linkapp",
        component: () => import("@/views/linkapp/linkapp.vue"),
        meta: {
          title: "Link tải app",
        },
      },
    ],
  },
  {
    path: "/staff",
    component: Layout,
    name: "Staff",
    meta: {
      title: "Quản lý nhân viên",
      icon: "el-icon-date",
    },
    children: [
      {
        path: "/staff",
        name: "Staff",
        component: () => import("@/views/staff/staff.vue"),
        meta: {
          title: "Quản lý nhân viên",
        },
      },
    ],
  },
  {
    path: "/images",
    component: Layout,
    name: "Images",
    meta: {
      title: "Quản lý ảnh đại diện",
      icon: "el-icon-upload",
    },
    children: [
      {
        path: "/images",
        name: "Images",
        component: () => import("@/views/images/images.vue"),
        meta: {
          title: "Quản lý ảnh đại diện",
        },
      },
    ],
  },
  {
    path: "/extention",
    component: Layout,
    name: "Extention",
    meta: {
      title: "Quản lý Extention",
      icon: "el-icon-connection",
    },
    children: [
      {
        path: "/extention",
        name: "Extention",
        component: () => import("@/views/extention/extention.vue"),
        meta: {
          title: "Quản lý Extention",
        },
      },
    ],
  },
  { path: "*", redirect: "/deviceaccess", hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    mode: "history",
    base: process.env.BASE_URL,
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
