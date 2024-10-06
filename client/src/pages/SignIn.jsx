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

function SignIn() {
  const [formData, setFormData] = useState({
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
        "http://localhost:3000/api/auth/signin",
        formData,
        {
          withCredentials: true, // This ensures cookies are sent
        }
      );
      if (res.data.success === true) {
        localStorage.setItem("access_token", res.data.token);
        dispatch(signInSuccess(res.data));
        navigate("/");
      }
    } catch (error) {
      dispatch(
        signInFailure(error?.response?.data?.message || "Something went wrong")
      );
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          {loading ? "Loading" : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
      {msg && <p className="text-green-500 mt-5">{msg}</p>}
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}

export default SignIn;
