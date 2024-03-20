import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
export const toast = {
  success(message: string) {
    Toastify({
      text: message,
      duration: 2500,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
        fontSize: "18px",
      },
    }).showToast();
  },
  info(message: string) {
    Toastify({
      text: message,
      duration: 2500,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      style: {
        background: "#03a9f4",
        fontSize: "18px",
      },
    }).showToast();
  },
  error(message: string) {
    Toastify({
      text: message,
      duration: 2500,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      style: {
        background: "#d32f2f",
        fontSize: "18px",
      },
    }).showToast();
  },
};
