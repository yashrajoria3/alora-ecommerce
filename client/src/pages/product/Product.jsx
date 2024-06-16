import ReactModal from "react-modal";
import { useState, useEffect, useContext } from "react";
import ClipLoader from "react-spinners/ClipLoader";

import { addToCart } from "../../controllers/cartController";
import CartContext from "../../context/cartContext";
import AuthContext from "../../context/AuthContext";

import { useLocation } from "react-router-dom";
import axios from "axios";

import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { TbDiscountCheck } from "react-icons/tb";
import AllProductContext from "../../context/AllProductContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "react-cookie";

const WEBLINK = "https://alora.onrender.com";

const Product = () => {
  const location = useLocation();
  const currentId = location.pathname.split("/")[2];
  const { user } = useContext(AuthContext);
  const { cartDispatch } = useContext(CartContext);
  const { productList, AllProductDispatch } = useContext(AllProductContext);

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState([]);
  const [qty, setQty] = useState(1);
  const [source, setSource] = useState(null);
  const [cookies, setCookies, remove] = useCookies(["access_token"]);

  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRatingChange = (event) => {
    setRating(Number(event.target.value));
  };
  const handleWriteReview = () => {
    setIsModalOpen(true);
  };
  const handleReviewTitle = (event) => {
    setReviewTitle(event.target.value);
  };
  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };
  const handleSubmit = async () => {
    await axios
      .put(
        `${WEBLINK}/api/products/review/${currentId}/${user._id}/${cookies.access_token}`,
        {
          name: user.name,
          profile: user.image,
          title: reviewTitle,
          star: rating,
          review: review,
        }
      )
      .then((res) => {
        AllProductDispatch(
          addReview(currentId, {
            name: user.name,
            title: reviewTitle,
            profile: user.image,
            star: rating,
            review: review,
          })
        );
        setIsModalOpen(false);
        window.location.reload(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    const getProduct = async () => {
      try {
        const currentProduct = await axios.get(
          `${WEBLINK}/api/products/find/${currentId}`
        );
        // console.log(currentProduct);
        setProduct(currentProduct.data);
        setSource(currentProduct.data.coverImage);
        setLoading(true);
      } catch (err) {
        console.log(err);
      }
    };
    getProduct();
  }, [currentId]);

  const handleClick = async () => {
    if (!user) alert("Log in to add to cart!");
    if (qty > 10 || qty < 0) {
      toast.warn("Max order limit is 10 per user", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setQty(1);
    } else {
      addToCart(user._id, currentId, qty, cookies.access_token)(cartDispatch);
      toast.info(" Added to cart!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const addReview = (productId, review) => ({
    type: "ADD_REVIEW",
    payload: { productId, review },
  });

  const renderStars = (rating) => {
    const filledStarsSvg = Array(rating).fill(
      <svg
        className="w-4 h-4 text-yellow-300 mr-1"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 22 20"
      >
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
      </svg>
    );
    const emptyStarsSvg = Array(5 - rating).fill(
      <svg
        className="w-4 h-4 text-gray-300 dark:text-gray-500 mr-1"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 22 20"
      >
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
      </svg>
    );

    const allStars = [...filledStarsSvg, ...emptyStarsSvg];

    return allStars;
  };

  const options = { day: "numeric", month: "long", hour: "numeric" };
  return loading ? (
    <div className="mt-6 container mx-auto  min-h-[300px] flex flex-col items-start justify-start font-inter gap-2">
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="light"
      />

      <div className="w-full flex flex-row gap-2 p-2">
        <div className="w-1/2 h-full border border-gray-200 flex flex-col items-center">
          <img
            src={product.coverImage}
            className="object-contain w-[600px] h-[400px] "
          />
          <div className=" w-full p-2 flex flex-row items-center justify-evenly gap-10">
            {product.allImage &&
              product.allImage.map((img) => {
                return (
                  <img
                    className="w-1/3 h-[100px] object-contain cursor-pointer rounded-md"
                    src={img}
                    key={img}
                    onClick={() => {
                      setSource({ img });
                    }}
                  />
                );
              })}
          </div>
        </div>
        <div className="w-1/2 h-full flex flex-col items-center justify-evenly pl-4 gap-4 ">
          <div className="w-full  h-1/3 flex flex-col items-start justify-start ">
            <h1 className="text-accent text-2xl font-semibold">
              {product.title}
            </h1>
            <h1 className="text-accent text-base font-normal">
              Brand: {product.brand}
            </h1>
            <h1 className="text-accent text-sm font-normal">
              {product.rating.toFixed(2)} Ratings
            </h1>
            <h1 className="text-2xl font-semibold mt-4 ">₹ {product.price}</h1>
            <hr className="w-full text-gray-200 mt-4 mx-auto" />
            <div className="flex flex-row items-center justify-start w-fit h-20  p-2 gap-4 ">
              <div className="flex flex-row items-center justify-center  rounded-md border border-gray-200 w-fit p-2 h-10  ">
                <AiOutlineMinus
                  className="h-6 w-6 text-gray-300 hover:text-accent cursor-pointer"
                  onClick={() => {
                    if (qty > 1) setQty(qty - 1);
                  }}
                />
                <span className="h-6 w-6 text-center">{qty}</span>
                <AiOutlinePlus
                  className="h-6 w-6 text-gray-300 hover:text-accent cursor-pointer"
                  onClick={() => {
                    setQty(qty + 1);
                  }}
                />
              </div>
              <button
                className="bg-accent text-white text-md py-2 px-4 rounded-md"
                onClick={handleClick}
              >
                Add to cart
              </button>
            </div>
            <div className="w-full h-auto  text-base text-justify">
              {product.desc}
            </div>
          </div>

          {product.offers.length > 0 && (
            <div className="w-full h-1/3  flex flex-col items-start justify-start ">
              <div className="flex flex-row items-center text-md font-normal gap-2">
                <TbDiscountCheck />
                <h1>Best offers</h1>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm font-normal mt-4">
                {product.offers.map((offer, idx) => {
                  return (
                    <span
                      className="p-2 border border-black rounded-md max-w-xs max-h-fit"
                      key={idx}
                    >
                      <p className="font-bold text-sm">{offer.offerType}</p>
                      <p className="font-normal text-md">{offer.offerDesc}</p>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full flex flex-col gap-2 p-2 ">
        <div className="mb-10">
          <button
            onClick={handleWriteReview}
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
          >
            Write a review
          </button>

          <ReactModal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel="Write a Review"
            className="flex flex-col justify-evenly bg-white font-inter"
            style={{
              overlay: {
                backgroundColor: "rgba(255,255,255,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
              content: {
                position: "relative",
                top: "auto",
                left: "auto",
                right: "auto",
                bottom: "auto",
                height: "300px",
                width: "500px",
                padding: "20px",
                borderRadius: "4px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
              },
            }}
          >
            <button
              className="modal-close float-right  text-red-500"
              onClick={() => setIsModalOpen(false)}
              style={{
                fontSize: "28px",
                position: "absolute",
                top: "2px",
                right: "10px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              &times;
            </button>

            <h3 className="text-2xl text-blue-800 text-left font-bold mb-5">
              Write a Review
            </h3>
            <div className="flex flex-col justify-around">
              <div className="flex flex-row items-center gap-2">
                <h1 className="text-base font-medium text-black ">
                  Rate the Product:
                </h1>
                <select
                  value={rating}
                  onChange={handleRatingChange}
                  required
                  className="w-fit border "
                  placeholder="Select the rating"
                >
                  <option value="1">1 star</option>
                  <option value="2">2 stars</option>
                  <option value="3">3 stars</option>
                  <option value="4">4 stars</option>
                  <option value="5">5 stars</option>
                </select>
              </div>
            </div>
            <div className="w-2/3 space-y-2">
              <h1 className=" text-base font-medium">Review</h1>
              <input
                type="text"
                name="title"
                className="bg-gray-200 w-full"
                placeholder="Enter the title"
                required
                value={reviewTitle}
                onChange={handleReviewTitle}
              />
              <textarea
                value={review}
                onChange={handleReviewChange}
                required
                placeholder="Write your review here"
                className="bg-gray-200 w-full"
              ></textarea>
            </div>
            <button
              className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 mt-2 flex items-center justify-center gap-2 "
              onClick={handleSubmit}
            >
              Submit
            </button>
          </ReactModal>
          {product.reviews.length == 0 && (
            <h1 className="text-base  font-medium my-2">
              Be the first one to review this product
            </h1>
          )}
        </div>

        {product.reviews.length > 0 && (
          <div className="w-full h-[300px] flex flex-col md:flex-row items-start justify-around ">
            <div className="w-1/2 ">
              <div className="flex items-center mb-2">
                {renderStars(Number(product.rating.toFixed(0)))}
                <p className="ml-2 text-sm font-medium text-gray-900 ">
                  {`${product.rating.toFixed(0)} out of 5`}
                </p>
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total {product.reviews.length} reviews
              </p>
              <div className="flex items-center mt-4">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  5 star
                </a>
                <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded ">
                  <div
                    className="h-5 bg-yellow-300 rounded"
                    style={{
                      width: `  ${
                        (
                          Number(product.numReviews[5]) /
                          Number(product.reviews.length)
                        ).toFixed(2) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {(
                    Number(product.numReviews[5]) /
                    Number(product.reviews.length)
                  ).toFixed(2) * 100}
                  %
                </span>
              </div>
              <div className="flex items-center mt-4">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  4 star
                </a>
                <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded ">
                  <div
                    className="h-5 bg-yellow-300 rounded"
                    style={{
                      width: `  ${
                        (
                          Number(product.numReviews[4]) /
                          Number(product.reviews.length)
                        ).toFixed(2) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {(
                    Number(product.numReviews[4]) /
                    Number(product.reviews.length)
                  ).toFixed(2) * 100}
                  %
                </span>
              </div>
              <div className="flex items-center mt-4">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  3 star
                </a>

                <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded ">
                  <div
                    className="h-5 bg-yellow-300 rounded"
                    style={{
                      width: `  ${
                        (
                          Number(product.numReviews[3]) /
                          Number(product.reviews.length)
                        ).toFixed(2) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {(
                    Number(product.numReviews[3]) /
                    Number(product.reviews.length)
                  ).toFixed(2) * 100}
                  %
                </span>
              </div>
              <div className="flex items-center mt-4">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  2 star
                </a>
                <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded ">
                  <div
                    className="h-5 bg-yellow-300 rounded"
                    style={{
                      width: `  ${
                        (
                          Number(product.numReviews[2]) /
                          Number(product.reviews.length)
                        ).toFixed(2) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {(
                    Number(product.numReviews[2]) /
                    Number(product.reviews.length)
                  ).toFixed(2) * 100}
                  %
                </span>
              </div>
              <div className="flex items-center mt-4">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  1 star
                </a>
                <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded ">
                  <div
                    className="h-5 bg-yellow-300 rounded"
                    style={{
                      width: `  ${
                        (
                          Number(product.numReviews[1]) /
                          Number(product.reviews.length)
                        ).toFixed(2) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {(
                    Number(product.numReviews[1]) /
                    Number(product.reviews.length)
                  ).toFixed(2) * 100}
                  %
                </span>
              </div>
            </div>
            <div className="w-1/2 overflow-y-scroll max-h-[300px]  py-2 flex flex-col  gap-2 border border-gray-200 rounded-md p-2">
              {product.reviews
                .slice(0)
                .reverse()
                .map((item) => {
                  return (
                    <div className="w-full h-auto ">
                      <article>
                        <div className="flex items-center mb-4 space-x-4">
                          <img
                            className="w-10 h-10 rounded-full"
                            src={item.profile}
                            alt="profile picture"
                          />
                          <div className="space-y-1 font-medium ">
                            <p>{item.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center mb-1">
                          {renderStars(item.star)}
                          <h3 className="ml-2 text-sm font-semibold text-gray-900 ">
                            {item.title}
                          </h3>
                        </div>
                        <footer className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                          <p>
                            Reviewed on &nbsp;
                            <time datetime="2017-03-03 19:00">
                              {new Date(item.createdAt).toLocaleDateString(
                                "en-US",
                                options
                              )}
                            </time>
                          </p>
                        </footer>
                        <p className="mb-2 text-gray-500 dark:text-gray-400">
                          {item.review}
                        </p>
                        <hr className="mb-2" />
                      </article>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="w-full h-[200px] flex items-center justify-center">
      <ClipLoader color="#2f4b68" />
    </div>
  );
};

export default Product;
