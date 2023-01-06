import React, {useEffect, useState} from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import 'boxicons'
import '../../../css/nav.css'



function Navg({ socket }) {
  const user = localStorage.getItem('name')
  const [notification, setNotification] = useState([])
const toggleFunc = () => {
    const sidebar = document.getElementById('sidebar')
    sidebar.classList.toggle('close')
    const navDiv = document.querySelector('.navDiv')
    navDiv.classList.toggle('close')
}

let room = 23
useEffect(() => {
  socket.emit("join_room", room)
  socket.on("receive_message", (data) => {
    setNotification(data)
  })
})

const displayNotification = (n) => {
  return (
    <Dropdown.Item href="#/action-1" key={1}>{n.message}</Dropdown.Item>
  )
}



return (
<div className="ndG">
    <Navbar bg="light" expand="lg" className="topbar">

      <Container>
      <Row className='row-edit'>
        <Col xs={2}>
        <Navbar.Brand href="#home">Toyoxpress</Navbar.Brand>
        </Col>
        <Col xs={7}>
            <div onClick={toggleFunc}>
        <Button variant="dark"><box-icon name='menu' color='white' id='hola'></box-icon></Button> </div>
        </Col>
        <Col >

          <Nav className="me-auto">
            <div className="notificacion">
              { 
              notification.length > 0 && (
              <div className="bola " id='bola'>{notification.length}</div>)
              }
              <box-icon name='menu' color='red' id='hola'></box-icon>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown polo">
                {
                     notification.map((n) => displayNotification(n))
                }
                <Button variant="primary" onClick={() => {
                  socket.emit('clean_nots', { message: 'cleaned' })
                  setNotification([])
                  }}>Mark as Read!</Button>
            </NavDropdown>
            </div>
            <NavDropdown title={user} id="basic-nav-dropdown">
              hola
            </NavDropdown>
          </Nav>
        </Col>
        </Row>
      </Container>
    </Navbar>

    
    </div>
)
}

export default Navg


