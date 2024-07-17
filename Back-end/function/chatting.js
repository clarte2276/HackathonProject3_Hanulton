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

// 채팅방 메시지 조회 (GET)
router.get("/chatroom/:sender/to/:receiver/messages", (req, res) => {
  const { sender, receiver } = req.params;
  const session_id = req.session.user ? req.session.user.id : null; // 세션이 없는 경우 대비

  if (session_id != sender) {
    return res.status(403).send("Forbidden");
  }

  pool.query(
    "SELECT sender_id, receiver_id, content FROM messages WHERE (sender_id = ? AND receiver_id = ?)",
    [sender, receiver],
    (error, results) => {
      if (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).send("서버 오류");
      }
      console.log("Fetched messages from DB:", results); // 쿼리 결과 로그 추가
      res.json(results);
    }
  );
});
// 새로운 메시지 전송 (POST)
router.post("/chatroom/:sender/to/:receiver/messages", (req, res) => {
  const { sender, receiver } = req.params;
  const { content } = req.body;
  const session_id = req.session.user ? req.session.user.id : null; // 세션이 없는 경우 대비

  if (session_id != sender) {
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
