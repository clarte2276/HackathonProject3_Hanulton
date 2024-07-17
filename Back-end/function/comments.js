const express = require("express");
const mysql = require("mysql");
const db_config = require("../config/db_config.json");
const moment = require("moment");
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

// 유틸리티 함수: 쿼리 실행 (쿼리 실행 반복 간편화)
const executeQuery = (query, params, res, callback) => {
  pool.getConnection((err, conn) => {
    if (err) {
      console.error("MySQL Connection Error", err);
      return res.status(500).send("DB 서버 연결 실패");
    }
    conn.query(query, params, (err, results) => {
      conn.release();
      if (err) {
        console.error("SQL 실행 시 오류 발생", err);
        return res.status(500).send("Query 실패");
      }
      callback(results);
    });
  });
};

// 댓글 가져오기
const getComments = (tableName, board_no, res) => {
  const query = `SELECT comment_no, nickname, content, DATE_FORMAT(created_date, '%Y년 %m월 %d일 %H시 %i분') AS created_date FROM ${tableName} WHERE board_no = ? ORDER BY created_date DESC`;
  executeQuery(query, [board_no], res, (results) => {
    res.json(results);
  });
};

// 댓글 추가
const insertComment = (tableName, board_no, nickname, content, createdDate, res) => {
  const query = `INSERT INTO ${tableName} (board_no, nickname, content, created_date) VALUES (?, ?, ?, ?)`;
  const params = [board_no, nickname, content, createdDate];
  executeQuery(query, params, res, (result) => {
    res.json({ comment_no: result.insertId });
  });
};

// 댓글 수정
const updateComment = (comment_no, content, updatedDate, res) => {
  const query = `UPDATE comments SET content = ?, created_date = ? WHERE comment_no = ?`;
  const params = [content, updatedDate, comment_no];
  executeQuery(query, params, res, () => {
    res.sendStatus(204);
  });
};

// 댓글 삭제
const deleteComment = (comment_no, res) => {
  const query = `DELETE FROM comments WHERE comment_no = ?`;
  executeQuery(query, [comment_no], res, () => {
    res.sendStatus(204);
  });
};

// 댓글 작성 게시판 타입
const boards = ["boardsell", "boardcookfriend", "boardads"];

boards.forEach((board) => {
  // 댓글 데이터 가져오기
  router.get(`/${board}/comments/:boardNo`, (req, res) => {
    getComments(board, req.params.boardNo, res);
  });

  // 댓글 등록
  router.post(`/${board}/writecomments/:boardNo`, (req, res) => {
    const { content } = req.body;
    const nickname = req.session.user.nickname;
    const createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    insertComment(board, req.params.boardNo, nickname, content, createdDate, res);
  });

  // 댓글 수정
  router.put(`/${board}/process/updatecomments/:commentNo`, (req, res) => {
    const { content } = req.body;
    const updatedDate = moment().format("YYYY-MM-DD HH:mm:ss");
    updateComment(req.params.commentNo, content, updatedDate, res);
  });

  // 댓글 삭제
  router.delete(`/${board}/process/deletecomments/:commentNo`, (req, res) => {
    deleteComment(req.params.commentNo, res);
  });
});

module.exports = router;
