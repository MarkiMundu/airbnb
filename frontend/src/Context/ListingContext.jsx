import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { authDataContext } from "./AuthContext";
import { userDataContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const listingDataContext = createContext(null);
function ListingContext({ children }) {
  const navigate = useNavigate();
  const { serverUrl } = useContext(authDataContext);
  const { getCurrentUser } = useContext(userDataContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frontEndImage1, setFrontEndImage1] = useState(null);
  const [frontEndImage2, setFrontEndImage2] = useState(null);
  const [frontEndImage3, setFrontEndImage3] = useState(null);
  const [backEndImage1, setBackEndImage1] = useState(null);
  const [backEndImage2, setBackEndImage2] = useState(null);
  const [backEndImage3, setBackEndImage3] = useState(null);
  const [rent, setRent] = useState("");
  const [city, setCity] = useState("");
  const [landmark, setLandmark] = useState("");
  const [category, setCategory] = useState("");
  const [listingData, setListingData] = useState([]);
  const [newListData, setNewListData] = useState([]);
  const [cardDetails, setCardDetails] = useState(null);
  const [searchData, setSearchData] = useState([]);
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const resetListingForm = () => {
    setTitle(""); setDescription(""); setFrontEndImage1(null); setFrontEndImage2(null); setFrontEndImage3(null);
    setBackEndImage1(null); setBackEndImage2(null); setBackEndImage3(null); setRent(""); setCity(""); setLandmark(""); setCategory("");
  };
  const handleAddListing = async () => {
    if (!title.trim() || !description.trim() || !rent || Number(rent) <= 0 || !city.trim() || !landmark.trim() || !category || !backEndImage1 || !backEndImage2 || !backEndImage3) {
      toast.error("Complete all listing details and select all three images"); return;
    }
    setAdding(true);
    try {
      const formData = new FormData();
      Object.entries({ title, description, rent, city, landMark: landmark, category, image1: backEndImage1, image2: backEndImage2, image3: backEndImage3 }).forEach(([key, value]) => formData.append(key, value));
      await axios.post(`${serverUrl}/api/listing/add`, formData, { withCredentials: true });
      await Promise.allSettled([getListing(), getCurrentUser()]); resetListingForm(); toast.success("Listing added successfully"); navigate("/mylisting");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to add listing");
      console.error("Add listing failed:", error.response?.data || error.message);
    } finally { setAdding(false); }
  };

  const handleViewCard = async (id) => {
    if (!id) return;
    try {
      const { data } = await axios.get(`${serverUrl}/api/listing/findlistingbyid/${id}`, { withCredentials: true });
      setCardDetails(data); navigate(`/viewcard/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load listing details");
      console.error("Load listing failed:", error.response?.data || error.message);
    }
  };

  const getListing = async () => {
    try {
      const { data } = await axios.get(`${serverUrl}/api/listing/get`);
      setListingData(data); setNewListData(data); return data;
    } catch (error) {
      console.error("Fetch listings failed:", error.response?.data || error.message);
      return [];
    }
  };
  const handleSearch = async (value) => {
    const query = String(value || "").trim();
    if (!query) { setSearchData([]); return; }
    try {
      const { data } = await axios.get(`${serverUrl}/api/listing/search`, { params: { query } });
      setSearchData(data);
    } catch (error) {
      setSearchData([]); toast.error(error.response?.data?.message || "Search failed");
    }
  };

  useEffect(() => { getListing(); }, [serverUrl]);
  const value = {
    title, setTitle, description, setDescription,
    frontEndImage1, setFrontEndImage1, frontEndImage2, setFrontEndImage2, frontEndImage3, setFrontEndImage3,
    backEndImage1, setBackEndImage1, backEndImage2, setBackEndImage2, backEndImage3, setBackEndImage3,
    rent, setRent, city, setCity, landmark, setLandmark, category, setCategory,
    handleAddListing, adding, setAdding, listingData, setListingData, getListing,
    newListData, setNewListData, handleViewCard, cardDetails, setCardDetails,
    updating, setUpdating, deleting, setDeleting, handleSearch, searchData, setSearchData, resetListingForm,
  };
  return <listingDataContext.Provider value={value}>{children}</listingDataContext.Provider>;
}
export default ListingContext;
