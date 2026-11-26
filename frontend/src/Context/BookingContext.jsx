import axios from "axios";
import React, { createContext, useContext, useState } from "react";
import { authDataContext } from "./AuthContext";
import { userDataContext } from "./UserContext";
import { listingDataContext } from "./ListingContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const bookingDataContext = createContext(null);
function BookingContext({ children }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [total, setTotal] = useState(0);
  const [night, setNight] = useState(0);
  const [bookingData, setBookingData] = useState(null);
  const [booking, setBooking] = useState(false);
  const { serverUrl } = useContext(authDataContext);
  const { getCurrentUser } = useContext(userDataContext);
  const { getListing } = useContext(listingDataContext);
  const navigate = useNavigate();

  const handleBooking = async (id) => {
    if (!checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn)) {
      toast.error("Please choose a valid check-in and check-out date");
      return;
    }
    setBooking(true);
    try {
      const result = await axios.post(`${serverUrl}/api/booking/create/${id}`, { checkIn, checkOut }, { withCredentials: true });
      setBookingData(result.data);
      await Promise.allSettled([getCurrentUser(), getListing()]);
      toast.success("Booked successfully");
      navigate("/booked");
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed. Please try again.");
      console.error("Booking failed:", error.response?.data || error.message);
    } finally { setBooking(false); }
  };

  const cancelBooking = async (id) => {
    try {
      const result = await axios.delete(`${serverUrl}/api/booking/cancel/${id}`, { withCredentials: true });
      await Promise.allSettled([getCurrentUser(), getListing()]);
      toast.success(result.data?.message || "Booking cancelled successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to cancel booking");
      console.error("Cancel booking failed:", error.response?.data || error.message);
      return false;
    }
  };

  return <bookingDataContext.Provider value={{ checkIn, setCheckIn, checkOut, setCheckOut, total, setTotal, night, setNight, bookingData, setBookingData, handleBooking, cancelBooking, booking, setBooking }}>{children}</bookingDataContext.Provider>;
}
export default BookingContext;
