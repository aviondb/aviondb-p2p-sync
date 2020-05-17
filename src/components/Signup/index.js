import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { signup } from "../../redux/actions/signup";
import { useHistory } from "react-router-dom";

function Login(props) {
  const { signup, user } = props;
  const history = useHistory();

  if (user.email) {
    history.push("/todolist");
  }
  return (
    <Fragment>
      <center>
        <h1>Sign up</h1>
        <br />
        <div className="form-inline">
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
            id="signup-btn"
            onClick={() => {
              signup({
                email: document.getElementById("email").value,
                password: document.getElementById("password").value,
              });
              document.getElementById("signup-btn").innerHTML =
                "Signing you in...";
            }}
          >
            Sign up
          </button>
        </div>
        <br />
        <Link to="/login">Login Instead?</Link>
      </center>
    </Fragment>
  );
}

const mapStateToProps = (state) => ({
  user: state.app.user,
});

const mapDispatchToProps = (dispatch) => ({
  signup: (payload) => dispatch(signup(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
