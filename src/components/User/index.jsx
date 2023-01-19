import { useEffect, useState }from 'react'
import Navg from '../sub-components/nav'
import Sidebar from '../sub-components/sidebar'
import { url_api } from '../../lib/data/server'
import Pagination from 'react-bootstrap/Pagination'
import Select from 'react-select'
import 'boxicons'
import Swal from 'sweetalert2'
import {useHistory} from 'react-router-dom'
function User({socket}) {
  const modUsuarios = JSON.parse(localStorage.getItem('permissions')).modificarUsuarios
  const delUsuarios = JSON.parse(localStorage.getItem('permissions')).eliminarUsuarios
    const history = useHistory()
  const key = localStorage.getItem('key')
  if (!key) {
    history.push('/login')
  }
  const [users, setUsers] = useState([])
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [_id, set_id] = useState('')
  const [verMoves, setVerMoves] = useState(false)
  const [aproveMoves, setAproveMoves] = useState(false)
  const [delMoves, setDelMoves] = useState(false)
  const [cUsers, setCUsers] = useState(false)
  const [modUsers, setModUsers] = useState(false)
  const [delUsers, setDelUsers] = useState(false)
  const [deletingUser, setDeletingUser] = useState()
  const [currentPage, setCurrentPage] = useState(0)
const [vPage, setVPage] = useState(10)
const [meEncuentro, setMeEncuentro] = useState(1)
const [estaba, setEstaba] = useState(1)
  const [sHours, setSHours] = useState(false)
  const [oHours, setOHours] = useState(false)

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
  console.log(e)
  setCurrentPage(0)
  setEstaba(1)
  setMeEncuentro(1)
  setVPage(e.value)
}
  const gettingUsers = () => {
    fetch(`${url_api}/users`).then(res => res.json()).then(({users}) => {
      setUsers(users)

  })
  }
  useEffect(() => {
 gettingUsers()
  }, [])

  const editUsers = (u, i) => { 
    console.log("modUsuarios", modUsuarios)
    if (modUsuarios) {
        return(<button className='btn btn-primary' data-bs-toggle="modal" data-bs-target={`#actModal-${i}`}><box-icon name='edit-alt' color='#ffffff' ></box-icon></button>)
    }
  }

  const removeUser = async () => {
    await fetch(`${url_api}/users/deleteUser`, {
      method: 'DELETE',
      body: JSON.stringify(deletingUser),
    headers: new Headers({ 'Content-type': 'application/json'})
  }).then(r => console.log(r)).then(r => gettingUsers()).then(Swal.fire({
    icon: 'success',
    title: 'Usuario Eliminado con exito',
  }))
  }

  const deleteUsers = (u) => {
    console.log("delUsuario", delUsuarios)
    if (delUsuarios) {
        return(<button className='btn btn-danger' value={u._id} onClick={(e) => {
      Swal.fire({
        title: 'Estas seguro que deseas eliminar a este usuario?',
        showDenyButton: true,
        showCancelButton: true,
        cancelButtonText: `Cancelar`,
        denyButtonText: `Eliminar`,
      }).then((result) => { if (result.isDenied) {
        console.log(u._id)
        setDeletingUser({ _id: u._id})
        removeUser()
        }
      })
        }}><box-icon name='trash' type='solid' color='#ffffff' ></box-icon></button>)
    }
  }

  const handlerDisable = () => {
    const vm = document.getElementById('movesVista').checked
    const cu = document.getElementById('createU').checked
    const am = document.getElementById('aproveMoves')
    const dm = document.getElementById('delMoves')
    const mu = document.getElementById('modU')
    const du = document.getElementById('deleteU')
    if (!vm) {
        am.setAttribute("disabled", "")
        dm.setAttribute("disabled", "")
    }else if (vm) {
        am.removeAttribute("disabled")
        dm.removeAttribute("disabled")
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
                verMovimientos: verMoves,
                aprobarMovimientos: aproveMoves,
                eliminarMovimientos: delMoves,
                crearUsuarios: cUsers,
                modificarUsuarios: modUsers,
                eliminarUsuarios: delUsers,
                horasIngreso: sHours,
                obviarIngreso: oHours
            },
            password: password
        }
    fetch(`${url_api}/users/register`, {
        method: 'POST',
        body: JSON.stringify(registerData),
      headers: new Headers({ 'Content-type': 'application/json'})
    }).then(res => res.json()).then(r => console.log(r)).then(r => gettingUsers()).then(Swal.fire({
      icon: 'success',
      title: 'Usuario registrado con exito',
    }))

    }
  }
  const actUser = async (u ,i) => {
    const email = document.getElementById(`actInputEmail-${i}`).value
    const username = document.getElementById(`actUsernameInput-${i}`).value
    const movesVista = document.getElementById(`actMovesVista-${i}`).checked
    const aproveMoves = document.getElementById(`actAproveMoves-${i}`).checked
    const createU = document.getElementById(`actCreateU-${i}`).checked
    const modU = document.getElementById(`actModU-${i}`).checked
    const delU = document.getElementById(`actDeleteU-${i}`).checked
    const modTime = document.getElementById(`actModTime-${i}`).checked
    const obTime = document.getElementById(`actObTime-${i}`).checked
    console.log(email, username, movesVista, aproveMoves,createU, modU, delU, modTime)
 const permissions = 
    {verMovimientos: movesVista,
      aprobarMovimientos: aproveMoves,
      eliminarMovimientos: delMoves,
      crearUsuarios: createU,
      modificarUsuarios: modU,
      eliminarUsuarios: delU,
      horasIngreso: modTime,
      obviarIngreso: obTime
    }

    const actData = {_id: _id,email: email, username: username, permissions: permissions }
    
    await fetch(`${url_api}/users/updateUser`, {
      method: 'PUT',
      body: JSON.stringify(actData),
    headers: new Headers({ 'Content-type': 'application/json'})
  }).then(r => console.log(r)).then(r => {
    gettingUsers()
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
    <Navg socket={socket}/>
    <Sidebar />
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
    <h5 onClick={() => console.log(verMoves)}>- Movimientos</h5>
    <div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="movesVista" onChange={() => {
            const value = document.getElementById('movesVista').checked
            setVerMoves(value)
            handlerDisable()
  }} />
  <label class="form-check-label" for="movesVista">
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
                let id = `actModal-${i}`
                console.log(id)
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
    <h5 onClick={() => console.log(verMoves)}>- Movimientos</h5>
    <div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id={`actMovesVista-${i}`} defaultChecked={u.permissions.verMovimientos}  onChange={() => {
            const value = document.getElementById(`actMovesVista-${i}`).checked
            setVerMoves(value)
            handlerDisable()
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