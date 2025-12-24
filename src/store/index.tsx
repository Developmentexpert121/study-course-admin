import { configureStore, createSlice } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// Import your reducers

import adminReducer from './slices/adminslice/adminSlice';
import adminActivityReducer from './slices/adminslice/adminActivitySlice';
import usersReducer from './slices/adminslice/all-user-details';
import userCourseSlice from './slices/adminslice/userCourseSlice';
import courseDetailReducer from './slices/adminslice/getinfoaboutcourse';
import chaptersReducer from './slices/adminslice/chaptersSlice'
import userManagementReducer from './slices/adminslice/userManagement'
import dashboardStatsReducer from './slices/adminslice/dashboardStatsSlice'
import courseAuditLogReducer from './slices/adminslice/auditcourselog';
import userReducer  from './slices/profile/profileinfo';
import usereditReducer from './slices/profile/profileedit';
import  homepageinfo from './slices/homepage/homepage';
import ratingReducer from './slices/adminslice/ratinguser';
import emailReducer from './slices/homepage/emailSlice';
import bulkEmailReducer from "./slices/adminslice/emailsent";
import ratingshowhide from "./slices/adminslice/ratinghideshow";
import softdeleteratings from "./slices/adminslice/ratingsoftdelete";
import admminratings from "./slices/adminslice/reviewhideadmin";
import superadmininfos from "./slices/adminslice/courseEnrollmentsSlice";
import  coursesReducer from "./slices/adminslice/userprogress";
import instructorDashboardReducer from "./slices/adminslice/admindashboard";
import progressReducer from"./slices/adminslice/completechapter";


const placeholderSlice = createSlice({
  name: "placeholder",
  initialState: {},
  reducers: {},
});

export const makeStore = () => {
  return configureStore({
    reducer: {
      admin: adminReducer,
      placeholder: placeholderSlice.reducer,
      adminActivity: adminActivityReducer,
      users: usersReducer,
      userCourses: userCourseSlice,
      courseDetail: courseDetailReducer,
      chapters: chaptersReducer,
      userManagement: userManagementReducer,
      dashboardStats: dashboardStatsReducer,
      courseAuditLogs: courseAuditLogReducer,
      user: userReducer,
      useredit: usereditReducer,
      homepage: homepageinfo,
      ratings: ratingReducer,
       email: emailReducer,
       bulkEmail: bulkEmailReducer,
       ratingsuperadmin:ratingshowhide,
       ratingsoftdelete:softdeleteratings,
       ratingadmin:admminratings,
       coursedetails:superadmininfos,
        courses: coursesReducer,
         instructorDashboard: instructorDashboardReducer,
         progress: progressReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
