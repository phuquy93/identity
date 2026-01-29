const TokenKey = "identity_token";

const TokenKeyReset = "identity_token_reset";

export function getToken() {
  return localStorage.getItem(TokenKey);
}
export function setToken(token) {
  return localStorage.setItem(TokenKey, token);
}

export function removeToken() {
  return localStorage.removeItem(TokenKey);
}

export function getTokenReset() {
  return localStorage.getItem(TokenKeyReset);
}
export function setTokenReset(token) {
  return localStorage.setItem(TokenKeyReset, token);
}

export function removeTokenReset() {
  return localStorage.removeItem(TokenKeyReset);
}
