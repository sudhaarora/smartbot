import { createSelector } from "@reduxjs/toolkit";

const selectState = (state) => state.customNotification;

const customNotificationSelectors = createSelector(selectState, (state) => state);

export default customNotificationSelectors;
