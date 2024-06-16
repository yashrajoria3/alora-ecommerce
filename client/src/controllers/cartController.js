import axios from "axios";
import { useContext } from "react";
import CartContext from "../context/cartContext";

import { useCookies } from "react-cookie";

// const WEBLINK = "http://localhost:800/";
const WEBLINK = "https://alora.onrender.com/";

export const getCart = (id, token) => (dispatch) => {
  axios
    .get(`${WEBLINK}api/cart/${id}/${token}`)
    .then((res) =>
      dispatch({
        type: "GET_CART",
        payload: res.data,
      })
    )
    .catch((err) => console.log(err));
};

export const updateCart = (userId, productId, qty, token) => (dispatch) => {
  axios
    .put(`${WEBLINK}api/cart/${userId}/${token}`, {
      productId,
      qty,
    })
    .then((res) =>
      dispatch({
        type: "GET_CART",
        payload: res.data,
      })
    )
    .catch((err) => {
      console.log("Error in update cart:", err);
    });
};

export const addToCart = (id, productId, quantity, token) => (dispatch) => {
  axios
    .post(`${WEBLINK}api/cart/${id}/${token}`, {
      productId,
      quantity,
    })
    .then((res) =>
      dispatch({
        type: "ADD_TO_CART",
        payload: res.data,
      })
    )
    .catch((err) => console.log(err));
};

export const deleteFromCart = (userId, itemId, token) => (dispatch) => {
  axios
    .delete(`${WEBLINK}api/cart/${userId}/${itemId}/${token}`)
    .then((res) =>
      dispatch({
        type: "DELETE_FROM_CART",
        payload: res.data,
      })
    )
    .catch((err) => console.log(err));
};
