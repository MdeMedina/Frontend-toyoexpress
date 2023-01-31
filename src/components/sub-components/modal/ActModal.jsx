import React, {useState, useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Select from 'react-select'
import chroma from 'chroma-js'
import InputGroup from 'react-bootstrap/InputGroup';
import {formatDateHoy} from '../../dates/dates'
import {cuentas} from '../../../lib/data/SelectOptions'

function ActModal(props) {
  const {move, settingactmounts, i} = props
  const [conversion, setConversion] = useState(true)
  const [newMonto, setNewMonto] = useState('')
  const [newCuenta, setNewCuenta] = useState(null)
  const [newPago, setNewPago] = useState(null)
  const [hoy, sethoy] = useState('')
  const [bolos, setBolos] = useState(0)
  const [cambio, setCambio] = useState(0)
  const [newConcepto, setNewConcepto] = useState('')
  const [dollars, setDollars] = useState(move.monto)
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
  
console.log(move)
  useEffect(() => {
    changingDollars(bolos, cambio)
  }, [bolos, cambio])
  

  useEffect(() => {
    if (!props.show) {
      setConversion(false)
    }
  }, [props])
  useEffect(() => {
    sethoy(`${formatDateHoy(new Date())}`)
    setNewCuenta(move.cuenta)
    setConversion(move.pago)
    setNewMonto(move.monto)
    setBolos(move.bs)
    setCambio(move.change)
    setNewConcepto(move.concepto)
  }, [])
  
    

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      centered
      id={`actModal-${i}`}
    >
      <Modal.Header closeButton>
          <Modal.Title>Nuevo Movimiento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="error" className='desaparecer'>*Por Favor, rellene todos los campos</div>
          <label>Cuenta Afectada:</label>
    <Select 
    defaultValue={{label:`Ya seleccionado: ${move.cuenta}`, value: move.cuenta}}
     onChange={(e) => {
      setNewCuenta(e.value)
    }}
    options={cuentas}
    styles={colourStyles}
    />

      <br />

      <label>Tipo de pago:</label>
          <Form.Select id={`pagoAct-${i}`}  onChange={(e) => {
           const {value} = e.target
          setConversion(value)
          }}>
        <option value={move.pago}>Ya seleccionado: {move.pago}</option>
        <option value='Bs'>Bs</option>
        <option value='Efectivo'>Efectivo</option>
        <option value='Zelle'>Zelle</option>
      </Form.Select>
      <br />
      {
        !conversion || conversion === 'Bs'? false : <div><label >Monto:</label>
        <InputGroup className="mb-3">
          <Form.Control id={`montoAct-${i}`} aria-label="Amount (to the nearest dollar)" defaultValue={move.monto}  onChange={(e) => {
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
        <Form.Control id={`bolosAct-${i}`} aria-label="Amount (to the nearest dollar)"  defaultValue={move.bs} onChange={e => {
          setBolos(e.target.value)
        }}/>
        <InputGroup.Text>Bs</InputGroup.Text>
      </InputGroup> 
      <InputGroup >
        <Form.Label>Valor de cambio:</Form.Label>
        <Form.Control  id={`cambioAct-${i}`}  aria-label="Amount (to the nearest dollar)" defaultValue={move.change} onChange={e => {
          setCambio(e.target.value)
        }}/>
        <InputGroup.Text>Bs</InputGroup.Text>
      </InputGroup>
        <InputGroup >
        <Form.Label>Valor en dolares:</Form.Label>
        <Form.Control id={`dolarsAct-${i}`} aria-label="Amount (to the nearest dollar)" value={dollars} onChange={(e) => {
            setNewMonto(e.target.value)
          }}/>
        <InputGroup.Text>$</InputGroup.Text>
      </InputGroup>
      </div> : false
    }
      <Form.Group className="mb-3" >
        <Form.Label>Concepto de Registro:</Form.Label>
        <Form.Control id={`conceptoAct-${i}`} as="textarea" rows={3} defaultValue={move.concepto} onChange={(e) => {
            setNewConcepto(e.target.value)
          }} controlId="ControlTextArea-Act"/>
      </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={() => {
            console.log('action', props.settingActMounts)
            props.settingActMounts(newCuenta, newConcepto, bolos, cambio, newMonto, conversion)
          }}>
            Guardar
          </Button>
        </Modal.Footer>
    </Modal>
  );
}

export {ActModal}