import React, {useState, useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import {formatDateHoy} from '../../dates/dates'


function IModal(props) {
  const {settingMounts} = props
  const [conversion, setConversion] = useState(false)
  const [bolos, setBolos] = useState(0)
  const [cambio, setCambio] = useState(0)
  const [dollars, setDollars] = useState(0)
  
  const changingDollars = (bs, change) => {
    let dolares = bs / change
    if (isNaN(dolares)  || dolares === Infinity) {
      setDollars(0)
    }else {
      setDollars(dolares)
    }
  }

  useEffect(() => {
    changingDollars(bolos, cambio)
    settingMounts(bolos, cambio)
  }, [bolos, cambio])
useEffect(() => {
  if (!props.show) {
    setConversion(false)
  }
}, [props])
  const hoy = `${formatDateHoy(new Date())}`
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
          <Modal.Title>Nuevo Ingreso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="i-error" className='desaparecer'>*Por Favor, rellene todos los campos</div>
          <label>Cuenta Afectada:</label>
          <Form.Select id='i-account'>
        <option value='n/d'>Seleccione una Opcion</option>
        <option value='Cuenta01HU'>Cuenta01HU</option>
        <option value='Cuenta02JM'>Cuenta02JM</option>
        <option value='Cuenta03JPA'>Cuenta03JPA</option>
      </Form.Select>
      <br />
      <label>Tipo de pago:</label>
          <Form.Select id='i-pago' onChange={(e) => {
         const {value} = e.target
        setConversion(value)
        console.log(`el value es igual: ${value}, no hay value: ${!value}, value es igual a Bs: ${value === 'Bs'}, `)
        }}>
        <option value=''>Seleccione una Opcion</option>
        <option value='Bs'>Bs</option>
        <option value='Efectivo'>Efectivo</option>
        <option value='Zelle'>Zelle</option>
      </Form.Select>
      <br />
      
    { !conversion || conversion === 'Bs'? console.log(conversion) : <div><label >Monto:</label>
      <InputGroup className="mb-3">
        <Form.Control id='i-monto' aria-label="Amount (to the nearest dollar)" />
        <InputGroup.Text>$</InputGroup.Text>
      </InputGroup>
      </div>
    } 
    {
      conversion === 'Bs' ? <div className="row mb-3">
      <InputGroup className="col-4">
      <Form.Label>Cantidad de bolivares:</Form.Label>
        <Form.Control aria-label="Amount (to the nearest dollar)" onChange={e => {
          setBolos(e.target.value)
        }}/>
        <InputGroup.Text>Bs</InputGroup.Text>
      </InputGroup>
      <InputGroup className="col-4">
        <Form.Label>Valor de cambio:</Form.Label>
        <Form.Control  aria-label="Amount (to the nearest dollar)" onChange={e => {
          setCambio(e.target.value)
        }}/>
        <InputGroup.Text>Bs</InputGroup.Text>
      </InputGroup>
        <InputGroup className="col-4">
        <Form.Label>Valor en dolares:</Form.Label>
        <Form.Control id='i-monto' aria-label="Amount (to the nearest dollar)" value={dollars}/>
        <InputGroup.Text>$</InputGroup.Text>
      </InputGroup>
      </div> : false
    }
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Concepto de Registro:</Form.Label>
        <Form.Control id="i-concepto" as="textarea" rows={3} />
      </Form.Group>
      <label >Fecha:</label>
      <Form.Control
        type="text"
        placeholder={hoy}
        aria-label="Disabled input example"
        readOnly
      />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={props.onSend}>
            Save Changes
          </Button>
        </Modal.Footer>
    </Modal>
  );
}

export default IModal