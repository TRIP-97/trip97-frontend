import { localAxios } from "@/util/http-commons";

const local = localAxios();

// 관광지의 리뷰를 가져오는 함수
function getReviews(attractionId, success, fail) {
  local.get(`attraction/${attractionId}/review`).then(success).catch(fail);
}

// 관광지에 리뷰를 작성하는 함수
function registerReview(review, success, fail) {
  local.post(`attraction/${review.attractionId}/review`, review).then(success).catch(fail);
}

// 관광지의 리뷰를 수정하는 함수
function updateReview(review, success, fail) {
  local
    .put(`attraction/${review.attractionId}/review/${review.id}`, review)
    .then(success)
    .catch(fail);
}

// 관광지의 리뷰를 삭제하는 함수
function removeReview(param, success, fail) {
  local
    .delete(`attraction/${param.attractionId}/review/${param.reviewId}`)
    .then(success)
    .catch(fail);
}

export { getReviews, registerReview, updateReview, removeReview };
