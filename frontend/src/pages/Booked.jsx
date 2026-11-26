import React, { useContext, useEffect, useState } from "react";
import { GiConfirmed } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import Star from "../Components/Star";
import { authDataContext } from "../Context/AuthContext";
import { userDataContext } from "../Context/UserContext";
import { listingDataContext } from "../Context/ListingContext";
import { bookingDataContext } from "../Context/BookingContext";
import axios from "axios";
import { toast } from "react-toastify";

function Booked() {
  const { bookingData } = useContext(bookingDataContext);
  const { serverUrl } = useContext(authDataContext);
  const { getCurrentUser } = useContext(userDataContext);
  const { getListing } = useContext(listingDataContext);
  const navigate = useNavigate();
  const [star, setStar] = useState(null);
  useEffect(() => { if (!bookingData) navigate("/mybooking", { replace: true }); }, [bookingData, navigate]);

  const handleRating = async () => {
    if (!star) { toast.error("Please select a rating first"); return; }
    try {
      await axios.post(`${serverUrl}/api/listing/ratings/${bookingData.listing}`, { ratings: star }, { withCredentials: true });
      await Promise.allSettled([getListing(), getCurrentUser()]);
      toast.success("Thanks for your rating"); navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to submit rating");
    }
  };
  if (!bookingData) return null;
  return (
    <div className="w-[100vw] min-h-[100vh] flex items-center justify-center gap-[10px] bg-slate-200 flex-col p-4">
      <div className="w-[95%] max-w-[500px] min-h-[350px] bg-white flex items-center justify-center border border-[#b5b5b5] flex-col gap-[20px] p-[20px] rounded-lg">
        <div className="w-full flex items-center justify-center text-[20px] flex-col gap-[20px] font-semibold"><GiConfirmed className="w-[100px] h-[100px] text-green-600" />Booking Confirmed</div>
        <div className="w-full flex items-center justify-between gap-3"><span>Booking ID:</span><span className="break-all">{bookingData._id}</span></div>
        <div className="w-full flex items-center justify-between"><span>Owner:</span><span>{bookingData.host?.email || "Host"}</span></div>
        <div className="w-full flex items-center justify-between"><span>Total Rent:</span><span>₹{Number(bookingData.totalRent).toFixed(2)}</span></div>
      </div>
      <div className="w-[95%] max-w-[600px] bg-white flex items-center justify-center gap-[20px] p-[20px] border flex-col rounded-lg">
        <h1 className="text-[18px]">{star || 0} out of 5 ratings</h1>
        <Star onRate={setStar} />
        <button className="px-[50px] py-[10px] bg-green-600 text-white text-[18px] rounded-lg" onClick={handleRating}>Submit rating</button>
        <button className="text-blue-700 underline" onClick={() => navigate("/")}>Skip and go home</button>
      </div>
      <button className="absolute top-[10px] right-[10px]" onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
}
export default Booked;
