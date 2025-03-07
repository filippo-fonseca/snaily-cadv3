import axios, { AxiosResponse } from "axios";
import { toast, ToastOptions } from "react-toastify";

type AllowedMethods = "GET" | "POST" | "DELETE" | "PUT";
let url: string | undefined = "/";

if (process.env.REACT_APP_IS_DEV) {
  url = process.env.REACT_APP_SERVER_URL;
}

export const handleRequest = (path: string, method: AllowedMethods, data?: object) => {
  return axios({
    url: `${url}api/v1${path}`,
    method,
    data,
    withCredentials: true,
  });
};

export const isSuccess = (res: AxiosResponse) => {
  const isNotLogin = !["/login", "/logout", "/register", "/"].includes(window.location.pathname);
  if (isNotLogin && res.data?.invalid_token) {
    console.clear();
    window.location.href = "/login";

    return false;
  }

  return res.data.status && res.data.status === "success";
};

export function playSound(src: string) {
  const audio = new Audio(src);
  audio.volume = 0.7;

  const play = () => {
    audio.play();

    return true;
  };

  const stop = () => {
    audio.pause();
    audio.currentTime = 0;

    return true;
  };

  return { stop, play, audio };
}

export function notify(message: string) {
  const success = (options?: ToastOptions) =>
    toast.success(message, {
      style: {
        background: "#D1E7DD",
      },
      className: "alert-success",
      ...options,
    });

  const error = (options?: ToastOptions) =>
    toast.error(message, {
      style: {
        background: "#F8D7DA",
      },
      className: "alert-danger",
      ...options,
    });

  const warn = (options?: ToastOptions) =>
    toast.warn(message, {
      style: {
        background: "#FFF3CD",
      },
      className: "alert-warning",
      ...options,
    });

  return {
    success,
    error,
    warn,
  };
}
