import React from "react";
import Navg from "../sub-components/nav";
import { Link } from "react-router-dom";
import Sidebar from "../sub-components/sidebar";
import { useHistory } from "react-router-dom";
function Home({ socket }) {
  const history = useHistory();
  const key = localStorage.getItem("key");
  if (!key) {
    history.push("/login");
  }

  return (
    <>
      <Navg socket={socket} />
      <Sidebar />
      <div class="row d-flex justify-content-center c-container">
        <div className="col-11">
          <h2>Bienvenido</h2>
        </div>
        <div className="col-4 row d-flex justify-content-center">
          <div class="card cd col-11">
            <img src="..." class="card-img-top" alt="..." />
            <div class="card-body ">
              <h5 class="card-title d-flex justify-content-center">
                Movimientos
              </h5>
              <p class="card-text d-flex justify-content-center">
                Crea, visualiza, elimina y edita, ingresos y egresos
              </p>
              <Link to="/moves" className="d-flex justify-content-center">
                <btn class="btn btn-primary">Entrar</btn>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-4 row d-flex justify-content-center">
          <div class="card cd col-11">
            <img src="..." class="card-img-top" alt="..." />
            <div class="card-body ">
              <h5 class="card-title d-flex justify-content-center">Usuarios</h5>
              <p class="card-text d-flex justify-content-center">
                Crea, visualiza, elimina y edita usuarios
              </p>
              <Link to="/user" className="d-flex justify-content-center">
                <btn class="btn btn-primary">Entrar</btn>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-4 row d-flex justify-content-center">
          <div class="card cd col-11">
            <img src="..." class="card-img-top" alt="..." />
            <div class="card-body ">
              <h5 class="card-title d-flex justify-content-center">
                Actualizar horas de ingreso
              </h5>
              <p class="card-text d-flex justify-content-center">
                Actualiza las horas de ingreso de los usuarios a la aplicacion
              </p>
              <Link to="/update" className="d-flex justify-content-center">
                <btn class="btn btn-primary">Entrar</btn>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
