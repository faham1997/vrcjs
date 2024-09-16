const vrchat = require("vrchat");

let configuration;
let currentUser;
let AuthenticationApi;

// Login to VRChat
const login = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  if (!username || !password)
    return res.json({
      status: "error",
      error: "Please provide both username and password",
    });

  configuration = new vrchat.Configuration({ username, password });
  const options = { headers: { "User-Agent": "ExampleProgram/0.0.1" } };

  AuthenticationApi = new vrchat.AuthenticationApi(configuration);
  UsersApi = new vrchat.UsersApi(configuration);
  SystemApi = new vrchat.SystemApi(configuration);

  try {
    const resp = await AuthenticationApi.getCurrentUser(options);
    currentUser = resp.data;

    if (currentUser.requiresTwoFactorAuth) {
      const method = currentUser.requiresTwoFactorAuth[0];
      return res.json({
        status: "2FA_REQUIRED",
        method: method === "emailOtp" ? "EMAIL" : "TOTP",
      });
    }

    return res.json({ status: "ok", user: currentUser.displayName });
  } catch (error) {
    return res.json({
      status: "error",
      error: "Login failed",
      details: error.message,
    });
  }
};

// Verify 2FA
const verify2FA = async (req, res) => {
  const { code, method } = req.body;
  const options = { headers: { "User-Agent": "ExampleProgram/0.0.1" } };

  try {
    if (method === "emailOtp") {
      await AuthenticationApi.verify2FAEmailCode({ code }, options);
    } else if (method === "totp") {
      await AuthenticationApi.verify2FA({ code }, options);
    }

    currentUser = (await AuthenticationApi.getCurrentUser(options)).data;
    return res.json({ status: "ok", user: currentUser.displayName });
  } catch (error) {
    return res.json({
      status: "error",
      error: "2FA verification failed",
      details: error.message,
    });
  }
};

// Fetch current user info
const getUserInfo = async (req, res) => {
  const options = { headers: { "User-Agent": "ExampleProgram/0.0.1" } };

  try {
    const resp = await AuthenticationApi.getCurrentUser(options);
    return res.json({ status: "ok", userInfo: resp.data });
  } catch (error) {
    return res.json({
      status: "error",
      error: "Failed to fetch user info",
      details: error.message,
    });
  }
};

module.exports = {
  login,
  verify2FA,
  getUserInfo,
};
