import { createContext, useEffect, useReducer } from "react";

const INITIAL_STATE = {
  productList: JSON.parse(localStorage.getItem("productList") || null),
};

const AllProductContext = createContext(INITIAL_STATE);
export default AllProductContext;

const AllProductReducer = (state, action) => {
  switch (action.type) {
    case "GET_LIST":
      return { productList: action.payload };
    case "ADD_REVIEW":
      const updatedProductList = state.productList.map((product) => {
        if (product._id === action.payload.productId) {
          return {
            ...product,
            reviews: [...product.reviews, action.payload.review],
          };
        }
        return product;
      });
      return { productList: updatedProductList };

    default:
      return state;
  }
};

export const AllProductContextProvider = ({ children }) => {
  const [state, AllProductDispatch] = useReducer(
    AllProductReducer,
    INITIAL_STATE
  );

  useEffect(() => {
    localStorage.setItem("productList", JSON.stringify(state.productList));
  }, state.productList);

  return (
    <AllProductContext.Provider
      value={{ productList: state.productList, AllProductDispatch }}
    >
      {children}
    </AllProductContext.Provider>
  );
};
