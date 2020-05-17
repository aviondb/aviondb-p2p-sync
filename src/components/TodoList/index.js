import React, { Fragment } from "react";
import {
  addTodoItem,
  getTodoList,
  updateTodoItem,
  getDatabaseAddress,
} from "../../redux/actions/todolist";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import Loader from "../../assets/loading.gif";
import TodoItem from "./todoItem";
const QRCode = require("qrcode.react");

function TodoList(props) {
  const {
    addTodoItem,
    getTodoList,
    updateTodoItem,
    getDatabaseAddress,
    user,
    todoList,
    loaded,
    address,
  } = props;
  /*const history = useHistory();
   if (!user.email) {
    history.push("/signup");
  } */

  if (!loaded) {
    getTodoList();
  }

  return (
    <Fragment>
      <center>
        <div className="form-inline" style={{ marginTop: "2rem" }}>
          <div className="form-group mx-sm-3 mb-2">
            <input
              type="text"
              className="form-control"
              id="todo"
              placeholder="Enter Todo"
            />
            <br />
            <br />
            <button
              className="btn btn-primary mb-2"
              onClick={() => {
                addTodoItem({
                  id: Math.random().toString().substr(2, 4),
                  todo: document.getElementById("todo").value,
                  isDone: false,
                });
                document.getElementById("todo").value = "";
              }}
            >
              Add Todo
            </button>
          </div>
        </div>
        <br />
        <br />
        <br />
        {address ? (
          <Fragment>
            <QRCode
              value={`${window.location.origin}/sync?multiAddr=/p2p-circuit/ipfs/${address}`}
            />
            <h4>OR</h4>
            <a
              target="_blank"
              href={`${window.location.origin}/sync?multiAddr=/p2p-circuit/ipfs/${address}`}
            >
              Use sync link
            </a>
          </Fragment>
        ) : (
          <img src={Loader} width="100px" />
        )}
        <br />
        <br />
        <div className="card" style={{ width: "18rem" }}>
          <ul className="list-group list-group-flush">
            <TodoItem todos={todoList} updateTodoItem={updateTodoItem} />
          </ul>
        </div>
      </center>
    </Fragment>
  );
}

const mapStateToProps = (state) => ({
  user: state.app.user,
  todoList: state.app.todoList,
  loaded: state.app.loaded,
  address: state.app.address,
});

const mapDispatchToProps = (dispatch) => ({
  addTodoItem: (payload) => dispatch(addTodoItem(payload)),
  updateTodoItem: (payload) => dispatch(updateTodoItem(payload)),
  getTodoList: () => dispatch(getTodoList()),
  getDatabaseAddress: () => dispatch(getDatabaseAddress()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);
