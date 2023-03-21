import { useEffect, useState }from 'react'
import Navg from '../sub-components/nav'
import Sidebar from '../sub-components/sidebar'
import { HexColorPicker } from "react-colorful";
import Pagination from 'react-bootstrap/Pagination'
import Select from 'react-select'
import 'boxicons'
import { backendUrl, frontUrl } from '../../lib/data/server';
import Swal from 'sweetalert2'
import {useNavigate} from 'react-router-dom'
import { gettingAccounts } from '../../lib/data/SelectOptions';

export const AccountConfig = ({socket}) => {
const ca = JSON.parse(localStorage.getItem('permissions')).configurarCuentas
const key = localStorage.getItem('key')
if (!key) {
  window.location.href=`${frontUrl()}/login`;
}
const navigate = useNavigate()
 const [accountName, setAccountName] = useState('')
 const [accountColor, setAccountColor] = useState('')
 const [accountChecked, setAccountChecked] = useState(true)
 const [cuentas, setCuentas] = useState([])
 const [_id, set_id] = useState('')
const [currentPage, setCurrentPage] = useState(0)
 const [estaba, setEstaba] = useState(1)
const [meEncuentro, setMeEncuentro] = useState(1)
const [deletingAccount, setDeletingAccount] = useState()
const [vPage, setVPage] = useState(10)
useEffect(() => {
  if (!ca) {
    navigate('/')
  }

  if (!key) {
    navigate("/login")
  }

}, [ca, key, navigate])


useEffect(() => {
  const sidebar = document.getElementById("sidebar");
  const navDiv = document.querySelector(".navDiv");
  console.log(navDiv);
  console.log(sidebar.classList.contains("close"));

  if (!sidebar.classList.contains("close")) {
    console.log("si lo tengo");
    sidebar.classList.toggle("close");
    // navDiv.classList.toggle("close");
  }
}, []);
useEffect(() => {
    let diff =  meEncuentro - estaba
    setCurrentPage(currentPage + (vPage * diff))
    getAccounts()
  }, [estaba, meEncuentro])

 
 const editCuenta = (u, i) => { 
        return(<button className='btn btn-primary' data-bs-toggle="modal" data-bs-target={`#actModal-${i}`} onClick={() => {
          setAccountChecked(u.saldo)
          setAccountColor(u.color)
          setAccountName(u.name)
        }}><box-icon name='edit-alt' color='#ffffff' ></box-icon></button>)
  }

 const getAccounts = async () => {
 await fetch(`${backendUrl()}/cuentas`).then(res => res.json()).then(r => {
    setCuentas(r)
    console.log(r)
    console.log(cuentas)
})
}

const actCuenta = async (u) => {
    let nombreCuenta;
    let colorCuenta;
    if (!accountName) {
        nombreCuenta = u.name
    } else {
        nombreCuenta = accountName
    }

    if (!accountColor) {
        colorCuenta = u.color
    } else {
    colorCuenta = accountColor
    }

    const actData = {_id: u._id, name: nombreCuenta, color: colorCuenta, saldo: accountChecked}
    
    await fetch(`${backendUrl()}/cuentas/actualizarCuenta`, {
      method: 'PUT',
      body: JSON.stringify(actData),
    headers: new Headers({ 'Content-type': 'application/json'})
  }).then(r => {
    console.log(r)
    if(r.status === 200) {
    Swal.fire({
  icon: 'success',
  title: 'Cuenta Actualizada con exito!',
})
} else {
    Swal.fire({
        icon: 'error',
        title: 'Algo extraño ha ocurrido!',
      })
}
}).then(r => console.log(r)).then(r => {
    getAccounts()
  }).then(
    setAccountName(''),
    setAccountColor(''),
    setAccountChecked(true)
  ).then(gettingAccounts())
}
const deleteCuenta = (u) => {
        return(<button className='btn btn-danger' value={u._id} onClick={(e) => {
      Swal.fire({
        title: 'Estas seguro que deseas eliminar esta cuenta?',
        showDenyButton: true,
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: `Cancelar`,
        denyButtonText: `Eliminar`,
      }).then((result) => { if (result.isDenied) {
        Swal.fire({
          title: 'Estas seguro COMPLETAMENTE que deseas eliminar esta cuenta?',
          showDenyButton: true,
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonText: `Cancelar`,
          denyButtonText: `Eliminar`,
        }).then((result) => { if (result.isDenied) {
          removeAccount(u._id)
          }
        })
        }
      })

        }}><box-icon name='trash' type='solid' color='#ffffff' ></box-icon></button>)
    }

    const removeAccount = async (id) => {
        await fetch(`${backendUrl()}/cuentas/eliminarCuenta`, {
          method: 'DELETE',
          body: JSON.stringify({_id: id}),
        headers: new Headers({ 'Content-type': 'application/json'})
      }).then(r => {
        if (r.status === 200) {
        Swal.fire({
        icon: 'success',
        title: 'Cuenta Eliminada con exito',
      })} else {
        Swal.fire({
            icon: 'error',
            title: 'Algo extraño ha ocurrido',
          })
      }
    }).then(r => console.log(r)).then(r => getAccounts())
      }
  
 const createAccount = () => {
        const registerData = {
            name: accountName,
            color: accountColor,
            saldo: accountChecked
        }
    fetch(`${backendUrl()}/cuentas/crearCuenta`, {
        method: 'POST',
        body: JSON.stringify(registerData),
      headers: new Headers({ 'Content-type': 'application/json'})
    }).then(r => {
        console.log(r)
        if(r.status === 201) {
        Swal.fire({
      icon: 'success',
      title: 'Cuenta creada con exito!',
    })
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Algo extraño ha ocurrido!',
          })
    }
}).then(r => getAccounts()).then(setAccountColor('')).then(setAccountName('')).then(gettingAccounts())
 }
 let itemPagination = [];
 let pages;
 const filteredResults = () => {
   return cuentas.slice(currentPage, currentPage + vPage)
 }
 
 const nextPage = () => {
   setEstaba(meEncuentro)
   setMeEncuentro(parseFloat(meEncuentro) + 1)
 }
 
 const prevPage = () => {
   setEstaba(meEncuentro)
   setMeEncuentro(parseFloat(meEncuentro) - 1)
 }
 const makePages = () => {
 pages = Math.ceil(cuentas.length / vPage)
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
    <div className="d-flex justify-content-center ">
    <div className="container-fluid row  d-flex justify-content-center">
    <div className="row bg-light col-11 filtros">
        <div className="toyox" data-bs-toggle="modal" data-bs-target="#registerModal">Crear una cuenta</div>
        <div className="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-scrollable">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="registerModalLabel">Crear una cuenta</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <form className="row">
  <div className="mb-1 col-6">
    <label className="form-label">Nombre de la cuenta</label>
    <input type="text" className="form-control"  onChange={(e) => {
        const value = e.target.value
        setAccountName(value)
    }}/>
  </div>
  <div className="mb-1 col-6">
    <label className="form-label">Color de la cuenta</label>
    <HexColorPicker color={`#aabbcc`} onChange={setAccountColor} />
    color: {accountColor}
  </div>
  <div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="modTime" defaultChecked={accountChecked} onChange={(e) => {
            let {checked} = e.target
            setAccountChecked(checked)
  }}/>
  <label class="form-check-label" for="modTime">
    Agregar a Saldo
  </label>
</div>
</form>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" className="btn btn-primary" onClick={() => createAccount()}>Crear</button>
      </div>
    </div>
    </div>
    </div>
    </div>
    <div className="col-11 bg-light t-mod row d-flex justify-content-start">
        <table className="table ">
    <thead>
        <tr>
            <th>Cuenta</th>
            <th>Color</th>
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody>
     {
        filteredResults().map((u, i) => {
            let id = `actModal-${i}`
            console.log(id)
            return (
            <tr>
            <td>{u.label}</td>
            <td><box-icon type='solid' color={u.color} name='circle'></box-icon>{"   "}{u.color}</td>
            <td >
                {editCuenta(u, i)}
<div class="modal fade" id={`actModal-${i}`} tabindex="-1" aria-labelledby="actModalLabel" aria-hidden="true">
<div class="modal-dialog modal-dialog-scrollable">
<div class="modal-content">
  <div class="modal-header">
    <h1 class="modal-title fs-5" id={`actModalLabel-${i}`}>Modificar cuenta</h1>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  </div>
  <div class="modal-body">
  <form>
  <div className="mb-3 col-6">
    <label className="form-label">Nombre de la cuenta</label>
    <input type="text" className="form-control" defaultValue={u.label} onChange={(e) => {
        const value = e.target.value
        setAccountName(value)
    }}/>
  </div>
  <div className="mb-3 col-6">
    <label className="form-label">Color de la cuenta</label>
    <HexColorPicker color={accountColor} onChange={setAccountColor} />
    color: {accountColor}
  </div>
  <div class="form-check ">
  <input class="form-check-input disabled" type="checkbox" value="" id={`actAproveMoves-${i}`}  defaultChecked={u.saldo} onChange={(e) => {
            const {checked} = e.target
            setAccountChecked(checked)
  }}/>
  <label class="form-check-label" for={`actAproveMoves-${i}`}>
    Agregar a saldo
  </label>
</div>
</form>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
    <button type="button" class="btn btn-primary" onClick={() => {
      actCuenta(u ,i)
      }}>Actualizar</button>
  </div>
</div>
</div>
</div>
                {"      "}
                {deleteCuenta(u)}
            </td>
            </tr>
        )})
    } 
    </tbody>
        </table>
    </div>
    </div>
    </div>
    </>
  )
}
