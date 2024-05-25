import "./App.css";
import Home from "./components/Home/Home";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import Navbar from "./components/common/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import frontBanner from "./components/images/frontBanner.avif";
import Footer from "./components/common/Footer";
import Workout from "./components/Workouts/Workout";
import Profile from "./components/User/Profile";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "../Redux/user/userSlice";
import ChangePassword from "./components/User/ChangePassword";
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";
import DetailWorkout from "./components/Workouts/DetailWorkout";
import Exercises from "./components/Exercise/Exercises";
import Challenges from "./components/Challenge/Challenges";
import { clearErrors } from "../Redux/user/userSlice";
import { useSelector } from "react-redux";
import DetailedChallenge from "./components/Challenge/DetailedChallenge";
import DetailExercise from "./components/Exercise/DetailExercise";
import Create from "./components/Challenge/Create";
import MyChallenges from "./components/User/MyChallenges";
import Update from "./components/Challenge/Update";
import AddExercise from "./components/Exercise/AddExercise";
import MyExercises from "./components/User/MyExercises";
import EditExercise from "./components/Exercise/EditExercise";
import Posts from "./components/Posts/Posts";
import Collections from "./components/Collection/Collections";
import 'react-notifications-component/dist/theme.css'
import { ReactNotifications } from 'react-notifications-component'
function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.USER);
  useEffect(() => {
    dispatch(loadUser());
    dispatch(clearErrors());
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <BrowserRouter>
        <ReactNotifications />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/workout/:id" element={<DetailWorkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/challenges/:id" element={<DetailedChallenge />} />
          <Route path="/exercise/:id" element={<DetailExercise />} />
          <Route path="/challenges/create" element={<Create />} />
          <Route path="/challenges/update/:id" element={<Update />} />
          <Route path="/my-challenges" element={<MyChallenges />} />
          <Route path="/addexercise" element={<AddExercise />} />
          <Route path="/my-exercises" element={<MyExercises />} />
          <Route path="/exercise/update/:id" element={<EditExercise />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/my-collections" element={<Collections />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
