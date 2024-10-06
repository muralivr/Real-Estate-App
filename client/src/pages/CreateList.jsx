import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function CreateList() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();

  function handleImageUpload() {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(null);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((url) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(url),
          });
          setImageUploadError(null);
          setUploading(false);
        })
        .catch((error) => {
          setImageUploadError("Image Uplaod Failed (2 MB Max)", error);
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per list");
      setUploading(false);
    }
  }
  async function storeImage(file) {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "_" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${Math.round(progress)}%`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  }

  function handleDelete(index) {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setImageUploadError("You must upload atleast 1 image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be less than regular price");
      setLoading(true);
      setError(null);
      const res = await axios.post(
        "http://localhost:3000/api/list/create",
        { ...formData, userRef: currentUser._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      console.log(res);

      if (res.data.success === true) {
        setLoading(false);
        setError(null);
        navigate(`/list/${res.data.list._id}`);
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
      setLoading(false);
    }
  }
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Create List</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="rounded-lg border p-3"
            id="name"
            required
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="rounded-lg border p-3"
            id="description"
            required
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="rounded-lg border p-3"
            id="address"
            required
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sell"
                className="w-5"
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.id })
                }
                checked={formData.type === "sell"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.id })
                }
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.id]: e.target.checked })
                }
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.id]: e.target.checked })
                }
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.id]: e.target.checked })
                }
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                className="p-3 rounded-lg border border-gray-300"
                required
                onChange={(e) =>
                  setFormData({ ...formData, bedrooms: e.target.value })
                }
                value={formData.bedrooms}
              />
              <span>Beds</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="bathrooms"
                min={1}
                max={10}
                className="p-3 rounded-lg border border-gray-300"
                required
                onChange={(e) =>
                  setFormData({ ...formData, bathrooms: e.target.value })
                }
                value={formData.bathrooms}
              />
              <span>Baths</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="regularPrice"
                min={50}
                max={1000000}
                className="p-3 rounded-lg border border-gray-300"
                required
                onChange={(e) =>
                  setFormData({ ...formData, regularPrice: e.target.value })
                }
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                {formData.type === "rent" && (
                  <span className="text-sm">($/Month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  id="discountedPrice"
                  min={0}
                  max={1000000}
                  className="p-3 rounded-lg border border-gray-300"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, discountPrice: e.target.value })
                  }
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  {formData.type === "rent" && (
                    <span className="text-sm">($/Month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">Images:</p>
          <span className="font-normal text-gray-600 ml-2">
            The first image will be the cover (max 6)
          </span>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="p-3 border border-gray-300 rounded-w-full"
            />
            <button
              type="button"
              onClick={handleImageUpload}
              className="uppercase p-3 text-green-700 border border-green-700 rounded hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">{imageUploadError}</p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => {
              return (
                <>
                  <div
                    className="flex justify-between p-3 border items-center"
                    key={index}
                  >
                    <img
                      src={url}
                      alt="List Image"
                      className="w-20 h-20 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="text-red-700 uppercase p-3 rounded-lg hover:opacity-95"
                    >
                      Delete
                    </button>
                  </div>
                </>
              );
            })}
          <button
            disabled={loading || uploading}
            className="uppercase mt-3 p-3 rounded-lg bg-slate-700 text-white hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating" : "Create List"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}

export default CreateList;
