import React, { useContext,useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from 'axios'
import {authDataContext}from '../Context/AuthContext'
import { userDataContext } from "../Context/UserContext";
import { toast } from "react-toastify";

function SignUp() {
  let navigate = useNavigate();
  let {serverUrl} = useContext(authDataContext);
  let{userData,setUserData}=useContext(userDataContext)
  let[name,setName]=useState("")
  let[email,setEmail]=useState("")
  let[password,setPassword]=useState("")
  let{loading,setLoading}=useContext(authDataContext)

  //handle signup function.
  const handleSignUp = async(e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let result = await axios.post(serverUrl+"/api/auth/signup",{
      name,
      email,
      password
      },{withCredentials:true})
      setLoading(false)
      setUserData(result.data)
      navigate("/")
      toast.success("SignUp Successfully")
      console.log(result)
    } catch (error) {
      setLoading(false)
      console.log(error)
      toast.error(error.response?.data?.message || "Unable to create account. Please try again.")
  //      if (error.response) {
  //   console.log("Server responded with:", error.response.data);
  // } else if (error.request) {
  //   console.log("No response received:", error.request);
  // } else {
  //   console.log("Error setting up request:", error.message);
  // }

    }
  }

  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center relative">
      <div className="w-[50px] h-[50px] bg-[red] cursor-pointer  absolute top-[10%] left-[20px] rounded-[50%] flex items-center justify-center" onClick={()=>navigate("/")}>
        <FaArrowLeftLong className="w-[25px] h-[25px] text-[white]" />
      </div>
      <form
        action=""
        className="max-w-[900px] w-[90%] h-[600px] flex items-center justify-center  flex-col
      md:items-start gap-[10px]"
      onSubmit={handleSignUp}>
        <h1 className="text-[30px] text-[black]">Welcome to Airbnb</h1>
        <div
          className="w-[90%] flex items-start justify-start
       flex-col gap-[10px] mt-[30px]"
        >
          <label htmlFor="name" className="text-[20px]">
            UserName
          </label>
          <input
            type="text"
            id="name"
            className="w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg
        text-[18px] px-[20px]"
          required onChange={(e)=>setName(e.target.value)} value={name}/>
        </div>
        <div
          className="w-[90%] flex items-start justify-start
       flex-col gap-[10px]"
        >
          <label htmlFor="email" className="text-[20px]">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg
        text-[18px] px-[20px]"
          required onChange={(e)=>setEmail(e.target.value)} value={email}/>
        </div>
        <div
          className="w-[90%] flex items-start justify-start
       flex-col gap-[10px]"
        >
          <label htmlFor="password" className="text-[20px]">
            Password
          </label>
          <input
            type="password"
            minLength={6}
            id="password"
            className="w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg
        text-[18px] px-[20px]"
          required onChange={(e)=>setPassword(e.target.value)} value={password}/>
        </div>
        <button className="px-[50px] py-[10px] bg-[green] text-[white] text-[18px] md:px-[100px] rounded-lg mt-[20px]" disabled={loading}>
         {loading?"Loading...":"SignUp"}
        </button>
        <p className="text-[18px]">
          Already have a account?
          <span
            className="text-[19px] text-[blue] cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
