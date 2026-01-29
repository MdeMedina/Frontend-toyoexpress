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
import { backendUrl, frontUrl } from '../../lib/data/server';
import EModal from '../sub-components/modal/E-modal'
import { cuentas, gettingAccounts } from '../../lib/data/SelectOptions'

function Moves({socket}) {
  const media = window.innerWidth
  let cantidadM = localStorage.getItem('cantidadM')
  const key = localStorage.getItem("token");
  if (!key) {
    window.location.href = `${frontUrl()}/logout`;
  } 
  const hoy = `${formatDateHoy(new Date())}`
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  useEffect(() => {
    const sidebar = document.getElementById("sidebar");
    const navDiv = document.querySelector(".navDiv");
    gettingAccounts()
    console.log(navDiv);
    console.log(sidebar.classList.contains("close"));

    if (!sidebar.classList.contains("close")) {
      console.log("si lo tengo");
      sidebar.classList.toggle("close");
      // navDiv.classList.toggle("close");
    }
  }, []);

  const MySwal = withReactContent(Swal)
  let fechaActual = new Date()
  let primerDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
 let handleClose = () => {
    document.body.classList.remove("modal-open");
  }
const vm = JSON.parse(localStorage.getItem("permissions")).verOtrosMovimientos
const am = JSON.parse(localStorage.getItem("permissions")).aprobarMovimientos
const dm = JSON.parse(localStorage.getItem("permissions")).eliminarMovimientos
const mf = JSON.parse(localStorage.getItem("permissions")).modificarFechas
const em = JSON.parse(localStorage.getItem("permissions")).editarMovimientos
const [moves, setMoves] = useState([])
const [editKey, setEditKey] = useState()
const [montoCajaChica, setMontoCajaChica] = useState(0);
const [montoTotal, setMontoTotal] = useState(0);
const [room, setRoom] = useState()
const [condicionBusqueda, setCondicionBusqueda] = useState({status: 'Unverified'});
const [pagina, setPagina] = useState(1);
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
const [startDate, setStartDate] = useState(mf? subDays(new Date(), 30) : new Date(new Date().setDate(1)));
const [endDate, setEndDate] = useState(new Date());
const [fechas, setFechas] = useState({from: startDate, to: endDate})
const [startUDate, setStartUDate] = useState(primerDia)
const [minDate, setMinDate] = useState(primerDia)
const [name, setName] = useState(null)
const [concepto, setConcepto] = useState(null)
const [identificador, setIdentificador] = useState('')
const [Id, setId] = useState('')
const [pdfCuenta, setPdfCuenta] = useState(null)
const [pdfName, setPdfName] = useState(null)
const [nroAprobacion, setNroAprobacion] = useState('')
const [deletingMove, setDeletingMove] = useState()
const [searchStatus, setSearchStatus] = useState('')
const [vale, setVale] = useState('')
const [currentPage, setCurrentPage] = useState(0)
const [vPage, setVPage] = useState(parseInt(cantidadM))
const [meEncuentro, setMeEncuentro] = useState(1)
const [estaba, setEstaba] = useState(1)
const [sortId, setSortId] = useState(0)
const [sortStatus, setSortStatus] = useState(0)
const [sortFecha, setSortFecha] = useState(0)
const [Fecha, setFecha] = useState()
const [bolos, setBolos] = useState(0)
const [cambio, setCambio] = useState(0)
const [newConcepto, setNewConcepto] = useState('')
const nm = localStorage.getItem('name')
const [totalMovimientos, setTotalMovimientos] = useState(0);



const getMoves = async ( condition, pagina, cantidad, fechas, sort) => {
  if (!sort) {
    sort = {_id: 1}
  }
  const response = await fetch(URL, {
    method:'POST',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({condition, pagina, cantidad, fechas, sort, vm, nm}),
  })
  if (response.status === 401) {
    console.log("saliendo por la derecha en get moves", response);
    window.location.href = `${frontUrl()}/login`
    return false
  }
  let data = await response.json()
  console.log(data)
 setMoves(data.movimientos)
 setTotalMovimientos(data.total)
 setMontoCajaChica(Number(data.cajaChica.toFixed(2)))
 setMontoTotal(Number(data.saldo.toFixed(2)))
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

useEffect(() => {
  let inicio = new Date(startDate)
  let final = new Date(endDate)
  final = final.setDate(final.getDate())
  final= new Date(final)
  setFechas({from: inicio, to: final});
}, [startDate, endDate]);






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
  await fetch(`${backendUrl()}/users/actNotificaciones`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
    headers: new Headers({ 'Content-type': 'application/json', "Authorization": `Bearer ${token}`}),
  
  })
  .then(res => {
    if(res.status === 401) {
      window.location.href =`${frontUrl()}/logout`
      return false
    }
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
  await fetch(`${backendUrl()}/users/actualizarCantidad`, { method: 'PUT',
  body: JSON.stringify(actData),
  headers: new Headers({ 'Content-type': 'application/json', "Authorization": `Bearer ${token}`}),
}).then(res => {
  if(res.status === 401) {
    window.location.href =`${frontUrl()}/logout`
    return false
  }
}).then(localStorage.setItem('cantidadM', ActCantidad))
}

useEffect(() => {
  if (moves.length > 0) {
  if (!sortId._id){
    getMoves(condicionBusqueda, pagina, vPage, fechas, sortFecha);
  } else {
    getMoves(condicionBusqueda, pagina, vPage, fechas, sortId);
  }
  }
}, [sortId, sortFecha]);



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

const paginacion = (ciclo, total) => {
  const cantidad = Math.ceil(total / ciclo);
  console.log(cantidad)
  return (
    <div className="anterior col-9 d-flex align-items-center">
      <Pagination size="sm" className='mb-0'>
        {Array.from(Array(cantidad).keys()).map((number) => {
          const active = pagina === number + 1 ? true : false;
          return (
            <Pagination.Item
              key={number + 1}
              active={active}
              onClick={() => paginar(number + 1, active)}
            >
              {number + 1}
            </Pagination.Item>
          );
        })}
      </Pagination>
    </div>
  );
};

const paginar = (page, ignorar) => {
  if (ignorar) return false;
  setPagina(page);
  if (!sortId._id && !sortFecha.fecha) {  
    getMoves(condicionBusqueda, page, vPage, fechas);
  } else if (!sortId._id) {
    getMoves(condicionBusqueda, page, vPage, fechas, sortFecha);
  } else {
    getMoves(condicionBusqueda, page, vPage, fechas, sortId);
  }

};

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

    return fetch(`${backendUrl()}/moves/movimiento`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(obj),
    }).then(res => {
      if(res.status === 401) {
        window.location.href =`${frontUrl()}/logout`
        return false
      }
      return res.json()
    }).then(r => {
        if (r.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Movimiento Creado con exito",
            showConfirmButton: false,
            timer: 1100
          }).then(setPagina(1)).then(getMoves(condicionBusqueda, 1, vPage, fechas))
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
        setEditKey(m.identificador)        
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

   await fetch(`${backendUrl()}/moves/updateMove`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(obj),
    }).then(res => {
      if(res.status === 401) {
        window.location.href =`${frontUrl()}/logout`
        return false
      }
      return res.json()
    }).then(r => {
      if (r.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Movimiento Actualizado con exito",
          showConfirmButton: false,
          timer: 1100
        }).then(setPagina(1)).then(getMoves(condicionBusqueda, 1, vPage, fechas))
      } else {
        Swal.fire({
          icon: "error",
          title: "Algo extraño ha ocurrido",
          text: "Comuniquese con el administrador",
          showConfirmButton: false,
          timer: 1100
        })
      }
    }).then().then(socket.emit('move', `Hay ${moves.length} movimientos por aprobar!`)).then(setActShow(false)).then(setActMovimiento(false));

  }



const negativos = (m, i) => {
  let id = m.identificador.split('-')
 let mont =  parseFloat(m.monto)
  if (id[0] == 'E' && mont > 0) {
    mont = mont * -1
  }

  if (id[0] == 'I') {
    return <td className='monto-table'>{numberFormat.format(mont.toFixed(2))}</td>
  } else if (id[0] == 'E') {
    return <td className='monto-table egreso'> {numberFormat.format(mont.toFixed(2))}</td>
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

  await fetch(`${backendUrl()}/moves/deleteMoves`, {
    method: 'PUT',
    body: JSON.stringify(identificador),
  headers: new Headers({ 'Content-type': 'application/json', "Authorization": `Bearer ${token}`})
}).then(res => {
  if(res.status === 401) {
    window.location.href =`${frontUrl()}/logout`
    return false
  }
  return res.json()
}).then(r => {
  if (r.status === 200) {
    Swal.fire({
      icon: "success",
      title: "Movimiento Eliminado con exito",
      showConfirmButton: false,
      timer: 1100
    }).then(setPagina(1)).then(getMoves(condicionBusqueda, 1, vPage, fechas))
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
const URL = `${backendUrl()}/moves`
const gettingUsers = async() => {
  await fetch(`${backendUrl()}/users`, {
    headers: {"Authorization": `Bearer ${token}`}
  }).then(res => {
    if(res.status === 401) {
      window.location.href =`${frontUrl()}/logout`
      return false
    }
    return res.json()
  }).then((users) => {
    setUsers(users.users)
}) 
}

useEffect(() => {
  if (!sortId._id && !sortFecha.fecha) {  
    getMoves(condicionBusqueda, 1, vPage, fechas);
  } else if (!sortId._id) {
    getMoves(condicionBusqueda, 1, vPage, fechas, sortFecha);
  } else {
    getMoves(condicionBusqueda, 1, vPage, fechas, sortId);
  }
  setPagina(1);
}, [condicionBusqueda, vPage, fechas]);


const handleVPage = (e) => {

  setCurrentPage(0)
  setEstaba(1)
  setMeEncuentro(1)
  setVPage(parseInt(e))
}

const handleCuentaValue = (e) => {
  let values = e.map(item => item.value)
if (!e.length) {
  setCondicionBusqueda(prev => ({...prev, cuenta: ''}))
}else {
  setCurrentPage(0)
  setEstaba(1)
  setMeEncuentro(1)
  setCondicionBusqueda(prev => ({...prev, cuenta: values}))
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
      setCondicionBusqueda(prev => ({...prev, identificador: e.value}))
  }
const handleNameValue = (e) => {
  let values = e.map(item => item.value)
  if (!e.length) {
    setCondicionBusqueda(prev => ({...prev, name: ''}))
  }else {
    setCurrentPage(0)
    setEstaba(1)
    setMeEncuentro(1)
    setCondicionBusqueda(prev => ({...prev, name: values}))
  }
  }
  const handleConceptoValue = (e) => {
    if (!e.length) {
      setCondicionBusqueda(prev => ({...prev, concepto: ''}))
    }else {
      setCurrentPage(0)
      setEstaba(1)
      setMeEncuentro(1)
      setCondicionBusqueda(prev => ({...prev, concepto: e}))
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
    let values = e.map(item => item.value)
    if (!e.length) {
      setCondicionBusqueda(prev => ({...prev, pago: null}))
    }else {
      setCurrentPage(0)
      setEstaba(1)
      setMeEncuentro(1)
      setCondicionBusqueda(prev => ({...prev, pago: values}))
    }
    }
    const handleAproveValue = (e) => {
      if (!e.length) {
        setCondicionBusqueda(prev => ({...prev, vale: ''}))
      }else {
        setCurrentPage(0)
        setEstaba(1)
        setMeEncuentro(1)
        setCondicionBusqueda(prev => ({...prev, vale: e}))
      }
      }

  

    let tMoves = [
      {value: '', label: 'Todos'},
      {value: 'I', label: 'Ingresos'},
      {value: 'E', label: 'Egresos'}
    ]
let nombres = []
let tPagos = [
  {value: 'bs', label: 'Bs'},
  {value: 'zelle', label: 'Zelle'},
  {value: 'efectivo', label: 'Efectivo'}
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

const getMovesPDF = async ( condition, fechas) => {
  const response = await fetch(`${URL}/PDF`, {
    method:'POST',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({condition, fechas})
  })
  if (response.status === 401) {
    window.location.href = `${frontUrl()}/login` 
    return false
  }
  let data = await response.json()
 return {moves: data.movimientos, saldoInicio: data.fechaInicio, saldoFin: data.fechaFin}
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
function formatearFecha(fechaString) {
  const fecha = new Date(fechaString);
  fecha.setDate(fecha.getDate() + 1);
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const año = fecha.getFullYear().toString().slice(-2);

  return `${dia}/${mes}/${año}`;
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
function filterRangePDFinit(arr, a, b) {
  // agregamos paréntesis en torno a la expresión para mayor legibilidad

  return arr.filter(item => {
   const arrfecha =  item.fecha.split('/')
   const arrInit =  a.split('-')
   const arrEnd =  b.split('-')
   const fechaReal = new Date(arrfecha[2], parseInt(arrfecha[1] - 1), arrfecha[0])
  const init = new Date (arrInit[0], parseInt(arrInit[1] - 1), arrInit[2])
  const end = new Date (arrEnd[0], parseInt(arrEnd[1] - 1), (arrEnd[2] - 1))
   return (new Date(fechaReal) >= init && new Date(fechaReal) <= end)
  });
}


const formatDate = (date) => {
  const arrInit =  date.split('-')
  const init = new Date (arrInit[0], parseInt(arrInit[1] - 1), arrInit[2])
  return formatDateHoy(init)
}



const mountingTotal = () => {

  if (montoTotal > 0) {
    return <label className='ingreso-label '>{montoTotal}$</label>
  } else if (montoTotal < 0) {
    return <label className='egreso-label'>{montoTotal}$</label>
  } else {
    return <label className=''>{montoTotal}$</label>
  }
}


const mountingTotalCC = () => {

  if (montoCajaChica > 0) {
    return <label className='ingreso-label '>{montoCajaChica}$</label>
  } else if (montoCajaChica < 0) {
    return <label className='egreso-label'>{montoCajaChica}$</label>
  } else {
    return <label className=''>{montoCajaChica}$</label>
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
await fetch(`${backendUrl()}/moves/updateStatus`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  headers: new Headers({ 'Content-type': 'application/json', "Authorization": `Bearer ${token}`})
  }).then(r => {
    if (r.status === 401) {
      window.location.href =`${frontUrl()}/logout`
      return false
    }

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
 let sort
  if (!sortId._id && !sortFecha.fecha){
    getMoves(condicionBusqueda, 1, vPage, fechas)
  } else if (!sortId._id) {
    getMoves(condicionBusqueda, 1, vPage, fechas, sortFecha)
  } else {
    getMoves(condicionBusqueda, 1, vPage, fechas, sortId)
  }

setPagina(1);

}   

}



useEffect(()=> {
  if (!sortId._id && !sortFecha.fecha){
    getMoves(condicionBusqueda, 1, vPage, fechas)
  } else if (!sortId._id) {
    getMoves(condicionBusqueda, 1, vPage, fechas, sortFecha)
  } else {
    getMoves(condicionBusqueda, 1, vPage, fechas, sortId)
  }
  setPagina(1);
  gettingUsers() 
  socket.on('move', () => {  if (!sortId._id && !sortFecha.fecha){
    getMoves(condicionBusqueda, 1, vPage, fechas)
  } else if (!sortId._id) {
    getMoves(condicionBusqueda, 1, vPage, fechas, sortFecha)
  } else {
    getMoves(condicionBusqueda, 1, vPage, fechas, sortId)
  } 
    setPagina(1)})

  return () => {
    socket.off('move', () => {  if (!sortId._id && !sortFecha.fecha){
      getMoves(condicionBusqueda, 1, vPage, fechas)
    } else if (!sortId._id) {
      getMoves(condicionBusqueda, 1, vPage, fechas, sortFecha)
    } else {
      getMoves(condicionBusqueda, 1, vPage, fechas, sortId)
    }    
      setPagina(1)})
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
  setCondicionBusqueda(prev => ({...prev, status: e.target.value}))
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



const filteredResultsPDF = (init, fin, pdC, pdN) => {
  let results;
  let alphaResults = [];
  let inicialSald = []
  let betaResults = moves
  betaResults = betaResults.filter( (dato) => {
    return !dato.disabled
  })

  if (vm === false) {
    betaResults = betaResults.filter((dato) => {
      return dato.name.includes(localStorage.getItem('name'))
    })

  }
  if (pdC) {
    console.log(pdC)
    alphaResults = []
    pdC.map((c) => {
      betaResults.map((dato) => {
        if (c.value === dato.cuenta) {
          alphaResults.push(dato)
        }
      })
      })
      betaResults = alphaResults
  }
  if (pdN) {
    alphaResults = []
    pdN.map((c) => {
      betaResults.map((dato) => {
        if (c.value === dato.name) {
          alphaResults.push(dato)
        }
      })
    })
    betaResults = alphaResults
}

  inicialSald = filterRangePDFinit(betaResults, '09-01-2023', init)
  betaResults= filterRangePDF(betaResults, init, fin)
  betaResults = betaResults.sort((a, b) => {
    const arrId1 = a.identificador.split('-')
    const arrId2 = b.identificador.split('-')
    return (  parseInt(arrId1[1]) - parseInt(arrId2[1])  )})

  //   betaResults = betaResults.sort((a, b) => {
  //    const arrfecha1 =  a.fecha.split('/')
  //    const fechaReal1 = new Date(arrfecha1[2], parseInt(arrfecha1[1] - 1), arrfecha1[0])
  //    const arrfecha2 =  b.fecha.split('/')
  //    const fechaReal2 = new Date(arrfecha2[2], parseInt(arrfecha2[1] - 1), arrfecha2[0])
  //    return fechaReal1 - fechaReal2 
  //  })
  alphaResults = []
  let tempSald = 0;
  let initFinalSald = 0;
  let finalSald = 0
  inicialSald.map((i) => {
    tempSald = parseFloat(i.monto)
    if (i.identificador.charAt(0) === 'E') {
   if (tempSald > 0) {
     tempSald = tempSald * -1 
    }
  }
  if (i.disabled == false) {
    initFinalSald = (initFinalSald + tempSald).toFixed(2)
    initFinalSald = parseFloat(initFinalSald)
  }
})

betaResults.map((r) => {
 r.monto = parseFloat(r.monto)
 if (r.identificador.charAt(0) === 'E') {
  if (r.monto > 0) {
   r.monto = r.monto * -1 
  }
 }
 if (r.disabled == false) {
  finalSald = (finalSald + r.monto).toFixed(2)
  finalSald = parseFloat(finalSald)
  }
 alphaResults.push(r)
})
betaResults = alphaResults
   results = betaResults
   finalSald = (finalSald + initFinalSald).toFixed(2)
   

   return {results, initFinalSald, finalSald}
}

const filteredResultsPDFCC = (init, fin, pdC, pdN) => {
  let results;
  let alphaResults = [];
  let inicialSald = []
  let betaResults = moves
  betaResults = betaResults.filter( (dato) => {
    return !dato.disabled
  })

  betaResults.map((dato) => {
    cuentas.map((c) => {
      if (dato.cuenta == c.label && c.saldo == false) {
        alphaResults.push(dato)
      }
    })
  })
  betaResults = alphaResults

  inicialSald = filterRangePDFinit(betaResults, '09-01-2023', init)
  betaResults= filterRangePDF(betaResults, init, fin)
  betaResults = betaResults.sort((a, b) => {
    const arrId1 = a.identificador.split('-')
    const arrId2 = b.identificador.split('-')
    return (  parseInt(arrId1[1]) - parseInt(arrId2[1])  )})

  //   betaResults = betaResults.sort((a, b) => {
  //    const arrfecha1 =  a.fecha.split('/')
  //    const fechaReal1 = new Date(arrfecha1[2], parseInt(arrfecha1[1] - 1), arrfecha1[0])
  //    const arrfecha2 =  b.fecha.split('/')
  //    const fechaReal2 = new Date(arrfecha2[2], parseInt(arrfecha2[1] - 1), arrfecha2[0])
  //    return fechaReal1 - fechaReal2 
  //  })
  alphaResults = []
  let tempSald = 0;
  let initFinalSald = 0;
  let finalSald = 0
  betaResults.map((r) => {
   r.monto = parseFloat(r.monto)
   if (r.identificador.charAt(0) === 'E') {
    if (r.monto > 0) {
     r.monto = r.monto * -1 
    }
   }
   if (r.disabled == false) {
    finalSald = (finalSald + r.monto).toFixed(2)
    finalSald = parseFloat(finalSald)
    }
   alphaResults.push(r)
 })
inicialSald.map((i) => {
  tempSald = parseFloat(i.monto)
  if (i.identificador.charAt(0) === 'E') {
   if (tempSald > 0) {
    tempSald = tempSald * -1 
   }
  }
  if (i.disabled == false) {
    initFinalSald = (initFinalSald + tempSald).toFixed(2)
    initFinalSald = parseFloat(initFinalSald)
    }
})
 betaResults = alphaResults
   results = betaResults
   finalSald = (finalSald + initFinalSald).toFixed(2)

   return {results, initFinalSald, finalSald}
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
let total = 0;
let pdfTotal = 0;
let totalI = 0;
let totalE = 0;
let table = [];
function filtPDF (init, fin, pdC, pdN) {
  let resulting;
  let ini;
  let fini;

  if(vm) {
  const {results, initFinalSald, finalSald} = filteredResultsPDF(init, fin, pdC, pdN)
  ini = initFinalSald
  fini = finalSald
 resulting = results
}else {
  const {results, initFinalSald, finalSald} = filteredResultsPDFCC(init, fin, pdC, pdN)
  ini = initFinalSald
  fini = finalSald
  resulting = results
}
table.push({ingreso: "Saldo Inicial:", egreso: `$${ini}`})
resulting.map((m, i) => {
 if (m.monto > 0) {
  totalI += m.monto
 } else if (m.monto < 0) {
  totalE += m.monto
 }
  pdfTotal += m.monto
  const bodys = {
  identificador: m.identificador, 
  username: m.name, 
  cuenta: m.cuenta,
  concepto: m.concepto,
  status: statusSetterPdf(m),
  aprobacion: m.vale,
  fecha: formatearFecha(m.fecha),
  ingreso: m.monto > 0 ? m.monto : 0.00,
  egreso: m.monto < 0 ? m.monto : 0.00
  }
  table.push (bodys)
})
table.push({ingreso: "Saldo Final:", egreso: `$${fini}`})
}
let bsIdLabel
let pdC;
let pdN
let conceptos = []
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
  <h2  className=' row col-12' data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample"> <div className="col-10">Filtros de busqueda de movimientos</div><div className="col-2 cent"><div className="d-flex align-items-center"><box-icon name='chevron-down'></box-icon></div></div></h2> 
  <div className="col-md-4 col-xs-12 align-self-start d-flex justify-content-start mt-2 mb-2 row ">
 <div className="col-6">
  <label htmlFor="">Tipo de movimiento</label>
  </div>
  <div className="col-6">
  <Select options={tMoves} onChange={(e) => {
   handleTMoveValue(e)
  }} className="select-max"/>
  </div>
  </div>
    { !vm ? false: <div className="col-md-4 col-xs-12 align-self-start d-flex justify-content-start mt-2 mb-2 row">
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
  <div className="col-md-4 col-xs-12 align-self-start d-flex justify-content-start mt-2 mb-2 row">
  <div className="col-6">
  <label htmlFor="">Cuenta</label>
  </div>
  <div className="col-6">
  <Select options={cuentas} isMulti onChange={handleCuentaValue} className="select-max"/>
  </div>
  </div>
  <div className="col-md-4 col-xs-12 align-self-start d-flex justify-content-start mt-2 mb-2 row">
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
  <div className="col-md-4 col-xs-12 align-self-start d-flex justify-content-start mt-2 mb-2 row">
  <div className="col-6">
  <label htmlFor="">Tipo de pago</label>
  </div>
  <div className="col-6">

  <Select options={tPagos} isMulti onChange={handlePayValue} className="select-max"/>
  </div>
  </div>
  <div className="col-md-4 col-xs-12 align-self-start d-flex justify-content-start mt-2 mb-2 row">
  <div className="col-6">
  <label htmlFor="">Concepto</label>
  </div>
  <div className="col-6">
  <input type="text" className="form-control onda" onChange={(e) => {
      const {value} = e.target
      handleConceptoValue(value)
    }}/>
  </div>
  </div>
  

{
    media > 414 ? 
      <div className="col-12 align-self-center d-flex justify-content-center mt-2 mb-2 row">
      <div className="col-md-3 col-xs-1 d-flex justify-content-end">
      <label htmlFor="">Caja Chica:</label>
      </div>
      <div className="col-md-4 col-xs-6 d-flex align-items-center justify-content-start">
      {mountingTotalCC()}
      </div>
      {vm ? (
      <>
      <div className="col-md-2 col-xs-4 d-flex justify-content-end">
      <label htmlFor="">Saldo Total:</label>
      </div>
      <div className="col-md-3 col-xs-6 d-flex align-items-center justify-content-start">
      {mountingTotal()}
      </div>
      </>
      ) : false}
      </div> : false
  }
  {
    media > 416 ? <> <br />
    <br /></> : false
  }
 
  <hr />
  <div className="container-fluid row d-flex justify-content-center">
    <div className="col-md-6 col-xs-12 mb-3 row">
{ vm ? <div className="col-6">
        Fecha de inicio:
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
        Fecha de inicio:
  <DatePicker
        selected={startDate}
        onChange={(date) => stDateSetter(date)}
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
        Fecha de cierre:
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
        Fecha de cierre:
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
      </div>}
      </div>
      <div className="col-md-5 col-xs-12 row ">
        <h4 className='d-flex justify-content-center'>Status de movimiento</h4> 
      <div class="form-check col-md-4 col-xs-12 d-flex justify-content-start">
  <input class="form-check-input" type="radio" name="flexRadioDefault" value={''} id="flexRadioDefault1"  onChange={(e) => setterStatus(e)}/>
  <label class="form-check-label" htmlFor="flexRadioDefault1">
    Todos
  </label>
</div>
      <div class="form-check col-md-4 col-xs-12 d-flex justify-content-start">
  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value={'Unverified'} defaultChecked  onChange={(e) => setterStatus(e)}/>
  <label class="form-check-label" htmlFor="flexRadioDefault2">
    No verificados
  </label>
</div>
<div class="form-check col-md-4 col-xs-12 d-flex justify-content-start">
  <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3"  value={'Aprove'}  onChange={(e) => setterStatus(e)}/>
  <label className="form-check-label" htmlFor="flexRadioDefault3">
    Verificados
  </label>
  
</div>

</div>
</div>
{
    media <= 414 ? 
      <div className="col-md-12 align-self-start d-flex justify-content-start mt-2 mb-2 row">
      <div className="col-md-3 col-xs-1">
      <label htmlFor="">Caja Chica:</label>
      </div>
      <div className="col-md-4 col-xs-6 ">
      <label className='ingreso-label '>{montoCajaChica}$</label>
      </div>
      {vm ? (
      <>
      <div className="col-md-2 col-xs-4">
      <label htmlFor="">Saldo Total:</label>
      </div>
      <div className="col-md-3 col-xs-6 ">
      <label className='ingreso-label '>{montoTotal}$</label>
      </div>
      </>
      ) : false}
      </div> : false
  }
<div className='col-12 d-flex align-items-center justify-content-center'>
<button className='toyox lt' onClick={() => {   
                window.location.reload(false);
}}><FontAwesomeIcon icon={faArrowsRotate} /></button> 
</div>
</div>
<div className="col-11 bg-light t-mod row">
<div className="col-12 row" >
  <div className="col-1 d-flex align-items-center">
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
{paginacion(vPage, totalMovimientos)}
<div className="col-2 d-flex align-items-center justify-content-end">
  <button type="button" class="toyox" onClick={() => {
    MySwal.fire({
      title: 'Escoja la fecha para la impresion',
      html:<>
      <div className='row rw-bit d-flex justify-content-center'>
      {vm ? <div className="col-6 align-self-start d-flex justify-content-start mt-2 mb-2 row"><div className="col-6"><label htmlFor="">Usuario</label></div><div className="col-12"><Select options={nombres} id='name' isMulti onChange={async (e) => {
        pdN = e
  }}  className="select-max-pdf"/></div></div> : false}
    { vm ?
 <div className="col-6 align-self-start d-flex justify-content-start mt-2 mb-2 row"><div className="col-6"><label htmlFor="">Cuenta</label></div><div className="col-12"><Select options={cuentas}  isMulti id='cuenta' onChange={async (e) => {
    pdC = e
  }} className="select-max-pdf"/></div></div> : false }</div>
      <div class="col-12 d-flex justify-content-center">Fecha de inicio:</div><div class="col-12 d-flex justify-content-center"><input type="date" id="swal-input1" /></div> <br /> 
        <div class="col-12 d-flex justify-content-center">Fecha final:</div><div class="col-12 d-flex justify-content-center"><input type="date" id="swal-input2" /></div></>
        
    }).then((result) => {
      if (result.isConfirmed) {
      let doc
      let input1 = document.getElementById('swal-input1').value
      let input2 = document.getElementById('swal-input2').value
     async function generarPDF() {
        doc = new jsPDF();
        input1 = document.getElementById('swal-input1').value;
        input2 = document.getElementById('swal-input2').value;
        console.log(pdC, pdN);
        let table = []
        let valoresU = pdN.map((v) => {
          return v.value
        })
        let valoresC = pdC.map((v) => {
          return v.value
        })
        let iSald;
        let fSald;
        let movis
        if (vm) {
        let {moves, saldoInicio, saldoFin} = await getMovesPDF({name: valoresU, cuenta: valoresC}, {from: input1, to:input2})
        movis = moves
        iSald = saldoInicio.total
        fSald = saldoFin.total
        table.push({ingreso: "Saldo Inicial:", egreso: `$${iSald}`})
        movis.map((m, i) => {
           const bodys = {
           identificador: m.identificador, 
           username: m.name, 
           cuenta: m.cuenta,
           concepto: m.concepto,
           status: statusSetterPdf(m),
           aprobacion: m.vale,
           fecha: formatearFecha(m.fecha),
           ingreso: m.monto > 0 ? m.monto : 0.00,
           egreso: m.monto < 0 ? m.monto : 0.00
           }
           table.push (bodys)
         })
         table.push({ingreso: "Saldo Final:", egreso: `$${fSald}`})
        }else {
          let {moves, saldoInicio, saldoFin} = await getMovesPDF({cuenta: ["CajaChica"]}, {from: input1, to:input2})
          movis = moves
          iSald = saldoInicio.cajaChica
          fSald = saldoFin.cajaChica
          table.push({ingreso: "Saldo Inicial:", egreso: `$${iSald}`})
          movis.map((m, i) => {
             const bodys = {
             identificador: m.identificador, 
             username: m.name, 
             cuenta: m.cuenta,
             concepto: m.concepto,
             status: statusSetterPdf(m),
             aprobacion: m.vale,
             fecha: formatearFecha(m.fecha),
             ingreso: m.monto > 0 ? m.monto : 0.00,
             egreso: m.monto < 0 ? m.monto : 0.00
             }
             table.push (bodys)
           })
           table.push({ingreso: "Saldo Final:", egreso: `$${fSald}`})
        }
      
        doc.setFontSize(18);
        doc.text('Reporte: Ingresos y Egresos', 64, 6);
        input1 = formatDate(input1);
        input2 = formatDate(input2);
        doc.setFontSize(12);
        doc.text(`Desde: ${input1}`, 14, 12);
        doc.text(`Hasta: ${input2}`, 54, 12);
        autoTable(doc, {    
          styles: {fontSize: 7},
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
            { header: 'Ingreso', dataKey: 'ingreso' },
            { header: 'Egreso', dataKey: 'egreso' },
          ],
        });
        doc.save(`Reporte Movimientos desde ${input1} hasta ${input2}.pdf`);
        doc = null; // liberar memoria asignando null al objeto doc
        pdC = null;
        pdN = null;
      }
  generarPDF()      
  }
    })
  }}>Imprimir</button>
  </div>
  </div>
  <hr className="e-change"/>
  <div className="tab-c col-12">
<table className="table">
<thead>
        <tr>
            <th onClick={() => {
              sortId._id === 1 ? setSortId({_id: -1}) : sortId._id === -1 ? setSortId({_id: 1}) : sortId === 0 ? setSortId({_id: -1}) : setSortId({_id: -1})
              setSortFecha(0)
            }} ><div className='d-flex'>  Identificador{sortId._id === -1 ? <box-icon name='chevron-down'></box-icon> : sortId._id === 1  ?  <box-icon name='chevron-up'></box-icon> : <box-icon name='chevron-down' color='#b1b0b0' ></box-icon>} </div></th>
            <th>Usuario</th>
            <th>Cuenta</th>
            <th>Concepto</th>
            <th><div className='d-flex'>Status </div></th>
            <th>Nro de aprobacion</th>
            <th onClick={() => {
              sortFecha.fecha === 1 ? setSortFecha({fecha: -1}) : sortFecha.fecha === -1 ? setSortFecha({fecha: 1}) : sortFecha === 0 ? setSortFecha({fecha: -1}) : setSortFecha({fecha: -1})
              setSortId(0)
            }}><div className='d-flex'>Fecha {sortFecha.fecha === -1 ? <box-icon name='chevron-down'></box-icon> : sortFecha.fecha === 1  ?  <box-icon name='chevron-up'></box-icon> : <box-icon name='chevron-down' color='#b1b0b0' ></box-icon>}</div></th>
            <th>Acciones</th>
            <th className='monto-table'>Monto</th>
        </tr>
    </thead>
    <tbody>

  {
    moves.map((m, i) => {
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
        <div className="col-12 texto">{formatearFecha(m.fecha)}</div>
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
        {m.efectivo > 0 ? <div className="col-12 texto">Efectivo: ${m.efectivo.toFixed(2)}</div> : false}
        {m.zelle > 0 ? <div className="col-12 texto">Zelle:${m.zelle.toFixed(2)}</div> : false}
        {m.otro > 0 ? <div className="col-12 texto">Otros:${m.otro.toFixed(2)}</div> : false}
        {m.dollars > 0 ? <div className="col-12 texto">Pago en Bolivares</div> : false}
        {m.dollars > 0 ? <div className="col-4 texto">Valor $: ${m.dollars.toFixed(2)} </div> : false}
        {m.dollars > 0 ? <div className="col-4 texto">Cambio: {m.change.toFixed(2)}Bs</div> : false}
        {m.dollars > 0 ? <div className="col-4 texto"><div >Bs:</div> {m.bs.toFixed(2)}Bs</div> : false}
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
                <td >{formatearFecha(m.fecha)}</td>
                <td>
                  <div className='row'>
                <div className="col-4">
                {editMoves(m, i)}
                {
                  actShow && editKey === m.identificador?
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
  </tbody>
  </table>
  </div>
  <div className="col-12 d-flex justify-content-end">
  </div>


  </div>
  </div>
  </div>
</>
)
}

export default Moves