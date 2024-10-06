import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Contact({ list }) {
  const [landLord, setLandLord] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    async function fetchLandLord() {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/user/" + list.userRef,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        if (res.data.success === true) {
          setLandLord(res.data.userdetails);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchLandLord();
  }, [list.userRef]);
  return (
    <>
      {landLord && (
        <div className="flex flex-col gap-4">
          <p>
            Contact <span className="font-semibold">{landLord.username}</span>{" "}
            for <span className="font-semibold">{list.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message..."
            className="w-full p-3 border rounded-lg"
          ></textarea>
          <Link
            to={`mailto:${landLord.email}?subject=Regarding ${list.name}&body=${message}`}
            className="bg-slate-700 text-white p-3 rounded-lg text-center uppercase hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}

export default Contact;
