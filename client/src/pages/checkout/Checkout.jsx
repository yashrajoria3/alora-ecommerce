import React, { useContext, useState } from "react";
import CartContext from "../../context/cartContext";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import { useCookies } from "react-cookie";
import "./styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WEBLINK = "https://alora.onrender.com";

// const stripeKey ="pk_test_51LYVLbSAyvMVxYE2WSZasSLU9snSJwJq1HFWGh6mWtdZHg0KqnHBmQKmXwd8t6EhTpLUOpsXnpFx6aWGhqEPzCGp000DQEVv6x";
const Checkout = () => {
  const { cart, cartDispatch } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);

  const [address, setAddress] = useState({
    country: "India",
    name: "",
    email: "",
    confirmEmail: "",
    phone: "",
    streetAddress: "",
    city: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  // const handleInputChange = (e) => {
  //   setAddress((prevState) => ({
  //     ...prevState,
  //     [e.target.name]: e.target.value,
  //   }));
  // };

  // const tokenHandler = async () => {
  //   try {
  //     const res = axios.delete(`${WEBLINK}/api/cart/${user._id}`);
  //     cartDispatch({ type: "CLEAR_CART" });
  //     localStorage.removeItem("cart");
  //     await axios.post(`${WEBLINK}/api/order`, {
  //       userId: user._id,
  //       products: cart.items,
  //       total: cart.total,
  //       shippingAddress: address,
  //     });
  //     navigate("/order/success");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const handleClick = async () => {
    if (validateForm()) {
      try {
        await axios
          .post(`${WEBLINK}/api/stripe/checkout`, {
            items: Object.entries(cart.items).map(
              ([_, { quantity, name, productId, img, price }]) => ({
                price_data: {
                  currency: "INR",
                  product_data: {
                    name: name,
                    images: [img],
                    metadata: { productId: productId },
                  },
                  unit_amount: Number(price),
                },
                quantity: Number(quantity),
                // tax_rates: ["txr_1NFXChSHS6cBSQ8V3ta64dXl"],
              })
            ),
          })
          .then(async (response) => {
            await axios.post(
              `${WEBLINK}/api/order/${user._id}/${cookies.access_token}`,
              {
                userId: user._id,
                items: cart.items,
                shippingAddress: {
                  address: address.streetAddress,
                  country: address.country,
                  city: address.city,
                },
                total: cart.total,
                paymentMode: "card",
              }
            );

            await axios.delete(
              `${WEBLINK}/api/cart/${user._id}/${cookies.access_token}`
            );
            cartDispatch({ type: "CLEAR_CART" });
            localStorage.removeItem("cart");
            return response.data;
          })
          .then((response) => {
            if (response.url) {
              window.location.assign(response.url);
            }
          });
      } catch (err) {
        console.log(err);
      }
    } else {
      toast.error(
        "Please fill in all required fields to continue for checkout.",
        { position: toast.POSITION.TOP_CENTER }
      );
    }
  };

  const validateForm = () => {
    const { country, name, email, confirmEmail, phone, streetAddress, city } =
      address;

    // Check if any required field is empty
    if (
      country.trim() === "" ||
      name.trim() === "" ||
      email.trim() === "" ||
      confirmEmail.trim() === "" ||
      phone.trim() === "" ||
      streetAddress.trim() === "" ||
      city.trim() === ""
    ) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }

    if (email !== confirmEmail) {
      return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return false;
    }

    return true;
  };

  return (
    <div className=" mx-auto w-full  md:container px-6 font-inter flex flex-col md:justify-start justify-center gap-4 py-2">
      <div className="container mt-10 ">
        Cart {">"} <span className="text-accent font-medium">Checkout</span>{" "}
        {">"} Payment
      </div>
      <div className=" container w-full flex md:flex-row flex-col items-start md:justify-evenly justify-center gap-2">
        <div className=" border border-gray-400 md:w-2/3 w-full rounded-md">
          <form
            className="w-full h-full  px-4 py-6"
            id="checkout-form"
            name="checkout"
          >
            <div className="flex flex-wrap -mx-3 mb-3 md:mb-6">
              <div className="w-full px-3">
                <label
                  className="block tracking-wide text-accent text-base font-bold mb-2"
                  htmlFor="grid-name"
                >
                  Select Shipping Country
                </label>
                <select
                  id="country"
                  name="country"
                  required
                  value={address.country}
                  onChange={handleInputChange}
                  className=" block w-full bg-gray-100 text-accent border border-grabg-gray-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="Dubai">Dubai</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
            </div>
            <hr className="mb-3" />
            <div className="flex flex-wrap -mx-3 mb-3 md:mb-6">
              <h1 className="block tracking-wide text-accent text-base font-bold mb-4 px-3">
                Shipping Address
              </h1>
              <div className="w-full px-3">
                <label
                  className="block tracking-wide text-accent text-sm font-normal mb-2"
                  htmlFor="grid-city"
                >
                  Full Name *
                </label>
                <input
                  required
                  onChange={handleInputChange}
                  className="appearance-none block w-full bg-gray-100 text-accent border border-grabg-gray-100 rounded py-3 text-sm px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-email"
                  name="name"
                  type="name"
                  placeholder="Enter your full name"
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-3 md:mb-6 md:flex-row flex-col md:justify-evenly justify-start">
              <div className="w-full md:w-1/2 px-3 ">
                <label
                  className="block tracking-wide text-accent text-sm font-normal mb-2"
                  htmlFor="grid-email"
                >
                  Email address *
                </label>
                <input
                  required
                  onChange={handleInputChange}
                  className="appearance-none block w-full bg-gray-100 text-accent border border-grabg-gray-100 rounded py-3 text-sm px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-email"
                  name="email"
                  type="email"
                  placeholder="Your email address"
                />
              </div>
              <div className="w-full md:w-1/2 px-3 ">
                <label
                  className="block tracking-wide text-accent text-sm font-normal mb-2"
                  htmlFor="grid-re-email"
                >
                  Confirmation Email *
                </label>
                <input
                  required
                  onChange={handleInputChange}
                  className="appearance-none block w-full bg-gray-100 text-accent border border-grabg-gray-100 rounded py-3 text-sm px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-re-email"
                  name="confirmEmail"
                  type="re-email"
                  placeholder="Enter your confirmation email"
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-2 mt-8">
              <div className="w-full px-3 ">
                <label
                  className="block tracking-wide text-accent text-sm font-normal mb-2"
                  htmlFor="grid-phone"
                >
                  Phone number *
                </label>
                <input
                  required
                  onChange={handleInputChange}
                  className="appearance-none block w-full bg-gray-100 text-accent border border-grabg-gray-100 rounded py-3 text-sm px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-phone"
                  name="phone"
                  type="phone"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-2 mt-8">
              <div className="w-full px-3 ">
                <label
                  className="block tracking-wide text-accent text-sm font-normal mb-2"
                  htmlFor="grid-streetAddress"
                >
                  Street name and house number *
                </label>
                <input
                  required
                  onChange={handleInputChange}
                  className="appearance-none block w-full bg-gray-100 text-accent border border-grabg-gray-100 rounded py-3 text-sm px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-streetAddress"
                  name="streetAddress"
                  type="streetAddress"
                  placeholder="Enter your street name and house number"
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3  mt-8">
              <div className="w-full px-3 ">
                <label
                  className="block tracking-wide text-accent text-sm font-normal mb-2"
                  htmlFor="grid-city"
                >
                  City *
                </label>
                <input
                  required
                  onChange={handleInputChange}
                  className="appearance-none block w-full bg-gray-100 text-accent border border-grabg-gray-100 rounded py-3 text-sm px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-city"
                  name="city"
                  type="city"
                  placeholder="City"
                />
              </div>
            </div>
          </form>
        </div>
        <div className="border border-gray-400 w-full md:w-1/3 rounded-md">
          <div className="flex flex-col items-center justify-start p-4">
            <div className="w-full gap-2">
              <h1 className="text-accent text-xl font-[600] mb-3">
                Your order
              </h1>
              <div className="w-full h-auto max-h-[200px]  p-2 flex flex-col overflow-y-scroll">
                {cart.items.map((item, idx) => {
                  return (
                    <div
                      className="w-full h-[100px] flex flex-row items-start justify-around p-2"
                      key={idx}
                    >
                      <div className="w-1/3">
                        <img
                          src={item.img}
                          key={idx}
                          alt={`${idx} iamge`}
                          className="h-24 w-24"
                        />
                      </div>
                      <div className="w-2/3 flex flex-col items-start justify-start gap-3">
                        <div className="flex flex-row items-center justify-between w-full">
                          <h1>{item.name.substring(0, 14)} ..</h1>
                          <h1>₹{item.price}</h1>
                        </div>
                        <span>x {item.quantity}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <hr className="my-3" />
              <div className=" w-full flex flex-col items-start justify-start rounded-md  gap-4 p-4">
                <div className="w-full flex flex-row items-center justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-medium">₹{cart.total}</span>
                </div>
                <div className="w-full flex flex-row items-center justify-between">
                  <span className="text-gray-400">Discount</span>
                  <span className="text-gray-400">₹{0}</span>
                </div>
                <hr className="w-[95%] text-gray-100 mx-auto" />
                <div className="w-full flex flex-row items-center justify-between font-accent">
                  <span className="font-normal">Grand total</span>
                  <span className="font-medium text-2xl">₹{cart.total}</span>
                </div>

                <div className="w-full">
                  {/* <StripeCheckout
                    amount={cart.total}
                    token={tokenHandler}
                    stripeKey={stripeKey}
                    currency="INR"
                    // className="w-full"
                  > */}
                  <button
                    className="w-full py-2 px-3 bg-accent rounded-md text-white "
                    onClick={handleClick}
                  >
                    Continue to payment
                  </button>
                  {/* </StripeCheckout> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
export default Checkout;
