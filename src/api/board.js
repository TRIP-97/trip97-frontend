import { localAxios } from "@/util/http-commons";

const local = localAxios();

// 자유게시판 전체 게시물 불러오기
function listBoard(success, fail) {
  local.get(`/board`).then(success).catch(fail);
}

// 자유게시판 게시물 상세보기
function detailBoard(boardId, success, fail) {
  local.get(`/board/${boardId}`).then(success).catch(fail);
}

// 자유게시판 게시물 작성
function registBoard(token, board) {
  local.post(`/board`, JSON.stringify(board), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

// 이미지 업로드
function uploadImage(file, success, fail) {
  const formData = new FormData();
  formData.append("file", file);

  local.post(`/board/upload`, formData, {  
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(success).catch(fail);
}

// 자유게시판 게시물 삭제
function deleteBoard(boardId, success, fail) {
  local.delete(`/board/${boardId}`).then(success).catch(fail);
}

// 자유게시판 게시물 수정
function modifyBoard(board, succes, fail) {
  local.put(`/board/${board.id}`, JSON.stringify(board).then(success).catch(fail));
}

export { listBoard, detailBoard, registBoard, uploadImage, deleteBoard, modifyBoard};