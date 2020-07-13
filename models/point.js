const mongoose = require("mongoose");

// 스키마 정의
// 컬렉션에 들어가는 Document의 구조물 정의
// 필드, 타입, 필수여부 등
const PointSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
    trim: true, // 공백같은거 알아서 잘라줌
  },
  service: {
    type: String,
    required: true,
    trim: true,
    // unique: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
});

// 스키마 -> 모델
// 컬렉션 -> users 컬렉션 생성
const Point = mongoose.model("point", PointSchema);
module.exports = Point;
