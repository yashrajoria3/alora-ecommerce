import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../context/AuthContext.js";
import CartContext from "../../context/cartContext.js";
import "./login.css";
import Logo from "../../assets/image/logo.png";

import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginImg2 from "../../assets/image/login2.jpg";
import jwt_decode from "jwt-decode";
// import { Button } from "@material-tailwind/react";

import {
  useGoogleLogin,
  GoogleLogin,
  hasGrantedAllScopesGoogle,
} from "@react-oauth/google";

const WEBLINK = "https://alora.onrender.com";

export const Login = () => {
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const { cartDispatch } = useContext(CartContext);

  if (user) navigate("/");

  //toggle for login/register
  const [state, setState] = useState(true);
  const [loginCred, setLoginCred] = useState({
    email: undefined,
    password: undefined,
  });
  const [regCred, setRegCred] = useState({
    email: undefined,
    email: undefined,
    password: undefined,
  });

  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);

  const handleChange = (e) => {
    if (state)
      setLoginCred((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    else setRegCred((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  //function to fetch cart
  const getCart = async (userId, access_token) => {
    try {
      const res = await axios.get(
        `${WEBLINK}/api/cart/find/${userId}/${access_token}`
      );
      cartDispatch({ type: "GET_CART", payload: res.data });
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (!state) {
      try {
        const res = await axios.post(`${WEBLINK}/api/auth/register`, regCred);
        toast.success(`Register Successfully!`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setCookie("access_token", res.data.token);
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
        getCart(res.data.details._id, res.data.token);
        navigate("/");
        // alert("Registered Successfully!");
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await axios.post(`${WEBLINK}/api/auth/login`, loginCred);
        toast.success(`Welcome ${loginCred.email}!`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setCookie("access_token", res.data.token);
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
        getCart(res.data.details._id, res.data.token);
        navigate("/");
      } catch (err) {
        console.log(err);
      }
    }
  };

  const onLoginSuccess = async (tokenResponse) => {
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      }
    );
    const decoded = response.data;
    try {
      const data = await axios.get(
        `${WEBLINK}/api/users/find/${decoded.email}`
      );
      if (data.data == null) {
        const res = await axios.post(`${WEBLINK}/api/auth/google/register`, {
          name: decoded.name,
          email: decoded.email,
          profile: decoded.picture,
        });
        toast.success(`Registered Successfully!`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setCookie("access_token", res.data.token);
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
        getCart(res.data.details._id, res.data.token);
        navigate("/");
      } else {
        const user = data.data;
        const res = await axios.post(`${WEBLINK}/api/auth/google/login`, {
          email: user.email,
        });
        toast.success(`Welcome ${res.data.details.name}!`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setCookie("access_token", res.data.token);
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
        getCart(res.data.details._id, res.data.token);
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const onLoginFail = (res) => {
    console.log(res);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            <img src={Logo} className="w-32 mx-auto" />
          </div>
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Sign up</h1>
            <div className="w-full flex-1 mt-8">
              <div className="flex flex-col items-center">
                <button
                  className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-blue-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                  onClick={useGoogleLogin({
                    onSuccess: (tokenResponse) => {
                      onLoginSuccess(tokenResponse);
                    },
                  })}
                >
                  <div className="bg-white p-2 rounded-full">
                    <svg className="w-4" viewBox="0 0 533.5 544.3">
                      <path
                        d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                        fill="#4285f4"
                      />
                      <path
                        d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                        fill="#34a853"
                      />
                      <path
                        d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                        fill="#fbbc04"
                      />
                      <path
                        d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                        fill="#ea4335"
                      />
                    </svg>
                  </div>
                  <span className="ml-4">Login in with Google</span>
                </button>
                {/* <GoogleLogin
                  onSuccess={onLoginSuccess}
                  onError={onLoginFail}
                  className="w-32 h-10"
                /> */}

                <button className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-blue-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5">
                  <div className="bg-white p-1 rounded-full">
                    <svg className="w-6" viewBox="0 0 32 32">
                      <path
                        fillRule="evenodd"
                        d="M16 4C9.371 4 4 9.371 4 16c0 5.3 3.438 9.8 8.207 11.387.602.11.82-.258.82-.578 0-.286-.011-1.04-.015-2.04-3.34.723-4.043-1.609-4.043-1.609-.547-1.387-1.332-1.758-1.332-1.758-1.09-.742.082-.726.082-.726 1.203.086 1.836 1.234 1.836 1.234 1.07 1.836 2.808 1.305 3.492 1 .11-.777.422-1.305.762-1.605-2.664-.301-5.465-1.332-5.465-5.93 0-1.313.469-2.383 1.234-3.223-.121-.3-.535-1.523.117-3.175 0 0 1.008-.32 3.301 1.23A11.487 11.487 0 0116 9.805c1.02.004 2.047.136 3.004.402 2.293-1.55 3.297-1.23 3.297-1.23.656 1.652.246 2.875.12 3.175.77.84 1.231 1.91 1.231 3.223 0 4.61-2.804 5.621-5.476 5.922.43.367.812 1.101.812 2.219 0 1.605-.011 2.898-.011 3.293 0 .32.214.695.824.578C24.566 25.797 28 21.3 28 16c0-6.629-5.371-12-12-12z"
                      />
                    </svg>
                  </div>
                  <span className="ml-4">Login in with GitHub</span>
                </button>
              </div>
              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Or login in with email
                </div>
              </div>
              {state && (
                <div className="mx-auto max-w-xs">
                  <input
                    onChange={handleChange}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="text"
                    id="email"
                    placeholder="email"
                  />
                  <input
                    onChange={handleChange}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="password"
                    id="password"
                    placeholder="Password"
                  />
                  <button
                    className="mt-5 tracking-wide font-semibold bg-blue-100 text-[#242424] w-full py-4 rounded-lg hover:bg-blue-200 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    onClick={handleClick}
                  >
                    <svg
                      className="w-6 h-6 -ml-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <path d="M20 8v6M23 11h-6" />
                    </svg>
                    <span className="ml-3">Login</span>
                  </button>
                  <p className="mt-6 text-sm text-gray-600 text-center">
                    <button
                      className="cursor-pointer"
                      onClick={() => {
                        setState(!state);
                      }}
                    >
                      Not a user? Register
                    </button>
                  </p>
                </div>
              )}
              {!state && (
                <div className="mx-auto max-w-xs">
                  <input
                    onChange={handleChange}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="text"
                    id="name"
                    placeholder="name"
                    required
                  />
                  <input
                    onChange={handleChange}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="email"
                    id="email"
                    placeholder="email"
                    required
                  />
                  <input
                    onChange={handleChange}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="password"
                    required
                    id="password"
                    placeholder="Password"
                  />
                  <button
                    className="mt-5 tracking-wide font-semibold bg-blue-100 text-[#242424] w-full py-4 rounded-lg hover:bg-blue-200 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    onClick={handleClick}
                  >
                    <svg
                      className="w-6 h-6 -ml-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <path d="M20 8v6M23 11h-6" />
                    </svg>
                    <span className="ml-3">Register</span>
                  </button>
                  <p className="mt-6 text-sm text-gray-600 text-center">
                    <button
                      className="cursor-pointer"
                      onClick={() => {
                        setState(!state);
                      }}
                    >
                      Already a user? Login
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <img src={loginImg2} alt="login page" />
        </div>
      </div>
    </div>
  );
};
