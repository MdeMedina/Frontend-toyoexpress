import React, {useState} from 'react'
import EModal from '../sub-components/modal/E-modal'
import IModal from '../sub-components/modal/I-modal'
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2'
import Navg from '../sub-components/nav'
import Sidebar from '../sub-components/sidebar'
import { url_api } from '../../lib/data/server';
function Caja({socket}) {
    const history = useHistory()
  const key = localStorage.getItem('key')
  if (!key) {
    history.push('/login')
  }
    const [egresoShow, setEgresoShow] = React.useState(false);
    const [ingresoShow, setIngresoShow] = React.useState(false);
    const [bolos, setBolos] = useState(0)
    const [cambio, setCambio] = useState(0)
    
  const email = localStorage.getItem('email')

    const settingMounts = (bs, change) => {
      setBolos(bs)
      setCambio(change)
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
      let obj = {cuenta: cuenta, concepto: concepto, bs: bolos, change: cambio, monto: monto, name: name, pago: pago, email: email}
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
        }))
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
      let obj = { cuenta: cuenta, concepto: concepto, bs: bolos, change: cambio, monto: monto, name: name, pago: pago, email: email}
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
        }))
        setIngresoShow(false)
      }
    }
  
    return (
      <>
    <Navg socket={socket}/>
    <Sidebar>

        </Sidebar>
        <Button variant="primary" onClick={() => setEgresoShow(true)}>
          Crear un Egreso
        </Button>
        <EModal show={egresoShow} onHide={() => setEgresoShow(false)} onSend={() => {
          egreso()
          }} settingMounts={settingMounts}/>

        <Button variant="primary" onClick={() => setIngresoShow(true)}>
          Crear un Ingreso
        </Button>
        <IModal show={ingresoShow} onHide={() => setIngresoShow(false)} onSend={() => {
          ingreso()
}} settingMounts={settingMounts}/>
      </>
    );
  }

export default Caja