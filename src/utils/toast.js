import { createToastInterface } from "vue-toastification";

const toast = createToastInterface({
  position: "top-right",
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: "button",
  icon: true,
  rtl: false
});


const toast2 = createToastInterface({
  position: "top-right",
  timeout: 0,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: "button",
  icon: true,
  rtl: false
});

export default {
  error(value) {
    toast.error(value);
  },
  warning(value) {
    toast.warning(value);
  },
  success(value) {
    toast2.success(value);
  }
};
