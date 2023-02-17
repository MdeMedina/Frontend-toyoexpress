import React, {useState, ChangeEvent, useRef, forwardRef} from 'react'
import Navg from '../sub-components/nav'
import Sidebar from '../sub-components/sidebar'
import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {useReactToPrint} from 'react-to-print'
import { faArrowsRotate, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import {ActModal} from '../sub-components/modal/ActModal'
import DatePicker from 'react-datepicker'
import Pagination from 'react-bootstrap/Pagination'
import Select from 'react-select'
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom'
import 'boxicons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import {formatDateHoy} from '../dates/dates'
import '../../css/moves.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import { url_api, url_local } from '../../lib/data/server';
import EModal from '../sub-components/modal/E-modal'
import { cuentas } from '../../lib/data/SelectOptions'

function Moves({socket}) {
  let cantidadM = localStorage.getItem('cantidadM')
  const hoy = `${formatDateHoy(new Date())}`
  const navigate = useNavigate()

  const MySwal = withReactContent(Swal)
  let fechaActual = new Date()
  let primerDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
 let handleClose = () => {
    document.body.classList.remove("modal-open");
  }
const vm = JSON.parse(localStorage.getItem("permissions")).verMovimientos
const am = JSON.parse(localStorage.getItem("permissions")).aprobarMovimientos
const dm = JSON.parse(localStorage.getItem("permissions")).eliminarMovimientos
const em = JSON.parse(localStorage.getItem("permissions")).editarMovimientos
const [moves, setMoves] = useState([])
const [room, setRoom] = useState()
const [actMovimiento, setActMovimiento] = useState(false)
const [ActCantidad, setActCantidad] = useState(cantidadM)
const [users, setUsers] = useState([])
const [monto, setMonto] = useState('')
const [myMove, setMyMove] = useState()
const [move, setMove] = useState()
const [actShow, setActShow] = useState(false)
const [newFecha, setNewFecha] = useState()
const [mostrar, setMostrar] = useState(false)
const [cuenta, setCuenta] = useState(null)
const [pago, setPago] = useState(null)
const [aproveN, setAproveN] = useState([])
const [egresoShow, setEgresoShow] = React.useState(false);
const [selectMove, setSelectMove] = useState('')
const [startDate, setStartDate] = useState(subDays(new Date(), 30));
const [startUDate, setStartUDate] = useState(primerDia)
const [minDate, setMinDate] = useState(primerDia)
const [endDate, setEndDate] = useState(new Date());
const [name, setName] = useState(null)
const [identificador, setIdentificador] = useState('')
const [Id, setId] = useState('')
const [pdfCuenta, setPdfCuenta] = useState(null)
const [pdfName, setPdfName] = useState(null)
const [nroAprobacion, setNroAprobacion] = useState('')
const [deletingMove, setDeletingMove] = useState()
const [searchStatus, setSearchStatus] = useState('')
const [vale, setVale] = useState('')
const [currentPage, setCurrentPage] = useState(0)
const [vPage, setVPage] = useState(cantidadM)
const [meEncuentro, setMeEncuentro] = useState(1)
const [estaba, setEstaba] = useState(1)
const [sortId, setSortId] = useState(0)
const [sortStatus, setSortStatus] = useState(0)
const [sortFecha, setSortFecha] = useState(0)
const [Fecha, setFecha] = useState()
const [bolos, setBolos] = useState(0)
const [cambio, setCambio] = useState(0)
const [newConcepto, setNewConcepto] = useState('')
const isAdmin = localStorage.getItem('role')
const getMoves = async () => {
  const response = await fetch(URL)
  let data = await response.json()
 setMoves(data)
}

const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
  <button className="toyox" onClick={onClick} ref={ref}>
    {value}
  </button>
));


const componentRef = useRef()
const handlePrint = useReactToPrint({
  content: () => componentRef.current,
  documentTitle: 'Movimiento',
  onAfterPrint: () => {
    setMostrar(false)
  }
})





const ComPrint = React.forwardRef((props, ref) => {
  return (
 <div ref={ref} className="mx-3
 my-3">
<div className="modal-header row ">
        <h1 className="modal-title fs-5 col-12">Movimiento: {move.identificador}</h1>
          <div className="col-4 d-flex justify-content-end">
          {statusSetter(move)}
        </div>
      </div>
      <div className="modal-body row d-flex justify-content-center">
        <div className=" row">
          <h6 className="col-12 titulo">Datos Generales</h6>
          <div className="col-12 subtitulo">Fecha de Creacion</div>
        <div className="col-12 texto">{move.fecha}</div>
        {
          !move.vale ? false : <div><div className="col-12 subtitulo">Vale de Aprobacion</div><div className="col-12 texto">{move.vale}</div></div>
        }
        {
          !move.vale ? false : <div><div className="col-12 subtitulo">Fecha de Aprobado</div><div className="col-12 texto">{move.aFecha}</div></div>
        }
        <div className="col-12 subtitulo">Concepto de movimiento</div>
        <div className="col-12 texto">{move.concepto}</div>
      
        <h6 className="col-12 titulo">Datos de facturacion</h6>
        <div className="col-12 texto">{move.name}</div>
        <div className="col-12 subtitulo">Correo Electronico</div>
        <div className="col-12 texto">{move.email}</div>
        <div className="col-12 subtitulo">Tipo de Pago</div>
        <div className="col-12 texto">{move.pago}</div>
          <div className="col-12 subtitulo">Cuenta</div>
          <div className="col-12 texto">{move.cuenta}</div>
          {
          move.pago === 'Bs'?  <div><div className="col-12 subtitulo">Monto</div><div className="col-12 texto">{numberFormat.format(move.monto)}<div className="sub-texto">*Este monto es resultado de {move.bs}Bs a un cambio de {move.change}Bs por dolar</div></div></div> : <div><div className="col-12 subtitulo">Monto</div><div className="col-12 texto">{numberFormat.format(move.monto)}</div></div>
        }
        </div>

      </div>
      </div>)})

      const btnId = (m) => {
        let id = m.identificador.split('-')

        if (id[0] === 'E') {
          return (<button type="button" className="btn btn-danger" data-bs-target={bsTarget} data-bs-toggle="modal" onClick={() => {
            setMove(m)
          }}>{m.identificador}</button>)
        } else if (id[0] === 'I') {
          return (<button type="button" className="btn btn-success" data-bs-target={bsTarget} data-bs-toggle="modal" onClick={() => {
            setMove(m)
          }}>{m.identificador}</button>)
        }
      }



const actDNote = async () => {
  let updateData = {email: localStorage.getItem('email'), notificaciones: []}
  await fetch(`${url_api}/users/actNotificaciones`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  headers: new Headers({ 'Content-type': 'application/json'})
  })
} 

useEffect(() => {
  actDNote()
})


useEffect(() => {
  actmoveCantidad()

}, [ActCantidad])
const actmoveCantidad = async () => {
  let actData = {
    email: localStorage.getItem('email'),
    cantidadM: parseInt(ActCantidad)
  }
  await fetch(`${url_api}/users/actualizarCantidad`, { method: 'PUT',
  body: JSON.stringify(actData),
headers: new Headers({ 'Content-type': 'application/json'})
}).then(localStorage.setItem('cantidadM', ActCantidad))
}


useEffect(() => {
  if (mostrar) {
    handlePrint()
  }
}, [mostrar])

function currencyFormatter({ currency, value}) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    minimumFractionDigits: 2,
    currency
  }) 
  return formatter.format(value)
}
const movimiento = async (id, cuenta, concepto, bs, change, monto, fecha, dollars, efectivo, zelle, otro ) => {
  let name = localStorage.getItem("name");
  let obj = {
     id,
    cuenta,
    concepto,
    dollars,
    otro,
    efectivo,
    zelle,
    bs,
    change,
    fecha,
    monto,
    name: name,
    email: localStorage.getItem('email'),
    messageId: localStorage.getItem("messageID")
  };
  
  let error = document.getElementById("error");
  if (!cuenta) {

    if (error.classList.contains("desaparecer")) {
      error.classList.remove("desaparecer");
    }
  }  else if (!monto) {

    if (error.classList.contains("desaparecer")) {
      error.classList.remove("desaparecer");
    }
  } else if (!concepto) {

    if (error.classList.contains("desaparecer")) {
      error.classList.remove("desaparecer");
    }
  } else {
    if (!error.classList.contains("desaparecer")) {
      error.classList.add("desaparecer");
    }

    return fetch(`${url_api}/moves/movimiento`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then(r => r.json()).then(r => {
        setMoves(r.moves)
        if (r.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Movimiento Creado con exito",
            showConfirmButton: false,
            timer: 1100
          })
        } else {
          Swal.fire({
            icon: "error",
            title: "Algo extraño ha ocurrido",
            text: "Comuniquese con el administrador",
            showConfirmButton: false,
            timer: 1100
          })
        }
      })
.then(socket.emit('move', `Hay ${moves.length} movimientos por aprobar!`)).then(setSelectMove(false)).then(setEgresoShow(false));
  }
};

const inputsLoads = () => {
  return (
    <div>
    <div className="col-4 align-self-start d-flex justify-content-start mt-2 mb-2 row"><div className="col-6"><label htmlFor="">Name</label></div><div className="col-6"><Select options={nombres} isMulti onChange={handlePdfNameValue} className="select-max"/></div></div> 
<div className="col-4 align-self-start d-flex justify-content-start mt-2 mb-2 row"><div className="col-6"><label htmlFor="">Cuenta</label></div><div className="col-6"><Select options={cuentas} isMulti onChange={handlePdfCuentaValue} className="select-max"/></div></div>
</div>
  )
}

const editMoves = (m, i) => { 
  if (em) {
      return(<button className='btn btn-primary closer' data-bs-toggle="modal" data-bs-target={`#actModal-${i}`} onClick={() => {         
        setMyMove(m)
        setIdentificador(m.identificador)
        setActShow(true)}}><box-icon name='edit-alt' color='#ffffff' size='20px'></box-icon></button>)
      }
  
}

const settingMounts = (id, cuenta, concepto, bs, change, monto, fecha, dollars, efectivo, zelle, otro) => {
    movimiento(id, cuenta, concepto, bs, change, monto, fecha, dollars, efectivo, zelle, otro)
}

const settingactmounts = (id, cuenta, concepto, bs, change, monto, fecha,  dollars, efectivo, zelle, otro) => {

  updateMove(id, cuenta, concepto, bs, change, monto, fecha,  dollars, efectivo, zelle, otro)
}

const updateMove = async (id, cuenta, concepto, bs, change, monto, fecha, dollars, efectivo, zelle, otro) => {

  let obj = {
    identificador: identificador,
    id,
    cuenta,
    dollars, 
    efectivo, 
    zelle,
    otro,
    concepto,
    bs,
    change,
    fecha,
    monto,
    name: name,
  };

   await fetch(`${url_api}/moves/updateMove`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    }).then(r => r.json()).then(r => {
      setMoves(r.moves)
      if (r.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Movimiento Actualizado con exito",
          showConfirmButton: false,
          timer: 1100
        })
      } else {
        Swal.fire({
          icon: "error",
          title: "Algo extraño ha ocurrido",
          text: "Comuniquese con el administrador",
          showConfirmButton: false,
          timer: 1100
        })
      }
    }).then(socket.emit('move', `Hay ${moves.length} movimientos por aprobar!`)).then(setActShow(false)).then(setActMovimiento(false));

  }



const negativos = (m, i) => {
  let id = m.identificador.split('-')

  if (id[0] == 'I') {
    return <td className='monto-table'>{numberFormat.format(m.monto)}</td>
  } else if (id[0] == 'E') {
    return <td className='monto-table egreso'> -{numberFormat.format(m.monto)}</td>
  }
}

const totalNegativo = (total) => {
  total = parseFloat(total)
  if (total >= 0) {
    return <td className='monto-table'><h6>{numberFormat.format(total)}</h6></td>
  } else if (total < 0) {
    return <td className='monto-table egreso'><h6 className='egreso'>{numberFormat.format(total)}</h6></td>
  }
}

const removeMove = async (identificador) => {

  await fetch(`${url_api}/moves/deleteMoves`, {
    method: 'PUT',
    body: JSON.stringify(identificador),
  headers: new Headers({ 'Content-type': 'application/json'})
}).then(r => r.json()).then(r => {
  setMoves(r.moves)
  if (r.status === 200) {
    Swal.fire({
      icon: "success",
      title: "Movimiento Eliminado con exito",
      showConfirmButton: false,
      timer: 1100
    })
  } else {
    Swal.fire({
      icon: "error",
      title: "Algo extraño ha ocurrido",
      text: "Comuniquese con el administrador",
      showConfirmButton: false,
      timer: 1100
    })
  }
}).then(socket.emit('move', `Hay ${moves.length} movimientos por aprobar!`)).then(setDeletingMove(false))
}
const deleteMoves = (m) => {
  if (dm) {
      return(<button className='btn btn-danger closer' value={m._id} onClick={(e) => {
    Swal.fire({
      title: 'Estas seguro que deseas eliminar este Movimiento?',
      showConfirmButton: false,
      showDenyButton: true,
      showCancelButton: true,
      cancelButtonText: `Cancelar`,
      denyButtonText: `Eliminar`,
    }).then((result) => { if (result.isDenied) {
      Swal.fire({
        title: 'Estas COMPLETAMENTE seguro que deseas eliminar este Movimiento?',
        showConfirmButton: false,
        showDenyButton: true,
        showCancelButton: true,
        cancelButtonText: `Cancelar`,
        denyButtonText: `Eliminar`,
      }).then((result) => { if (result.isDenied) {
    
        removeMove({identificador: m.identificador})
      
        }
      })
      }
    })
      }}><box-icon name='trash' type='solid' color='#ffffff' size='20px'></box-icon></button>)
  }
}
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

  setCurrentPage(0)
  setEstaba(1)
  setMeEncuentro(1)
  setVPage(e)
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
const handlePdfCuentaValue = (e) => {
  if (!e.length) {
    setPdfCuenta(null)
  }else {

    setPdfCuenta(e)
  }
  }
const handleTMoveValue = (e) => {
    setCurrentPage(0)
    setEstaba(1)
    setMeEncuentro(1)
    setId(e.value)
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
  const handlePdfNameValue = (e) => {
    if (!e.length) {
      setPdfName(null)
    }else {

      setPdfName(e)
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
    const handleAproveValue = (e) => {
      if (!e.length) {
        setNroAprobacion(null)
      }else {
        setCurrentPage(0)
        setEstaba(1)
        setMeEncuentro(1)
        setNroAprobacion(e)
      }
      }
  

    let tMoves = [
      {value: '', label: 'Todos'},
      {value: 'I', label: 'Ingresos'},
      {value: 'E', label: 'Egresos'}
    ]
let nombres = []
let tPagos = [
  {value: 'Bs', label: 'Bs'},
  {value: 'Zelle', label: 'Zelle'},
  {value: 'Efectivo', label: 'Efectivo'}
]

const aproveSetter2 = (move) => {
  if (am) { return(<div className="row px-3 py-2">
    <div className="col-4 d-flex align-items-center">
<label htmlFor="vale" className="form-label col-12 subtitulo">Nro de aprobacion</label>
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
    return (<button type="button" className="btn btn-success" data-bs-dismiss="modal" aria-label="Close" onClick={() => {
      updateStatus(move)
    }
    }>Aprobar</button>)
  }
}

const statusSetter = (move) => {
   if (!move.vale) {
    return (<div class="botonpendiente">Pendiente</div>)
  }
  else if (move.vale) {
    return (<div class="botonrealizado">Aprobado</div>)
  }
}
const statusSetterPdf = (move) => {
  if (!move.vale) {
   return "Pendiente"
 }
 else if (move.vale) {
   return "Aprobado"
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

  return arr.filter(item => {
   const arrfecha =  item.fecha.split('/')
   const fechaReal = new Date(arrfecha[2], parseInt(arrfecha[1] - 1), arrfecha[0])
   return (new Date(fechaReal) >= new Date(new Date(a).toDateString()) && new Date(fechaReal) <= new Date(new Date(b).toDateString()))
  });
}
function filterRangePDF(arr, a, b) {
  // agregamos paréntesis en torno a la expresión para mayor legibilidad

  return arr.filter(item => {
   const arrfecha =  item.fecha.split('/')
   const arrInit =  a.split('-')
   const arrEnd =  b.split('-')
   const fechaReal = new Date(arrfecha[2], parseInt(arrfecha[1] - 1), arrfecha[0])
  const init = new Date (arrInit[0], parseInt(arrInit[1] - 1), arrInit[2])
  const end = new Date (arrEnd[0], parseInt(arrEnd[1] - 1), arrEnd[2])
   return (new Date(fechaReal) >= init && new Date(fechaReal) <= end)
  });
}

const formatDate = (date) => {
  const arrInit =  date.split('-')
  const init = new Date (arrInit[0], parseInt(arrInit[1] - 1), arrInit[2])
  return formatDateHoy(init)
}

const mountingTotal = (total) => {
  total = parseFloat(total)
  if (total >= 0) {
    return <label className='ingreso-label d-flex align-items-center'>{numberFormat.format(total)}</label>
  } else if (total < 0) {
    return <label className='egreso-label d-flex align-items-center'>{numberFormat.format(total)}</label>
  }
}

const updateStatus = async (move) => {
  if (vale === '') {
    Swal.fire( "Oops" ,  "Por favor escriba el valor del vale!" ,  "error" )
  } else {
  let message = `Tu movimiento ${move.identificador} ha sido aprobado`
  let email = move.email
  let messageId = move.messageId
  let updateData = {
    identificador: move.identificador,
    aFecha: hoy,
    vale: vale
  }
await fetch(`${url_api}/moves/updateStatus`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  headers: new Headers({ 'Content-type': 'application/json'})
  }).then(r => {

    if (r.status === 403) {
      Swal.fire({
        icon: 'error',
        title: 'Ese Nro de aprobacion ya existe',
      })
    } else if (r.status === 200) {
      Swal.fire({
        icon: 'success',
        title: 'Movimiento Aprobado con exito',
      })
    }
  }).then(socket.emit('move', `Hay ${moves.length} movimientos por aprobar!`)).then(socket.emit("join_room", move.messageId)).then(socket.emit("send_aprove", { email, message, messageId }))
getMoves()

}   

}



useEffect(()=> {
  getMoves()
  gettingUsers() 
  socket.on('move', getMoves)

  return () => {
    socket.off('move', getMoves)
  }
}, [])
const setterMonto = (e) => {
  setCurrentPage(0)
  setEstaba(1)
  setMeEncuentro(1)
  setMonto(e.target.value)
}

const options2 = { style: 'currency', currency: 'USD'};
const numberFormat = new Intl.NumberFormat('es-ES', options2);


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

const stDateUSetter = (date) => {
  setCurrentPage(0)
  setEstaba(1)
  setMeEncuentro(1)
  setStartUDate(date)
}

const endDateSetter = (date) => {
  setCurrentPage(0)
  setEstaba(1)
  setMeEncuentro(1)
  setEndDate(date)
}

let alphaResults = [];
let betaResults = []
let results = [];
let totalOriginal = 0;
let inicio = new Date(startDate)
if (!vm) {
  inicio = new Date(startUDate)
}
let final = new Date(endDate)
if (!monto && !cuenta && !pago && !name && !Id && !searchStatus && !nroAprobacion) {
  betaResults = moves

  betaResults = betaResults.filter( (dato) => {

    return !dato.disabled
  })

  betaResults= filterRange(betaResults, inicio, final)
  if (vm === false) {
    betaResults = betaResults.filter((dato) => {
      return dato.name.includes(localStorage.getItem('name'))
    })
  }


if (sortId === 1) {
  betaResults = betaResults.sort((a, b) => {
    const arrId1 = a.identificador.split('-')
    const arrId2 = b.identificador.split('-')
    return ( parseInt(arrId2[1]) - parseInt(arrId1[1]))}
   )
  }else if (sortId === 2) {
    betaResults = betaResults.sort((a, b) => {
      const arrId1 = a.identificador.split('-')
      const arrId2 = b.identificador.split('-')
      return ( parseInt(arrId1[1]) - parseInt(arrId2[1]) )}
     )
  } else if (sortFecha === 1) {
   betaResults = betaResults.sort((a, b) => {
    const arrfecha1 =  a.fecha.split('/')
    const fechaReal1 = new Date(arrfecha1[2], parseInt(arrfecha1[1] - 1), arrfecha1[0])
    const arrfecha2 =  b.fecha.split('/')
    const fechaReal2 = new Date(arrfecha2[2], parseInt(arrfecha2[1] - 1), arrfecha2[0])
    return fechaReal2 -fechaReal1 
  })
  } else if (sortFecha === 2) {
       betaResults = betaResults.sort((a, b) => {
    const arrfecha1 =  a.fecha.split('/')
    const fechaReal1 = new Date(arrfecha1[2], parseInt(arrfecha1[1] - 1), arrfecha1[0])
    const arrfecha2 =  b.fecha.split('/')
    const fechaReal2 = new Date(arrfecha2[2], parseInt(arrfecha2[1] - 1), arrfecha2[0])
    return fechaReal1 -fechaReal2 
  })
  } else if (sortStatus === 1) {
    betaResults = betaResults.sort((a, b) => {
      if (a.vale && !b.vale) {
        return 1
      } else if (a.vale && b.vale) {
        return 0
      } else if (!a.vale && b.vale) {
        return -1
      } else if (!a.vale && !b.vale){
        return 0
      }
    })
  } else if (sortStatus === 2) {
    betaResults = betaResults.sort((a, b) => {
      if (!a.vale && b.vale) {
        return 1
      } else if (!a.vale && !b.vale) {
        return 0
      } else if (a.vale && !b.vale) {
        return -1
      } else if (a.vale && b.vale){
        return 0
      }
    })
  }

  results = betaResults
  betaResults.map((m, i) => {
    if (m.identificador.charAt(0) === 'E') {
      totalOriginal -= parseFloat(m.monto)
      }else if (m.identificador.charAt(0) === 'I') {
       totalOriginal += parseFloat(m.monto)
      }
  })
} else {
  betaResults = moves
    if (vm === false) {
    betaResults = betaResults.filter((dato) => {
      return dato.name.includes(localStorage.getItem('name'))
    })
  }
  betaResults= filterRange(betaResults, inicio, final)

  if (Id) {
    betaResults = betaResults.filter((dato) => {
      return dato.identificador.includes(Id)
    })
  }

    if (nroAprobacion) {
    betaResults = betaResults.filter((dato) => {
      return dato.vale.includes(nroAprobacion)
    })
  }

  if (pago) {
    alphaResults = []
    pago.map((c) => {
      betaResults.map((dato) => {
        const ident = (move) => {
          return move.identificador = dato.identificador
        }
        if (c.value == 'Bs' && dato.dollars > 0) {

          if (alphaResults.indexOf(dato) === -1){
          alphaResults.push(dato)
          }
        } 

         if (c.value == 'Efectivo' && dato.efectivo > 0) {
          if (alphaResults.indexOf(dato) === -1 ){
            alphaResults.push(dato)
            }
        } 

         if (c.value == 'Zelle' && dato.zelle > 0) {
          if (alphaResults.indexOf(dato) === -1){
            alphaResults.push(dato)
            }
        }      })
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
  betaResults = betaResults.filter( (dato) => {

    return !dato.disabled
  })

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


  if (searchStatus === 'Aprove') {
    betaResults = betaResults.filter( (dato) => {
      return dato.vale 
    })
   }else if (searchStatus === 'Unverified') {
        betaResults = betaResults.filter( (dato) => {
      return !dato.vale
    })
   }


   if (sortId === 1) {
    betaResults = betaResults.sort((a, b) => {
      const arrId1 = a.identificador.split('-')
      const arrId2 = b.identificador.split('-')
      return ( parseInt(arrId2[1]) - parseInt(arrId1[1]))}
     )
    }else if (sortId === 2) {
      betaResults = betaResults.sort((a, b) => {
        const arrId1 = a.identificador.split('-')
        const arrId2 = b.identificador.split('-')
        return ( parseInt(arrId1[1]) - parseInt(arrId2[1]) )}
       )
    } else if (sortFecha === 1) {
     betaResults = betaResults.sort((a, b) => {
      const arrfecha1 =  a.fecha.split('/')
      const fechaReal1 = new Date(arrfecha1[2], parseInt(arrfecha1[1] - 1), arrfecha1[0])
      const arrfecha2 =  b.fecha.split('/')
      const fechaReal2 = new Date(arrfecha2[2], parseInt(arrfecha2[1] - 1), arrfecha2[0])
      return fechaReal2 -fechaReal1 
    })
    } else if (sortFecha === 2) {
         betaResults = betaResults.sort((a, b) => {
      const arrfecha1 =  a.fecha.split('/')
      const fechaReal1 = new Date(arrfecha1[2], parseInt(arrfecha1[1] - 1), arrfecha1[0])
      const arrfecha2 =  b.fecha.split('/')
      const fechaReal2 = new Date(arrfecha2[2], parseInt(arrfecha2[1] - 1), arrfecha2[0])
      return fechaReal1 -fechaReal2 
    })
    } else if (sortStatus === 1) {
      betaResults = betaResults.sort((a, b) => {
        if (a.vale && !b.vale) {
          return 1
        } else if (a.vale && b.vale) {
          return 0
        } else if (!a.vale && b.vale) {
          return -1
        } else if (!a.vale && !b.vale){
          return 0
        }
      })
    } else if (sortStatus === 2) {
      betaResults = betaResults.sort((a, b) => {
        if (!a.vale && b.vale) {
          return 1
        } else if (!a.vale && !b.vale) {
          return 0
        } else if (a.vale && !b.vale) {
          return -1
        } else if (a.vale && b.vale){
          return 0
        }
      })
    }

  results = betaResults
  betaResults.map((m, i) => {
    if (m.identificador.charAt(0) === 'E') {
      totalOriginal -= parseFloat(m.monto)
      }else if (m.identificador.charAt(0) === 'I') {
       totalOriginal += parseFloat(m.monto)
      }
  })
}
const filteredResults = () => {
  return results.slice(currentPage, currentPage + vPage)
}
const filteredResultsPDF = (init, fin) => {
  let results;
  let alphaResults = [];
  let betaResults = moves
  betaResults = betaResults.filter( (dato) => {
    return !dato.disabled
  })

  if (vm === false) {
    betaResults = betaResults.filter((dato) => {
      return dato.name.includes(localStorage.getItem('name'))
    })

  }
  if (pdfCuenta) {
    alphaResults = []
    pdfCuenta.map((c) => {
      betaResults.map((dato) => {
        if (c.value === dato.cuenta) {
          alphaResults.push(dato)
        }
      })
      })
      betaResults = alphaResults
  }
  if (pdfName) {
    alphaResults = []
    pdfName.map((c) => {
      betaResults.map((dato) => {
        if (c.value === dato.name) {
          alphaResults.push(dato)
        }
      })
    })
    betaResults = alphaResults
}

  betaResults= filterRangePDF(betaResults, init, fin)
  betaResults = betaResults.sort((a, b) => {
    const arrId1 = a.identificador.split('-')
    const arrId2 = b.identificador.split('-')
    return ( parseInt(arrId2[1]) - parseInt(arrId1[1]) )})

  //   betaResults = betaResults.sort((a, b) => {
  //    const arrfecha1 =  a.fecha.split('/')
  //    const fechaReal1 = new Date(arrfecha1[2], parseInt(arrfecha1[1] - 1), arrfecha1[0])
  //    const arrfecha2 =  b.fecha.split('/')
  //    const fechaReal2 = new Date(arrfecha2[2], parseInt(arrfecha2[1] - 1), arrfecha2[0])
  //    return fechaReal1 - fechaReal2 
  //  })
   results = betaResults

   return results
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
let total = 0;
let pdfTotal = 0;
let table = [];
function filtPDF (init, fin) {
filteredResultsPDF(init, fin).map((m, i) => {
  if (m.identificador.charAt(0) === 'E') {
    pdfTotal -= parseFloat(m.monto)
    }else if (m.identificador.charAt(0) === 'I') {
     pdfTotal += parseFloat(m.monto)
    }
    let id = m.identificador.split('-')
    let manto;
    if (id[0] == 'I') {
       manto = `${m.monto}`
    }else if (id[0] == 'E'){
       manto = `-${m.monto}`
    }
  const bodys = {
  identificador: m.identificador, 
  username: m.name, 
  cuenta: m.cuenta,
  concepto: m.concepto,
  status: statusSetterPdf(m),
  aprobacion: m.vale,
  fecha: m.fecha,
  monto: manto,
  }
  table.push (bodys)
})
table.push({fecha: "Total", monto: `$${pdfTotal.toFixed(2)}`})}
let bsIdLabel
return (
<>
  <div className="d-flex justify-content-center">
  <div className="container-fluid row  d-flex justify-content-center">
  <div className="row bg-light col-11 div-btn">
  <div className="toyox" onClick={() => setEgresoShow(true)}>Crear un movimiento</div>
  <EModal
                      show={egresoShow}
                      onHide={() => setEgresoShow(false)}
                      settingMounts={settingMounts}
                    />
  </div>
  <div className="row bg-light col-11 filtros">
  <h2 className='col-12'>Filtros de busqueda de movimientos</h2>
  <div className="col-4 align-self-start d-flex justify-content-start mt-2 mb-2 row ">
 <div className="col-6">
  <label htmlFor="">Tipo de movimiento</label>
  </div>
  <div className="col-6">
  <Select options={tMoves} onChange={(e) => {
   handleTMoveValue(e)
  }} className="select-max"/>
  </div>
  </div>
    { !vm ? false: <div className="col-4 align-self-start d-flex justify-content-start mt-2 mb-2 row">
  <div className="col-6">
  <label htmlFor="">Name</label>
  </div>
  <div className="col-6">
  {
    users.map((u) => {
      nombres.push({value: u.username, label: u.username})
    })}
  <Select options={nombres} isMulti onChange={handleNameValue} className="select-max"/>
  </div>
  </div>
  }
  <div className="col-4 align-self-start d-flex justify-content-start mt-2 mb-2 row">
  <div className="col-6">
  <label htmlFor="">Cuenta</label>
  </div>
  <div className="col-6">
  <Select options={cuentas} isMulti onChange={handleCuentaValue} className="select-max"/>
  </div>
  </div>
  <div className="col-4 align-self-start d-flex justify-content-start mt-2 mb-2 row">
  <div className="col-6">
  <label htmlFor="">Nro de aprobacion</label>
  </div>
  <div className="col-6">
  <input type="text" className="form-control onda" onChange={(e) => {
      const {value} = e.target
      handleAproveValue(value)
    }}/>
  </div>

  </div>
  <div className="col-4 align-self-start d-flex justify-content-start mt-2 mb-2 row">
  <div className="col-6">
  <label htmlFor="">Tipo de pago</label>
  </div>
  <div className="col-6">

  <Select options={tPagos} isMulti onChange={handlePayValue} className="select-max"/>
  </div>
  </div>
  <div className="col-4 align-self-start d-flex justify-content-start mt-2 mb-2 row">
  <div className="col-6">
  <label htmlFor="">Total:</label>
  </div>
  <div className="col-6 d-flex align-items-center">
  {mountingTotal(totalOriginal)}
  </div>
  </div>
  <br />
  <br />
  <hr />
  <div className="container-fluid row d-flex justify-content-center">
    <div className="col-6 row">
{ vm ? <div className="col-6">
        fecha de inicio:
  <DatePicker
        selected={startDate}
        onChange={(date) => stDateSetter(date)}
        dateFormat="dd/MM/yyyy"
        maxDate={addDays(new Date(), 0)}
        customInput={<ExampleCustomInput />}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        className='yesAdmin'
      />
      </div> : <div className="col-6">
        fecha de inicio:
  <DatePicker
        selected={startUDate}
        onChange={(date) => stDateUSetter(date)}
        dateFormat="dd/MM/yyyy"
        maxDate={addDays(new Date(), 0)}
        minDate={minDate}
        customInput={<ExampleCustomInput />}
        selectsStart
        startDate={startUDate}
        endDate={endDate}
        className='yesAdmin'
      />
      </div>} 
{vm ? <div className="col-6">
        fecha de cierre:
      <DatePicker
        selected={endDate}
        onChange={(date) => endDateSetter(date)}
        dateFormat="dd/MM/yyyy"
        selectsEnd
        startDate={startDate}
        customInput={<ExampleCustomInput />}
        endDate={endDate}
        maxDate={addDays(new Date(), 0)}
        minDate={startDate}
        wrapperClassName='d-flex justify-content-center'
        className='yesAdmin'
      />     
      </div> : <div className="col-6">
        fecha de cierre:
      <DatePicker
        selected={endDate}
        onChange={(date) => endDateSetter(date)}
        dateFormat="dd/MM/yyyy"
        selectsEnd
        startDate={startUDate}
        customInput={<ExampleCustomInput />}
        endDate={endDate}
        maxDate={addDays(new Date(), 0)}
        minDate={startUDate}
        wrapperClassName='d-flex justify-content-center'
        className='yesAdmin'
      />     
      </div>}
      </div>
      <div className="col-5 row ">
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
<div className='col-1 d-flex align-items-center justify-content-end'>
<button className='toyox lt' onClick={() => {   
                window.location.reload(false);
}}><FontAwesomeIcon icon={faArrowsRotate} /></button> 
</div>
</div>
</div>
<div className="col-11 bg-light t-mod row">
  <div className="col-4">
Movimientos a visualizar {"  "}
<select onChange={(e) => {
  const {value} = e.target
  handleVPage(parseInt(value))
  setActCantidad(value)
  }}>
  {
    ActCantidad == 10 ? <>  
    <option value={10} selected>10</option>
    <option value={20}>20</option>
      <option value={50}>50</option>
  </> : ActCantidad == 20 ? <>
    <option value={10}>10</option>
    <option value={20} selected>20</option>
      <option value={50}>50</option></> : ActCantidad == 50 ? <>
    <option value={10}>10</option>
    <option value={20}>20</option>
      <option value={50} selected>50</option></> : false
  }




</select>
</div>
<div className="col-8 d-flex align-items-center justify-content-end">
  <button type="button" class="toyox" onClick={() => {
    MySwal.fire({
      title: 'Escoja la fecha para la impresion',
      html:<>
      <div className='row rw-bit d-flex justify-content-center'>
      {vm ? <div className="col-6 align-self-start d-flex justify-content-start mt-2 mb-2 row"><div className="col-6"><label htmlFor="">Usuario</label></div><div className="col-12"><Select options={nombres} isMulti onChange={handlePdfNameValue} className="select-max-pdf"/></div></div> : false}
 <div className="col-6 align-self-start d-flex justify-content-start mt-2 mb-2 row"><div className="col-6"><label htmlFor="">Cuenta</label></div><div className="col-12"><Select options={cuentas} isMulti onChange={handlePdfCuentaValue} className="select-max-pdf"/></div></div></div>
      <div class="col-12 d-flex justify-content-center">Fecha de inicio:</div><div class="col-12 d-flex justify-content-center"><input type="date" id="swal-input1" /></div> <br /> 
        <div class="col-12 d-flex justify-content-center">Fecha final:</div><div class="col-12 d-flex justify-content-center"><input type="date" id="swal-input2" /></div></>
        
    }).then((result) => {
      if (result.isConfirmed) {
      var doc = new jsPDF()
      let input1 = document.getElementById('swal-input1').value
      let input2 = document.getElementById('swal-input2').value
      filtPDF(input1, input2)

      doc.setFontSize(18)
      doc.text('Reporte: Ingresos y Egresos', 64, 6)
      doc.setFontSize(12)
      input1 = formatDate(input1)
      input2 = formatDate(input2)
      doc.text(`Desde: ${input1}`, 14, 12)
      doc.text(`Hasta: ${input2}`, 54, 12)
    autoTable(doc, {    
      styles: {fontSize: 8},
      theme: 'grid',
      columnStyles: { monto: { halign: 'right' } }, 
    body: table,
    columns: [
      { header: 'Identificador', dataKey: 'identificador' },
      { header: 'Nombre de Usuario', dataKey: 'username' },
      { header: 'Cuenta', dataKey: 'cuenta' },
      { header: 'Concepto', dataKey: 'concepto' },
      { header: 'Status', dataKey: 'status' },
      { header: 'Nro de Aprobación', dataKey: 'aprobacion' },
      { header: 'Fecha', dataKey: 'fecha' },
      { header: 'Monto', dataKey: 'monto' }
    ], })
    doc.save(`Reporte Movimientos desde ${input1} hasta ${input2}.pdf`)
  }
    })
  }}>Imprimir</button>
  </div>
  <hr className="e-change"/>
<table className="table">
<thead>
        <tr>
            <th onClick={() => {
              sortId === 1 ? setSortId(2) : sortId === 2 ? setSortId(1) : sortId === 0 ? setSortId(1) : setSortId(1)
              setSortFecha(0)
              setSortStatus(0)
            }} ><div className='d-flex'>  Identificador{sortId === 1 ? <box-icon name='chevron-down'></box-icon> : sortId === 2  ?  <box-icon name='chevron-up'></box-icon> : <box-icon name='chevron-down' color='#b1b0b0' ></box-icon>} </div></th>
            <th>Usuario</th>
            <th>Cuenta</th>
            <th>Concepto</th>
            <th onClick={() => {
              sortStatus === 1 ? setSortStatus(2) : sortStatus === 2 ? setSortStatus(1) : sortStatus === 0 ? setSortStatus(1) : setSortStatus(1)
              setSortFecha(0)
              setSortId(0)
            }}><div className='d-flex'>Status {sortStatus === 1 ? <box-icon name='chevron-down'></box-icon> : sortStatus === 2  ?  <box-icon name='chevron-up'></box-icon> : <box-icon name='chevron-down' color='#b1b0b0' ></box-icon>}</div></th>
            <th>Nro de aprobacion</th>
            <th onClick={() => {
              sortFecha === 1 ? setSortFecha(2) : sortFecha === 2 ? setSortFecha(1) : sortFecha === 0 ? setSortFecha(1) : setSortFecha(1)
              setSortId(0)
              setSortStatus(0)
            }}><div className='d-flex'>Fecha {sortFecha === 1 ? <box-icon name='chevron-down'></box-icon> : sortFecha === 2  ?  <box-icon name='chevron-up'></box-icon> : <box-icon name='chevron-down' color='#b1b0b0' ></box-icon>}</div></th>
            <th>Acciones</th>
            <th className='monto-table'>Monto</th>
        </tr>
    </thead>
    <tbody>
  {
    filteredResults().map((m, i) => {
       bsTarget = `#exampleModal-${i}`
       bsId = `exampleModal-${i}`
       bsIdLabel = `exampleModalLabel-${i}`
       if (m.identificador.charAt(0) === 'E') {
       total -= parseFloat(m.monto)
       }else if (m.identificador.charAt(0) === 'I') {
        total += parseFloat(m.monto)
       }
      return (
        <tr className='tra'>
      <td>{btnId(m)}
<div className="modal fade" id={bsId} tabIndex="-1" aria-labelledby={`exampleModalLabel-${i}`} aria-hidden="true" key={m.identificador}>
  <div className="modal-dialog">
    <div className="modal-content">
      <div className='print'>
      <div className="modal-header row">
        <h1 className="modal-title fs-5 col-6" id={bsIdLabel}>Movimiento: {m.identificador}</h1>
        <div className="col-6 row">
          <div className="col-3"></div>
          <div className="col-6 d-flex justify-content-end">
          {statusSetter(m)}
          </div>
          <div className="col-3">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
        </div>
      </div>
      <div className="modal-body row d-flex justify-content-center">
        <div className="col-5  d">
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
        <div className="col-7 row ca">
        <h6 className="col-12 titulo">Datos de facturacion</h6>
        <div className="col-12 texto"><span className="subtitulo">Usuario: </span>{m.name}</div>
        <div className="col-12 subtitulo">Correo Electronico</div>
        <div className="col-12 texto">{m.email}</div>
        <div className="col-12 subtitulo">Pagos:</div>
        {m.efectivo > 0 ? <div className="col-12 texto">Efectivo: ${m.efectivo}</div> : false}
        {m.zelle > 0 ? <div className="col-12 texto">Zelle:${m.zelle}</div> : false}
        {m.otro > 0 ? <div className="col-12 texto">Otros:${m.otro}</div> : false}
        {m.dollars > 0 ? <div className="col-12 texto">Pago en Bolivares</div> : false}
        {m.dollars > 0 ? <div className="col-4 texto">Valor $: ${m.dollars} </div> : false}
        {m.dollars > 0 ? <div className="col-4 texto">Cambio: {m.change}Bs</div> : false}
        {m.dollars > 0 ? <div className="col-4 texto"><div >Bs:</div> {m.bs}Bs</div> : false}
        <div className="col-12 texto">{m.pago}</div>
          <div className="col-12 subtitulo">Cuenta</div>
          <div className="col-12 texto">{m.cuenta}</div>
          {
          m.pago === 'Bs'?  <div><div className="col-12 subtitulo">Total</div><div className="col-12 texto">{numberFormat.format(m.monto)}<div className="sub-texto">*Este monto es resultado de {m.bs}Bs a un cambio de {m.change}Bs por dolar</div></div></div> : <div><div className="col-12 subtitulo">Monto</div><div className="col-12 texto">{numberFormat.format(m.monto)}</div></div>
        }
        </div>

      </div>
      </div>
      <div className='row'></div>
        { 
        !m.vale && am ? <div className="col-12"><hr />{aproveSetter2(m)}</div> : false
        }
      <div className="modal-footer">
        <button className='toyox' onClick={() => {
          setMostrar(true)
          }}>Imprimir</button>
        {!m.vale && am ? <div>{aproveSetter3(m)}</div>: false}
        {
            mostrar ? <ComPrint move={m} ref={componentRef} /> :false
          }
      </div>
    </div>
  </div>
</div>
                </td>
                <td>{m.name}</td>
                <td >{m.cuenta}</td>
                <td className='concepto-table'>{m.concepto}</td>
                <td >{statusSetter(m)}</td>
                <td >{!m.vale ? "No aprobado" : m.vale}</td>
                <td >{m.fecha}</td>
                <td>
                  <div className='row'>
                <div className="col-4">
                {editMoves(m, i)}
                {
                  actShow ?
                <ActModal
                  key={i}
                      show={actShow}
                      move={myMove}
                      onHide={() => {
                        handleClose()
                        setActShow(false)
                      }}
                      settingActMounts={(id, cuenta, concepto, bs, change, monto, fecha, dollars, efectivo, zelle) => settingactmounts(id, cuenta, concepto, bs, change, monto, fecha, dollars, efectivo, zelle)}
                      i={i} /> : false}
                      </div>
                      <div className="col-4">
                      {deleteMoves(m)}
                      </div>
                      </div>
                      </td>
               {negativos(m,i)}

        </tr>

    )})
  }
  <tr>
                 <td>{"   "}</td>
                <td >{"   "}</td>
                <td >{"   "}</td>
                <td >{"   "}</td>
                <td>{"  "}</td>
                <td>{"  "}</td>
                <td>{"  "}</td>
                <td className='monto-table'><h6>Total:</h6></td>
                {totalNegativo(total)}
  </tr>
  </tbody>
  </table>
  <div className="col-12 d-flex justify-content-end">
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
  </div>
</>
)
}

export default Moves