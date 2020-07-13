const MovieModel = require("../../models/movie");
const mongoose = require("mongoose");

// id 유효성 체크
const checkId = (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).end();
  }
  next();
};

// 목록조회 (localhost:3000/moviec?limit=3)
// - 성공 : limit수만큼 movie 객체를 담은 배열을 리턴 (200:OK)
// - 실패 : limit가 숫자형이 아닌 경우(400: Bad Request)
const list = (req, res) => {
  console.log(typeof req.query.limit); // "3"
  const limit = parseInt(req.query.limit || 10, 10);
  if (Number.isNaN(limit)) {
    return res.status(400).end();
  }

  // limit수만큼 movie객체를 담은 배열 리턴
  MovieModel.find((err, result) => {
    if (err) return res.status(500).end(); //throw err;
    res.render("movie/list", { result });
  })
    .limit(limit)
    .sort({ _id: -1 });
};

// 상세조회
// - 성공 : id에 해당하는 movie 객체를 리턴 (200: OK)
// - 실패 : 유효한 id가 아닌경우 (400: Bad Request)
//         해당하는 id가 없는 경우
const detail = (req, res) => {
  const id = req.params.id;

  // 1. findById()
  // MovieModel.findById(id, (err, result) => {
  //   if (err) throw err;
  //   if (!result) return res.status(404).end();
  //   res.json(result);
  // });

  // 2. findOne()
  MovieModel.findOne({ _id: id }, (err, result) => {
    if (err) return res.status(500).end(); //throw err;
    if (!result) return res.status(404).end();
    res.render("movie/detail", { result });
  });
};

// 등록
// - 성공 : 201을 응답(201: Created), 등록한 movie객체를 리턴
// - 실패 : year, title 값 누락 시 400 반환 (400: Bad Request)
const create = (req, res) => {
  const { year, title, director } = req.body;
  if (!year || !title || !director)
    return res.status(400).send("필수 항목이 입력되지 않았습니다.");

  // 1. Model의 객체인 Document 생성 후 save
  // const movie = new Moviemodel({ year, title });
  // movie.save((err, result) => {
  //   if (err) throw err;
  //   res.status(201).json(result);
  // });

  // 2. Model.create() 이용
  MovieModel.create({ year, title, director }, (err, result) => {
    if (err) throw err;
    res.status(201).json(result);
  });
};

/// 수정
// - 성공 : id에 해당하는 movie 객체에 입력 데이터로 변경, 해당 객체를 반환 (200: OK)
// - 실패 : id가 숫자가 아닐경우 (400: Bad Request)
//         해당하는 id가 없는 경우
const update = (req, res) => {
  const id = req.params.id;
  // if (Number.isNaN(id)) return res.status(400).end();

  // const result = movie.find((m) => m.id === id);
  // if (!result) return res.status(404).end();

  // const { year, title, director } = req.body;
  // if (year) result.year = year;
  // if (title) result.title = title;
  // res.json(result);

  const { year, title, director } = req.body;

  MovieModel.findByIdAndUpdate(
    id,
    { year: year, title: title, director: director },
    { new: true },
    (err, result) => {
      if (err) throw err;
      if (!result) return res.status(404).end();
      res.json(result);
    }
  );
};

// 삭제
// - 성공 : id에 해당하는 객체를 배열에서 삭제 후 결과 배열 리턴 (200: OK)
// - 실패 : id가 유효하지 않을 경우 (400: Bad Request)
//         해당하는 id가 없는 경우
const remove = (req, res) => {
  const id = req.params.id;
  // if (Number.isNaN(id)) return res.status(400).end();

  // const result = movie.find((m) => m.id === id);
  // if (!result) return res.status(404).end();

  // movie = movie.filter((m) => m.id !== id);
  // res.json(movie);

  MovieModel.findByIdAndDelete(id, (err, result) => {
    if (err) return res.status(500).end();
    if (!result) return res.status(404).end();
    res.json(result);
  });
};

const showCreatePage = (req, res) => {
  res.render("movie/create");
};

const showUpdatePage = (req, res) => {
  const id = req.params.id;
  MovieModel.findById(id, (err, result) => {
    if (err) return res.status(500).send("조회 시 오류가 발생했습니다.");
    if (!result) return res.status(404).send("해당하는 정보가 없습니다.");
    res.render("movie/update", { result });
  });
};

module.exports = {
  list,
  detail,
  create,
  update,
  remove,
  checkId,
  showCreatePage,
  showUpdatePage,
};
