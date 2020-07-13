const express = require("express");
const router = express.Router();
const ctrl = require("./user.ctrl");

// 라우팅 설정

// localhost:3000/music, get
router.get("/signup", ctrl.showSignupPage); // 회원가입 페이지 보여줌
router.get("/login", ctrl.showLoginPage); // 로그인 페이지 보여줌
router.post("/login", ctrl.login); // 로그인
router.get("/logout", ctrl.logout); // 로그아웃

router.post("/signup", ctrl.signup); //회원가입

module.exports = router;
