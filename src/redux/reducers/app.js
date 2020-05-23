import types from "../constants";

const initialState = {
  user: {},
  todoList: [],
  loaded: false,
  address: null,
  addedInterval: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN:
      return { ...state, user: action.payload };
    case types.SIGNUP:
      return { ...state, user: action.payload };
    case types.ADD_TODO:
      return { ...state, todoList: [...state.todoList, action.payload] };
    case types.GET_TODOS:
      return {
        ...state,
        todoList: [...state.todoList, ...action.payload],
        address: action.id,
        loaded: true,
      };
    case types.REFRESH_TODOS:
      return {
        ...state,
        todoList: [...action.payload],
        addedInterval: true,
      };
    case types.GET_DB_ADDR:
      return {
        ...state,
        address: action.payload,
      };
    case types.UPDATE_TODOS:
      return {
        ...state,
        todoList: action.payload,
      };
    default:
      return state;
  }
};
