import types from "../constants";
import { getAvionDBCollection } from "../../utils";

const multiAddr = window.location.search.split("=").pop();
const options = multiAddr === "" ? null : { multiAddr: multiAddr };

export const addTodoItem = (payload) => async (dispatch) => {
  const collection = await (await getAvionDBCollection(options)).collection;
  await collection.insert([payload]);
  dispatch({
    type: types.ADD_TODO,
    payload: payload,
  });
};

export const getTodoList = () => async (dispatch) => {
  const { collection, ipfs } = await getAvionDBCollection(options);
  const id = await ipfs.id();
  const todos = await collection.find({});
  //console.log("TODOs: ", todos);
  dispatch({
    type: types.GET_TODOS,
    payload: todos,
    id: id.id,
  });
};

export const refreshTodoList = () => async (dispatch) => {
  const { collection, ipfs } = await getAvionDBCollection(options);
  const id = await ipfs.id();
  const todos = await collection.find({});
  console.log("TODOs: ", todos);
  dispatch({
    type: types.REFRESH_TODOS,
    payload: todos,
    addedInterval: true,
  });
};

export const getDatabaseAddress = () => async (dispatch) => {
  const ipfs = await (await getAvionDBCollection(options)).ipfs;
  const id = await ipfs.id();
  dispatch({
    type: types.GET_DB_ADDR,
    payload: id.id,
  });
};

export const updateTodoItem = (payload) => async (dispatch) => {
  const collection = await (await getAvionDBCollection(options)).collection;
  await collection.findOneAndUpdate(
    {
      id: payload.id,
    },
    {
      $set: { isDone: payload.isDone },
    }
  );
  const todos = await collection.find({});
  dispatch({
    type: types.UPDATE_TODOS,
    payload: todos,
  });
};
