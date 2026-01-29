import request from "@/utils/request";
import { getToken } from "@/utils/auth";

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

let is_admin = parseJwt(getToken())?.scope.search("admin");

export function getListDeviceAccess(params) {
  return request({
    url: `/${is_admin > -1 ? "Admin" : "App"}/DeviceAccess`,
    method: "get",
    params,
  });
}

export function getListLinkApp(params) {
  return request({
    url: `/App/LinkApp/GetFirstCode`,
    method: "get",
    params,
  });
}

export function coppyLinkApple(params) {
  return request({
    url: "/LinkApp/GetFirstLink",
    method: "get",
    params,
  });
}

export function getListStaff(params) {
  return request({
    url: `/${is_admin > -1 ? "Admin" : "App"}/Staff`,
    method: "get",
    params,
  });
}

export function getListExtention(params) {
  return request({
    url: `/${is_admin > -1 ? "Admin" : "App"}/Staff`,
    method: "get",
    params,
  });
}

export function deviceaccessAccept(params) {
  return request({
    url:
      `/App/DeviceAccess/` +
      params.id +
      "/" +
      (params.type === "duyet" ? "Accept" : "Reject"),
    method: "put",
    data: { note: null },
  });
}

export function staffResetPassword(params) {
  return request({
    url: `/${is_admin > -1 ? "Admin" : "App"}/Staff/${params.id}/SetPassword`,
    method: "put",
    data: { password: params.password },
  });
}

export function staffData(id) {
  return request({
    url: `/${is_admin > -1 ? "Admin" : "App"}/Staff/${id}/Data`,
    method: "get",
  });
}

export function extentionDataChange(params) {
  return request({
    url: `/${is_admin > -1 ? "Admin" : "App"}/Staff/${params.id}/Data`,
    method: "put",
    data: { fieldCode: params.fieldCode, fieldValue: params.fieldValue },
  });
}

export function getListImages(params) {
  return request({
    url: `/${is_admin > -1 ? "Admin" : "App"}/AvatarRequest`,
    method: "get",
    params,
  });
}

export function avatarRequestAction(params) {
  return request({
    url: `/${is_admin > -1 ? "Admin" : "App"}/AvatarRequest/${params.id}/${
      params.type === "duyet" ? "Accept" : "Reject"
    }`,
    method: "put",
    data: { note: null },
  });
}

export function changePassword(data) {
  return request({
    url: "/App/Account/Password",
    method: "put",
    data,
  });
}
