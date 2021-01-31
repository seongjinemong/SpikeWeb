const express = require("express");
const router = express.Router();
const ctrl = require("./point.ctrl");

// 라우팅 설정

// localhost:3000/point, get
router.get("/", ctrl.list); // 목록조회 (/point)
router.post("/", ctrl.addpoint); // 포인트 추가
router.get("/send", ctrl.showSendPage);
router.post("/send", ctrl.send);
router.delete("/", ctrl.remove);
router.get("/history", ctrl.history);

module.exports = router;
