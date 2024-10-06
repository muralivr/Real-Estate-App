import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

function ListItem({ list }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg w-full sm:w-[330px] transition-shadow overflow-hidden rounded-lg">
      <Link to={`/list/${list._id}`}>
        <img
          src={list.imageUrls[0]}
          alt="List Image Cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col w-full gap-2">
          <p className="truncate text-lg font-semibold text-slate-700">
            {list.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {list.address}
            </p>
          </div>
          <p className="text-sm text-gray-00 line-clamp-2">
            {list.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold">
            ${list.offer ? list.discountPrice : list.regularPrice}
            {list.type === "rent" && "/month"}
          </p>
          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs">
              {list.bedrooms > 1
                ? `${list.bedrooms} beds`
                : `${list.bedrooms} bed`}
            </div>
            <div className="font-bold text-xs">
              {list.bathrooms > 1
                ? `${list.bathrooms} baths`
                : `${list.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ListItem;
