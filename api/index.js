const express = require("express");
const router = express.Router();

router.use("/user", require("./user"));
router.use("/point", require("./point"));

module.exports = router;
