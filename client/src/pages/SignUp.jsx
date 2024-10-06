import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading, error, msg } = useSelector((state) => state.user);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await axios.post(
        "http://localhost:3000/api/auth/signup",
        formData,
        {
          withCredentials: true, // This ensures cookies are sent
        }
      );
      if (res.data.success === true) {
        localStorage.setItem("access_token", res.data.token);
        dispatch(signInSuccess(res.data));
        navigate("/sign-in");
      }
    } catch (error) {
      dispatch(
        signInFailure(error?.response?.data?.message || "Something went wrong")
      );
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button
          disabled={loading}
          className="rounded-lg p-3 bg-slate-700 text-white hover:opacity-95 disabled:opacity-80 uppercase"
        >
          {loading ? "Loading" : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
      {msg && <p className="text-green-500 mt-5">{msg}</p>}
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}

export default SignUp;
