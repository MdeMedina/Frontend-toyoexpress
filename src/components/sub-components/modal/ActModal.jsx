import React, {useState, useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Select from 'react-select'
import chroma from 'chroma-js'
import InputGroup from 'react-bootstrap/InputGroup';
import DatePicker from 'react-datepicker'
import {formatDateHoyEn, formatDateHoy} from '../../dates/dates'
import {cuentas, moveI} from '../../../lib/data/SelectOptions'

function ActModal(props) {

  const arreglarFecha = (fecha) => {
    let f = fecha
    f = new Date(fecha)
    f.setDate(f.getDate() + 1);
    console.log(f)
    return f
  }

  

  const changingDollars = (dollars, change) => {
    let balls = dollars * change
    if (isNaN(balls) || balls === Infinity) {
      setBolivares(0)
    }else {
      setBolivares(balls)
      setBolos(balls)
    }
  }
  const cambiandoTotal = () => {
    if (!dollars) {
      setDollars(0)
    }
    if (!efectivo) {
      setEfectivo(0)
    }
    if (!zelle) {
      setZelle(0)
    }
    if (!otro) {
      setOtro(0)
    }
    let t = parseFloat(dollars) + parseFloat(efectivo) + parseFloat(zelle) + parseFloat(otro)
    setTotal(t.toFixed(2))
    setNewMonto(t.toFixed(2))
  }

  const {move, settingactmounts, i} = props
  if (!move.otro) {
    move.otro = 0
  }
  let id = move.identificador.slice('-')
  console.log(id)
  id = id[0]
  let variable;
  const [conversion, setConversion] = useState(true)
  const [newMonto, setNewMonto] = useState('')
  const [selectMove, setSelectMove] = useState(id)
  const [startDate, setStartDate] = useState(arreglarFecha(move.fecha));
  const [newCuenta, setNewCuenta] = useState(null)
  const [newPago, setNewPago] = useState(null)
  const [otro, setOtro] = useState(move.otro)
  const [hoy, sethoy] = useState('')
  const [bolivares, setBolivares] = useState(move.bs)
  const [bolos, setBolos] = useState(move.bs)
  const [cambio, setCambio] = useState(0)
  const [newConcepto, setNewConcepto] = useState('')
  const [total, setTotal] = useState(move.monto)
  const [efectivo, setEfectivo] = useState(move.efectivo)
  const [zelle, setZelle] = useState(move.zelle)
  const [dollars, setDollars] = useState(move.dollars)
  

  const inputDisabled = (dolares) => {
    const e = document.getElementById(`d${move.identificador}`)
    console.log('Comprobacion de input',!e.hasAttribute('disabled') && dolares <= 0 )
    if (e.hasAttribute('disabled') && dolares > 0) {
      e.removeAttribute('disabled')
    }
   if (!e.hasAttribute('disabled') && dolares <= 0 ) {
     console.log('entre')
      e.setAttribute('disabled', "")
    }
  }

  function addDays(fecha, dias){ 
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }
  function subDays(fecha, dias){
    fecha.setDate(fecha.getDate() - dias);
    return fecha;
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
    if (id == 'E') {
      variable = moveI[0]
      console.log(variable)

    } else if (id == 'I') {
      variable = moveI[1]
      console.log(variable)
    }

   
    useEffect(() => {
      changingDollars(dollars, cambio)
    }, [dollars, cambio])
    useEffect(() => {
      cambiandoTotal()
    }, [dollars, zelle, efectivo, otro])

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
    if (!props.show) {
      setConversion(false)
    }
  }, [props])
  useEffect(() => {
    sethoy(`${formatDateHoy(arreglarFecha(move.fecha))}`)
    setNewCuenta(move.cuenta)
    setConversion(move.pago)
    setNewMonto(move.monto)
    setBolos(move.bs)
    setCambio(move.change)
    setNewConcepto(move.concepto)
  }, [])
  
  useEffect(() => {
    console.log(bolos, cambio, dollars, efectivo, zelle)
  }, [ bolos, cambio, dollars, efectivo, zelle])
    

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
          <Modal.Title>Editar Movimiento {move.identificador}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="error" className='desaparecer'>*Por Favor, rellene todos los campos</div>
          <label>Tipo de Movimiento:</label>
          <Select defaultValue={variable} onChange={(e) => {
            setSelectMove(e.value)
          }} options={moveI} styles={colourStyles}  />
      <br />
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

      <h3>Forma de Pago/Cobro</h3>
  <div><label >Efectivo:</label>
        <InputGroup className="mb-3">
          <Form.Control id='e-monto' aria-label="Amount (to the nearest dollar)" defaultValue={move.efectivo} onChange={(e) => {
            setEfectivo(e.target.value)
          }}/>
          <InputGroup.Text>$</InputGroup.Text>
        </InputGroup>
        </div>
        <div><label >Zelle:</label>
        <InputGroup className="mb-3">
          <Form.Control id='e-monto' aria-label="Amount (to the nearest dollar)" defaultValue={move.zelle} onChange={(e) => {
            setZelle(e.target.value)
          }}/>
          <InputGroup.Text>$</InputGroup.Text>
        </InputGroup>
        </div>
        <div><label >Otro:</label>
        <InputGroup className="mb-3">
          <Form.Control id='e-monto' aria-label="Amount (to the nearest dollar)" defaultValue={move.otro} onChange={(e) => {
            setOtro(e.target.value)
          }}/>
          <InputGroup.Text>$</InputGroup.Text>
        </InputGroup>
        </div>
  <div className="row mb-3">
    <div className='col-6'>
      <InputGroup>
      <Form.Label>Valor en dolares:</Form.Label>
        <Form.Control aria-label="Amount (to the nearest dollar)" defaultValue={move.dollars} onChange={e => {
          setDollars(e.target.value)
          let r = parseFloat(e.target.value);
          if(isNaN(parseFloat(e.target.value))){
            r = 0
          }
          inputDisabled(r)
        }}/>
      </InputGroup>
      </div>
      <div className='col-6 mb-3'>
      <InputGroup >
        <Form.Label>Valor de cambio:</Form.Label>
        { dollars > 0 ? 
        <Form.Control  aria-label="Amount (to the nearest dollar)" defaultValue={move.change} id={`d${move.identificador}`} onChange={e => {
          setCambio(e.target.value)
        }}/> : <Form.Control  aria-label="Amount (to the nearest dollar)" defaultValue={move.change} disabled id={`d${move.identificador}`} onChange={e => {
          setCambio(e.target.value)
        }}/> }
      </InputGroup>
      </div>
      <div className='col-12'>
        <InputGroup>
        <Form.Label>Cantidad de bolivares:</Form.Label>
        <Form.Control id='e-monto' aria-label="Amount (to the nearest dollar)" value={bolivares} onChange={(e) => {
            setBolos(e.target.value)
          }}/>
      </InputGroup>
      </div>
      </div>
      <br />
      <div><label >Monto:</label>
        <InputGroup className="mb-3">
          <Form.Control id='e-monto' aria-label="Amount (to the nearest dollar)" value={total} onChange={(e) => {
          }}/>
          <InputGroup.Text>$</InputGroup.Text>
        </InputGroup>
        </div>      <Form.Group className="mb-3" >
        <Form.Label>Concepto de Registro:</Form.Label>
        <Form.Control id={`conceptoAct-${i}`} as="textarea" rows={3} defaultValue={move.concepto} onChange={(e) => {
            setNewConcepto(e.target.value)
          }} controlId="ControlTextArea-Act"/>
      </Form.Group>
          <label>Fecha:</label>
      <DatePicker
      selected={startDate}
      dateFormat="dd/MM/yyyy"
      maxDate={addDays(new Date(move.fecha), 0)}
      onChange={(e) => {
        setStartDate(e)
        let value = formatDateHoy(e)
       value = value.split('/')
        console.log(value)
        let f = new Date(value[2],  parseInt(value[1] - 1), parseInt(value[0]) )
        console.log(f)
        f = formatDateHoy(f)
        console.log(f)
        sethoy(f)
      }}
    />

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={() => {
  console.log(efectivo, dollars, zelle)
            props.settingActMounts(selectMove, newCuenta, newConcepto, bolos, cambio, newMonto, hoy, dollars, efectivo, zelle)
          }}>
            Guardar
          </Button>
        </Modal.Footer>
    </Modal>
  );
}

export {ActModal}