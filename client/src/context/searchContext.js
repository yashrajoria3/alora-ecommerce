import { createContext, useReducer } from "react";

const INITIAL_STATE = {
  tag: null,
};

const SearchContext = createContext(INITIAL_STATE);
export default SearchContext;

const SearchReducer = (state, action) => {
  switch (action.type) {
    case "NEW_SEARCH":
      return {
        tag: action.payload,
      };
    case "RESET_SEARCH":
      return INITIAL_STATE;
    default:
      return state;
  }
};

export const SearchContextProvider = ({ children }) => {
  const [state, SearchDispatch] = useReducer(SearchReducer, INITIAL_STATE);

  return (
    <SearchContext.Provider value={{ tag: state.tag, SearchDispatch }}>
      {children}
    </SearchContext.Provider>
  );
};
