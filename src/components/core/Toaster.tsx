import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const toasterSuccess = (
  message: string,
  time: number = 3000,
  customId?: string | number,
) => {
  toast(message || "process has been done successfully", {
    type: "success",
    toastId: customId,
    position: "bottom-right",
    autoClose: time,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    className: "text-sm toaster-white",
  });
};

export const toasterError = (
  message: string,
  time: number = 3000,
  customId?: string | number,
) => {
  toast(message || "An error has been encountered", {
    type: "error",
    toastId: customId,
    position: "bottom-right",
    autoClose: time,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    className: "text-sm toaster-white font-bold",
  });
};

export const toasterInfo = (
  message: string,
  time: number = 3000,
  customId?: string | number,
) => {
  toast(message, {
    type: "info",
    toastId: customId,
    position: "top-center",
    autoClose: time,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: true,
    className: "text-sm p-2 toaster-black",
  });
};

export const toasterWarning = (
  message: string,
  time: number = 3000,
  customId?: string | number,
) => {
  toast(message, {
    type: "warning",
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    className: "text-sm toaster-white",
  });
};
