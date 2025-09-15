import React, { useEffect, useState, useRef, useCallback } from "react";
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

// ====== Config ======
const MIN_REFRESH_MS = 30 * 60 * 1000; // 30 min
// helper arriba del componente
const asBool = (v) => v === true || v === "true" || v === 1 || v === "1";

// dentro de Navg:
const token = localStorage.getItem("token");
let obH = false;
let am = false;
if (token) {
  const perms = JSON.parse(localStorage.getItem("permissions") || "{}");
  obH = asBool(perms?.obviarIngreso);
  am  = asBool(perms?.aprobarMovimientos);
}

// helpers junto a MIN_REFRESH_MS
const parseHHMM = (hhmm) => {
  if (!hhmm) return { h: 0, m: 0 };
  const [h, m] = String(hhmm).split(":").map(Number);
  return { h: h || 0, m: m || 0 };
};
const buildLocal = (y, mon, d, h, m) => new Date(y, mon, d, h, m, 0, 0);


// ====== Hook: usar fechas del servidor + timers locales ======
function useServerDates({ token, obH, setApertura, setCierre, navigate }) {
  const skewRef = useRef(0);                // serverNow - clientNow
  const warnTimeoutRef = useRef(null);      // aviso -5 min
  const closeTimeoutRef = useRef(null);     // logout al cierre

  const clearTimers = () => {
    if (warnTimeoutRef.current) clearTimeout(warnTimeoutRef.current);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    warnTimeoutRef.current = null;
    closeTimeoutRef.current = null;
  };


  const scheduleClose = useCallback((cierre, apertura) => {
    clearTimers();

    const nowLocal = new Date();
    const y = nowLocal.getFullYear();
    const mon = nowLocal.getMonth();
    const d = nowLocal.getDate();

    const { h: ch, m: cm } = parseHHMM(cierre);
    const { h: ah, m: amn } = parseHHMM(apertura);

    // si cierre < apertura => el cierre es al día siguiente
    const cierreIsTomorrow = (ch * 60 + cm) < (ah * 60 + amn);
    const cierreDate = cierreIsTomorrow
      ? buildLocal(y, mon, d + 1, ch, cm)
      : buildLocal(y, mon, d,     ch, cm);

    const warnDate = new Date(cierreDate.getTime() - 5 * 60 * 1000);

    const serverNow = Date.now() + skewRef.current;
    const warnDelay  = Math.max(warnDate.getTime()  - serverNow, 0);
    const closeDelay = Math.max(cierreDate.getTime() - serverNow, 0);

      console.log({
    nowLocal,
    skewMs: skewRef.current,
    warnAtLocal: warnDate,
    closeAtLocal: cierreDate,
    warnDelayMs: warnDelay,
    closeDelayMs: closeDelay,
    obH,
  });
    warnTimeoutRef.current = setTimeout(() => {
      const visto = localStorage.getItem("visto") === "true";
      if (!obH && !visto) {
        Swal.fire({
          icon: "warning",
          title: "¡La aplicación cierra en menos de 5 minutos!",
          showConfirmButton: true,
        });
        localStorage.setItem("visto", "true");
      }
    }, warnDelay);

    closeTimeoutRef.current = setTimeout(() => {
      if (!obH) navigate("/logout");
    }, closeDelay);
  }, [navigate, obH]);

  const fetchDates = useCallback(async () => {
    const r = await fetch(`${backendUrl()}/dates/`, {
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
    });
    if (r.status === 401) {
      window.location.href = `${frontUrl()}/logout`;
      return;
    }
    const json = await r.json();

    // Esperamos { apertura, cierre, serverNow }
    setApertura(json.apertura);
    setCierre(json.cierre);

    // Calcular skew (si no viene, usar 0)
skewRef.current =
  typeof json.serverNow === "number" ? json.serverNow - Date.now() : 0;

      // en useServerDates, dentro de fetchDates antes de scheduleClose:
    const todayKey = new Date().toISOString().slice(0,10); // YYYY-MM-DD
    const vistoKey = localStorage.getItem("vistoKey");
    if (vistoKey !== todayKey) {
      localStorage.removeItem("visto");
      localStorage.setItem("vistoKey", todayKey);
    }

    // Programar timers locales
    scheduleClose(json.cierre, json.apertura);
  }, [token, setApertura, setCierre, scheduleClose]);

  useEffect(() => {
    // Carga inicial
    fetchDates();

    // Refresh espaciado
    const refreshId = setInterval(fetchDates, MIN_REFRESH_MS);

    // Refresh al volver visibilidad/foco
    const onVis = () => {
      if (document.visibilityState === "visible") fetchDates();
    };
    const onFocus = () => fetchDates();

    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(refreshId);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("focus", onFocus);
      clearTimers();
    };


  }, [fetchDates]);
}

function Navg({ socket }) {
  const token = localStorage.getItem("token");
  let obH = false;
  let am = false;
  if (token) {
    const perms = JSON.parse(localStorage.getItem("permissions") || "{}");
    obH = !!perms.obviarIngreso;
    am = !!perms.aprobarMovimientos;
  }

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
  const [aproveN, setAproveN] = useState([]);
  const [notification, setNotification] = useState([]);
  const media = window.innerWidth;

  // ==== Sincroniza fechas del servidor y programa timers (aviso/logout)
  useServerDates({ token, obH, setApertura, setCierre, navigate });

  const settingPassword = (password, newPassword) => {
    setPassword(password);
    setNewPassword(newPassword);
    setActPassword(true);
  };

  const nuevaPass = async () => {
    if (actPassword === true) {
      const updateData = {
        email: localStorage.getItem("email"),
        ActualPassword: password,
        password: newPassword,
      };
      await fetch(`${backendUrl()}/users/actpass`, {
        method: "POST",
        body: JSON.stringify(updateData),
        headers: new Headers({
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        }),
      })
        .then((res) => {
          if (res.status === 401) {
            window.location.href = `${frontUrl()}/logout`;
            return false;
          }
          return res.json();
        })
        .then(
          Swal.fire({
            icon: "success",
            title: "Contraseña modificada con éxito",
          })
        );
    }
  };

  useEffect(() => {
    nuevaPass();
  }, [actPassword]);

  const toggleFunc = () => {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.toggle("close");
    const navDiv = document.querySelector(".navDiv");
    if (navDiv) navDiv.classList.toggle("close");
  };

  // ===== Notificaciones / Moves =====
  const getNote = async () => {
    const res = await fetch(`${backendUrl()}/users/`, {
      headers: new Headers({
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
    });
    if (res.status === 401) {
      window.location.href = `${frontUrl()}/logout`;
      return;
    }
    const data = await res.json();
    const users = data.users || [];
    const mine = users.filter((u) =>
      (u.email || "").includes(localStorage.getItem("email"))
    );
    const notis = (mine[0] && mine[0].notificaciones) || [];
    setNote(notis);
  };

  const actNote = async (n) => {
    const updateData = { email: n.email, notificaciones: [n.message] };
    const res = await fetch(`${backendUrl()}/users/actNotificaciones`, {
      method: "PUT",
      body: JSON.stringify(updateData),
      headers: new Headers({
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
    });
    if (res.status === 401) {
      window.location.href = `${frontUrl()}/logout`;
      return;
    }
    await res.json();
    getNote();
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
    // cleanup sockets opcional
    // return () => { socket.off("move"); socket.off("receive_aprove"); }
  });

  useEffect(() => {
    setfilterMove(
      moves.filter((m) => {
        return !m.vale && !m.disabled;
      })
    );
  }, [moves]);

  const getMoves = async () => {
    const response = await fetch(`${backendUrl()}/moves`, {
      headers: new Headers({
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
    });
    if (response.status === 401) {
      window.location.href = `${frontUrl()}/logout`;
      return;
    }
    const data = await response.json();
    setMoves(data);
  };

  // Carga inicial de otros datos (sin getTime: ya lo maneja useServerDates)
  useEffect(() => {
    getMoves();
    getNote();
  }, []);

  const displayNotificationMove = () => {
    if (!am) return null;

    if (filterMove.length > 1) {
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
  };

  const displayNotes = () => {
    if (!note[0]) {
      if (am) return false;
      return <div>No hay notificaciones nuevas</div>;
    }
    return (
      <div onClick={() => navigate("/moves")} className="af" key={1}>
        {`Tienes movimientos ya aprobados`}
      </div>
    );
  };

  return (
    <div className="ndG">
      <Navbar bg="light" expand="lg" className="topbar">
        <Container className="d-flex justify-content-center">
          <Row className="row-edit">
            {media > 414 ? (
              <>
                <Col
                  xs={5}
                  md={3}
                  className="d-flex align-items-center justify-content-endssss"
                >
                  <Navbar.Brand href="#home">
                    <img
                      src={require("../../img/logo.png")}
                      className="logo"
                      alt="..."
                    />
                  </Navbar.Brand>
                  <div id="number"></div>
                </Col>
                <Col xs={2} md={4} className="d-flex align-items-center">
                  <div onClick={toggleFunc}>
                    <Button variant="dark">
                      <box-icon name="menu" color="white" id="hola"></box-icon>
                    </Button>{" "}
                  </div>
                </Col>{" "}
              </>
            ) : (
              <>
                <Col xs={5} md={4} className="d-flex align-items-center">
                  <div onClick={toggleFunc}>
                    <Button variant="dark">
                      <box-icon name="menu" color="white" id="hola"></box-icon>
                    </Button>{" "}
                  </div>
                </Col>
                <Col
                  xs={3}
                  md={3}
                  className="d-flex align-items-center justify-content-end"
                >
                  <Navbar.Brand href="/" className="d-flex justify-content-center">
                    <img
                      src={require("../../img/logo.png")}
                      className="logo"
                      alt="..."
                    />
                  </Navbar.Brand>
                  <div id="number"></div>
                </Col>
              </>
            )}

            <Col
              xs={4}
              md={5}
              className="d-flex align-items-center justify-content-end"
            >
              <div className="row d-flex align-items-center justify-content-end">
                <div className="notificacion col-6">
                  {filterMove.length > 0 && am ? (
                    <div className="bola " id="bola">
                      {filterMove.length}
                    </div>
                  ) : (
                    false
                  )}
                  {!note[0] ? false : <div className="bola " id="bola"></div>}
                  <div className="dropstart col-7 d-flex justify-content-center ">
                    <div
                      className="nav-link dropdown-toggle"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <box-icon name="bell" className="campana" size="24px"></box-icon>
                    </div>

                    <ul className="dropdown-menu dropdown-menu-lg-start mdw">
                      <li className="row">
                        {displayNotificationMove()}
                        {displayNotes()}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="dropstart col-6 d-flex justify-content-end">
                  <a
                    className="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-lg-start">
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
              </div>
            </Col>
          </Row>
        </Container>
      </Navbar>
    </div>
  );
}

export default Navg;
