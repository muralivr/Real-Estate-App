import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import Contact from "../components/Contact.jsx";

function List() {
  SwiperCore.use(Navigation);
  const { id } = useParams();
  const [list, setList] = useState({
    imageUrls: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [contact, setContact] = useState(false);

  useEffect(() => {
    const getList = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await axios.get("http://localhost:3000/api/list/get/" + id);
        console.log(res);
        if (res.data.success === true) {
          setList(res.data.list);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(true);
      }
    };
    getList();
  }, []);
  return (
    <main>
      {loading && (
        <p className="text-slate-700 text-2xl text-center mt-5">Loading...</p>
      )}
      {error && (
        <p className="text-red-700 text-2xl text-center mt-5">
          Something went wrong...
        </p>
      )}
      {list && !loading && !error && (
        <>
          <Swiper navigation>
            {list.imageUrls.map((url) => {
              return (
                <SwiperSlide key={url}>
                  <div
                    className="h-[600px]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="flex flex-col max-w-6xl mx-auto p-3 my-7 gap-6">
            <p className="text-2xl font-semibold">
              {list.name}-${" "}
              {list.offer ? list.discountPrice : list.regularPrice}
              {list.type === "rent" && "/month"}
            </p>
            <p className="flex item-center mt-6 gap-2 text-slate-700 my-2 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {list.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {list.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {list.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+list.regularPrice - +list.discountPrice} OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {list.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex items-center gap-4 sm-gap-6 flex-wrap">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg" />
                {list.bedrooms > 1
                  ? `${list.bedrooms} beds`
                  : `${list.bedrooms} bed`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg" />
                {list.bathrooms > 1
                  ? `${list.bathrooms} baths`
                  : `${list.bathrooms} bath`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking className="text-lg" />
                {list.parking ? `Parking` : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaChair className="text-lg" />
                {list.furnished ? `Furnished` : "Not Furnished"}
              </li>
            </ul>
            {currentUser && list.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 uppercase rounded-lg p-3 text-white hover:opacity-95"
              >
                Contact LandLord
              </button>
            )}
            {contact && <Contact list={list}/>}
          </div>
        </>
      )}
    </main>
  );
}

export default List;
