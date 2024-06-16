import axios from "axios";

const WEBLINK = "https://alora.onrender.com";
export const getItems = (id) => (dispatch) => {
  axios
    .get(`${WEBLINK}/api/products/find/${id}`)
    .then((res) =>
      dispatch({
        type: "GET_PRODUCT",
        payload: res.data,
      })
    )
    .catch((err) => console.log(err));
};

export const addItem = (item) => (dispatch) => {
  axios
    .post(`${WEBLINK}/api/products/find/62f98afd50b3e57963f436d4`, item)
    .then((res) =>
      dispatch({
        type: "ADD_PRODUCT",
        payload: res.data,
      })
    )
    .catch((err) => console.log(err));
};

export const deleteItem = (id) => (dispatch) => {
  axios
    .delete(`${WEBLINK}/api/products/:${id}`)
    .then((res) =>
      dispatch({
        type: "DELETE_PRODUCT",
        payload: id,
      })
    )
    .catch((err) => console.log(err));
};

export const updateItem = (id, item) => (dispatch) => {
  axios
    .put(`/${WEBLINK}/api/products/${id}`, item)
    .then((res) =>
      dispatch({
        type: "UPDATE_PRODUCT",
        payload: Promise.all([id, res.data]),
      })
    )
    .catch((err) => console.log(err));
};
