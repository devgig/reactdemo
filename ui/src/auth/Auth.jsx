import auth0 from "auth0-js";
import axios from 'axios';
import Base64 from 'js-base64';

const REDIRECT_ON_LOGIN = "redirect_on_login";

// Stored outside class since private
// eslint-disable-next-line
const ID_TOKEN = "id_token";
const ACCESS_TOKEN = "access_token";
const EXPIRES_AT = "expiresAt";
const CLAIMS = "claims";

export default class Auth {
  constructor(history) {
    this.history = history;
    this.userProfile = null;
    this.requestedScopes = "openid profile email";
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      responseType: "token id_token",
    });
  }

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

  getApplicationClaims = authResult => {
        axios.get("https://localhost:44326/api/auth").then(response => {
          if (response.status == 200) return response.data;
          throw new Error("Network response was not ok.");
        })
        .then(response => {

          var decodedValue = response["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

          localStorage.setItem(CLAIMS, decodedValue || "");
        })
        .catch(err => {
          this.history.push("/");
          alert(`Error: ${err.error}. Claims request failed.`);
          console.log(err);
        } );
  }

  setSession = authResult => {
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
    
    this.auth0.logout({
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      returnTo: "http://localhost:3000"
    });
  };

  getAccessToken = () => {
    let accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (!accessToken) {
      throw new Error("No access token found.");
    }
    return accessToken;
  };


  getProfile = cb => {
    if (this.userProfile) return cb(this.userProfile);
    this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
      if (profile) this.userProfile = profile;
      cb(profile, err);
    });
  };

  userHasClaims = claims => {
    const grantedScopes = (localStorage.getItem(CLAIMS) || []);
    return claims.every(claim => grantedScopes.includes(claim));
  }

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
