//로그인
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const mysql = require("mysql");
const db_config = require("../config/db_config.json");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
  port: db_config.port,
  debug: false,
});

// /login에 접속했을 때 다음과 같은 일을 하세요
router.post("/process/login", (req, res) => {
  console.log("/login 호출됨", req.body);
  const paramID = req.body.id;
  const paramPW = req.body.password;

  console.log("로그인 요청입니다. " + paramID + " " + paramPW);
  pool.getConnection((err, conn) => {
    if (err) {
      console.log("MySQL Connection Error", err);
      if (conn) conn.release();
      res.status(500).json({ success: false, message: "DB 서버 연결 실패" });
      return;
    }
    conn.query(
      "SELECT id, nickname, password, store FROM users WHERE id = ?",
      [paramID],
      async (err, rows) => {
        conn.release();
        if (err) {
          console.dir(err);
          res.status(500).json({ success: false, message: "Query 실패" });
          return;
        }

        if (rows.length > 0) {
          const user = rows[0];
          const match = await bcrypt.compare(paramPW, user.password);
          if (match) {
            console.log(
              "아이디 [%s], 패스워드가 일치하는 이름 [%s] 찾음",
              paramID,
              user.nickname
            );
            req.session.user = {
              id: user.id,
              nickname: user.nickname,
              authorized: true,
            };
            res.json({ success: true });
          } else {
            console.log("비밀번호 [%s], 패스워드가 일치하지 않음", paramPW);
            res
              .status(401)
              .json({ success: false, message: "패스워드가 일치하지 않음" });
          }
        } else {
          console.log("아이디 [%s], 패스워드가 일치하는 아이디 없음", paramID);
          res.status(401).json({
            success: false,
            message: "아이디 또는 패스워드가 일치하지 않음",
          });
        }
      }
    );
  });
});

router.post("/process/signup", async (req, res) => {
  console.log("/signup 호출됨", req.body);

  const paramName = req.body.name;
  const paramNickname = req.body.nickname;
  const paramStore = req.body.store;
  const parambirth = req.body.birth;
  const paramID = req.body.id;
  const paramPW = req.body.password;

  try {
    const hashedPassword = await bcrypt.hash(paramPW, 10);

    pool.getConnection((err, conn) => {
      if (err) {
        console.log("MySQL Connection Error", err);
        if (conn) conn.release();
        return res.json({ success: false, message: "DB 서버 연결 실패" });
      }
      console.log("데이터베이스 연결 성공");

      const exec = conn.query(
        "INSERT INTO users (name, nickname, store, birth, id, password) VALUES (?, ?, ?, ?,?, ?);",
        [
          paramName,
          paramNickname,
          paramStore,
          parambirth,
          paramID,
          hashedPassword,
        ],
        (err, result) => {
          conn.release();
          console.log("실행된 SQL: " + exec.sql);

          if (err) {
            console.log("SQL 실행 시 오류 발생", err);
            return res.json({ success: false, message: "Query 실패" });
          }

          if (result) {
            console.dir(result);
            console.log("insert 성공");
            return res.json({ success: true, message: "회원가입 성공" });
          } else {
            console.log("insert 실패");
            return res.json({ success: false, message: "사용자 추가 실패" });
          }
        }
      );
    });
  } catch (error) {
    console.log("비밀번호 해싱 오류", error);
    return res.json({ success: false, message: "비밀번호 해싱 실패" });
  }
});

//app과 router 연동
router.use("/loginpage", router);

module.exports = router;
