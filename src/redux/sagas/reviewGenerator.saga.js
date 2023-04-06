import { call, put, takeLatest } from "redux-saga/effects";
import * as actions from "../actions/reviewGenerator.action";
import * as constants from "../constants/reviewGenerator.constant";
import paths from "../../api/path";
import NetworkApi from "../../api/NetworkApi";
// import { setItems } from "../../utils/storage";
import { getItems } from "../../utils/storage";

import { showNotification } from "../actions/customNotification.action";

const getApiConfig = () => {
  const [tokenType, token] = getItems(["tokenType", "token"]);
  const headers = {
    Authorization: `${tokenType} ${token}`,
    token,
  };
  return {
    headers,
    Authorization: headers.Authorization,
  };
};

export function* ReviewGenerator(data) {
  const apiConfig = getApiConfig();
  try{
    const { payload } = data;
    console.log(payload);
    
    const response = yield call(
      NetworkApi.post, 
      paths.RESTAURANT_REVIEW_OPEN_API_URL, 
      payload,
      apiConfig.headers
    );

    if (response.status && response.data) {
      const data = response.data.choices[0].text;
      yield put(actions.reviewGeneratorSuccessfull(data));
      yield put(
        showNotification("Data fetched successfully", "success")
      );
    }

  } catch(e) {
    const errorMessage = e.message;
    yield put(actions.reviewGeneratorFailed());
    yield put(showNotification(errorMessage, "warning"));
  }
}

export function* reqReviewGenerator() {
  yield takeLatest(constants.REVIEW_GENERATOR, ReviewGenerator);
}


