// 마이페이지 구현
const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const router = express.Router();
const db_config = require("../config/db_config.json");

// Database connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
  port: db_config.port,
  debug: false,
});

// 로그인 여부 확인 미들웨어
const checkLogin = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

// users 정보
router.post("/", checkLogin, (req, res) => {
  const userID = req.session.user.id;

  pool.getConnection((err, conn) => {
    if (err) {
      console.log("MySQL Connection Error", err);
      if (conn) conn.release();
      return res.status(500).send("DB 서버 연결 실패");
    }

    const userQuery =
      "SELECT name, nickname, store, birth, id FROM users WHERE id = ?";
    conn.query(userQuery, [userID], (err, userRows) => {
      conn.release();
      if (err) {
        console.log("SQL 실행 시 오류 발생", err);
        return res.status(500).send("사용자 정보 가져오기 실패");
      }

      if (userRows.length > 0) {
        res.json(userRows[0]);
      } else {
        res.status(404).send("사용자 정보가 존재하지 않습니다.");
      }
    });
  });
});

//구매
router.post("/", checkLogin, (req, res) => {
  const userID = req.session.user.id;

  pool.getConnection((err, conn) => {
    if (err) {
      console.log("MySQL Connection Error", err);
      if (conn) conn.release();
      return res.status(500).send("DB 서버 연결 실패");
    }

    const userQuery =
      "SELECT title, created_date FROM boardbuy WHERE nickname = ?";
    conn.query(userQuery, [userID], (err, userRows) => {
      conn.release();
      if (err) {
        console.log("SQL 실행 시 오류 발생", err);
        return res.status(500).send("사용자 정보 가져오기 실패");
      }

      if (userRows.length > 0) {
        res.json(userRows[0]);
      } else {
        res.status(404).send("사용자 정보가 존재하지 않습니다.");
      }
    });
  });
});

//판매
router.post("/", checkLogin, (req, res) => {
  const userID = req.session.user.id;

  pool.getConnection((err, conn) => {
    if (err) {
      console.log("MySQL Connection Error", err);
      if (conn) conn.release();
      return res.status(500).send("DB 서버 연결 실패");
    }

    const userQuery =
      "SELECT title, created_date FROM boardsell WHERE nickname = ?";
    conn.query(userQuery, [userID], (err, userRows) => {
      conn.release();
      if (err) {
        console.log("SQL 실행 시 오류 발생", err);
        return res.status(500).send("사용자 정보 가져오기 실패");
      }

      if (userRows.length > 0) {
        res.json(userRows[0]);
      } else {
        res.status(404).send("사용자 정보가 존재하지 않습니다.");
      }
    });
  });
});

// 내 정보 업데이트
router.post("/process/update", checkLogin, async (req, res) => {
  const id = req.session.user.id;
  const { nickname, password } = req.body;

  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    pool.getConnection((err, conn) => {
      if (err) {
        console.log("MySQL Connection Error", err);
        if (conn) conn.release();
        return res.status(500).json({ message: "DB 서버 연결 실패" });
      }

      const sql = `
        UPDATE users SET nickname = ?${
          hashedPassword ? ", password = ?" : ""
        } WHERE id = ?`;

      const params = [nickname];
      if (hashedPassword) {
        params.push(hashedPassword);
      }
      params.push(id);

      const exec = conn.query(sql, params, (err, result) => {
        conn.release();
        console.log("실행된 SQL: " + exec.sql);

        if (err) {
          console.log("SQL 실행 시 오류 발생", err);
          return res.status(500).json({ message: "사용자 정보 업데이트 실패" });
        }

        if (result.affectedRows > 0) {
          console.log("사용자 정보 업데이트 성공");
          res.status(200).json({ message: "사용자 정보 업데이트 성공" });
        } else {
          console.log("사용자 정보 업데이트 실패");
          res.status(500).json({ message: "사용자 정보 업데이트 실패" });
        }
      });
    });
  } catch (error) {
    console.log("비밀번호 해싱 오류", error);
    res.status(500).json({ message: "비밀번호 해싱 실패" });
  }
});

router.use("/mypage", router);
//app과 router 연동
module.exports = router;
