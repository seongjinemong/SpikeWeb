const MusicModel = require("../../models/music");
const mongoose = require("mongoose");

// id 유효성 체크
const checkId = (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).end();
  }
  next();
};

// 목록조회 (localhost:3000/music?limit=3)
// - 성공 : limit수만큼 music 객체를 담은 배열을 리턴 (200:OK)
// - 실패 : limit가 숫자형이 아닌 경우(400: Bad Request)
const list = (req, res) => {
  console.log(typeof req.query.limit); // "3"
  const limit = parseInt(req.query.limit || 10, 10);
  if (Number.isNaN(limit)) {
    return res.status(400).end();
  }

  // limit수만큼 music객체를 담은 배열 리턴
  MusicModel.find((err, result) => {
    if (err) return res.status(500).end(); //throw err;
    //res.json(result);
    res.render("music/list", { result });
  })
    .limit(limit)
    .sort({ _id: -1 });
};

// 상세조회
// - 성공 : id에 해당하는 music 객체를 리턴 (200: OK)
// - 실패 : 유효한 id가 아닌경우 (400: Bad Request)
//         해당하는 id가 없는 경우
const detail = (req, res) => {
  const id = req.params.id;

  // 1. findById()
  // MusicModel.findById(id, (err, result) => {
  //   if (err) throw err;
  //   if (!result) return res.status(404).end();
  //   res.json(result);
  // });

  // 2. findOne()
  MusicModel.findOne({ _id: id }, (err, result) => {
    if (err) return res.status(500).end(); //throw err;
    if (!result) return res.status(404).end();
    //res.json(result);
    res.render("music/detail", { result });
  });
};

// 등록
// - 성공 : 201을 응답(201: Created), 등록한 music객체를 리턴
// - 실패 : singer, title 값 누락 시 400 반환 (400: Bad Request)
const create = (req, res) => {
  const { singer, title } = req.body;
  if (!singer || !title)
    return res.status(400).send("필수 항목이 입력되지 않았습니다.");

  // 1. Model의 객체인 Document 생성 후 save
  // const music = new MusicModel({ singer, title });
  // music.save((err, result) => {
  //   if (err) throw err;
  //   res.status(201).json(result);
  // });

  // 2. Model.create() 이용
  MusicModel.create({ singer, title }, (err, result) => {
    if (err) throw err;
    res.status(201).json(result);
  });
};

// 수정
// - 성공 : id에 해당하는 music 객체에 입력 데이터로 변경, 해당 객체를 반환 (200: OK)
// - 실패 : id가 숫자가 아닐경우 (400: Bad Request)
//         해당하는 id가 없는 경우
const update = (req, res) => {
  const id = req.params.id;
  // if (Number.isNaN(id)) return res.status(400).end();

  // const result = music.find((m) => m.id === id);
  // if (!result) return res.status(404).end();

  // const { singer, title } = req.body;
  // if (singer) result.singer = singer;
  // if (title) result.title = title;
  // res.json(result);

  const { singer, title } = req.body;

  MusicModel.findByIdAndUpdate(
    id,
    { singer: singer, title: title },
    { new: true },
    (err, result) => {
      if (err) return res.status(500).send("수정 시 오류가 발생했습니다.");
      if (!result) return res.status(404).send("해당하는 정보가 없습니다.");
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

  // const result = music.find((m) => m.id === id);
  // if (!result) return res.status(404).end();

  // music = music.filter((m) => m.id !== id);
  // res.json(music);

  MusicModel.findByIdAndDelete(id, (err, result) => {
    if (err) return res.status(500).send("삭제시 오류가 발생했습니다.");
    if (!result) return res.status(404).send("해당하는 정보가 없습니다.");
    res.json(result);
  });
};

const showCreatePage = (req, res) => {
  res.render("music/create");
};

const showUpdatePage = (req, res) => {
  const id = req.params.id;
  MusicModel.findById(id, (err, result) => {
    if (err) return res.status(500).send("조회 시 오류가 발생했습니다.");
    if (!result) return res.status(404).send("해당하는 정보가 없습니다.");
    res.render("music/update", { result });
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
