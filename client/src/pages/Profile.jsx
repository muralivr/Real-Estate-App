import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import axios from "axios";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserStart,
  signoutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice.js";
import { Link } from "react-router-dom";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const fileRef = useRef(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "",
  });

  const dispatch = useDispatch();
  const { loading, error, msg } = useSelector((state) => state.user);
  const [showListingError, setShowListingError] = useState(null);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  function handleFileUpload(file) {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  }

  async function handleDelete() {
    try {
      dispatch(deleteUserStart());
      const res = await axios.delete(
        "http://localhost:3000/api/user/delete/" + currentUser._id,
        {
          withCredentials: true,
        }
      );
      if (res.data.success === true) {
        localStorage.removeItem("access_token");
        dispatch(deleteUserSuccess(res.data));
      }
    } catch (error) {
      console.log(error);
      dispatch(
        deleteUserFailure(
          error?.response?.data?.message || "Something went wrong"
        )
      );
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await axios.post(
        "http://localhost:3000/api/user/update/" + currentUser._id,
        formData,
        {
          withCredentials: true, // This ensures cookies are sent
        }
      );
      console.log(res);

      if (res.data.success === true) {
        dispatch(updateUserSuccess(res.data));
      }
    } catch (error) {
      dispatch(updateUserFailure(error.response.data.message));
    }
  }

  async function handleLogout() {
    try {
      dispatch(signoutUserStart());
      const res = await axios.post("http://localhost:3000/api/auth/signout", {
        withCredentials: true,
      });
      console.log(res);

      if (res.data.success === true) {
        localStorage.removeItem("access_token");
        dispatch(signoutUserSuccess(res.data));
      }
    } catch (error) {
      console.log(error);
      dispatch(
        updateUserFailure(
          error?.response?.data?.message || "Something went wrong"
        )
      );
    }
  }

  async function handleShowList() {
    try {
      setShowListingError(null);
      const res = await axios.get(
        "http://localhost:3000/api/user/list/" + currentUser._id,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      console.log(res);

      if (res.data.success === true) {
        setUserList(res.data?.list);
        console.log(res.data?.list);
      }
    } catch (error) {
      console.log(error);
      setShowListingError(error.message);
    }
  }

  async function handleDeleteList(listId) {
    try {
      const res = await axios.delete(
        "http://localhost:3000/api/list/delete/" + listId,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      console.log(res);

      if (res.data.success === true) {
        setUserList((prev) => prev.filter((list) => list._id !== listId));
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          className="rounded-full w-24 h-24 object-cover m-auto cursor-pointer"
          src={formData.avatar || currentUser.avatar}
          alt="Profile"
          onClick={() => fileRef.current.click()}
        />
        <p className="m-auto">
          {fileUploadError ? (
            <span className="text-red-700">
              Error in Iamge Upload(Image must be less than 2 MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image Uploaded Successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
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
        <button className="rounded-lg p-3 bg-slate-700 text-white hover:opacity-95 disabled:opacity-80 uppercase">
          {loading ? "Loading" : "Update"}
        </button>
        <Link
          to="/create-list"
          className="bg-green-700 text-white uppercase rounded-lg p-3 hover:opacity-95 text-center"
        >
          Create List
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleLogout} className="text-red-700 cursor-pointer">
          Logout
        </span>
      </div>
      {msg && <p className="text-green-500 mt-5">{msg}</p>}
      {error && <p className="text-red-500 mt-5">{error}</p>}
      <button
        type="button"
        onClick={handleShowList}
        className="text-green-700 uppercase mt-5 text-md w-full"
      >
        Show List
      </button>
      {showListingError && (
        <p className="text-red-700 text-sm">{showListingError}</p>
      )}
      {userList && userList.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-xl mt-5">Your List</h1>
          {userList.map((list) => {
            return (
              <>
                <div
                  key={list._id}
                  className="border rounded-lg p-3 flex justify-between items-center gap-4"
                >
                  <Link to={`/list/${list._id}`}>
                    <img
                      src={list.imageUrls[0]}
                      alt="List Cover Image"
                      className="h-16 w-16 object-contain"
                    />
                  </Link>
                  <Link
                    to={`/list/${list._id}`}
                    className="text-slate-700 font-semibold flex-1 hover:underline truncate"
                  >
                    <p>{list.name}</p>
                  </Link>
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteList(list._id)}
                      className="text-red-700"
                    >
                      DELETE
                    </button>
                    <Link
                      to={`/edit-list/${list._id}`}
                      className="text-green-700"
                    >
                      EDIT
                    </Link>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Profile;
