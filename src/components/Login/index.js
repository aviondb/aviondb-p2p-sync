import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { login } from "../../redux/actions/login";
import { useHistory } from "react-router-dom";
import Footer from "../Footer";

function Login(props) {
  const { user, login } = props;
  const history = useHistory();

  if (user.email) {
    history.push("/todolist");
  }

  return (
    <Fragment>
      <center>
        <h1>Login</h1>
        <br />
        <form className="form-inline">
          <div className="form-group mx-sm-3 mb-2">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              type="text"
              className="form-control"
              id="email"
              placeholder="Enter Email"
            />
          </div>
          <br />
          <br />
          <div className="form-group mx-sm-3 mb-2">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
            />
          </div>
          <br />
          <br />
          <br />
          <button
            className="btn btn-primary mb-2"
            id="login-btn"
            onClick={() => {
              login({
                email: document.getElementById("email").value,
                password: document.getElementById("password").value,
              });
              document.getElementById("login-btn").innerHTML =
                "Logging you in...";
            }}
          >
            Login
          </button>
        </form>
        <br />
        <Link to="/signup">Signup Instead?</Link>
      </center>
    </Fragment>
  );
}

const mapStateToProps = (state) => ({
  user: state.app.user,
});

const mapDispatchToProps = (dispatch) => ({
  login: (payload) => dispatch(login(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
