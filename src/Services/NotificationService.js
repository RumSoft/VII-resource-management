import React from "react";
import { toast } from "react-toastify";
//https://fkhadra.github.io/react-toastify

export default class NotificationService {
  /**
   * Make error notification displaying api response message
   * @param {SytheticEvent} exception variable from catch eg. catch(e => NotificationManager.apiError(e));
   * @param {string} title error title
   */
  static apiError(e, title, params) {
    this.error(`🔥 ${title}`, e?.response?.data?.message);
  }

  static error(title, description, params) {
    this._notify(`🚨 ${title}`, description, { ...params, type: "error" });
  }

  static success(title, description, params) {
    this._notify(`✔ ${title}`, description, { ...params, type: "success" });
  }

  static info(title, description, params) {
    this._notify(`📃 ${title}`, description, { ...params, type: "info" });
  }

  static warning(title, description, params) {
    this._notify(`⚠ ${title}`, description, { ...params, type: "warning" });
  }

  static close(toastId) {
    toast.dismiss(toastId);
  }

  static clear() {
    toast.dismiss();
  }

  static _notify(title, description, params) {
    const text = description ? (
      <div>
        <p className="m-0">{title}</p>
        <p className="m-0 small">{description}</p>
      </div>
    ) : (
      title
    );
    toast(text, {
      ...params,
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    });
  }
}
