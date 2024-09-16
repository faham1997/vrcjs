const express = require("express");
const router = express.Router();

const {
  login,
  verify2FA,
  getUserInfo,
} = require("../controllers/authentication.controller");

router.post("/login", login);
router.post("/verify-2fa", verify2FA);
router.get("/user-info", getUserInfo);

module.exports = router;
