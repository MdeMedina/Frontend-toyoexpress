import { useEffect, useState }from 'react'
import Navg from '../sub-components/nav'
import Sidebar from '../sub-components/sidebar'
import { backendUrl, frontUrl} from '../../lib/data/server'
import Pagination from 'react-bootstrap/Pagination'
import Select from 'react-select'
import 'boxicons'
import Swal from 'sweetalert2'
function User({socket}) {
  const modUsuarios = JSON.parse(localStorage.getItem('permissions')).modificarUsuarios
  const delUsuarios = JSON.parse(localStorage.getItem('permissions')).eliminarUsuarios
    const key = localStorage.getItem("key");
    if (!key) {
      window.location.href=`${frontUrl()}/login`;
    }
    
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
  
  const [users, setUsers] = useState([])
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [_id, set_id] = useState('')
  const [verMoves, setVerMoves] = useState(false)
  const [verMovesOt, setVerMovesOt] = useState(false)
  const [aproveMoves, setAproveMoves] = useState(false)
  const [delMoves, setDelMoves] = useState(false)
  const [cUsers, setCUsers] = useState(false)
  const [vExcel, setVExcel] = useState(false)
  const [modUsers, setModUsers] = useState(false)
  const [modFechas, setModFechas] = useState(false)
  const [delUsers, setDelUsers] = useState(false)
  const [deletingUser, setDeletingUser] = useState()
  const [consultaPrecios, setConsultaPrecios] = useState()
  const [currentPage, setCurrentPage] = useState(0)
const [vPage, setVPage] = useState(10)
const [meEncuentro, setMeEncuentro] = useState(1)
const [estaba, setEstaba] = useState(1)
  const [sHours, setSHours] = useState(false)
  const [oHours, setOHours] = useState(false)
  const [eMoves, setEMoves] = useState(false)
  const [cAccounts, setCAccounts] = useState(false)

  let numeros = [
    {value: 2, label: 2},
    {value: 3, label: 3},
    {value: 4, label: 4}
  ]

useEffect(() => {
  let diff =  meEncuentro - estaba
  setCurrentPage(currentPage + (vPage * diff))
}, [estaba, meEncuentro])

const handleVPage = (e) => {
  setCurrentPage(0)
  setEstaba(1)
  setMeEncuentro(1)
  setVPage(e.value)
}
  const gettingUsers = () => {
    fetch(`${backendUrl()}/users`).then(res => res.json()).then(({users}) => {
      setUsers(users)

  })
  }
  useEffect(() => {
 gettingUsers()
  }, [])

  const editUsers = (u, i) => { 
    if (modUsuarios) {
        return(<button className='btn btn-primary' data-bs-toggle="modal" data-bs-target={`#actModal-${i}`}><box-icon name='edit-alt' color='#ffffff' ></box-icon></button>)
    }
  }

  const removeUser = async () => {
    await fetch(`${backendUrl()}/users/deleteUser`, {
      method: 'DELETE',
      body: JSON.stringify(deletingUser),
    headers: new Headers({ 'Content-type': 'application/json'})
  }).then(res => res.json()).then(r => setUsers(r)).then(Swal.fire({
    icon: 'success',
    title: 'Usuario Eliminado con exito',
  }))
  }

  const deleteUsers = (u) => {
    if (delUsuarios) {
        return(<button className='btn btn-danger' value={u._id} onClick={(e) => {
      Swal.fire({
        title: 'Estas seguro que deseas eliminar a este usuario?',
        showDenyButton: true,
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: `Cancelar`,
        denyButtonText: `Eliminar`,
      }).then((result) => { if (result.isDenied) {
        Swal.fire({
          title: 'Estas seguro COMPLETAMENTE de que deseas eliminar a este usuario?',
          showDenyButton: true,
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonText: `Cancelar`,
          denyButtonText: `Eliminar`,
        }).then(result => {if (result.isDenied){
          setDeletingUser({ _id: u._id})
          removeUser()
        }})
        }
      })

        }}><box-icon name='trash' type='solid' color='#ffffff' ></box-icon></button>)
    }
  }

  const handlerDisable = () => {
    const vm = document.getElementById('movesVista').checked
    const vmo = document.getElementById('movesVistaOt')
    const cu = document.getElementById('createU').checked
    const am = document.getElementById('aproveMoves')
    const mf = document.getElementById('modFechas')
    const em = document.getElementById('eMoves')
    const dm = document.getElementById('delMoves')
    const mu = document.getElementById('modU')
    const du = document.getElementById('deleteU')
    if (!vm) {
        vmo.setAttribute("disabled", "")
        am.setAttribute("disabled", "")
        dm.setAttribute("disabled", "")
        mf.setAttribute("disabled", "")
        em.setAttribute("disabled", "")
    }else if (vm) {
      vmo.setAttribute("disabled", "")
        am.removeAttribute("disabled")
        dm.removeAttribute("disabled")
        mf.removeAttribute("disabled")
        em.removeAttribute("disabled")
    }

    if (!cu) {

        mu.setAttribute("disabled", "")
        du.setAttribute("disabled", "")
    }else if (cu) {
        mu.removeAttribute("disabled")
        du.removeAttribute("disabled")
    }
  }

  const createUser = () => {
    const cPass = document.getElementById('InputPassword2').value
    if (email === ''){
        Swal.fire("Ooops!" ,"Por favor ingrese un correo electronico", "error")
    }else if (!username) {
      Swal.fire("Ooops!" ,"Por favor ingrese un nombre de usuario", "error")
    }else if(password === ''){
      Swal.fire("Ooops!" ,"Por favor ingrese una contraseña", "error")
    }else if (password !== cPass) {
      Swal.fire("Ooops!" ,"Las contraseñas no coinciden", "error")
    }else {
        const registerData = {
            email: email,
            username: username,
            permissions: {
                consultarPrecios: consultaPrecios,
                verMovimientos: verMoves,
                verOtrosMovimientos: verMovesOt,
                aprobarMovimientos: aproveMoves,
                editarMovimientos: eMoves,
                eliminarMovimientos: delMoves,
                crearUsuarios: cUsers,
                modificarUsuarios: modUsers,
                eliminarUsuarios: delUsers,
                modificarFechas: modFechas,
                horasIngreso: sHours,
                obviarIngreso: oHours, 
                configurarCuentas: cAccounts,
                verExcel: vExcel
            },
            password: password
        }
    fetch(`${backendUrl()}/users/register`, {
        method: 'POST',
        body: JSON.stringify(registerData),
      headers: new Headers({ 'Content-type': 'application/json'})
    }).then(res => res.json()).then(r => setUsers(r)).then(  Swal.fire({
      icon: "success",
      title: "Usuario Creado con exito",
      showConfirmButton: false,
      timer: 1100
    }))

    }
  }
  const actUser = async (u ,i) => {
    const email = document.getElementById(`actInputEmail-${i}`).value
    const username = document.getElementById(`actUsernameInput-${i}`).value
    const consultarPrecios = document.getElementById(`actConsultarPrecios-${i}`).checked;
    const movesVista = document.getElementById(`actMovesVista-${i}`).checked
    const movesVistaOt = document.getElementById(`actMovesVistaOt-${i}`).checked
    const aproveMoves = document.getElementById(`actAproveMoves-${i}`).checked
    const modFechas = document.getElementById(`actModFechas-${i}`).checked
    const delMoves = document.getElementById(`actDelMoves-${i}`).checked
    const createU = document.getElementById(`actCreateU-${i}`).checked
    const eMoves = document.getElementById(`actEMoves-${i}`).checked
    const modU = document.getElementById(`actModU-${i}`).checked
    const delU = document.getElementById(`actDeleteU-${i}`).checked
    const modTime = document.getElementById(`actModTime-${i}`).checked
    const obTime = document.getElementById(`actObTime-${i}`).checked
    const cAccounts = document.getElementById(`actCAccounts-${i}`).checked
    const verExcel = document.getElementById(`actVerExcel-${i}`).checked
    console.log(delMoves)
 const permissions = 
    {
      consultarPrecios: consultarPrecios,
      verMovimientos: movesVista,
      verOtrosMovimientos: movesVistaOt,
      aprobarMovimientos: aproveMoves,
      eliminarMovimientos: delMoves,
      crearUsuarios: createU,
      modificarFechas: modFechas,
      modificarUsuarios: modU,
      eliminarUsuarios: delU,
      horasIngreso: modTime,
      obviarIngreso: obTime,     
      editarMovimientos: eMoves,
      configurarCuentas: cAccounts,
      verExcel: verExcel
    }

    const actData = {_id: _id,email: email, username: username, permissions: permissions }
    
    await fetch(`${backendUrl()}/users/updateUser`, {
      method: 'PUT',
      body: JSON.stringify(actData),
    headers: new Headers({ 'Content-type': 'application/json'})
  }).then(res => res.json()).then(r => {
    setUsers(r)
  }).then(Swal.fire({
    icon: 'success',
    title: 'Usuario modificado con exito',
  }))
  }

  let itemPagination = [];
  let pages;
  const filteredResults = () => {
    return users.slice(currentPage, currentPage + vPage)
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
  pages = Math.ceil(users.length / vPage)
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
        <div className="btn btn-success" data-bs-toggle="modal" data-bs-target="#registerModal">Registrar Usuario</div>
        <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="registerModalLabel">Registre un usuario</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <form>
  <div class="mb-3">
    <label for="registerInputEmail1" class="form-label">Email</label>
    <input type="email" class="form-control" id="registerInputEmail1" aria-describedby="emailHelp" onChange={() => {
        const value = document.getElementById('registerInputEmail1').value
        setEmail(value)
    }}/>
  </div>
  <div class="mb-3">
    <label for="usernameInput" class="form-label">Nombre de usuario</label>
    <input type="email" class="form-control" id="usernameInput" aria-describedby="emailHelp" onChange={() => {
        const value = document.getElementById('usernameInput').value
        setUsername(value)
    }}/>
  </div>
  <div class="mb-3">
    <label for="InputPassword1" class="form-label">Contraseña</label>
    <input type="password" class="form-control" id="InputPassword1" onChange={() => {
        const value = document.getElementById('InputPassword1').value
        setPassword(value)
    }}/>
  </div>
  <div class="mb-3">
    <label for="InputPassword2" class="form-label">Confirmar contraseña</label>
    <input type="password" class="form-control" id="InputPassword2" />
  </div>
  <hr />
    <h3>Permisos</h3>
    <div class="form-check">
  <input class="form-check-input" type="checkbox" value="" checked id="consulaPrecios" onChange={() => {
            const value = document.getElementById('consultaPrecios').checked
            setConsultaPrecios(value)
  }} />
  <label class="form-check-label" for="consultaPrecios">
  Consultar listado de precios
  </label>
</div>
    <h5>- Movimientos</h5>
    <div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="movesVista" onChange={() => {
            const value = document.getElementById('movesVista').checked
            setVerMoves(value)
            handlerDisable()
  }} />
  <label class="form-check-label" for="movesVista">
    Ver la pestaña movimientos
  </label>
</div>
    <div class="form-check">
  <input class="form-check-input disabled" type="checkbox" value="" id="movesVistaOt" onChange={() => {
            const value = document.getElementById('movesVistaOt').checked
            setVerMovesOt(value)
  }} />
  <label class="form-check-label" for="movesVistaOt">
    Ver los movimientos de otros usuarios
  </label>
</div>
<div class="form-check ">
  <input class="form-check-input disabled" type="checkbox" value="" id="aproveMoves" disabled onChange={() => {
            const value = document.getElementById('aproveMoves').checked
            setAproveMoves(value)
  }}/>
  
  <label class="form-check-label" for="aproveMoves">
    Aprobar movimientos de otros usuarios
  </label>
  </div>
  <div class="form-check ">
  <input class="form-check-input disabled" type="checkbox" value="" id="eMoves" disabled onChange={(e) => {
            const value = e.target.checked
            setEMoves(value)
  }}/>
  
  <label class="form-check-label" for="eMoves">
  Modificar Movimientos
  </label>
</div>
<div class="form-check ">
  <input class="form-check-input disabled" type="checkbox" value="" id="modFechas" disabled onChange={(e) => {
            const value = e.target.checked
            setModFechas(value)
  }}/>
  
  <label class="form-check-label" for="modFechas">
  Modificar fechas de Movimientos
  </label>
</div>
<br />
  <div class="form-check ">
  <input class="form-check-input disabled" type="checkbox" value="" id="delMoves" disabled onChange={(e) => {
            const value = e.target.checked
            setDelMoves(value)
  }}/>
  
  <label class="form-check-label" for="delMoves">
    Eliminar movimientos
  </label>
</div>
<br />
    <h5>- Usuarios</h5>
    <div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="createU" onChange={() => {
            const value = document.getElementById('createU').checked
            setCUsers(value)
            handlerDisable()
  }}/>
  <label class="form-check-label" for="createU">
   Crear usuarios
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="modU" disabled onChange={() => {
            const value = document.getElementById('modU').checked
            setModUsers(value)
  }}/>
  <label class="form-check-label" for="modU">
    Modificar usuarios
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="deleteU" disabled onChange={() => {
            const value = document.getElementById('deleteU').checked
            setDelUsers(value)
  }} />
  <label class="form-check-label" for="deleteU">
    Eliminar usuarios
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="modTime" onChange={() => {
            const value = document.getElementById('modTime').checked
            setSHours(value)
  }}/>
  <label class="form-check-label" for="modTime">
    Modificar los horarios de ingreso y/o salida
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="obTime" onChange={() => {
            const value = document.getElementById('obTime').checked
            setOHours(value)
  }}/>
  <label class="form-check-label" for="modTime">
    Modificar los horarios de ingreso y/o salida
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="cAccounts"onChange={(e) => {
            const value = e.target.checked
            setCAccounts(value)
  }}/>
  <label class="form-check-label" for="cAccounts">
    Configurar y Modificar cuentas
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="vExcel"onChange={(e) => {
            const value = e.target.checked
            setVExcel(value)
  }}/>
  <label class="form-check-label" for="cAccounts">
  Carga mediante Excel
  </label>
</div>
</form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary" onClick={() => createUser()}>Crear</button>
      </div>
    </div>
  </div>
</div>
</div>
<br /><br />
<div className="col-11 bg-light t-mod row d-flex justify-content-start">
<table className="table ">
    <thead>
        <tr>
            <th>Nombre de Usuario</th>
            <th>Correo electronico</th>
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody>
        {
            filteredResults().map((u, i) => {
                return (
                <tr>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td >
                    {editUsers(u, i)}
    <div class="modal fade" id={`actModal-${i}`} tabindex="-1" aria-labelledby="actModalLabel" aria-hidden="true" onClick={() => {
      set_id(u._id)
    }}>
  <div class="modal-dialog modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id={`actModalLabel-${i}`}>Modificar usuario</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <form>
  <div class="mb-3">
    <label for={`actInputEmail-${i}`}  class="form-label">Email</label>
<input type="email" class="form-control" id={`actInputEmail-${i}`} aria-describedby="emailHelp" defaultValue={u.email} />
  


  </div>
  <div class="mb-3">
    <label for={`actUsernameInput-${i}`} class="form-label">Nombre de usuario</label>
    <input type="email" class="form-control" id={`actUsernameInput-${i}`} aria-describedby="emailHelp" defaultValue={u.username}/>
  </div>
  <hr />
    <h3>Permisos</h3>
    <div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id={`actConsultarPrecios-${i}`} defaultChecked={u.permissions.consultarPrecios}  onChange={() => {
            const value = document.getElementById(`actConsultarPrecios-${i}`).checked
            setConsultaPrecios(value)
  }} />
  <label class="form-check-label" for={`actConsultarPrecios-${i}`}>
  Consultar listado de precios
  </label>
</div>
    <h5>- Movimientos</h5>
    <div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id={`actMovesVista-${i}`} defaultChecked={u.permissions.verMovimientos}  onChange={() => {
            const value = document.getElementById(`actMovesVista-${i}`).checked
            setVerMoves(value)
            handlerDisable()
  }} />
  <label class="form-check-label" for={`actMovesVista-${i}`}>
    Ver la pestaña movimientos
  </label>
</div>
    <div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id={`actMovesVistaOt-${i}`} defaultChecked={u.permissions.verMovimientos}  onChange={() => {
            const value = document.getElementById(`actMovesVistaOt-${i}`).checked
            setVerMovesOt(value)
  }} />
  <label class="form-check-label" for={`actMovesVista-${i}`}>
    Ver los movimientos de otros usuarios
  </label>
</div>
<div class="form-check ">
  <input class="form-check-input disabled" type="checkbox" value="" id={`actAproveMoves-${i}`}  defaultChecked={u.permissions.aprobarMovimientos} onChange={() => {
            const value = document.getElementById(`actAproveMoves-${i}`).checked
            setAproveMoves(value)
  }}/>
  <label class="form-check-label" for={`actAproveMoves-${i}`}>
    Aprobar movimientos de otros usuarios
  </label>
</div>
<div class="form-check ">
  <input class="form-check-input disabled" type="checkbox" value="" id={`actEMoves-${i}`}  defaultChecked={u.permissions.editarMovimientos} onChange={(e) => {
            const value = e.target.checked
            setEMoves(value)
  }}/>
  <label class="form-check-label" for={`actEMoves-${i}`}>
Editar Movimientos
  </label>
</div>
<div class="form-check ">
  <input class="form-check-input disabled" type="checkbox" value="" id={`actModFechas-${i}`}  defaultChecked={u.permissions.modificarFechas} onChange={(e) => {
            const value = e.target.checked
            setModFechas(value)
  }}/>
  <label class="form-check-label" for={`actModFechas-${i}`}>
Modificar fecha de Movimientos
  </label>
</div>
<div class="form-check ">
  <input class="form-check-input disabled" type="checkbox" value="" id={`actDelMoves-${i}`}  defaultChecked={u.permissions.eliminarMovimientos} onChange={(e) => {
            const value = e.target.checked
            setDelMoves(value)
  }}/>
  <label class="form-check-label" for={`actDelMoves-${i}`}>
    Eliminar movimientos
  </label>
</div>
<br />
    <h5>- Usuarios</h5>
    <div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id={`actCreateU-${i}`}  defaultChecked={u.permissions.crearUsuarios} onChange={() => {
            const value = document.getElementById(`actCreateU-${i}`).checked
            setCUsers(value)
            handlerDisable()
  }}/>
  <label class="form-check-label" for={`actCreateU-${i}`} >
   Crear usuarios
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id={`actModU-${i}`}   defaultChecked={u.permissions.modificarUsuarios} onChange={() => {
            const value = document.getElementById(`actModU-${i}`).checked
            setModUsers(value)
  }}/>
  <label class="form-check-label" for={`actModU-${i}`}>
    Modificar usuarios
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id={`actDeleteU-${i}`}  defaultChecked={u.permissions.eliminarUsuarios} onChange={() => {
            const value = document.getElementById(`actDeleteU-${i}`).checked
            setDelUsers(value)
  }} />
  <label class="form-check-label" for={`actDeleteU-${i}`}>
    Eliminar usuarios
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id={`actModTime-${i}`} defaultChecked={u.permissions.horasIngreso} onChange={() => {
            const value = document.getElementById(`actModTime-${i}`).checked
            setSHours(value)
  }}/>
  <label class="form-check-label" for={`actModTime-${i}`}>
    Modificar los horarios de ingreso y/o salida
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id={`actObTime-${i}`} defaultChecked={u.permissions.obviarIngreso} onChange={() => {
            const value = document.getElementById(`actObTime-${i}`).checked
            setOHours(value)
  }}/>
  <label class="form-check-label" for={`actObTime-${i}`}>
  Obviar horarios de ingreso y salida
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id={`actCAccounts-${i}`} defaultChecked={u.permissions.configurarCuentas} onChange={() => {
            const value = document.getElementById(`actCAccounts-${i}`).checked
            setCAccounts(value)
  }}/>
  <label class="form-check-label" for={`actCAccounts-${i}`}>
  Configurar y Modificar cuentas
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id={`actVerExcel-${i}`} defaultChecked={u.permissions.verExcel} onChange={() => {
            const value = document.getElementById(`actVerExcel-${i}`).checked
            setVExcel(value)
  }}/>
  <label class="form-check-label" for={`actVerExcel-${i}`}>
  Carga mediante excel
  </label>
</div>
</form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary" onClick={() => {
          actUser(u ,i)
          }}>Actualizar</button>
      </div>
    </div>
  </div>
</div>
                    {"      "}
                    {deleteUsers(u)}
                </td>
                </tr>
            )})
        }
    </tbody>
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
    users.length > currentPage + vPage ?  <Pagination.Next onClick={nextPage}/> : false
  }
  </Pagination>
</table>
</div>
</div>
</div>
</>
)
}

export default User