import { BsCartPlus } from "react-icons/bs";
import { AiOutlineLeft } from "react-icons/ai";
import { AiOutlineRight } from "react-icons/ai";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AllProductContext from "../../context/AllProductContext";
import { addToCart } from "../../controllers/cartController";
import AuthContext from "../../context/AuthContext";
import CartContext from "../../context/cartContext";
import { PiShoppingCartThin } from "react-icons/pi";
import { useCookies } from "react-cookie";

const WEBLINK = "https://alora.onrender.com";

const Featured = () => {
  const { user } = useContext(AuthContext);
  const { cart, cartDispatch } = useContext(CartContext);
  const [product, setProduct] = useState([]);
  const [qty, setQty] = useState([]);
  const [loading, setLoading] = useState(false);
  const { productList, AllProductDispatch } = useContext(AllProductContext);

  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
  // console.log("", localStorage.getItem("asdsad"));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        await axios.get(`${WEBLINK}/api/products/`).then((data) => {
          setProduct(data.data);
          setLoading(true);
          AllProductDispatch({ type: "GET_LIST", payload: data.data });
          return data.data;
        });

        // console.log("fetched data is:", fetchedProducts);
      } catch (err) {
        console.log(err);
      }
    };
    // console.log(productList);
    if (!productList) {
      // console.log("asdasd");
      fetchProduct();
    } else {
      setLoading(true);
      setProduct(productList);
    }
    // else product=
    // console.log(product);
  }, []);

  // if (!productList) AllProductDispatch({ type: "GET_LIST", payload: product });
  const handleClick = (id) => {
    addToCart(user._id, id, 1, cookies.access_token)(cartDispatch);
  };

  return loading ? (
    <div className=" mx-auto w-full flex flex-col md:container px-2 md:px-4  h-auto py-10 gap-4">
      <div className="w-full md:flex justify-between">
        <h1 className="text-accent text-3xl font-inter font-bold">
          Featured products
        </h1>
      </div>
      <div className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 justify-items-center justify-center gap-y-6 gap-x-12 mt-10 mb-5">
        {/* <div className="flex w-full   overflow-x-scroll scrollbar-hide gap-2 md:gap-2 "> */}
        {product.map((item, idx) => (
          <div className="w-80 bg-white shadow rounded" key={idx}>
            <Link to={`/product/${item._id}`}>
              <div
                className="h-48 w-full  flex flex-col justify-between p-4 bg-contain bg-no-repeat bg-center"
                style={{ backgroundImage: `url(${item.coverImage})` }}
              >
                <div className="flex justify-between">
                  <button className="text-white hover:text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
                <div>
                  <span className="uppercase text-xs bg-green-50 p-0.5 border-green-500 border rounded text-green-700 font-medium select-none">
                    available
                  </span>
                </div>
              </div>
            </Link>
            <div className="p-4 flex flex-col items-center">
              <Link to={`/product/${item._id}`}>
                <p className="text-gray-400 font-light text-xs text-center">
                  {item.brand}
                </p>
                <h1 className="text-gray-800 text-center mt-1">
                  {item.title.substring(0, 30)}...
                </h1>
                <p className="text-center text-gray-800 mt-1">₹{item.price}</p>
                {/* <div className="inline-flex items-center mt-2">
                <button className="bg-white rounded-l border text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <div className="bg-gray-100 border-t border-b border-gray-100 text-gray-600 hover:bg-gray-100 inline-flex items-center px-4 py-1 select-none">
                  {qty.productId}
                </div>
                <button className="bg-white rounded-r border text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div> */}
              </Link>
              <button
                className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 mt-4 w-full flex items-center justify-center gap-2"
                onClick={() => {
                  handleClick(item._id);
                }}
              >
                Add to Cart
                <PiShoppingCartThin />
              </button>
            </div>
          </div>

          /* <div
            key={item.id}
            className="flex-none   py-2 h-fit rounded-lg  pl-0  "
          >
            <Link
              to={`/product/${item._id}`}
              style={{ textDecoration: "none" }}
            >
              <img
                src={item.coverImage}
                alt={item.brand}
                className="object-cover md:object-contain h-[250px] w-[350px] mx-auto  "
              />
              <div className="flex flex-row items-center  mx-auto   h-auto justify-between  md:w-2/3 md:px-1">
                <div>
                  <h1 className="text-sm mt-2 p-1 ">{item.title}</h1>
                  <p className="font-medium">₹ {item.price}</p>
                </div>
                <div className="w-fit">
                  <BsCartPlus
                    className="h-8 w-8 text-white bg-accent rounded-md p-[8px] cursor-pointer"
                    onClick={() => {
                      handleClick(item._id);
                    }}
                  />
                </div>
              </div>
            </Link>
          </div> */
        ))}
      </div>
    </div>
  ) : (
    <div className=" ">
      <ClipLoader color="#2f4b68" />
    </div>
  );
};

export default Featured;
