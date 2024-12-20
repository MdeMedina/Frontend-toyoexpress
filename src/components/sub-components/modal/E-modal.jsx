import React, {useState, useEffect, forwardRef} from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import chroma from 'chroma-js'
import InputGroup from 'react-bootstrap/InputGroup';
import {formatDateHoy} from '../../dates/dates'
import {formatDateHoyEn} from '../../dates/dates'
import {cuentas, moveI} from '../../../lib/data/SelectOptions'




function EModal(props) {
  const mf = JSON.parse(localStorage.getItem("permissions")).modificarFechas
  const {settingMounts} = props
  const [isDisabled, setIsDisabled] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
const [endDate, setEndDate] = useState(new Date());
  const [conversion, setConversion] = useState(false)
  const [selectMove, setSelectMove] = useState()
  const [newMonto, setNewMonto] = useState('')
  const [total, setTotal] = useState(0)
  const [efectivo, setEfectivo] = useState(0)
  const [dollars, setDollars] = useState(0)
  const [bolivares, setBolivares] = useState(0)
  const [otro, setOtro] = useState(0)
  const [zelle, setZelle] = useState(0)
  const [newCuenta, setNewCuenta] = useState(null)
  const [newPago, setNewPago] = useState(null)
  const [hoy, sethoy] = useState(formatDateHoy(new Date()))
  const [bolos, setBolos] = useState(0)
  const [cambio, setCambio] = useState(0)
  const [newConcepto, setNewConcepto] = useState('')

  const handleClick = () => {
    if (isDisabled) return;

    setIsDisabled(true); // Deshabilitar el botón
    props.settingMounts(selectMove, newCuenta, newConcepto, bolos, cambio, newMonto, hoy, dollars, efectivo, zelle, otro);
    setEfectivo(0);
    setZelle(0);
    setDollars(0);
    setNewMonto(0);
    setTotal(0);
    setOtro(0);

    // Opcional: volver a habilitar después de completar la acción
    setTimeout(() => setIsDisabled(false), 2000); // Reemplaza "2000" con el tiempo necesario
  };
  const changingDollars = (dollars, change) => {
    let balls = dollars * change
    if (isNaN(balls) || balls === Infinity) {
      setBolivares(0)
    }else {
      setBolivares(balls)
      setBolos(balls)
    }
  }

  const inputDisabled = (dolares) => {
    const e = document.getElementById('createChange')
    console.log('Comprobacion de input',!e.hasAttribute('disabled') && dolares <= 0 )
    if (e.hasAttribute('disabled') && dolares > 0) {
      e.removeAttribute('disabled')
    }
   if (!e.hasAttribute('disabled') && dolares <= 0 ) {
     console.log('entre')
      e.setAttribute('disabled', "")
    }
  }



  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className="toyox" onClick={onClick} ref={ref}>
      {value}
    </button>
  ));

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
    changingDollars(dollars, cambio)
  }, [dollars, cambio])
  useEffect(() => {
    cambiandoTotal()
  }, [dollars, zelle, efectivo, otro])
  

  useEffect(() => {
    if (!props.show) {
      setConversion(false)
    }
  }, [props])

  
    useEffect(() => {
      console.log(selectMove, newCuenta, newConcepto, newMonto, bolos, cambio, conversion, hoy)
    }, [selectMove, newCuenta, newConcepto, newMonto, bolos, cambio, conversion, hoy])

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
          <Select onChange={(e) => {
            setSelectMove(e.value)
          }} options={moveI} styles={colourStyles}  />
      <br />
          <label>Cuenta Afectada:</label>
    <Select onChange={(e) => {
      setNewCuenta(e.value)
    }}
    options={cuentas}
    styles={colourStyles}
    />

      <br />

<div className='row'>
      <h3>Forma de Pago/Cobro</h3>
  <div className='col-4'><label >Efectivo:</label>
        <InputGroup className="mb-3 col-6">
          <Form.Control id='e-monto' aria-label="Amount (to the nearest dollar)" className='input-form' onChange={(e) => {
            setEfectivo(e.target.value)
          }}/>
          <InputGroup.Text>$</InputGroup.Text>
        </InputGroup>
        </div>
        <div className='col-4'><label >Zelle:</label>
        <InputGroup className="mb-3 col-6">
          <Form.Control id='e-monto' aria-label="Amount (to the nearest dollar)" className='input-form' onChange={(e) => {
            setZelle(e.target.value)
          }}/>
          <InputGroup.Text>$</InputGroup.Text>
        </InputGroup>
        </div>
        <div className='col-4'><label >Otro:</label>
        <InputGroup className="mb-3 col-6">
          <Form.Control id='e-monto' aria-label="Amount (to the nearest dollar)" className='input-form' onChange={(e) => {
            setOtro(e.target.value)
          }}/>
          <InputGroup.Text>$</InputGroup.Text>
        </InputGroup>
        </div>
  <div className="row mb-3">
  <label >Bolivares:</label>
    <div className='col-4'>
      <InputGroup>
      <Form.Label>Valor en<br />dolares:</Form.Label>
        <Form.Control aria-label="Amount (to the nearest dollar)" onChange={e => {
          setDollars(e.target.value)
          let r = parseFloat(e.target.value);
          if(isNaN(parseFloat(e.target.value))){
            r = 0
          }
          inputDisabled(r)
        }}/>
        <InputGroup.Text>$</InputGroup.Text>
      </InputGroup>
      </div>
      <div className='col-4 mb-3'>
      <InputGroup >
        <Form.Label>Valor de<br />cambio:</Form.Label>
        <Form.Control  aria-label="Amount (to the nearest dollar)" disabled id='createChange' onChange={e => {
          setCambio(e.target.value)
        }}/>
        <InputGroup.Text>Bs</InputGroup.Text>
      </InputGroup>
      </div>
      <div className='col-4'>
        <InputGroup>
        <Form.Label>Cantidad de<br />bolivares:</Form.Label>
        <br />
        <Form.Control id='e-monto' aria-label="Amount (to the nearest dollar)" value={bolivares} readOnly onChange={(e) => {
            setBolos(e.target.value)
          }}/>
          <InputGroup.Text>Bs</InputGroup.Text>
      </InputGroup>
      </div>
      </div>
      <br />
      <div><label >Total:</label>
        <InputGroup className="mb-3">
          <Form.Control id='e-monto' aria-label="Amount (to the nearest dollar)" className='input-form total' size='lg' readOnly value={total} onChange={(e) => {
          }}/>
          <InputGroup.Text>$</InputGroup.Text>
        </InputGroup>
        </div>
      </div> 
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Concepto de Registro:</Form.Label>
        <Form.Control id="e-concepto" as="textarea" rows={3} onChange={(e) => {
            setNewConcepto(e.target.value)
          }}/>
      </Form.Group>
      <label >Fecha:</label>
      { !mf ? <Form.Control
        type="text"
        placeholder={hoy}
        aria-label="Disabled input example"
        readOnly
      />:
      <DatePicker
      selected={startDate}
      dateFormat="dd/MM/yyyy"
      maxDate={addDays(new Date(), 0)}
      customInput={<ExampleCustomInput />}
      onChange={(e) => {
        setStartDate(e)
        console.log(e)
        let value = formatDateHoy(e)
       value = value.split('/')
        console.log(value)
        let f = new Date(value[2],  parseInt(value[1] - 1), parseInt(value[0]) )
        console.log(f)
        f = formatDateHoy(f)
        console.log(f)
        sethoy(f)
      }}
    />}


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleClick} disabled={isDisabled}>
            Crear
          </Button>
        </Modal.Footer>
    </Modal>
  );
}

export default EModal
