import axios from "axios";
import { Link } from "react-router-dom";
import { BsTrash } from "react-icons/bs";
import { useState, useEffect, useContext } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineMinus } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CartContext from "../../context/cartContext";
import AuthContext from "../../context/AuthContext";
import AllProductContext from "../../context/AllProductContext";
import {
  addToCart,
  deleteFromCart,
  updateCart,
} from "../../controllers/cartController";
import empty from "../../assets/image/empty.png";
import { useCookies } from "react-cookie";

const WEBLINK = "https://alora.onrender.com";

const Cart = () => {
  const navigate = useNavigate();

  const { productList } = useContext(AllProductContext);
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
  const { cart, cartDispatch } = useContext(CartContext);
  const { user, dispatch } = useContext(AuthContext);

  const [selectedProducts, setSelectedProducts] = useState([]);

  if (!user) navigate("/login");

  useEffect(() => {
    const getCart = async (userId) => {
      try {
        const res = await axios.get(
          `${WEBLINK}/api/cart/find/${userId}/${cookies.access_token}`
        );
        cartDispatch({ type: "GET_CART", payload: res.data });
      } catch (err) {
        console.log(err);
      }
    };
    if (!cart) getCart(user._id);
  }, []);

  const handleDelete = (id) => {
    deleteFromCart(user._id, id, cookies.access_token)(cartDispatch);
  };
  const handleDeleteSelected = () => {
    if (selectedProducts) {
      selectedProducts.map((id) => {
        deleteFromCart(user._id, id, cookies.access_token)(cartDispatch);
      });
      setSelectedProducts([]);
    }
  };

  const handleProductSelect = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  // const changeQty = (productId, operator) => {};

  // const currentId = location.pathname.split("/")[2];

  return !cart || !cart.items || cart.items.length == 0 ? (
    <div className="w-full mx-auto container h-[50vh]  flex flex-col items-center justify-center ">
      <img src={empty} alt="cart empty" className="h-[200px] w-[200px]" />
      <h1 className="text-lg text-accent font-inter">Cart is empty</h1>
      <h1 className="text-sm text-accent font-inter">
        Please add a few items.
      </h1>
    </div>
  ) : (
    <div className="mt-4  mx-auto w-full flex flex-col md:flex-row items-start gap-2  px-2 md:px-4 py-10 md:container font-inter">
      <div className="md:flex flex-col items-start justify-between md:w-[70%] pr-4 gap-4">
        <div className=" mx-auto w-[90%] flex flex-row items-center justify-between px-2">
          <h1 className="text-accent text-3xl font-inter font-medium">Cart</h1>
          <span
            className="flex items-center text-sm gap-2 cursor-pointer"
            onClick={() => {
              handleDeleteSelected();
            }}
          >
            <BsTrash />
            <h1>Remove</h1>
          </span>
        </div>
        <div className="w-full ">
          <table className=" mx-auto w-[90%]  border-spacing-y-4 border-collapse ">
            <tbody>
              <tr className="w-full border-b border-b-gray-200">
                <th className="w-[10%] ">
                  <div className="w-full h-full  flex flex-col items-center justify-center">
                    <input
                      type="checkbox"
                      name="select-all"
                      id="all"
                      disabled
                      className="text-sm border border-accentDark"
                    />
                  </div>
                </th>
                <th className="w-[50%] font-medium text-gray-400 text-left uppercase">
                  Product
                </th>
                <th className="w-[20%] font-medium text-gray-400 text-center  uppercase">
                  Quantity
                </th>
                <th className="w-[20%] font-medium text-gray-400 text-right uppercase ">
                  Price
                </th>
              </tr>
              {cart.items.map((product) => {
                return (
                  <tr
                    className="w-full p-4 border-b border-b-gray-200"
                    key={product.productId}
                  >
                    <td className=" w-[10%] ">
                      <div className="w-full h-full  flex flex-col items-center justify-center">
                        <input
                          type="checkbox"
                          name="select-all"
                          id={product.productId}
                          defaultChecked={selectedProducts.includes(
                            product.productId
                          )}
                          className="text-sm"
                          onClick={() => {
                            handleProductSelect(product.productId);
                          }}
                        />
                      </div>
                    </td>
                    <td className=" w-[50%] font-medium  ">
                      <Link to={`/product/${product.productId}`}>
                        <div className="flex flex-row items-center justify-start gap-4">
                          <img
                            src={product.img}
                            alt="image"
                            className="w-[80px] h-[80px] object-contain rounded-md"
                          />
                          <h1 className="w-1/2 text-sm leading-tight font-left ">
                            {product.name}
                          </h1>
                        </div>
                      </Link>
                    </td>
                    <td className="w-[20%] ">
                      <div className="h-full w-full  flex flex-col items-center justify-center gap-2 ">
                        <div className="flex  rounded-md border border-gray-200 h-fit w-fit p-2">
                          {/* <AiOutlineMinus
                            className="h-6 w-6 text-gray-300 hover:text-accent cursor-pointer"
                            id={product.productId}
                          /> */}
                          <span className="h-6 w-6 text-center text-neutral-500 ">
                            {product.quantity}
                          </span>
                          {/* <AiOutlinePlus
                            className="h-6 w-6 text-gray-300 hover:text-accent cursor-pointer"
                            id={product.productId}
                          /> */}
                        </div>
                        <span
                          className="flex items-center text-xs gap-2 cursor-pointer"
                          onClick={() => {
                            handleDelete(product.productId);
                          }}
                        >
                          <BsTrash />
                          <h1>Remove</h1>
                        </span>
                      </div>
                    </td>
                    <td className="text-right w-[20%] font-medium">
                      ₹{product.price}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className=" md:w-[30%] flex flex-col items-start justify-start rounded-md border border-gray-100 gap-4 p-4">
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
        <button
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 mt-2 flex items-center justify-center gap-2 "
          onClick={() => {
            navigate("/checkout");
          }}
        >
          Checkout now
        </button>
      </div>
    </div>
  );
};

export default Cart;
