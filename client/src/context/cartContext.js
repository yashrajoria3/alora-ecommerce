import { createContext, useEffect, useReducer } from "react";

const INITIAL_STATE = {
  cart: JSON.parse(localStorage.getItem("cart")) || null,
};

const CartContext = createContext(INITIAL_STATE);
export default CartContext;

export const CartReducer = (state, action) => {
  switch (action.type) {
    case "GET_CART":
      return {
        ...state,
        cart: action.payload,
      };

    case "ADD_TO_CART":
      return {
        ...state,
        cart: action.payload,
      };

    case "DELETE_FROM_CART":
      return {
        cart: action.payload,
      };
    case "CLEAR_CART":
      return {
        cart: null,
      };

    default:
      return state;
  }
};

export const CartContextProvider = ({ children }) => {
  const [state, cartDispatch] = useReducer(CartReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  return (
    <CartContext.Provider
      value={{ cartDispatch, cart: state.cart, loading: state.loading }}
    >
      {children}
    </CartContext.Provider>
  );
};
