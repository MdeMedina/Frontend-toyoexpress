import React from "react";
import { backendUrl, frontUrl } from "../../lib/data/server";
import { useNavigate } from "react-router-dom";
import "../../css/login.css";
import Swal from "sweetalert2";

function Login() {
  const navigate = useNavigate();
  let loginData = {};
  let user;
  let pass;

  const actInactive = async (email) => {
    let updateData = { email };
    await fetch(`${backendUrl()}/users/actInactive`, {
      method: "PUT",
      body: JSON.stringify(updateData),
      headers: new Headers({ "Content-type": "application/json" }),
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let permissions = {};
    user = document.getElementById("user").value;
    pass = document.getElementById("pass").value;
    loginData = {
      email: user,
      password: pass,
    };
    const loginRes = await fetch(`${backendUrl()}/users/login`, {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: new Headers({ "Content-type": "application/json" }),
    });
    const loginJson = await loginRes.json();
    const loginStatus = await loginRes.status;
    if (loginStatus === 403 || loginStatus === 401) {
      Swal.fire({
        icon: "error",
        title: loginJson.errormessage,
      });
    } else if (loginStatus === 200) {
      permissions = loginJson.permissions;
      actInactive(loginJson.email);
      localStorage.setItem("key", loginJson.key);
      localStorage.setItem("HourAlert", !permissions.obviarIngreso);
      localStorage.setItem("name", loginJson.name);
      localStorage.setItem("email", loginJson.email);
      localStorage.setItem("cVend", loginJson.vendedor);
      localStorage.setItem("cantidadM", loginJson.cantidadM);
      localStorage.setItem("permissions", JSON.stringify(permissions));
      localStorage.setItem("messageID", loginJson.messageId);
      localStorage.setItem("nav", true);
      localStorage.setItem("visto", false);

      navigate("/");
    } else {
      Swal.fire({
        icon: "error",
        title: loginJson.errormessage,
      });
    }
  };

  return (
    <>
      <form className="Form mt-5" onSubmit={handleSubmit}>
        <div className="row la d-flex justify-content-center">
          <div className="col-12">
            <img src={require("../img/logo.png")} className="logo-login" />
          </div>
          <div className="row col-3 bg-light filtros d-flex justify-content-center">
            <div className="Username login-div col-10">
              <label className="form-label d-flex justify-content-start">
                Email
              </label>
              <input type="text" id="user" className="form-control" />
            </div>
            <br />
            <br />
            <div className="Password login-div col-10">
              <label className="form-label d-flex justify-content-start">
                Password
              </label>
              <input type="password" id="pass" className="form-control" />
            </div>
            <div className="col-10 d-flex justify-content-center mt-3">
              <input type="submit" className="btn btn-primary" />
            </div>
            <div className="desaparezco error login-div" id="userInvalid">
              <h3 id="h3Error"></h3>
              <br />
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  let aparecer = document.getElementById("userInvalid");
                  aparecer.classList.add("desaparezco");
                }}
              >
                close
              </button>
            </div>
            <div className="desaparezco pase login-div" id="userGood">
              <h3 id="h3"></h3>
              <br />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  let aparecer = document.getElementById("userGood");
                  aparecer.classList.add("desaparezco");
                }}
              >
                close
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default Login;
