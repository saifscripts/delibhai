import { Fragment, useEffect } from "react";
import { Toaster as ReactHotToaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { useGetMeQuery } from "./redux/features/auth/authApi.js";
import { setUser } from "./redux/features/auth/authSlice.js";
import router from "./router.jsx";

export default function App() {
  const dispatch = useDispatch();
  const { data } = useGetMeQuery();

  // update current user data on first load
  useEffect(() => {
    dispatch(setUser({ user: data?.data }));
  }, [dispatch, data]);

  return (
    <Fragment>
      <RouterProvider router={router} />
      <ReactHotToaster />
      <Toaster />
      {/* <LocationTracker /> */}
    </Fragment>
  );
}
