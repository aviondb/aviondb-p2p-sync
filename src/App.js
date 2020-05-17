import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import Store from "./redux/store";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import TodoList from "./components/TodoList";
import Sync from "./components/Sync";
//import Login from "./components/Login";
//import Signup from "./components/Signup";
import Footer from "./components/Footer";

function App() {
  return (
    <center>
      <Provider store={Store}>
        <Router>
          <Switch>
            {/* <Route path="/login">
              <Login />
            </Route> */}
            <Route path="/todolist">
              <TodoList />
            </Route>
            <Route path="/sync">
              <Sync />
            </Route>
            <Route path="">
              <TodoList />
            </Route>
          </Switch>
        </Router>
        <div style={{ position: "absolute", bottom: "30px", width: "100%" }}>
          <Footer />
        </div>
      </Provider>
    </center>
  );
}

export default App;
