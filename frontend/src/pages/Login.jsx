import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import {useState} from 'react'
import { authDataContext } from "../Context/AuthContext";
import axios from 'axios'
import { userDataContext } from "../Context/UserContext";
import { toast } from "react-toastify";

function Login() {
  let navigate = useNavigate();
  let {serverUrl} = useContext(authDataContext);
  let{userData,setUserData}=useContext(userDataContext)
  let[email,setEmail]=useState("")
  let[password,setPassword]=useState("")
  let{loading,setLoading}=useContext(authDataContext)

  //handle login function.
   const handleLogin = async(e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let result = await axios.post(serverUrl+"/api/auth/login",{
      email,
      password
      },{withCredentials:true})
      setLoading(false)
      setUserData(result.data)
      navigate("/")
      toast.success("Login Successfully")
      console.log(result)
    } catch (error) {
      setLoading(false)
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.")
      console.log(error)
    }
  }

  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center relative">
      <div
        className="w-[50px] h-[50px] bg-[red] cursor-pointer  absolute top-[10%] left-[20px] rounded-[50%] flex items-center justify-center"
        onClick={() => navigate("/")}
      >
        <FaArrowLeftLong className="w-[25px] h-[25px] text-[white]" />
      </div>
      <form
        action=""
        className="max-w-[900px] w-[90%] h-[600px] flex items-center justify-center  flex-col
      md:items-start gap-[10px]"
      onSubmit={handleLogin}>
        <h1 className="text-[30px] text-[black]">Welcome to Airbnb</h1>

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
         required onChange={(e)=>setEmail(e.target.value)} value={email} />
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
            id="password"
            className="w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg
        text-[18px] px-[20px]"
          required onChange={(e)=>setPassword(e.target.value)} value={password}/>
        </div>
        <button className="px-[50px] py-[10px] bg-[green] text-[white] text-[18px] md:px-[100px] rounded-lg mt-[20px]" disabled={loading}>
          {loading?"loading...":"Login"}
        </button>
        <p className="text-[18px]">
          Create new account?
          <span
            className="text-[19px] text-[blue] cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            SignUp
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
