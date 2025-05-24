import React from "react";
import { Routes, Route, Navigate } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Notification from "./pages/Notification.jsx";
import Callpage from "./pages/Callpage.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import { Toaster } from "react-hot-toast";
import { PageLoader } from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import NotificationsPage from "./pages/Notification.jsx";
import FriendCard from "./pages/FriendCard.jsx";
import ChatPage from "./pages/Chat.jsx";

const App = () => {
  const { isLoading, authUser } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnBoarded = authUser?.isOnBoarded;
  console.log(isOnBoarded);
  

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen" data-theme="night">
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={true}>
                <HomePage/>
              </Layout>
            ) : (
              <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />
            )
          }
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <Signup /> : <Navigate to={
            isOnBoarded?"/":"/onboarding"
          } />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to={
            isOnBoarded?"/":"/onboarding"
          } />}
        />
            <Route
          path="/notifications"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/call/:id"
          element={isAuthenticated && isOnBoarded ? <Callpage /> :(
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        
      <Route
  path="/chat/:id"
  element={
    isAuthenticated ? (
      <Layout showSidebar={false}>
        <ChatPage />
      </Layout>
    ) : (
      <Navigate to="/login" />
    )
  }
/>

        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnBoarded ? (<Onboarding />) : (<Navigate to="/" />)
            ) : (
              <Navigate to="/login" />
            )
          }
        />

         <Route
          path="/friends"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={true}>
                <FriendsPage />
              </Layout>
            ) : (
              <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />
            )
          }
        />

      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
