import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { formatDateHoyEn, formatDateMananaEn } from "../../dates/dates";
import Dropdown from "react-bootstrap/Dropdown";
import Swal from "sweetalert2";
import "boxicons";
import "../../../css/nav.css";
import { url_api } from "../../../lib/data/server";

function Navg({ socket }) {
  const [apertura, setApertura] = useState();
  const [cierre, setCierre] = useState();
  const [ahora_mismo, setAhora_mismo] = useState();
  const user = localStorage.getItem("name");
  const [notification, setNotification] = useState([]);
  const toggleFunc = () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("close");
    const navDiv = document.querySelector(".navDiv");
    navDiv.classList.toggle("close");
  };
  const [time, changeTime] = useState(new Date().toLocaleTimeString());
  /*const ap = ( time < 12) ? "<span>AM</span>":"<span>PM</span>";*/
  const hoy = `${formatDateHoyEn(new Date())} ${apertura}`; // 2022-10-25T10:00
  let hoy_cierre;
  if (cierre < apertura) {
    hoy_cierre = `${formatDateMananaEn(new Date())} ${cierre}`; // 2022-10-26T20:00
  } else {
    hoy_cierre = `${formatDateHoyEn(new Date())} ${cierre}`; // 2022-10-25T20:00
  }
  useEffect(() => {
    setAhora_mismo(`${formatDateHoyEn(new Date())} ${time}`);
  }, [time]);

  useEffect(
    function () {
      setInterval(() => {
        changeTime(new Date().toLocaleTimeString());
      }, 1000);
      setInterval(() => {
        let a = new Date(hoy_cierre);
        let b = new Date(ahora_mismo);
        let c = (a - b) / 60000;
        if (c === 5) {
          Swal.fire({
            icon: "warning",
            title: "El sitio cerrara en 5 minutos...",
          });
        }
      }, 1000);
    },
    [hoy_cierre]
  );

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

  const displayNotification = (n) => {
    return (
      <Dropdown.Item href="#/action-1" key={1}>
        {n.message}
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
                    {notification.map((n) => displayNotification(n))}
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
                    <li>
                      <a class="dropdown-item" href="#">
                        Action three
                      </a>
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
