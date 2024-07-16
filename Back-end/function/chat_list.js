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

  const currentUserNickname = req.session.user.nickname;

  // 현재 사용자의 roomId를 가져오는 쿼리
  const getRoomIdQuery = "SELECT id FROM users WHERE nickname = ?";

  pool.query(getRoomIdQuery, [currentUserNickname], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send("서버 오류");
    }

    if (results.length === 0) {
      return res.status(404).send("사용자를 찾을 수 없습니다.");
    }

    const currentUserId = req.session.user.id;

    // 메시지와 사용자 정보를 가져오는 쿼리
    const query = `
      SELECT DISTINCT u.id, u.nickname, u.state 
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
});

// 채팅방 메시지 조회 (GET)
router.get("/chatroom/:sender/to/:receiver", (req, res) => {
  const { sender, receiver } = req.params;
  const session_id = req.session.user.id;

  if (session_id != sender) {
    return res.status(403).send("Forbidden");
  }

  pool.query(
    "SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?)",
    [sender, receiver],
    (error, results) => {
      if (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).send("서버 오류");
      }
      res.json(results);
    }
  );
});

// 새로운 메시지 전송 (POST)
router.post("/chatroom/:sender/to/:receiver", (req, res) => {
  const { sender, receiver } = req.params;
  const { receiver_id, content } = req.body;
  const session_id = req.session.user.id;

  if (session_id != sender || receiver_id != receiver) {
    return res.status(403).send("Forbidden");
  }

  pool.query(
    "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)",
    [sender, receiver, content],
    (error, results) => {
      if (error) {
        console.error("Message save error:", error);
        return res.status(500).send("서버 오류");
      }
      // 두 번째 쿼리를 수행하고, 모든 쿼리가 성공하면 응답을 보냅니다.
      pool.query(
        "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)",
        [receiver, sender, content],
        (error, results) => {
          if (error) {
            console.error("Message save error:", error);
            return res.status(500).send("서버 오류");
          }
          res.status(201).send("메시지 전송 성공");
        }
      );
    }
  );
});

router.use("/chat", router);

module.exports = router;
