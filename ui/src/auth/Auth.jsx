import auth0 from "auth0-js";
import axios from "axios";

const REDIRECT_ON_LOGIN = "redirect_on_login";

// Stored outside class since private
// eslint-disable-next-line
const ID_TOKEN = "id_token";
const ACCESS_TOKEN = "access_token";
const EXPIRES_AT = "expiresAt";
const CLAIMS = "claims";

export const axiosInstance = axios.create();

export default class Auth {
  constructor(history) {
    this.history = history;
    this.userProfile = null;
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      responseType: "token id_token",
      scope: "openid profile email",
    });
    this.init();
  }

  requestInterceptor = null;
  responseInterceptor = null;

  requestHandler = (request) => {
    const data = this.getSecureHeader();
    //add security headers
    for (let key in data) request.headers[key] = data[key];
    return request;
  };

  requestErrorHandler = (err) => {
    this.handleError(err);
    return Promise.reject({ ...err });
  };

  responseErrorHandler = (err) => {
    this.handleError(err);
    //handle unauthorized by trying to log in again
    if ([401].indexOf(err.response?.status) !== -1) this.login();
    return Promise.reject({ ...err });
  };

  responseHandler = (response) => {
    //handle unathorized by trying to log in again.
    if ([401].indexOf(response?.status) !== -1) this.login();
    return response;
  };

  init = () => {
    if (this.responseInterceptor)
      this.axiosInstance.interceptors.response.eject(this.responseInterceptor);
    if (this.requestInterceptor)
      this.axiosInstance.interceptors.request.eject(this.requestInterceptor);

    this.requestInterceptor = axiosInstance.interceptors.request.use(
      (request) => this.requestHandler(request),
      (error) => this.requestErrorHandler(error)
    );

    this.responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => this.responseHandler(response),
      (error) => this.responseErrorHandler(error)
    );
  };

  getSecureHeader = () => {
    const token = this.getAccessToken();
    if (!token || typeof token === "undefined") {
      this.login();
      return;
    }
    return {
      Authorization: `Bearer ${token}`,
      "x-correlation-id": this.createUUID(),
    };
  };

  CreateUUID = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  };

  login = () => {
    localStorage.setItem(
      REDIRECT_ON_LOGIN,
      JSON.stringify(this.history.location)
    );
    this.auth0.authorize();
  };

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        const redirectLocation =
          localStorage.getItem(REDIRECT_ON_LOGIN) === "undefined"
            ? "/"
            : JSON.parse(localStorage.getItem(REDIRECT_ON_LOGIN));
        this.getApplicationClaims();

        this.history.push(redirectLocation);
      } else if (err) {
        this.history.push("/");
        alert(`Error: ${err.error}. Check the console for further details.`);
        console.log(err);
      }
      localStorage.removeItem(REDIRECT_ON_LOGIN);
    });
  };

  getApplicationClaims = (authResult) => {
    const accessToken = this.getAccessToken();

    fetch(`${process.env.REACT_API}/api/auth`, {
      headers: new Headers({
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      }),
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        // throw new Error("Network response was not ok.");
      })
      .then((claims) => {
        let text = JSON.parse(claims);
        let decodedValue =
          text["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        localStorage.setItem(CLAIMS, decodedValue || "");
      })
      .catch((err) => {
        this.history.push("/");
        // alert(`Error: ${err.error}. Claims request failed.`);
        console.log(err);
      });
  };

  setSession = (authResult) => {
    console.log(authResult);
    // set the time that the access token will expire
    let expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    localStorage.setItem(EXPIRES_AT, expiresAt);
    localStorage.setItem(ACCESS_TOKEN, authResult.accessToken);
    localStorage.setItem(ID_TOKEN, authResult.idToken);

    this.scheduleTokenRenewal();
  };

  isAuthenticated() {
    return new Date().getTime() < localStorage.getItem(EXPIRES_AT);
  }

  logout = () => {
    localStorage.removeItem(REDIRECT_ON_LOGIN);
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(EXPIRES_AT);
    localStorage.removeItem(CLAIMS);
    localStorage.removeItem(ID_TOKEN);

    this.auth0.logout({
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      returnTo: "http://localhost:3000",
    });
  };

  getAccessToken = () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (!accessToken) {
      throw new Error("No access token found.");
    }
    return accessToken;
  };

  getProfile = (cb) => {
    if (this.userProfile) return cb(this.userProfile);
    this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
      if (profile) this.userProfile = profile;
      cb(profile, err);
    });
  };

  userHasClaims = (claims) => {
    const grantedScopes = localStorage.getItem(CLAIMS) || [];
    return claims.every((claim) => grantedScopes.includes(claim));
  };

  renewToken(cb) {
    this.auth0.checkSession({}, (err, result) => {
      if (err) {
        console.log(`Error: ${err.error} - ${err.error_description}.`);
      } else {
        this.setSession(result);
      }
      if (cb) cb(err, result);
    });
  }

  scheduleTokenRenewal() {
    const delay = localStorage.getItem(EXPIRES_AT) - Date.now();
    if (delay > 0) setTimeout(() => this.renewToken(), delay);
  }
}
