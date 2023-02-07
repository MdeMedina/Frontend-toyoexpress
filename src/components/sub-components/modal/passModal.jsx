import React, {useState, useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function PassModal(props) {
  const [password, setPassword] = useState()
  const [newPassword, setNewPassword] = useState()
  
    

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
          <Modal.Title>Cambiar contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="error" className='desaparecer'>*Por Favor, rellene todos los campos</div>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Contraseña Actual</Form.Label>
        <Form.Control type="password" placeholder="Password"  onChange={(e) => {
            const {value} = e.target
            setPassword(value)
        }}/>
      </Form.Group>
      
      <Form.Group  className="mb-3" controlId="formPlaintextPassword">
        <Form.Label column sm="5">
          Nueva Contraseña
        </Form.Label>
          <Form.Control type="password" placeholder="Password" onChange={(e) => {
            const {value} = e.target
            setNewPassword(value)
        }}/>
      </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={() => {
            props.settingMounts(password, newPassword)
          }}>
           Cambiar
          </Button>
        </Modal.Footer>
    </Modal>
  );
}

export {PassModal}