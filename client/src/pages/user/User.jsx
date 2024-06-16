import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { useCookies } from "react-cookie";
import axios from "axios";

const WEBLINK = "https://alora.onrender.com";

const User = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [order, setOrder] = useState([]);
  const [cookies, setCookies, remove] = useCookies(["access_token"]);

  if (!user) {
    navigate("/login");
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await axios.get(
          `${WEBLINK}/api/order/find/${user._id}/${cookies.access_token}`
        );
        if (data) {
          setOrder(data.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchOrders();
  }, []);
  const options = { day: "numeric", month: "long", hour: "numeric" };

  return (
    <div className=" font-inter my-auto flex flex-col items-start justify-center p-4 w-full h-screen bg-[#f0f0f0]">
      <div className="w-1/2 mx-auto h-[400px]  flex flex-col justify-start gap-4 bg-white p-10">
        <h1 className="text-center text-2xl font-medium">Personal Details</h1>
        <div className=" mx-auto   flex flex-row items-center justify-start gap-4 w-full ">
          <div className="w-1/2  flex-col gap-4 border-r border-r-gray-600 flex items-center justify-center">
            <img
              src={user.image}
              className="w-[150px] h-[150px] rounded-full object-cover"
            />
            <input
              type="file"
              name="profile"
              id="profilePic"
              className="float-right"
            />
          </div>
          <div className="w-1/2 ml-10">
            <form
              className="w-full h-full  px-4 py-6"
              id="checkout-form"
              name="checkout"
            >
              <div className="flex flex-wrap -mx-3 mb-3 md:mb-6 md:flex-row flex-col md:justify-evenly justify-start">
                <div className="w-full md:w-1/2 px-3 ">
                  <label
                    className="block tracking-wide text-accent text-sm font-normal mb-2"
                    htmlFor="grid-name"
                  >
                    First name
                  </label>
                  <input
                    required
                    className="appearance-none block w-full bg-gray-100 text-accent border border-grabg-gray-100 rounded py-3 text-sm px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-name"
                    name="firstName"
                    disabled
                    value={user.name.split(" ")[0]}
                  />
                </div>
                <div className="w-full md:w-1/2 px-3 ">
                  <label
                    className="block tracking-wide text-accent text-sm font-normal mb-2"
                    htmlFor="grid-re-email"
                  >
                    Last name
                  </label>
                  <input
                    required
                    className="appearance-none block w-full bg-gray-100 text-accent border border-grabg-gray-100 rounded py-3 text-sm px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-name"
                    name="lastName"
                    disabled
                    value={user.name.split(" ")[1]}
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-2 mt-8">
                <div className="w-full px-3 ">
                  <label
                    className="block tracking-wide text-accent text-sm font-normal mb-2"
                    htmlFor="grid-phone"
                  >
                    Email
                  </label>
                  <input
                    required
                    className="appearance-none block w-full bg-gray-100 text-accent border border-grabg-gray-100 rounded py-3 text-sm px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-email"
                    name="email"
                    type="email"
                    disabled
                    value={user.email}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <hr />
      <div className="w-1/2 mx-auto max-h-[400px] overflow-y-scroll h-auto flex flex-col items-center justify-start gap-4 bg-white p-10 example">
        <h1 className="text-2xl text-black mb-10 font-medium">My Orders</h1>
        {order.length > 0 &&
          order.map((item) => {
            const items = item.items;
            return items.map((product, index) => (
              <div
                key={index}
                className="grid grid-cols-4  w-full border rounded-md h-[100px]  place-items-center"
              >
                <img
                  src={product.img}
                  alt="product-img"
                  className="h-[100px] w-[100px] object-contain"
                />
                <h1>{product.name}</h1>
                <div className="flex flex-col items-center justify-center">
                  <h1 className="text-lg font-medium">₹ {product.price}</h1>
                  <h1 className="text-sm text-gray-400">
                    <time datetime="2017-03-03 19:00">
                      {new Date(item.createdAt).toLocaleDateString(
                        "en-US",
                        options
                      )}
                    </time>
                  </h1>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <h1 className="text-red-500 font-medium">
                    <span className="h-2 w-2 rounded-full bg-red"></span>
                    Delivery Pending
                  </h1>
                </div>
              </div>
            ));
          })}
        {order.length == 0 && <h1>You have not placed any orders. </h1>}
      </div>
    </div>
  );
};

export default User;
