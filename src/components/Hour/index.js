import React, { useState } from "react";
import Navg from "../sub-components/nav";
import Sidebar from "../sub-components/sidebar";
import { url_api } from "../../lib/data/server";
import "../../css/hour.css";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import { useEffect } from "react";
const socket = io.connect(`${url_api}`);

function UpdateHour() {
  let hour;
  const history = useHistory();
  const key = localStorage.getItem("key");
  if (!key) {
    history.push("/login");
  }
  const [apertura, setApertura] = useState("");
  const [cierre, setCierre] = useState("");

  const [time, changeTime] = useState(new Date().toLocaleTimeString());
  /*const ap = ( time < 12) ? "<span>AM</span>":"<span>PM</span>";*/

  useEffect(function () {
    setInterval(() => {
      changeTime(new Date().toLocaleTimeString());
    }, 1000);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let apertura = document.getElementById("apertura");
    apertura = apertura.value;
    let cierre = document.getElementById("cierre");
    cierre = cierre.value;
    let hourData = {
      apertura: apertura,
      cierre: cierre,
    };
    const updatedDate = await fetch(`${url_api}/dates/update`, {
      method: "PUT",
      body: JSON.stringify(hourData),
      headers: new Headers({ "Content-type": "application/json" }),
    });
    hour = await updatedDate.json();
    hour = hour.response;
    let aparecer = document.getElementById("hora");
    aparecer.classList.remove("desaparezco");
    let h3 = document.getElementById("h3");
    h3.innerHTML = hour;
  };

  const arepa = (e) => {
    e.preventDefault();
    let message;
    socket.emit("join_room", 23);
    message = { message: "Update says hello!", room: 23 };
    socket.emit("send_message", message);
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      alert(data.message);
    });
  }, [socket]);
  useEffect(() => {
    getTime();
  }, []);
  const getTime = async () => {
    await fetch(`${url_api}/dates/`)
      .then((r) => r.json())
      .then((r) => {
        setApertura(r.apertura);
        setCierre(r.cierre);
      });
  };

  return (
    <>
      <Navg socket={socket} />
      <Sidebar />
      <div className="row d-flex justify-content-center">
        <div className="row bg-light d-flex justify-content-center filtros col-4">
          <form className="Form">
            <h1>Horarios Admin</h1>
            <div className="abre col-12">
              <label>hora de apertura:</label>
              <input
                type="time"
                id="apertura"
                defaultValue={apertura}
                onChange={(e) => console.log(e)}
              />
            </div>
            <div className="cierra col-12">
              <label>hora de cierre:</label>
              <input type="time" id="cierre" defaultValue={cierre} />
            </div>
            <input
              type="submit"
              className="btn btn-primary"
              onClick={handleSubmit}
            />
            <div className="desaparezco hora" id="hora">
              <h3 id="h3"></h3>
              <br />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  let aparecer = document.getElementById("hora");
                  aparecer.classList.add("desaparezco");
                }}
              >
                close
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="row d-flex justify-content-center">
        <div className="row bg-light d-flex justify-content-center filtros col-4">
          <div className="fs-4 col-12 d-flex justify-content-center">
            Hora Actual
          </div>
          <div className="fs-5 col-12 d-flex justify-content-center">
            {time}
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateHour;
