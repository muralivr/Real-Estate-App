import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function handleGoogleClick() {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const res = await axios.post("http://localhost:3000/api/auth/google", {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      });
      console.log(res);

      if (res.data.success === true) {
        localStorage.setItem("access_token", res.data.token);
        dispatch(signInSuccess(res.data));
        navigate("/");
      }
    } catch (error) {
      console.log("Can't connect with google", error);
    }
  }
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 rounded-lg p-3 uppercase text-white hover:opacity-95"
    >
      Continue with google
    </button>
  );
}

export default OAuth;
