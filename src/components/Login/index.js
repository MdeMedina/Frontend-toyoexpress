function Login ( ) {
    return (
        <form className='Form'>
        <h1>
          Login
        </h1> 
        <div className="Username">
        <label>Username</label>
        <input type="text"/>
        </div>
        <div className="Password">
        <label>Password</label>
        <input type="password" />
        </div>
        <input type="submit" className="submit"/>
        </form>
    )
}

export default Login