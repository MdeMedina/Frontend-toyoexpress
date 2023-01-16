import React, {useState, useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Select from 'react-select'
import chroma from 'chroma-js'
import InputGroup from 'react-bootstrap/InputGroup';
import {formatDateHoy} from '../../dates/dates'
import {cuentas} from '../../../lib/data/SelectOptions'




function EModal(props) {
  const {settingMounts} = props
  const [conversion, setConversion] = useState(false)
  const [selectMove, setSelectMove] = useState('egreso')
  const [newMonto, setNewMonto] = useState('')
  const [newCuenta, setNewCuenta] = useState(null)
  const [newPago, setNewPago] = useState(null)
  const [bolos, setBolos] = useState(0)
  const [cambio, setCambio] = useState(0)
  const [newConcepto, setNewConcepto] = useState('')
  const [dollars, setDollars] = useState(0)
  const changingDollars = (bs, change) => {
    let dolares = bs / change
    if (isNaN(dolares) || dolares === Infinity) {
      setDollars(0)
    }else {
      setDollars(dolares)
      setNewMonto(dolares)
    }
  }
  const dot = (color = 'transparent') => ({
    alignItems: 'center',
    display: 'flex',
  
    ':before': {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10,
    },
  });
  
  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: color.alpha(1).css(),
        color: "white",
        cursor: isDisabled ? 'not-allowed' : 'default',
  
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled
            ? isSelected
              ? data.color
              : color.alpha(0.3).css()
            : undefined,
        },
      };
    },
    input: (styles) => ({ ...styles, ...dot() }),
    placeholder: (styles) => ({ ...styles, ...dot('#ccc') }),
    singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
  };
  

  useEffect(() => {
    changingDollars(bolos, cambio)
  }, [bolos, cambio])
  

  useEffect(() => {
    if (!props.show) {
      setConversion(false)
    }
  }, [props])
  const hoy = `${formatDateHoy(new Date())}`        
  console.log(hoy)   
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
          <Modal.Title>Nuevo Egreso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="error" className='desaparecer'>*Por Favor, rellene todos los campos</div>
          <label>Tipo de Movimiento:</label>
          <Form.Select id='e-account' onChange={(e) => {
            setSelectMove(e.target.value)
          }}>
        <option value='egreso'>Egreso</option>
        <option value='ingreso'>Ingreso</option>
      </Form.Select>
      <br />
          <label>Cuenta Afectada:</label>
    <Select onChange={(e) => {
      setNewCuenta(e.value)
    }}
    options={cuentas}
    styles={colourStyles}
    />

      <br />

      <label>Tipo de pago:</label>
          <Form.Select id='e-pago' onChange={(e) => {
           const {value} = e.target
          setConversion(value)
          }}>
        <option value=''>Seleccione una Opcion</option>
        <option value='Bs'>Bs</option>
        <option value='Efectivo'>Efectivo</option>
        <option value='Zelle'>Zelle</option>
      </Form.Select>
      <br />
      {
        !conversion || conversion === 'Bs'? false : <div><label >Monto:</label>
        <InputGroup className="mb-3">
          <Form.Control id='e-monto' aria-label="Amount (to the nearest dollar)" onChange={(e) => {
            setNewMonto(e.target.value)
          }}/>
          <InputGroup.Text>$</InputGroup.Text>
        </InputGroup>
        </div>
      }
      {
      conversion === 'Bs' ? <div className="row mb-3">
      <InputGroup >
      <Form.Label>Cantidad de bolivares:</Form.Label>
        <Form.Control aria-label="Amount (to the nearest dollar)" onChange={e => {
          setBolos(e.target.value)
        }}/>
        <InputGroup.Text>Bs</InputGroup.Text>
      </InputGroup>
      <InputGroup >
        <Form.Label>Valor de cambio:</Form.Label>
        <Form.Control  aria-label="Amount (to the nearest dollar)" onChange={e => {
          setCambio(e.target.value)
        }}/>
        <InputGroup.Text>Bs</InputGroup.Text>
      </InputGroup>
        <InputGroup >
        <Form.Label>Valor en dolares:</Form.Label>
        <Form.Control id='e-monto' aria-label="Amount (to the nearest dollar)" value={dollars} onChange={(e) => {
            setNewMonto(e.target.value)
          }}/>
        <InputGroup.Text>$</InputGroup.Text>
      </InputGroup>
      </div> : false
    }
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Concepto de Registro:</Form.Label>
        <Form.Control id="e-concepto" as="textarea" rows={3} onChange={(e) => {
            setNewConcepto(e.target.value)
          }}/>
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
            Cerrar
          </Button>
          <Button variant="primary" onClick={() => {
            console.log(newMonto)
            props.settingMounts(selectMove, newCuenta, newConcepto, bolos, cambio, newMonto, conversion)
          }}>
            Crear
          </Button>
        </Modal.Footer>
    </Modal>
  );
}

export default EModal