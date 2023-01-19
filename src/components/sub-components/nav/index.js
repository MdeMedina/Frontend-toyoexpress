import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { formatDateHoyEn, formatDateMananaEn } from "../../dates/dates";
import Dropdown from "react-bootstrap/Dropdown";
import Swal from "sweetalert2";
import "boxicons";
import "../../../css/nav.css";
import { url_api } from "../../../lib/data/server";

function Navg({ socket }) {
  let obH = JSON.parse(localStorage.getItem("permissions")).obviarIngreso;
  let am = JSON.parse(localStorage.getItem("permissions")).aprobarMovimientos;
  const history = useHistory();
  const [apertura, setApertura] = useState();
  const [cierre, setCierre] = useState();
  const user = localStorage.getItem("name");
  let hourD = localStorage.getItem("HourAlert");
  const [alertDado, setAlertDado] = useState(hourD);
  const [notification, setNotification] = useState([]);
  const toggleFunc = () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("close");
    const navDiv = document.querySelector(".navDiv");
    navDiv.classList.toggle("close");
  };
  /*const ap = ( time < 12) ? "<span>AM</span>":"<span>PM</span>";*/
  let hoy_cierre;
  if (cierre < apertura) {
    hoy_cierre = `${formatDateMananaEn(new Date())} ${cierre}`; // 2022-10-26T20:00
  } else {
    hoy_cierre = `${formatDateHoyEn(new Date())} ${cierre}`; // 2022-10-25T20:00
  }

  let horaActual;
  let horaProgramadaAlert;
  let horaProgramada;
  function hourAlerta() {
    horaActual = new Date();
    horaProgramada = new Date(hoy_cierre);
    horaProgramadaAlert = new Date(hoy_cierre);
    horaProgramadaAlert.setMinutes(horaProgramadaAlert.getMinutes() - 5);
    if (
      horaProgramadaAlert - horaActual <= 0 &&
      localStorage.getItem("HourAlert") === "false" &&
      horaProgramada - horaActual > 0 &&
      !obH
    ) {
      localStorage.setItem("HourAlert", true);
      hourD = localStorage.getItem("HourAlert");
      setAlertDado(hourD);
      return alert("estamos a 5 minutos de cerrar");
    } else if (horaProgramada - horaActual <= 0 && !obH) {
      history.push("/logout");
    }
  }
  var timeout;
  window.onmousemove = function () {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      history.push("/logout");
    }, 3600000);
  };
  window.onmousemove = function () {
    hourAlerta();
  };

  useEffect(() => {
    if (am) {
      const seteando_noti = (move) =>
        setNotification((oldArray) => [...oldArray, move]);
      socket.on("move", seteando_noti);

      return () => {
        socket.off("move", seteando_noti);
      };
    }
  });

  useEffect(() => {
    getTime();
  });

  const getTime = async () => {
    await fetch(`${url_api}/dates/`)
      .then((r) => r.json())
      .then((r) => {
        setApertura(r.apertura);
        setCierre(r.cierre);
      });
  };

  let room = 23;
  useEffect(() => {
    socket.emit("join_room", room);
    socket.on("receive_message", (data) => {
      setNotification(data);
    });
  });

  const displayNotificationMove = (n) => {
    return (
      <Dropdown.Item href="#/action-1" key={1}>
        {n}
      </Dropdown.Item>
    );
  };

  return (
    <div className="ndG">
      <Navbar bg="light" expand="lg" className="topbar">
        <Container className="d-flex justify-content-center">
          <Row className="row-edit">
            <Col xs={2}>
              <Navbar.Brand href="#home">Toyoxpress</Navbar.Brand>
            </Col>
            <Col xs={5}>
              <div onClick={toggleFunc}>
                <Button variant="dark">
                  <box-icon name="menu" color="white" id="hola"></box-icon>
                </Button>{" "}
              </div>
            </Col>
            <Col xs={5}>
              <Nav className="me-auto row">
                <div className="notificacion col-2">
                  {notification.length > 0 && (
                    <div className="bola " id="bola">
                      {notification.length}
                    </div>
                  )}
                  <box-icon name="menu" color="red" id="hola"></box-icon>
                  <NavDropdown title="Dropdown" id="basic-nav-dropdown polo">
                    {notification.map((m) => displayNotificationMove(m))}
                    <Button
                      variant="primary"
                      onClick={() => {
                        socket.emit("clean_nots", { message: "cleaned" });
                        setNotification([]);
                      }}
                    >
                      Mark as Read!
                    </Button>
                  </NavDropdown>
                </div>
                <div class="dropdown col-3 d-flex justify-content-end">
                  <a
                    className="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user}
                  </a>
                  <ul class="dropdown-menu dropdown-menu-lg-start">
                    <li className="row">
                      <div className="col-11 d-flex justify-content-center">
                        Hora de ingreso:
                      </div>
                      <div className="fw-semibold d-flex justify-content-center">
                        {apertura}
                      </div>
                    </li>
                    <li className="row">
                      <div className="col-11 d-flex justify-content-center">
                        Hora de Cierre:
                      </div>
                      <div className="fw-semibold d-flex justify-content-center">
                        {cierre}
                      </div>
                    </li>
                  </ul>
                </div>
              </Nav>
            </Col>
          </Row>
        </Container>
      </Navbar>
    </div>
  );
}

export default Navg;
