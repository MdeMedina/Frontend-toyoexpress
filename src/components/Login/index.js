import React from 'react'
import { url_api } from '../../lib/data/server'
import {useHistory} from 'react-router-dom'
import '../../css/login.css';

function Login ( ) {
  const history = useHistory()
  let loginData = {}
  let user
  let pass

  const handleSubmit = async (event) => {
    
    event.preventDefault()
    let permissions = {}
          user = document.getElementById('user').value
          pass = document.getElementById('pass').value
          loginData = {
            email: user,
            password: pass
          }
         const loginRes = await fetch(`${url_api}/users/login`, {
            method: 'POST',
            body: JSON.stringify(loginData),
          headers: new Headers({ 'Content-type': 'application/json'})
          })
          const loginJson = await loginRes.json()
          const loginStatus = await loginRes.status
          if (loginStatus === 403 || loginStatus === 401){ 
            let userGood = document.getElementById('userGood')
            let isDesaparezco = userGood.classList.contains('desaparezco')
            if ( !isDesaparezco ){
              userGood.classList.add('desaparezco')
            }
            let aparecer = document.getElementById('userInvalid')
            aparecer.classList.remove('desaparezco')
            let h3 = document.getElementById('h3Error')
            h3.innerHTML = loginJson.errormessage
          } else if (loginStatus === 200) {
            permissions = loginJson.permissions
  
            localStorage.setItem('key', loginJson.key)
            localStorage.setItem('name', loginJson.name)
            localStorage.setItem('email', loginJson.email)
            localStorage.setItem('permissions', JSON.stringify(permissions))
            let userInvalid = document.getElementById('userInvalid')
            let isDesaparezco = userInvalid.classList.contains('desaparezco')
            history.push('/')
            if ( !isDesaparezco ){
              userInvalid.classList.add('desaparezco')
            }
            let aparecer = document.getElementById('userGood')
            aparecer.classList.remove('desaparezco')
            let h3 = document.getElementById('h3')
            h3.innerHTML = loginJson.message
          } else { 
            let userGood = document.getElementById('userGood')
            let isDesaparezco = userGood.classList.contains('desaparezco')
            if ( !isDesaparezco ){
              userGood.classList.add('desaparezco')
            }
            let aparecer = document.getElementById('userInvalid')
            aparecer.classList.remove('desaparezco')
            let h3 = document.getElementById('h3Error')
            h3.innerHTML = loginJson.errormessage
          }
  }

    return (
        <form className='Form' onSubmit={handleSubmit}>
        <h1>
          Login
        </h1> 
        <div className="Username login-div">
        <label>Username</label>
        <input type="text" id='user'/>
        </div>
        <div className="Password login-div">
        <label>Password</label>
        <input type="password" id='pass'/>
        </div>
        <input type="submit" className="submit" />
        <div className='desaparezco error login-div' id='userInvalid'><h3 id='h3Error'></h3><br/><button onClick={(e) => {
                e.preventDefault()
                  let aparecer = document.getElementById('userInvalid')
                  aparecer.classList.add('desaparezco')
        }}>close</button></div>
                <div className='desaparezco pase login-div' id='userGood'><h3 id='h3'></h3><br/><button onClick={(e) => {
                e.preventDefault()
                  let aparecer = document.getElementById('userGood')
                  aparecer.classList.add('desaparezco')
        }}>close</button></div>
        </form>
    )
}

export default Login