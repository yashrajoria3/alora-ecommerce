import { createContext, useReducer } from "react";

const INITIAL_STATE = {
  products: [],
};

const ProductContext = createContext(INITIAL_STATE);
export default ProductContext;

const ProductReducer = (state, action) => {
  switch (action.type) {
    case "GET_PRODUCT":
      return { ...state, products: action.payload };
    case "ADD_PRODUCT":
      return {
        ...state,
        products: [action.payload, ...state.products],
      };
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((item) => item._id !== action.payload),
      };
    case "UPDATE_PRODUCT":
      const { id, data } = action.payload;
      return {
        ...state,
        products: state.products.map((item) => {
          if (item._id === id) {
            item = data;
          }
        }),
      };
    default:
      return state;
  }
};

export const ProductContextProvider = ({ children }) => {
  const [state, productDispatch] = useReducer(ProductReducer, INITIAL_STATE);

  return (
    <ProductContext.Provider value={(productDispatch, state.products)}>
      {children}
    </ProductContext.Provider>
  );
};
