// 게시판 구현 boardbuy boardsell boardads
const express = require("express");
const mysql = require("mysql");
const db_config = require("../config/db_config.json");
const moment = require("moment");
const multer = require("multer");
const path = require("path");
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

// multer설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 파일 사이즈 제한 20MB
});

// 정적 파일 서빙
const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

// 게시판 데이터 가져오기
const getBoardData = (tableName, res) => {
  const query = `SELECT no, title, nickname, content, DATE_FORMAT(created_date, '%Y년 %m월 %d일 %H시 %i분') AS created_date, state, originprice, sellprice, file_path FROM ${tableName}`;
  executeQuery(query, [], res, (results) => {
    if (results.length === 0) {
      res.status(404).json({ message: "해당 게시판에 게시물이 없습니다." });
    } else {
      res.json(results);
    }
  });
};

// 게시판 데이터 삽입
const insertBoardData = (
  tableName,
  title,
  nickname,
  content,
  createdDate,
  originprice,
  sellprice,
  filePath,
  res
) => {
  pool.getConnection((err, conn) => {
    if (err) {
      console.log("MySQL Connection Error", err);
      return res.status(500).send("DB 서버 연결 실패");
    }

    conn.query(
      `INSERT INTO ${tableName} (title, nickname, content, created_date, originprice, sellprice, file_path) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, nickname, content, createdDate, originprice, sellprice, filePath],
      (err, result) => {
        conn.release();
        if (err) {
          console.log("SQL 실행 시 오류 발생", err);
          return res.status(500).send("Query 실패");
        }
        const newPostId = result.insertId;
        res.json({ no: newPostId });
      }
    );
  });
};

// 게시글 상세보기
const getPostDetails = (tableName, postId, req, res) => {
  pool.getConnection((err, conn) => {
    if (err) {
      console.error("MySQL 연결 오류:", err);
      res.status(500).send("서버 오류");
      return;
    }

    const postQuery = `SELECT *, DATE_FORMAT(created_date, '%Y년 %m월 %d일 %H시 %i분') AS created_date FROM ${tableName} WHERE no = ?`;
    conn.query(postQuery, [postId], (err, postResult) => {
      if (err) {
        console.error("게시글 조회 오류:", err);
        conn.release();
        res.status(500).send("서버 오류");
        return;
      }
      conn.release();
      if (postResult.length === 0) {
        res.status(404).send("게시물을 찾을 수 없습니다.");
      } else {
        res.json({
          post: postResult[0],
          session: req.session,
        });
      }
    });
  });
};

// 게시글 삭제
const deletePost = (tableName, postId, req, res) => {
  const userNickname = req.session.user.nickname;

  pool.query(
    `SELECT nickname FROM ${tableName} WHERE no = ?`,
    [postId],
    (error, results) => {
      if (error) {
        console.error("쿼리 실행 중 오류 발생: ", error);
        res.status(500).send("내부 서버 오류");
      } else {
        if (results.length === 0) {
          res.status(404).send("해당 게시물을 찾을 수 없습니다.");
        } else if (results[0].nickname !== userNickname) {
          res.status(403).send("삭제 권한이 없습니다.");
        } else {
          pool.query(
            `DELETE FROM ${tableName} WHERE no = ?`,
            [postId],
            (error) => {
              if (error) {
                console.error("쿼리 실행 중 오류 발생: ", error);
                res.status(500).send("내부 서버 오류");
              } else {
                console.log("게시물 삭제 완료");
                res.sendStatus(204);
              }
            }
          );
        }
      }
    }
  );
};

// 게시글 수정 폼
const getUpdateForm = (tableName, postId, req, res) => {
  pool.getConnection((err, conn) => {
    if (err) {
      console.error("MySQL 연결 오류:", err);
      res.status(500).send("서버 오류");
      return;
    }

    const postQuery = `SELECT *, DATE_FORMAT(created_date, '%Y년 %m월 %d일 %H시 %i분') AS created_date FROM ${tableName} WHERE no = ?`;
    conn.query(postQuery, [postId], (err, postResult) => {
      conn.release();
      if (err) {
        console.error("게시글 조회 오류:", err);
        res.status(500).send("서버 오류");
        return;
      } else {
        if (postResult.length > 0) {
          const board = postResult[0];
          if (board.nickname === req.session.user.nickname) {
            res.json(board);
          } else {
            res.status(403).send("수정 권한이 없습니다.");
          }
        } else {
          res.status(404).send("게시물을 찾을 수 없습니다.");
        }
      }
    });
  });
};

// 게시글 수정
const updatePost = (
  tableName,
  postId,
  title,
  content,
  createdDate,
  originprice,
  sellprice,
  filePath,
  req,
  res
) => {
  pool.query(
    `UPDATE ${tableName} SET title = ?, content = ?, created_date = ?, originprice = ?, sellprice = ?, file_path = ? WHERE no = ? AND nickname = ?`,
    [
      title,
      content,
      createdDate,
      originprice,
      sellprice,
      filePath,
      postId,
      req.session.user.nickname,
    ],
    (error) => {
      if (error) {
        console.error("쿼리 실행 중 오류 발생: ", error);
        res.status(500).send("내부 서버 오류");
      } else {
        console.log("게시물 수정 완료");
        res.sendStatus(204);
      }
    }
  );
};

// 게시글 상태 변경
const updatePostState = (tableName, postId, newState, req, res) => {
  pool.query(
    `UPDATE ${tableName} SET state = ? WHERE no = ? AND nickname = ?`,
    [newState, postId, req.session.user.nickname],
    (error) => {
      if (error) {
        console.error("쿼리 실행 중 오류 발생: ", error);
        res.status(500).send("내부 서버 오류");
      } else {
        console.log("게시물 상태 변경 완료");
        res.sendStatus(204);
      }
    }
  );
};

// 각각의 게시판 라우터 생성
const createBoardRoutes = (boardName, tableName) => {
  // 게시판 데이터 가져오기
  router.get(`/${boardName}`, (req, res) => {
    getBoardData(tableName, res);
  });

  // 새 글 작성
  router.post(
    `/${boardName}/process/new_Post`,
    upload.single("file"),
    (req, res) => {
      // upload.single 추가
      const { title, content, originprice, sellprice } = req.body;
      const nickname = req.session.user.nickname;
      const createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
      const filePath = req.file ? req.file.path : null;
      insertBoardData(
        tableName,
        title,
        nickname,
        content,
        createdDate,
        originprice,
        sellprice,
        filePath,
        res
      );
    }
  );

  // 상세보기
  router.get(`/${boardName}/PostView/:no`, (req, res) => {
    getPostDetails(tableName, req.params.no, req, res);
  });

  // 게시글 삭제
  router.delete(`/${boardName}/PostView/:no/process/delete`, (req, res) => {
    deletePost(tableName, req.params.no, req, res);
  });

  // 게시글 수정 폼
  router.get(`/${boardName}/PostView/:no/process/update`, (req, res) => {
    getUpdateForm(tableName, req.params.no, req, res);
  });

  // 게시글 수정
  router.post(
    `/${boardName}/PostView/:no/process/update`,
    upload.single("file"),
    (req, res) => {
      // upload.single 추가
      const { title, content, created_date, originprice, sellprice } = req.body;
      const createdDate = moment(created_date || new Date()).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const filePath = req.file ? req.file.path : null;
      updatePost(
        tableName,
        req.params.no,
        title,
        content,
        createdDate,
        originprice,
        sellprice,
        filePath,
        req,
        res
      );
    }
  );

  // 게시글 상태 변경
  router.post(`/${boardName}/PostView/:no/process/update_state`, (req, res) => {
    const { newState } = req.body;
    updatePostState(tableName, req.params.no, newState, req, res);
  });
};

// 각각의 게시판 라우트 설정
createBoardRoutes("boardcookfriend", "boardcookfriend");
createBoardRoutes("boardsell", "boardsell");
createBoardRoutes("boardads", "boardads");
module.exports = router;
