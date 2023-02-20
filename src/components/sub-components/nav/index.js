import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import NavDropdown from "react-bootstrap/NavDropdown";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { formatDateHoyEn, formatDateMananaEn } from "../../dates/dates";
import Dropdown from "react-bootstrap/Dropdown";
import Swal from "sweetalert2";
import "boxicons";
import "../../../css/nav.css";
import { backendUrl, frontUrl } from "../../../lib/data/server";
import { PassModal } from "../modal/passModal";
import { faL } from "@fortawesome/free-solid-svg-icons";

function Navg({ socket }) {
  let obH = JSON.parse(localStorage.getItem("permissions")).obviarIngreso;
  let am = JSON.parse(localStorage.getItem("permissions")).aprobarMovimientos;
  const navigate = useNavigate();
  const [apertura, setApertura] = useState();
  const [moves, setMoves] = useState([]);
  const [actPassword, setActPassword] = useState(false);
  const [filterMove, setfilterMove] = useState([]);
  const [note, setNote] = useState([]);
  const [cierre, setCierre] = useState();
  const [passShow, setPassShow] = useState();
  const [password, setPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const user = localStorage.getItem("name");
  let hourD = localStorage.getItem("HourAlert");
  const [alertDado, setAlertDado] = useState(hourD);
  const [aproveN, setAproveN] = useState([]);
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (!document.hidden) {
        getInactive();
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const settingPassword = (password, newPassword) => {
    setPassword(password);
    setNewPassword(newPassword);
    setActPassword(true);
  };

  const nuevaPass = async () => {
    if (actPassword === true) {
      let updateData = {
        email: localStorage.getItem("email"),
        ActualPassword: password,
        password: newPassword,
      };
      await fetch(`${backendUrl()}/users/actpass`, {
        method: "POST",
        body: JSON.stringify(updateData),
        headers: new Headers({ "Content-type": "application/json" }),
      }).then(
        Swal.fire({
          icon: "success",
          title: "Contraseña modificada con exito",
        })
      );
    }
  };

  useEffect(() => {
    nuevaPass();
  }, [actPassword]);

  const toggleFunc = () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("close");
    const navDiv = document.querySelector(".navDiv");
    navDiv.classList.toggle("close");
  };
  /*const ap = ( time < 12) ? "<span>AM</span>":"<span>PM</span>";*/

  const hourAlerta = async (cierre, apertura) => {
    let hoy_cierre;
    if (cierre < apertura) {
      hoy_cierre = `${formatDateMananaEn(new Date())}T${cierre}`; // 2022-10-26T20:00
    } else {
      hoy_cierre = `${formatDateHoyEn(new Date())}T${cierre}`; // 2022-10-25T20:00
    }
    const promResult = await fetch(`${backendUrl()}/users/hour`);
    const jsq = await promResult.json();
    let horaActual = await jsq.horaActual;
    horaActual = horaActual.split("-");
    horaActual = `${horaActual[0]}-${horaActual[1]}-${horaActual[2]}`;
    let hoy_real = new Date(hoy_cierre);
    let hoyMenosCinco = new Date(hoy_real.getTime() - 5 * 60 * 1000);
    let visto = localStorage.getItem("visto");
    if (visto == "true") {
      visto = true;
    }
    if (visto == "false") {
      visto = false;
    }

    console.log(visto);
    console.log(new Date(horaActual) >= hoyMenosCinco, !obH, !visto);
    console.log(new Date(horaActual), hoyMenosCinco);

    if (new Date(horaActual) >= hoyMenosCinco && !obH && !visto) {
      Swal.fire({
        icon: "warning",
        title: "La aplicacion cierra en menos de 5 minutos!",
        showConfirmButton: true,
      });
      localStorage.setItem("visto", true);
    }
    if (new Date(horaActual) >= hoy_real && !obH) {
      navigate("/logout");
    }
  };

  const getInactive = async () => {
    let updateData = { email: localStorage.getItem("email") };
    await fetch(`${backendUrl()}/users/inactive`, {
      method: "POST",
      body: JSON.stringify(updateData),
      headers: new Headers({ "Content-type": "application/json" }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        const promResult = await fetch(`${backendUrl()}/users/hour`);
        const jsq = await promResult.json();
        let horaActual = await jsq.horaActual;
        horaActual = horaActual.split("-");
        horaActual = `${horaActual[0]}-${horaActual[1]}-${horaActual[2]}`;
        let hora = res.hour;
        let actual = new Date(horaActual);
        let tiempo = new Date(actual) - new Date(hora);
        if (tiempo >= 3600000) {
          navigate("/logout");
        }
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Aquí puedes poner la función que quieras ejecutar cada 1 minuto
      getTime();
    }, 30000); // El número es el intervalo en milisegundos, por lo que 60000ms = 1 minuto

    return () => clearInterval(interval);
  }, []);

  const actInactive = async () => {
    let updateData = {
      email: localStorage.getItem("email"),
    };
    await fetch(`${backendUrl()}/users/actInactive`, {
      method: "PUT",
      body: JSON.stringify(updateData),
      headers: new Headers({ "Content-type": "application/json" }),
    });
  };

  useEffect(() => {
    getInactive();
    document.onclick = function () {
      actInactive();
    };
    window.setInterval(function () {
      getInactive();
    }, 3600000);
  }, []);
  let intervalo;

  const getNote = async () => {
    await fetch(`${backendUrl()}/users/`)
      .then((res) => res.json())
      .then((res) => res.users)
      .then((res) =>
        res.filter((dato) => {
          return dato.email.includes(localStorage.getItem("email"));
        })
      )
      .then((res) => res[0].notificaciones)
      .then((res) => setNote(res));
  };

  const actNote = async (n) => {
    let updateData = { email: n.email, notificaciones: [n.message] };
    await fetch(`${backendUrl()}/users/actNotificaciones`, {
      method: "PUT",
      body: JSON.stringify(updateData),
      headers: new Headers({ "Content-type": "application/json" }),
    }).then(getNote());
  };

  useEffect(() => {
    if (am) {
      socket.on("move", getMoves);
    }
    socket.emit("join_room", parseInt(localStorage.getItem("messageID")));
    socket.on("receive_aprove", (data) => {
      setAproveN((prevArray) => [...prevArray, data.message]);
      getNote();
      actNote(data);
    });
  });

  useEffect(() => {
    setfilterMove(
      moves.filter((m) => {
        return !m.vale && !m.disabled;
      })
    );
  }, [moves]);
  const getMoves = async () => {
    const response = await fetch(`${backendUrl()}/moves`);
    let data = await response.json();
    await setMoves(data);
  };

  useEffect(() => {
    getTime();
    getMoves();
    getNote();
  }, []);

  const getTime = async () => {
    let promResult = await fetch(`${backendUrl()}/dates/`);
    let json = await promResult.json();
    setApertura(json.apertura);
    setCierre(json.cierre);
    hourAlerta(json.cierre, json.apertura);
  };

  const displayNotificationMove = (n) => {
    if (am) {
      if (filterMove.length > 0 && filterMove.length > 1) {
        return (
          <div onClick={() => navigate("/moves")} className="af" key={1}>
            {`Hay ${filterMove.length} movimientos por aprobar`}
          </div>
        );
      } else if (filterMove.length === 1) {
        return (
          <div onClick={() => navigate("/moves")} className="af" key={1}>
            {`Hay 1 movimiento por aprobar`}
          </div>
        );
      } else {
        return <div>No hay movimientos por aprobar</div>;
      }
    }
  };

  const displayNotes = () => {
    if (!note[0]) {
      if (am) {
        return false;
      } else {
        return <div>No hay notificaciones nuevas</div>;
      }
    } else {
      return (
        <div onClick={() => navigate("/moves")} className="af" key={1}>
          {`Tienes movimientos ya aprobados`}
        </div>
      );
    }
  };

  return (
    <div className="ndG">
      <Navbar bg="light" expand="lg" className="topbar">
        <Container className="d-flex justify-content-center">
          <Row className="row-edit">
            <Col xs={2} className="d-flex align-items-center">
              <Navbar.Brand href="#home">
                <img
                  src={require("../../img/logo.png")}
                  className="logo"
                  alt="..."
                />
              </Navbar.Brand>
              <div id="number"></div>
            </Col>
            <Col xs={5} className="d-flex align-items-center">
              <div onClick={toggleFunc}>
                <Button variant="dark">
                  <box-icon name="menu" color="white" id="hola"></box-icon>
                </Button>{" "}
              </div>
            </Col>
            <Col xs={5}>
              <Nav className="me-auto row">
                <div className="notificacion col-2">
                  {filterMove.length > 0 && am ? (
                    <div className="bola " id="bola">
                      {filterMove.length}
                    </div>
                  ) : (
                    false
                  )}
                  {!note[0] ? false : <div className="bola " id="bola"></div>}
                  <div class="dropdown col-3 d-flex justify-content-end">
                    <div
                      className="nav-link dropdown-toggle"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {" "}
                      <box-icon name="bell" className="campana"></box-icon>
                    </div>

                    <ul
                      class="dropdown-menu dropdown-menu-lg-start
                    mdw"
                    >
                      <li className="row">
                        {displayNotificationMove(notification)}
                        {displayNotes()}
                      </li>
                    </ul>
                  </div>
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
                    <hr />
                    <li className="row">
                      <a
                        onClick={() => setPassShow(true)}
                        className="d-flex justify-content-center cc"
                      >
                        Cambiar contraseña
                      </a>
                      <PassModal
                        show={passShow}
                        onHide={() => setPassShow(false)}
                        settingMounts={settingPassword}
                      />
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
