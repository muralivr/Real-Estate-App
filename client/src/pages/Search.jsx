import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListItem from "../components/ListItem.jsx";

function Search() {
  const [sidebarData, setSideBarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const navigate = useNavigate();
  console.log(sidebarData);

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSideBarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }
    async function fetchList() {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const res = await axios.get(
          `http://localhost:3000/api/list/getlist?${searchQuery}`
        );
        console.log(res);

        if (res.data.success === true) {
          setLoading(false);
          setList(res.data.list);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchList();
  }, [location.search]);

  function handleChangeSelect(e) {
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSideBarData({ ...sidebarData, sort, order });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("order", sidebarData.order);
    urlParams.set("sort", sidebarData.sort);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term
            </label>
            <input
              type="text"
              placeholder="Search..."
              id="searchTerm"
              className="p-3 rounded-lg border w-full"
              value={sidebarData.searchTerm}
              onChange={(e) =>
                setSideBarData({ ...sidebarData, searchTerm: e.target.value })
              }
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="all"
                value={sidebarData.type}
                checked={sidebarData.type === "all"}
                onChange={(e) =>
                  setSideBarData({ ...sidebarData, type: e.target.id })
                }
              />
              <span>Rent & Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="rent"
                checked={sidebarData.type === "rent"}
                onChange={(e) =>
                  setSideBarData({ ...sidebarData, type: e.target.id })
                }
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="sell"
                checked={sidebarData.type === "sell"}
                onChange={(e) =>
                  setSideBarData({ ...sidebarData, type: e.target.id })
                }
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="offer"
                checked={sidebarData.offer}
                onChange={(e) =>
                  setSideBarData({
                    ...sidebarData,
                    [e.target.id]:
                      e.target.checked 
                  })
                }
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="parking"
                checked={sidebarData.parking}
                onChange={(e) =>
                  setSideBarData({
                    ...sidebarData,
                    [e.target.id]:
                      e.target.checked 
                  })
                }
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="furnished"
                checked={sidebarData.furnished}
                onChange={(e) =>
                  setSideBarData({
                    ...sidebarData,
                    [e.target.id]:
                      e.target.checked 
                  })
                }
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              id="sort_order"
              className="border rounded-lg p-3"
              defaultValue={"createdAt_desc"}
              onChange={handleChangeSelect}
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="rounded-lg w-full bg-slate-700 text-white text-center p-3 hover:opacity-95 uppercase">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-slate-700 font-semibold text-3xl mt-5 p-3">
          Lists:
        </h1>
        <div className="flex gap-6 flex-wrap">
          {!loading && list.length === 0 && (
            <p className="text-xl text-slate-700">No list found</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}
          {!loading &&
            list &&
            list.map((list) => <ListItem key={list._id} list={list}/>)}
        </div>
      </div>
    </div>
  );
}

export default Search;
