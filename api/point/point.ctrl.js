const PointModel = require("../../models/point");
const UserModel = require("../../models/user");
const HistoryModel = require("../../models/history");
const mongoose = require("mongoose");

const list = (req, res) => {
  console.log(typeof req.query.limit); // "3"
  const limit = parseInt(req.query.limit || 10, 10);
  if (Number.isNaN(limit)) {
    return res.status(400).end();
  }

  console.log(res.locals.user["userid"]);
  userid = res.locals.user.userid;

  // limit수만큼 movie객체를 담은 배열 리턴
  PointModel.find({ userid }, (err, result) => {
    if (err) return res.status(500).end(); //throw err;

    var sum = 0;
    result.forEach((point) => {
      sum += point.balance;
    });

    res.render("point/list", { result, sum });
    console.log(result);
    //res.json(result);
  })
    .limit(limit)
    .sort({ _id: -1 });
};

const addpoint = (req, res) => {
  console.log("addpoint function called");

  const { service, balance } = req.body;

  if (!service || !balance)
    return res.status(400).send("필수 항목이 입력되지 않았습니다.");

  const userid = res.locals.user.userid;
  console.log(userid);

  UserModel.findOne({ _id: userid }, (err, result) => {
    if (err) return res.status(500).end(); //throw err;
    if (!result) return res.status(404).end();
    PointModel.findOne({ userid, service }, (err, findresult) => {
      console.log(findresult);
      if (findresult == null) {
        console.log(err);
        PointModel.create({ userid, service, balance }, (err, result) => {
          if (err) throw err;
          res.status(201).json(result);
          console.log("point added!");
        });
      } else {
        PointModel.findOneAndUpdate(
          { userid, service },
          { balance: parseInt(findresult.balance) + parseInt(balance) },
          { new: true },
          (err, result) => {
            if (err)
              return res.status(500).send("수정 시 오류가 발생했습니다.");
            if (!result)
              return res.status(404).send("해당하는 정보가 없습니다.");
            res.json(result);
          }
        );
      }
    });
  });
};

const showSendPage = (req, res) => {
  const userid = res.locals.user.userid;

  PointModel.find({ userid }, (err, result) => {
    if (err) return res.status(500).end(); //throw err;
    res.render("point/send", { result });
    console.log(result);
    //res.json(result);
  }).sort({ _id: -1 });
};

const send = (req, res) => {
  console.log("send function called");

  const { service, balance, recipient } = req.body;
  const useremail = res.locals.user.email;

  if (!service || !balance || !recipient)
    return res.status(400).send("필수 항목이 입력되지 않았습니다.");

  const userid = res.locals.user.userid;
  console.log(userid);

  PointModel.findOne({ userid: userid, service: service }, (err, myresult) => {
    if (err) return res.status(500).send("오류"); //throw err;
    if (!myresult) return res.status(404).send("뭔가 잘못되었습니다..");
    if (balance > myresult.balance) {
      res.status(500).send("포인트가 부족합니다 ㅠㅜ");
      return;
    }

    UserModel.findOne({ email: recipient }, (err, recipientresult) => {
      if (err) return res.status(500).send("오류"); //throw err;
      if (!recipientresult) return res.status(404).send("그런 사람 없습니다..");

      console.log(recipientresult);
      const recipientid = recipientresult._id;

      PointModel.findOne(
        { userid: recipientid, service: service },
        (err, recipientpointresult) => {
          if (err) return res.status(500).send("오류"); //throw err;
          if (!recipientpointresult)
            return res
              .status(404)
              .send("그 사람은 그 포인트 서비스에 연결이 되어있지 않습니다..");
          PointModel.findOneAndUpdate(
            { userid: recipientid, service: service },
            {
              balance:
                parseInt(recipientpointresult.balance) + parseInt(balance),
            },
            { new: true },
            (err, sendresult) => {
              if (err)
                return res.status(500).send("수정 시 오류가 발생했습니다.");
              if (!sendresult)
                return res.status(404).send("해당하는 정보가 없습니다.");
              res.json(sendresult);
            }
          );
          PointModel.findOneAndUpdate(
            { userid: res.locals.user.userid, service: service },
            {
              balance: parseInt(myresult.balance) - parseInt(balance),
            },
            { new: true },
            (err, sendresult) => {
              if (err)
                return res.status(500).send("수정 시 오류가 발생했습니다.");
              if (!sendresult)
                return res.status(404).send("해당하는 정보가 없습니다.");
              //res.json(sendresult);
            }
          );
          const user = new HistoryModel({
            userid: userid,
            useremail: useremail,
            recipient: recipient,
            service: service,
            balance: balance * -1,
            date: Date.now(),
          });
          user.save((err, result) => {
            if (err)
              return res
                .status(500)
                .send("사용기록 추가 중 오류가 발생했습니다.");
            //res.status(201).json(result);
          });
        }
      );
    });
  });
};

const remove = (req, res) => {
  const { service } = req.body;
  const userid = res.locals.user.userid;

  PointModel.findOneAndDelete({ service, userid }, (err, result) => {
    if (err) return res.status(500).send("삭제시 오류가 발생했습니다.");
    if (!result) return res.status(404).send("해당하는 정보가 없습니다.");
    res.json(result);
  });
};

const history = (req, res) => {
  console.log(typeof req.query.limit); // "3"
  const limit = parseInt(req.query.limit || 10, 10);
  if (Number.isNaN(limit)) {
    return res.status(400).end();
  }

  const userid = res.locals.user.userid;
  const useremail = res.locals.user.email;

  HistoryModel.find(
    { $or: [{ userid: userid }, { recipient: useremail }] },
    (err, result) => {
      if (err) return res.status(500).send("정보 가져오는 중 오류쓰");

      var sum = 0;
      result.forEach((point) => {
        if (point.recipient == useremail) sum -= point.balance;
        else sum += point.balance;
      });

      res.render("point/history", { result, sum });
      console.log(result);
    }
  )
    .limit(limit)
    .sort({ date: -1 });
};

module.exports = { list, addpoint, showSendPage, send, remove, history };
