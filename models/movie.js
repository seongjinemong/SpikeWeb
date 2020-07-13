const mongoose = require("mongoose");

// 스키마 정의
// 컬렉션에 들어가는 Document의 구조물 정의
// 필드, 타입, 필수여부 등
const MovieSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
    trim: true, // 공백같은거 알아서 잘라줌
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  director: {
    type: String,
    required: true,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

// 스키마 -> 모델
// 컬렉션 -> movies 컬렉션 생성
const Movie = mongoose.model("movie", MovieSchema);
module.exports = Movie;
