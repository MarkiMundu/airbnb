import React, { useContext, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { useNavigate, useParams } from "react-router-dom";
import { listingDataContext } from "../Context/ListingContext";
import { userDataContext } from "../Context/UserContext";
import axios from "axios";
import { authDataContext } from "../Context/AuthContext"
import { bookingDataContext } from "../Context/BookingContext";
import { useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";


function ViewCard() {
  let navigate = useNavigate();
  let { id } = useParams();
  let { cardDetails, setCardDetails, getListing } = useContext(listingDataContext);
  let { userData, getCurrentUser } = useContext(userDataContext);
   let{serverUrl}=useContext(authDataContext);
  let [updatePopUp, setUpdatePopUp] = useState(false);
  let [bookingPopUp, setBookingPopUp] = useState(false);
      let[title,setTitle]=useState("")
      let[description,setDescription]=useState("")
      let[backEndImage1,setBackEndImage1]=useState(null)
      let[backEndImage2,setBackEndImage2]=useState(null)
      let[backEndImage3,setBackEndImage3]=useState(null)
      let[rent,setRent]=useState("")
      let[city,setCity]=useState("")
      let[minDate,setMinDate]=useState("")
      let[landmark,setLandmark]=useState("")
      let{updating,setUpdating}=useContext(listingDataContext)
      let{deleting,setDeleting}=useContext(listingDataContext)
      let{checkIn,setCheckIn,
     checkOut,setCheckOut,
     total,setTotal,
     night,setNight,handleBooking,booking}=useContext(bookingDataContext)


     useEffect(() => {
      if (id && (!cardDetails || String(cardDetails._id) !== String(id))) {
        axios.get(`${serverUrl}/api/listing/findlistingbyid/${id}`, { withCredentials: true })
          .then(({ data }) => setCardDetails(data))
          .catch((error) => { toast.error(error.response?.data?.message || "Listing not found"); navigate("/"); });
      }
     }, [id, cardDetails, serverUrl, setCardDetails, navigate]);

     useEffect(() => {
      if (!cardDetails) return;
      setTitle(cardDetails.title || ""); setDescription(cardDetails.description || "");
      setRent(cardDetails.rent || ""); setCity(cardDetails.city || ""); setLandmark(cardDetails.landMark || "");
     }, [cardDetails?._id]);

     //useeffect for rent calculation.

     useEffect(()=>{
      if(cardDetails && checkIn && checkOut){
        let InDate = new Date(checkIn)
        let OutDate = new Date(checkOut)
        let n = Math.ceil((OutDate - InDate)/(24*60*60*1000))
        setNight(n > 0 ? n : 0)
        let subtotal = Number(cardDetails.rent) * n
        let airBnbCharge = subtotal * 0.07
        let tax = subtotal * 0.07
        if(n>0){
          setTotal(subtotal + airBnbCharge + tax)
        }
        else{
          setTotal(0)
        }
      } else { setNight(0); setTotal(0); }
     },[checkIn,checkOut,cardDetails])
  

  //handle update button.
  const handleUpdateListing = async () => {
    setUpdating(true)
    try {
      let formData = new FormData();
      formData.append("title", title);
      if(backEndImage1){formData.append("image1", backEndImage1)};
      if(backEndImage2){formData.append("image2", backEndImage2)};
      if(backEndImage3){formData.append("image3", backEndImage3)};
      formData.append("description", description);
      formData.append("rent", rent);
      formData.append("city", city);
      formData.append("landMark", landmark);
      formData.append("category", cardDetails.category);

      let result = await axios.post(serverUrl + `/api/listing/update/${cardDetails._id}`,
        formData,
        { withCredentials: true },
      );
      setUpdating(false)
      await Promise.allSettled([getListing(), getCurrentUser()]);
      setCardDetails(result.data);
      navigate("/mylisting");
      toast.success(" Listing Updated")

      setTitle("");
      setDescription("");
      
      setBackEndImage1(null);
      setBackEndImage2(null);
      setBackEndImage3(null);
      setRent("");
      setLandmark("");
    } catch (error) {
      setUpdating(false)
       toast.error(error.response?.data?.message || "Request failed")
      console.log("Update failed:", error.response?.data || error.message);
    }
  };

  //delete function
  const handleDeleteListing=async()=>{
    setDeleting(true)
    console.log("delete button clicked")
    try {
      let result = await axios.delete(serverUrl + `/api/listing/delete/${cardDetails._id}`,
        { withCredentials: true },
      );
      setDeleting(false)
      await Promise.allSettled([getListing(), getCurrentUser()]);
      console.log(result.data)
      navigate("/mylisting")
      toast.success(" Listing Deleted")
    } catch (error) {
      setDeleting(false)
       toast.error(error.response?.data?.message || "Request failed")
      console.log(error)
      
    }
  }

  //function for image.
const handleImage1 = (e)=>{
  let file =e.target.files[0]
  setBackEndImage1(file)
}
const handleImage2 = (e)=>{
  let file =e.target.files[0]
  setBackEndImage2(file)
}
const handleImage3 = (e)=>{
  let file =e.target.files[0]
  setBackEndImage3(file)
}

useEffect(()=>{
 const today = new Date();
 const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
 setMinDate(localToday);
},[])

  if (!cardDetails) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <p className="text-xl font-semibold text-gray-700">Listing details are not available.</p>
        <button
          className="px-6 py-2 rounded-lg bg-green-600 text-white"
          onClick={() => navigate("/")}
        >
          Back to listings
        </button>
      </div>
    );
  }

  return (
    <div className="w-[100%] min-h-[100vh] bg-[white] flex items-center justify-center gap-[10px] flex-col overflow-auto relative">
      <div
        className="w-[50px] h-[50px] bg-[red] cursor-pointer  absolute top-[10%] left-[20px] rounded-[50%] flex items-center justify-center top-[5%]"
        onClick={() => navigate("/")}
      >
        <FaArrowLeftLong className="w-[25px] h-[25px] text-[white]" />
      </div>
      <div className="w-[95%] flex items-start justify-start text-[25px] md:w-[80%] mb-[10px]">
        <h1 className="text-[20px] text-[#272727] md:text-[30px] text-ellpsis text-nowrap overflow-hidden">
          {`In ${cardDetails.landMark.toUpperCase()},${cardDetails.city.toUpperCase()}`}
        </h1>
      </div>
      <div className="w-[95%] h-[400px] flex items-center justify-center flex-col md:w-[80%] md:flex-row">
        <div className="w-[100%] h-[65%] md:w-[70%] md:h-[100%] overflow-hidden flex items-center justify-center border-[2px] border-[white]">
          <img src={cardDetails.image1} alt="" className="w-[100%]" />
        </div>
        <div className="w-[100%] h-[50%] flex items-center justify-center md:w-[50%] md:h-[100%] md:flex-col">
          <div className="w-[100%] h-[100%] overflow-hidden flex items-center justify-center border-[2px] border-[white]">
            <img src={cardDetails.image2} alt="" className="w-[100%]" />
          </div>
          <div className="w-[100%] h-[100%] overflow-hidden flex items-center justify-center border-[2px] border-[white]">
            <img src={cardDetails.image3} alt="" className="w-[100%]" />
          </div>
        </div>
      </div>
      <div className="w-[95%] flex items-start justify-start text-[18px] md:w-[80%] md:text-[25px] px-[70px] md:px-[0px]">
        {`${cardDetails.title.toUpperCase()} ${cardDetails.category.toUpperCase()},${cardDetails.landMark.toUpperCase()} `}
      </div>
      <div className="w-[95%] flex items-start justify-start text-[18px] md:w-[80%] md:text-[25px] text-gray-800">
        {`${(cardDetails.description).toUpperCase()} `}
      </div>
      <div className="w-[95%] flex items-start justify-start text-[18px] md:w-[80%] md:text-[25px]">
        Rs.{`${cardDetails.rent}/day`}
      </div>
      <div className="w-[95%] h-[50px] flex items-center justify-start px-[110px]">
        {cardDetails.host == userData._id && (
          <button
            className="px-[30px] py-[10px] bg-[green] text-[white] text-[18px] text-nowrap md:px-[110px] rounded-lg "
            onClick={() => setUpdatePopUp((prev) => !prev)}
          >
            Edit listing
          </button>
        )}
        {cardDetails.host != userData._id && !cardDetails.isBooked && (
          <button className="px-[70px] py-[10px] bg-[green] text-[white] text-[18px] text-nowrap md:px-[100px] rounded-lg "
          onClick={() => setBookingPopUp((prev) => !prev)}>
            Reserve
          </button>
        )}
        {cardDetails.isBooked && cardDetails.host != userData._id && <span className="px-6 py-2 bg-gray-200 rounded-lg text-gray-700">Currently booked</span>}
      </div>

      {/* Update Listing Page */}
      {updatePopUp && 
        <div className="w-[100%] h-[100%] flex items-center justify-center bg-[#000000a9] absolute top-[0px]z-[100] backdrop-blur-sm">
          <RxCross2
            className="w-[30px] h-[30px] bg-[red] cursor-pointer  absolute top-[6%] left-[28px] rounded-[50%] flex items-center justify-center"
            onClick={() => setUpdatePopUp(false)}
          />

          <form
            action=""
            className="max-w-[900px] w-[90%] h-[550px] flex items-center justify-start flex-col  gap-[10px] overflow-auto mt-[50px] text-[white]
          bg-[#272727] p-[20px] rounded-lg"
            onSubmit={(e)=>{e.preventDefault()}}>
            <div
              className="w-[200px] h-[50px] text-[20px] bg-[#f14242] text-[white]
                  flex items-center justify-center rounded-[30px] absolute top-[5%] right-[10px] shadow-lg"
            >
              Update your details
            </div>
            <div className="w-[90%] flex items-start justify-start flex-col gap-[10px]">
              <label htmlFor="title" className="text-[20px]">
                Title
              </label>
              <input
                type="text"
                id="title"
                className="w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px] text-[black]"
                required
                placeholder="_bhk house or best title"
               onChange={(e)=>setTitle(e.target.value)} value={title}/>
            </div>

            <div className="w-[90%] flex items-start justify-start flex-col gap-[10px]">
              <label htmlFor="des" className="text-[20px]">
                Description
              </label>
              <textarea
                name=""
                id="des"
                className="w-[90%] h-[80px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px] text-[black]"
                required
              onChange={(e)=>setDescription(e.target.value)} value={description}></textarea>
            </div>

            <div className="w-[90%] flex items-start justify-start flex-col gap-[10px]">
              <label htmlFor="img1" className="text-[20px]">
                Image1
              </label>
              <div className="flex items-center justify-start w-[90%] h-[40px] border-[#555656] border-2 rounded-[10px]">
                <input
                  type="file" accept="image/*"
                  id="img1"
                  className="w-[100%] text-[15px] px-[10px]"
                  onChange={handleImage1}/>
              </div>
            </div>

            <div className="w-[90%] flex items-start justify-start flex-col gap-[10px]">
              <label htmlFor="img2" className="text-[20px]">
                Image2
              </label>
              <div className="flex items-center justify-start w-[90%] h-[40px] border-[#555656] border-2 rounded-[10px]">
                <input
                  type="file" accept="image/*"
                  id="img2"
                  className="w-[100%] text-[15px] px-[10px]"
                  onChange={handleImage2}/>
              </div>
            </div>

            <div className="w-[90%] flex items-start justify-start flex-col gap-[10px]">
              <label htmlFor="img3" className="text-[20px]">
                Image3
              </label>
              <div className="flex items-center justify-start w-[90%] h-[40px] border-[#555656] border-2 rounded-[10px]">
                <input
                  type="file" accept="image/*"
                  id="img3"
                  className="w-[100%] text-[15px] px-[10px]"
                  onChange={handleImage3}/>
              </div>
            </div>

            <div className="w-[90%] flex items-start justify-start flex-col gap-[10px]">
              <label htmlFor="rent" className="text-[20px]">
                Rent
              </label>
              <input
                type="number"
                id="rent"
                className="w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px] text-[black]"
                required
                placeholder="Rs.___/day"
              onChange={(e)=>setRent(e.target.value)} value={rent}/>
            </div>

            <div className="w-[90%] flex items-start justify-start flex-col gap-[10px]">
              <label htmlFor="city" className="text-[20px]">
                City
              </label>
              <input
                type="text"
                id="city"
                className="w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px] text-[black]"
                required
                placeholder="city,country"
              onChange={(e)=>setCity(e.target.value)} value={city}/>
            </div>

            <div className="w-[90%] flex items-start justify-start flex-col gap-[10px]">
              <label htmlFor="landmark" className="text-[20px]">
                Landmark
              </label>
              <input
                type="text"
                id="landmark"
                className="w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px] text-[black]"
                required
              onChange={(e)=>setLandmark(e.target.value)} value={landmark}/>
            </div>
            
            <div className="w-[100%] flex items-center justify-center gap-[30px] mt-[20px]">
            <button className="px-[10px] py-[10px] bg-[green] text-[white] text-[15px] text-nowrap md:px-[100px] md:text-[18px] rounded-lg mt-[20px]"
            type="button" onClick={handleUpdateListing} disabled={updating} >
             {updating?"updating...":"Update Listing"}
            </button>
            <button className="px-[10px] py-[10px] bg-[red] text-[white] text-[15px] text-nowrap md:px-[100px] md:text-[18px] rounded-lg mt-[20px]"
            type="button" onClick={handleDeleteListing} disabled={deleting}>
           { deleting?"Deleting...":"Delete listing"}
            </button>
            </div>
          </form>
        </div>}
         {bookingPopUp&&<div className="w-[100%] min-h-[100%] flex items-center justify-center flex-col gap-[30px]  bg-[#ffffffcd] absolute top-[0px]z-[100] z-[100] backdrop-blur-sm 
         md:flex-row md:gap-[100px]">
          <RxCross2
            className="w-[30px] h-[30px] bg-[red] cursor-pointer  absolute top-[6%] left-[28px] rounded-[50%] flex items-center justify-center"
            onClick={() => setBookingPopUp(false)}
          />
    
          <form action="" className="max-w-[450px] w-[90%] h-[450px] overflow-auto bg-[#f7fbfcfe] p-[20px] rounded-lg flex items-center justify-start flex-col gap-[10px]
          border-[1px] border-[#dedddd] shadow-[0_4px_10px_rgba(59,130,246,0.5)]" onSubmit={(e)=>e.preventDefault()}>
           <h1 className="w-[100%] flex items-center justify-center py-[10px] text-[25px] border-b-[1px] border-[#a3a3a3]">Confirm & Book</h1>
           <div className="w-[100%] h-[70%] mt-[10px] rounded-lg p-[10px]">
            <h3 className="text-[19px] font-semibold">Your Trip -</h3>

           <div className="w-[90%] flex flex-col md:flex-row items-start md:items-center justify-start md:justify-center gap-[24px] p-[10px]">
              <label htmlFor="checkIn" className="text-[18px] md:text-[20px]">CheckIn </label>
              <input type="date" min={minDate} id="CheckIn"className="w-[200px] h-[40px] border-[2px] border-[#555656] rounded-[10px] bg-transparent px-[10px] text-[15px] md:text-[18px] "
                required onChange={(e)=>setCheckIn(e.target.value)} value={checkIn}/>
            </div>
           <div className="w-[90%] flex flex-col md:flex-row items-start md:items-center justify-start md:justify-center gap-[10px] p-[10px]">
              <label htmlFor="checkOut" className="text-[18px] md:text-[20px]">CheckOut </label>
              <input type="date" min={checkIn || minDate} id="CheckOut"className="w-[200px] h-[40px] border-[2px] border-[#555656] rounded-[10px] bg-transparent px-[10px] text-[15px] md:text-[18px] "
                required onChange={(e)=>setCheckOut(e.target.value)} value={checkOut}/>
            </div>
               <div className="w-[100%] flex items-center justify-center">
             <button className="px-[80px] py-[10px] bg-[blue] text-[white] text-[18px] text-nowrap md:px-[100px] rounded-lg mt-[30px]"
             type="button" onClick={()=>handleBooking(cardDetails._id)} disabled={booking || !checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn)}>
              {booking?"Booking...":"Book Now"}
            </button>
            </div>

           </div>
           
          </form>
          <div className="max-w-[450px] w-[90%] h-[450px] bg-[#f7fbfcfe] p-[20px] rounded-lg flex itemx-center
          justify-center flex-col gap-[10px] border-[1px] border-[#e2e1e1] shadow-xl">
            <div className="w-[95%] h-[30%] border-[1px] border-[#abaaaa] rounded-lg flex justify-center items-center gap-[8px] 
            p-[20px] overflow-hidden"> 
            <div className="w-[70px] h-[90px] flex items-center justify-center flex-shrink-0 rounded-lg md:w-[100px] md:h-[100px]">
              <img src={cardDetails.image1} alt="" className="w-[100%] h-[100%] rounded-lg" /></div>
              <div className="w-[80%] h-[100px] gap-[5px]">
                <h1 className="w-[90%] truncate">{`IN ${cardDetails.landMark.toUpperCase()},${cardDetails.city.toUpperCase()}`}</h1>
                <h1>{cardDetails.title.toUpperCase()}</h1>
                <h1>{cardDetails.category.toUpperCase()}</h1>
                <h1 className="flex items-center justify-start gap-[5px]"><FaStar className="text-[#eb6262]"/>{cardDetails.ratings}</h1>
              </div>
            </div>
            <div className="w-[95%] h-[60%] border-[1px] border-[#abaaaa] rounded-lg flex justify-start
            items-start p-[20px] gap-[15px] flex-col" >
              <h1 className='text-[22px] font-semibold'>Booking Price -</h1>
              <p className="w-[100%] flex justify-between items-center px-[20px]">
                <span className="font-semibold">
                  {`₹${cardDetails.rent} X ${night} nights`}
                </span>
                <span>₹{(cardDetails.rent*night).toFixed(2)}</span>
              </p>
              <p className="w-[100%] flex justify-between items-center px-[20px]">
                <span className="font-semibold">
                 Tax(7%):
                </span>
                <span>₹{(night > 0 ? (cardDetails.rent * night * 0.07).toFixed(2) : "0.00")}</span>
              </p>
              <p className="w-[100%] flex justify-between items-center px-[20px] border-b-[1px] border-gray-500 pb-[10px]">
                <span className="font-semibold">
                 Airbnb Charge(7%):
                </span>
                <span>₹{(night > 0 ? (cardDetails.rent * night * 0.07).toFixed(2) : "0.00")}</span>
              </p>
               <p className="w-[100%] flex justify-between items-center px-[20px]">
                <span className="font-semibold">
                  Total Price:
                </span>
                <span>₹{total.toFixed(2)}</span>
              </p>
            </div>

          </div>

         </div>}
    </div>

  );
}

export default ViewCard;
