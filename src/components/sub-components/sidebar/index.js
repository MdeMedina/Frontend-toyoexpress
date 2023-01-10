import React, {useState, useEffect} from 'react'
import 'boxicons'
import {Link} from 'react-router-dom'
import EModal from '../modal/E-modal'
import IModal from '../modal/I-modal'
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2'
import { url_api } from '../../../lib/data/server';

function Sidebar (props) {
  const {getMoves} = props
    let permissions = JSON.parse(localStorage.getItem('permissions'))
    let cu = permissions.crearUsuarios
    let sh = permissions.horasIngreso
    const [egresoShow, setEgresoShow] = React.useState(false);
    const [ingresoShow, setIngresoShow] = React.useState(false);
    const [eBolos, setEBolos] = useState(0)
    const [eCambio, setECambio] = useState(0)
    const [iBolos, setIBolos] = useState(0)
    const [iCambio, setICambio] = useState(0)
    
  const email = localStorage.getItem('email')


    const eSettingMounts = (bs, change) => {
      setEBolos(bs)
      setECambio(change)
      
    }
    const iSettingMounts = (bs, change) => {
      setIBolos(bs)
      setICambio(change)
      
    }
    const egreso = () => {
      let cuenta = document.getElementById('e-account')
      cuenta = cuenta.value
      let pago = document.getElementById('e-pago')
      pago = pago.value
      let monto = document.getElementById('e-monto')
      monto = monto.value
      let concepto = document.getElementById('e-concepto')
      concepto = concepto.value
      let name = localStorage.getItem('name')
      let obj = {cuenta: cuenta, concepto: concepto, bs: eBolos, change: eCambio, monto: monto, name: name, pago: pago, email: email}
      let error = document.getElementById('e-error')
      if (cuenta === 'n/d') {
        if (error.classList.contains('desaparecer')) {error.classList.remove('desaparecer')}
      } else if (pago === 'n/d') {
        if (error.classList.contains('desaparecer')) {error.classList.remove('desaparecer')}
      } else if (!monto) {
        if (error.classList.contains('desaparecer')) {error.classList.remove('desaparecer')}
      } else if (!concepto) {
        if (error.classList.contains('desaparecer')) {error.classList.remove('desaparecer')}
      } else { if (!error.classList.contains('desaparecer')) {error.classList.add('desaparecer')}
      fetch(`${url_api}/moves/egreso`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
      }).then(response => console.log(response)).then(Swal.fire({
        icon: 'success',
        title: 'Movimiento Creado con exito',
        })).then(getMoves())
        setEgresoShow(false)
      }
    }

    const ingreso = () => {
      let cuenta = document.getElementById('i-account')
      cuenta = cuenta.value
      console.log(cuenta)
      let pago = document.getElementById('i-pago')
      pago = pago.value
      let monto = document.getElementById('i-monto')
      monto = monto.value
      let concepto = document.getElementById('i-concepto')
      concepto = concepto.value
      let name = localStorage.getItem('name')
      let obj = { cuenta: cuenta, concepto: concepto, bs: iBolos, change: iCambio, monto: monto, name: name, pago: pago, email: email}
      let error = document.getElementById('i-error')
      if (cuenta === 'n/d') {
        if (error.classList.contains('desaparecer')) {error.classList.remove('desaparecer')}
      } else if (pago === 'n/d') {
        if (error.classList.contains('desaparecer')) {error.classList.remove('desaparecer')}
      } else if (!monto) {
        if (error.classList.contains('desaparecer')) {error.classList.remove('desaparecer')}
      } else if (!concepto) {
        if (error.classList.contains('desaparecer')) {error.classList.remove('desaparecer')}
      } else { if (!error.classList.contains('desaparecer')) {error.classList.add('desaparecer')}
      fetch(`${url_api}/moves/ingreso`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
      }).then(response => console.log(response)).then(Swal.fire({
        icon: 'success',
        title: 'Movimiento Creado con exito',
        })).then(getMoves())
        setIngresoShow(false)
      }
    }
  

    const createFunction = () => {

        if (cu) {
        return (
          <li className="nav-link">
          <Link to="/user">
          <div className="icon">
              <box-icon name='user' size='20px'></box-icon>
              </div>
              <span className="text nav-text">Crear Usuario</span>
              </Link>
      </li>
        )
        }

      }
      const hourFunction = () => {
        if(sh) {
            return (
                <li className="nav-link">
                <Link to="/update">
                <div className="icon">
                    <box-icon name='time-five' size='20px'></box-icon>
                    </div>
                    <span className="text nav-text">Modificar horarios</span>
                    </Link>
            </li>
              )
        }
      }
    return (
        <div className='navDiv' >
        <nav className='sidebar' id='sidebar'>
            <div className='menu-bar'>
                <div className="menu">
                    <ul className="menu-links">
                      <div className="dropend ">
                        <li className="caja-link dropdown-toggle" data-bs-toggle="dropdown" >
                            {/* <Link to="/caja"> */}
                            <div className="icon">
                                <box-icon name='home' size='20px'></box-icon>
                                </div>
                                <span className="text nav-text">caja</span>
                                {/* </Link> */}
                        </li>
                        <ul class="dropdown-menu row cl">
                          <div className="col-12 ">
                            Egresos:
                        <Button variant="primary" onClick={() => setEgresoShow(true)}>
          Crear un Egreso
        </Button>
        <EModal show={egresoShow} onHide={() => setEgresoShow(false)} onSend={() => {
          egreso()
          }} eSettingMounts={eSettingMounts}/>
          </div>
          <hr className="e-change"/>
          <div className="col-12">
            Ingresos:
                  <Button variant="primary" onClick={() => setIngresoShow(true)}>
          Crear un Ingreso
        </Button>

        <IModal show={ingresoShow} onHide={() => setIngresoShow(false)} onSend={() => {
          ingreso()
}} iSettingMounts={iSettingMounts}/>
</div>
                         </ul>
                         </div>
                        <li className="nav-link">
                            <Link to="/moves">
                            <div className="icon">
                                <box-icon name='heart' size='20px'></box-icon>
                                </div>
                                <span className="text nav-text">Movimientos</span>
                                </Link>
                        </li>
                          {
                            createFunction()
                          }
                          {
                            hourFunction()
                          }
                    </ul>
                </div>
                <div className="bottom-content">
                <li className="nav-link">
                            <Link to="/logout">
                            <div className="icon">
                                <box-icon name='log-out' size='20px'></box-icon>
                                </div>
                                <span className="text nav-text">Logout</span>
                                </Link>
                        </li>
                </div>
            </div>
        </nav>
    </div>
    )
}

export default Sidebar