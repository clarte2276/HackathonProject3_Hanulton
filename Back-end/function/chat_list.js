// /chat/user   /chat/doctor

const express = require("express");
const mysql = require("mysql");
const db_config = require("../config/db_config.json");
const router = express.Router();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
  port: db_config.port,
  debug: false,
});

// 채팅 목록
router.post("/list", (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("로그인이 필요합니다.");
  }

  const currentUserId = req.session.user.id;

  // 메시지와 사용자 정보를 가져오는 쿼리
  const query = `
    SELECT DISTINCT u.id, u.nickname
    FROM users u
    JOIN messages m ON u.id = m.receiver_id
    WHERE m.sender_id = ? AND u.id != ?
  `;

  pool.query(query, [currentUserId, currentUserId], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send("서버 오류");
    }

    console.log(results); // 응답 데이터 확인을 위한 로그 추가
    res.json(results);
  });
});

router.use("/chat", router);

module.exports = router;
