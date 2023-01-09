import React, {useState, ChangeEvent} from 'react'
import Navg from '../sub-components/nav'
import Sidebar from '../sub-components/sidebar'
import { useEffect } from 'react'
import DatePicker from 'react-datepicker'
import Pagination from 'react-bootstrap/Pagination'
import Select from 'react-select'
import "react-datepicker/dist/react-datepicker.css";
import { useHistory } from 'react-router-dom'
import 'boxicons';
import {formatDateHoy} from '../dates/dates'
import '../../css/moves.css';
import Swal from 'sweetalert2';
import { url_api } from '../../lib/data/server';

function Moves({socket, verMovimientos, aprobarMovimientos, eliminarMovimientos}) {
  const hoy = `${formatDateHoy(new Date())}`
  const history = useHistory()
  const key = localStorage.getItem('key')
  if (!key) {
    history.push('/login')
  }
const vm = verMovimientos
const am = aprobarMovimientos
const dm = eliminarMovimientos
const [moves, setMoves] = useState([])
const [users, setUsers] = useState([])
const [monto, setMonto] = useState('')
const [cuenta, setCuenta] = useState(null)
const [pago, setPago] = useState(null)
const [startDate, setStartDate] = useState(subDays(new Date(), 30));
const [endDate, setEndDate] = useState(new Date());
const [name, setName] = useState(null)
const [concepto, setConcepto] = useState('')
const [deletingMove, setDeletingMove] = useState()
const [searchStatus, setSearchStatus] = useState('')
const [vale, setVale] = useState('')
const [currentPage, setCurrentPage] = useState(0)
const [vPage, setVPage] = useState(2)
const [meEncuentro, setMeEncuentro] = useState(1)
const [estaba, setEstaba] = useState(1)
const isAdmin = localStorage.getItem('role')

const removeMove = async () => {
  if(deletingMove){
  await fetch(`${url_api}/moves/deleteMoves`, {
    method: 'DELETE',
    body: JSON.stringify(deletingMove),
  headers: new Headers({ 'Content-type': 'application/json'})
}).then(r => console.log(r)).then(r => gettingUsers()).then(r => Swal.fire({
  icon: 'success',
  title: 'Movimiento Eliminado con exito',
})).then(getMoves())
  }
}
const deleteMoves = (m) => {
  console.log(dm)
  if (eliminarMovimientos) {
      return(<button className='btn btn-danger' value={m._id} onClick={(e) => {
    Swal.fire({
      title: 'Estas seguro que deseas eliminar este Movimiento?',
      showOkButton: false,
      showDenyButton: true,
      showCancelButton: true,
      cancelButtonText: `Cancelar`,
      denyButtonText: `Eliminar`,
    }).then((result) => { if (result.isDenied) {
      setDeletingMove({identificador: m.identificador ,_id: m._id})
      }
    })
      }}>Delete</button>)
  }
}
useEffect(() => {
removeMove()
}, [deletingMove])
useEffect(() => {
  let diff =  meEncuentro - estaba
  setCurrentPage(currentPage + (vPage * diff))
}, [estaba, meEncuentro])
const URL = `${url_api}/moves`
const gettingUsers = async() => {
  await fetch(`${url_api}/users`).then(res => res.json()).then((users) => {
    setUsers(users.users)
}) 
}

const handleVPage = (e) => {
  console.log(e)
  setCurrentPage(0)
  setEstaba(1)
  setMeEncuentro(1)
  setVPage(e.value)
}

const handleCuentaValue = (e) => {
if (!e.length) {
  setCuenta(null)
}else {
  setCurrentPage(0)
  setEstaba(1)
  setMeEncuentro(1)
  setCuenta(e)
}
}
const handleNameValue = (e) => {
  if (!e.length) {
    setName(null)
  }else {
    setCurrentPage(0)
    setEstaba(1)
    setMeEncuentro(1)
    setName(e)
  }
  }
  const handlePayValue = (e) => {
    if (!e.length) {
      setPago(null)
    }else {
      setCurrentPage(0)
      setEstaba(1)
      setMeEncuentro(1)
      setPago(e)
    }
    }

let nombres = []
let cuentas = [
  {value: 'Cuenta01HU', label: 'Cuenta01HU'},
  {value: 'Cuenta02JM', label: 'Cuenta02JM'},
  {value: 'Cuenta03JPA', label: 'Cuenta03JPA'}
]
let numeros = [
  {value: 2, label: 2},
  {value: 3, label: 3},
  {value: 4, label: 4}
]
let tPagos = [
  {value: 'Bs', label: 'Bs'},
  {value: 'Zelle', label: 'Zelle'},
  {value: 'Efectivo', label: 'Efectivo'}
]

const aproveSetter2 = (move) => {
  if (am) { return(<div className="row">
    <div className="col-1 d-flex align-items-center">
<label htmlFor="vale" className="form-label col-2">Vale</label>
</div>
<div className="col-6">
<input type="text" className="form-control" id="vale" aria-describedby="emailHelp" defaultValue={move.vale} onChange={(e) =>{
const {value} = e.target
setVale(value)
}}/>
</div>
</div>)}
}

const aproveSetter3 = (move) =>{
  if (am) {
    return (<button type="button" className="btn btn-primary" onClick={() => updateStatus(move)}>Save changes</button>)
  }
}

const getMoves = async () => {
   const response = await fetch(URL)
   let data = await response.json()
  setMoves(data)

}
const statusSetter = (move) => {
   if (!move.vale) {
    return (<div class="botonpendiente">Pendiente</div>)
  }
  else if (move.vale) {
    return (<div class="botonrealizado">Aprobado</div>)
  }
}



const statusBoxSetter = (move) => {
  if (!move.vale) {
    return (<div className="col-5 d-flex justify-content-start align-items-center">Status: Pendiente  <box-icon type='solid' name='circle' color='#fe0202'></box-icon></div>)
  } else if (move.vale) {
    return (<div className="col-5 d-flex justify-content-start align-items-center">Status: Aprobado  <box-icon type='solid' name='circle' color='#02FE06'></box-icon></div>)
  }
}
function addDays(fecha, dias){ 
  fecha.setDate(fecha.getDate() + dias);
  return fecha;
}
function subDays(fecha, dias){
  fecha.setDate(fecha.getDate() - dias);
  return fecha;
}
function filterRange(arr, a, b) {
  // agregamos paréntesis en torno a la expresión para mayor legibilidad
  return arr.filter(item => (a <= new Date(item.fecha) && new Date(item.fecha) <= b));
}

const updateStatus = async (move) => {
  if (vale === '') {
    Swal.fire( "Oops" ,  "Por favor escriba el valor del vale!" ,  "error" )
  } else {
  let updateData = {
    identificador: move.identificador,
    aFecha: hoy,
    vale: vale
  }
await fetch(`${url_api}/moves/updateStatus`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  headers: new Headers({ 'Content-type': 'application/json'})
  })
getMoves()
Swal.fire({
  icon: 'success',
  title: 'Movimiento Aprobado con exito',
})
}   

}

useEffect(()=> {
  getMoves()
  gettingUsers() 


  if (isAdmin === 'user') {
    const dated = document.getElementsByClassName('yesAdmin')

    for (let n of dated) {n.classList.add('desaparecer')}

  }else if (isAdmin === 'admin') {
    const dated = document.getElementsByClassName('noAdmin')
    for (let n of dated) {n.classList.add('desaparecer')}
  }
}, [isAdmin])
const setterMonto = (e) => {
  setCurrentPage(0)
  setEstaba(1)
  setMeEncuentro(1)
  setMonto(e.target.value)
}


const setterStatus = (e) => {
  setCurrentPage(0)
  setEstaba(1)
  setMeEncuentro(1)
  setSearchStatus(e.target.value)
}

const stDateSetter = (date) => {
  setCurrentPage(0)
  setEstaba(1)
  setMeEncuentro(1)
  setStartDate(date)
}

const endDateSetter = (date) => {
  setCurrentPage(0)
  setEstaba(1)
  setMeEncuentro(1)
  setEndDate(date)
}
let results = [];
let betaResults = [];
let alphaResults = [];
let inicio = new Date(startDate)
let final = new Date(endDate)
if (!monto && !cuenta && !pago && !name && !concepto && !searchStatus) {
  betaResults = moves

  betaResults= filterRange(betaResults, inicio, final)
  if (vm === false) {
    betaResults = betaResults.filter((dato) => {
      return dato.name.includes(localStorage.getItem('name'))
    })
  }
   betaResults = betaResults.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  results = betaResults

} else {
  betaResults = moves
    if (vm === false) {
    betaResults = betaResults.filter((dato) => {
      return dato.name.includes(localStorage.getItem('name'))
    })
  }
  betaResults= filterRange(betaResults, inicio, final)
  if (monto) {
    betaResults = betaResults.filter( (dato) => {
      return dato.monto.includes(monto.toLowerCase()) 
    })
 
  }
  if (pago) {
    alphaResults = []
    pago.map((c) => {
      betaResults.map((dato) => {
        if (c.value === dato.pago) {
          alphaResults.push(dato)
        }
      })
    })
    betaResults = alphaResults
  }
    if (name) {
      alphaResults = []
      name.map((c) => {
        betaResults.map((dato) => {
          if (c.value === dato.name) {
            alphaResults.push(dato)
          }
        })
      })
      betaResults = alphaResults
  }

  if (cuenta) {
    alphaResults = []
    cuenta.map((c) => {
      betaResults.map((dato) => {
        if (c.value === dato.cuenta) {
          alphaResults.push(dato)
        }
      })
      })
      betaResults = alphaResults
  }

  if (concepto) {
    betaResults = betaResults.filter( (dato) => {
      return dato.concepto.toLowerCase().includes(concepto.toLowerCase()) 
    })

  }
  if (searchStatus === 'Aprove') {
    betaResults = betaResults.filter( (dato) => {
      return dato.vale 
    })
   }else if (searchStatus === 'Unverified') {
        betaResults = betaResults.filter( (dato) => {
      return !dato.vale
    })
   }
  betaResults = betaResults.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  results = betaResults
}
const filteredResults = () => {
  return results.slice(currentPage, currentPage + vPage)
}

const nextPage = () => {
  setEstaba(meEncuentro)
  setMeEncuentro(parseFloat(meEncuentro) + 1)
}

const prevPage = () => {
  setEstaba(meEncuentro)
  setMeEncuentro(parseFloat(meEncuentro) - 1)
}
let bsId;
let bsTarget;
let pages
let itemPagination =[];

const makePages = () => {
  pages = Math.ceil(results.length / vPage)
  for (let i = 1; i <= pages; i++) {
    if (meEncuentro == i) {
      itemPagination.push(<Pagination.Item active onClick={(e) => {

        if (isNaN(e.target.text)) {
          setEstaba(meEncuentro)

        }else {
        setEstaba(meEncuentro)
        setMeEncuentro(e.target.text)
}
      }}>{i}</Pagination.Item>)
    } else {
      itemPagination.push(<Pagination.Item onClick={(e) => {
        if (isNaN(e.target.text)) {
          setEstaba(meEncuentro)
        }else {
        setEstaba(meEncuentro)
        setMeEncuentro(e.target.text)
}
      }}>{i}</Pagination.Item>)
    }
  }
}
return (
   
<>
<Navg socket={socket}/>
  <Sidebar getMoves={getMoves}/>
  <div className="d-flex justify-content-center">
  <div className="container-fluid row  d-flex justify-content-center">
  <div className="row bg-light col-11 filtros">
  <h2 className='col-12'>Filtros de busqueda de movimientos</h2>
  <div className="col-3 align-self-start d-flex justify-content-center ">
  <label htmlFor="">Monto</label>
  <input type="text" className="form-control searcher" placeholder='Search' value={monto} onChange={setterMonto}/>
  </div>
  <div className="col-3 align-self-start d-flex justify-content-center">

  <label htmlFor="">Cuenta</label>
  <Select options={cuentas} isMulti onChange={handleCuentaValue}/>
  </div>
    <div className="col-3 align-self-start d-flex justify-content-center">
  <label htmlFor="">Name</label>
  {
    users.map((u) => {
      nombres.push({value: u.username, label: u.username})
    })}
  <Select options={nombres} isMulti onChange={handleNameValue}/>
  </div>
  <div className="col-3 align-self-start d-flex justify-content-center">
  <label htmlFor="">Tipo de pago</label>
  <Select options={tPagos} isMulti onChange={handlePayValue}/>
  </div>
  <hr />
  <div className="container-fluid row d-flex justify-content-center">
    <div className="col-6 row">
      <div className="col-6">
        fecha de inicio:
  <DatePicker
        selected={startDate}
        onChange={(date) => stDateSetter(date)}
        dateFormat="yyyy-MM-dd"
        maxDate={addDays(new Date(), 0)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        className='yesAdmin'
      />

      </div>
      <div className="col-6">
        fecha de cierre:
              <DatePicker
        selected={endDate}
        onChange={(date) => endDateSetter(date)}
        dateFormat="yyyy-MM-dd"
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        maxDate={addDays(new Date(), 0)}
        minDate={startDate}
        wrapperClassName='d-flex justify-content-center'
        className='yesAdmin'
      />     
      </div>
      </div>
      <div className="col-6 row ">
        <h4 className='d-flex justify-content-center'>Status de movimiento</h4> 
      <div class="form-check col-4 d-flex justify-content-center">
  <input class="form-check-input" type="radio" name="flexRadioDefault" value={''} id="flexRadioDefault1" defaultChecked onChange={(e) => setterStatus(e)}/>
  <label class="form-check-label" htmlFor="flexRadioDefault1">
    Todos
  </label>
</div>
      <div class="form-check col-4 d-flex justify-content-start">
  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value={'Unverified'}  onChange={(e) => setterStatus(e)}/>
  <label class="form-check-label" htmlFor="flexRadioDefault2">
    No verificados
  </label>
</div>
<div class="form-check col-4 d-flex justify-content-start">
  <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3"  value={'Aprove'}  onChange={(e) => setterStatus(e)}/>
  <label className="form-check-label" htmlFor="flexRadioDefault3">
    Verificados
  </label>
</div>
</div>
</div>
</div>
<div className="col-11 bg-light t-mod row">
  <div className="col-3">
Movimientos a visualizar
<Select options={numeros} onChange={handleVPage}/>
</div>

<table className="table">
<thead>
        <tr>
            <th>Identificador</th>
            <th>Nombre de usuario</th>
            <th>Cuenta</th>
            <th>Concepto</th>
            <th>Status</th>
            <th>Monto</th>
            <th>Fecha</th>
        </tr>
    </thead>
    <tbody>
  {

    filteredResults().map((m, i) => {
       bsTarget = `#exampleModal-${i}`
       bsId = `exampleModal-${i}`
      return (
        <tr>
                <td><button type="button" className="btn btn-outline-primary" data-bs-target={bsTarget} data-bs-toggle="modal" >{m.identificador}</button>
<div className="modal fade" id={bsId} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" key={m.identificador}>
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header row">
        <h1 className="modal-title fs-5 col-6" id="exampleModalLabel">Movimiento: {m.identificador}</h1>
        <div className="col-6 row">
          <div className="col-4"></div>
          <div className="col-8 d-flex justify-content-end">
          {statusSetter(m)}
          </div>
        </div>
      </div>
      <div className="modal-body row d-flex justify-content-center">
        <div className="col-6 row">
          <h6 className="col-12 titulo">Datos Generales</h6>
          <div className="col-12 subtitulo">Fecha de Creacion</div>
        <div className="col-12 texto">{m.fecha}</div>
        {
          !m.vale ? false : <div><div className="col-12 subtitulo">Vale de Aprobacion</div><div className="col-12 texto">{m.vale}</div></div>
        }
        {
          !m.vale ? false : <div><div className="col-12 subtitulo">Fecha de Aprobado</div><div className="col-12 texto">{m.aFecha}</div></div>
        }
        <div className="col-12 subtitulo">Concepto de movimiento</div>
        <div className="col-12 texto">{m.concepto}</div>
       


        </div>
        <div className="col-6 row">
        <h6 className="col-12 titulo">Datos de facturacion</h6>
        <div className="col-12 texto">{m.name}</div>
        <div className="col-12 subtitulo">Correo Electronico</div>
        <div className="col-12 texto">{m.email}</div>
        <div className="col-12 subtitulo">Tipo de Pago</div>
        <div className="col-12 texto">{m.pago}</div>
          <div className="col-12 subtitulo">Cuenta</div>
          <div className="col-12 texto">{m.cuenta}</div>
          {
          m.pago === 'Bs'?  <div><div className="col-12 subtitulo">Monto</div><div className="col-12 texto">{m.monto}$<div className="sub-texto">*Este monto es resultado de {m.bs}Bs a un cambio de {m.change}Bs por dolar</div></div></div> : <div><div className="col-12 subtitulo">Monto</div><div className="col-12 texto">{m.monto}$</div></div>
        }
        </div>
        { 
        !m.vale && am ? <div className="col-12"><hr />{aproveSetter2(m)}</div> : false
        }

      </div>
 

      <div className="modal-footer">
        {deleteMoves(m)}
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        {!m.vale && am ? <div>{aproveSetter3(m)}</div>: false}
      </div>
    </div>
  </div>
</div>
                </td>
                <td>{m.name}</td>
                <td >{m.cuenta}</td>
                <td >{m.concepto}</td>
                <td >{statusSetter(m)}</td>
                <td >{m.monto}$</td>
                <td >{m.fecha}</td>
        </tr>
    )})
  }
  </tbody>
  </table>
<Pagination>
{  
currentPage > 0 ? <Pagination.Prev onClick={prevPage}/> : false
}
{
  makePages()
}
{itemPagination.map((item) => {
  return item
})}
  {
    results.length > currentPage + vPage ?  <Pagination.Next onClick={nextPage}/> : false
  }
  </Pagination>
  </div>
  </div>
  </div>
</>
)
}

export default Moves