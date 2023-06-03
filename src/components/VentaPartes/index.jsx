import React, { useState, useEffect } from 'react';
import { Form, Dropdown } from 'react-bootstrap';
import { read, utils, writeFile } from 'xlsx';
import 'boxicons'
import pako from 'pako';
import Select from 'react-select'
import ExcelFileReader from '../sub-components/ExcelReader';
import Swal from 'sweetalert2';
import {PDFDownloadLink, PDFViewer} from '@react-pdf/renderer';
import MyDocument from './documento';
import { backendUrl, frontUrl } from '../../lib/data/server';



export const VentaProductos = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClient, setSelectedClient] = useState(null)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [cantidad, setcantidad] = useState(1);
    const [cliente, setCliente] = useState('');
    const [sC, setSC] = useState('');
    const [sP, setSP] = useState('');
    const [clientes, setClientes] = useState([]);
    const [partes, setPartes] = useState([]);
    const [product, setProduct] = useState('');
    const [dataClient, setDataClient] = useState([]);
    const [dataProducts, setDataProducts] = useState([]);
    const [rif, setRif] = useState('');
    const [precioMayor, setPrecioMayor] = useState('');
    const [precioOferta, setPrecioOferta] = useState('');
    const [existencia, setexistencia] = useState(0);
    const [precioMenor, setPrecioMenor] = useState('');
    const [código, setCódigo] = useState('');
    const [nombreCorto, setNombreCorto] = useState('');
    const [nota, setNota] = useState('')
    const [total, setTotal] = useState('');
    const [items, setItems] = useState('');
    const [marca, setMarca] = useState('');
    const [referencia, setReferencia] = useState('');
    const [preShoppingCart, setpreShoppingCart] = useState([])
    const [shoppingCart, setShoppingCart] = useState([])
    const [searchResults, setSearchResults] = useState([]);

const ve = JSON.parse(localStorage.getItem("permissions")).verExcel
    const updateProducts = async (data) => {
      await fetch(`${backendUrl()}/excel/updateProducts`, {
        method: 'PUT',
        body: JSON.stringify(data),
      headers: new Headers({ 'Content-type': 'application/json'})
      })
    } 
    const updateClients = async (data) => {
      await fetch(`${backendUrl()}/excel/updateClients`, {
        method: 'PUT',
        body: JSON.stringify(data),
      headers: new Headers({ 'Content-type': 'application/json'})
      })
    } 

    const getClient = async () => {
      const response = await fetch(`${backendUrl()}/excel/clients`)
      let data = await response.json()
      data=data.excel
     setDataClient(data)
    }
    const getProducts = async () => {
      const response = await fetch(`${backendUrl()}/excel/products`)
      let data = await response.json()
      data = data.excel
     setDataProducts(data)
    }

    useEffect(() => {
      getProducts();
      getClient();
    
    }, []);

    const pdfInventario = () => {
      // Redirige a la ruta con los datos como parte de la URL
      window.location.href=`${frontUrl()}/pdf`;
    }

    const excelInventario = (data) => {
      let arr = data.filter((m) => m['Existencia Actual'] > 0)
      let nExcel = [];
      arr.map((m) => {
        let obj = {
          Código: m.Código,
          "Nombre Corto": m["Nombre Corto"],
          Referencia: m.Referencia,
          Marca: m.Marca,
          Modelo: m.Modelo,
          "Existencia Actual": m["Existencia Actual"],
          "Precio Oferta": m["Precio Oferta"],
          "Precio Mayor": m["Precio Mayor"],
          "Precio Minimo": m["Precio Minimo"],
        };
        nExcel.push(obj);
      });
      // Convertir a hoja de Excel
    const worksheet = utils.json_to_sheet(nExcel);
  
    // Crear libro de Excel y agregar hoja
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Hoja1');
  
    // Escribir archivo de Excel
    writeFile(workbook, 'Inventario.xlsx');
    }
    

  const entregarInventario = (data) => {

    Swal.fire(
    {
      icon: 'info',
      title: 'Seleccione un formato de vista',
      html: `<div class="col-12 row d-flex justify-content-center"><div class="col-6 d-flex justify-content-center"><div id='pdf' class="toyox">PDF</div></div> <div class="col-6 d-flex justify-content-center"><div class="toyox-e" id='excel-t'>Excel</div></div></div>`,
      showConfirmButton: false,
      timer: 4500
    }
    )
      let excel = document.getElementById('excel-t')
      excel.addEventListener('click', () => {
        excelInventario(data)
      })
      let pdf = document.getElementById('pdf')
      pdf.addEventListener('click', () => {
        pdfInventario(data)
      })

   
  }
  
   const insertClients = () => {
    dataClient.map((c) => {
      setClientes(prevItem => [...prevItem, {value: c.Nombre, label: c.Nombre}])
    })
   }

   const searchClients = () => {
    dataClient.map((c) => {
     if (c.Nombre === cliente) {
      setSC(c)
      setRif(c.Código)
     }
    })
   }

   const insertProducts = () => {
    dataProducts.map((c) => {
      setPartes(prevItem => [...prevItem, {value: c.Código, label: c.Código}])
    })
   }

   const searchProduct = () => {
    dataProducts.map((c) => {
     if (c.Código === product) {
      setSP(c)
      setPrecioMayor(c["Precio Mayor"])
      setPrecioMenor(c["Precio Minimo"])
      setPrecioOferta(c["Precio Oferta"])
      setexistencia(c["Existencia Actual"])
      setCódigo(c.Código)
      setReferencia(c.Referencia)
      setNombreCorto(c["Nombre Corto"])
      setMarca(c.Modelo)
     }
    })
   }

    useEffect(() => {
      insertClients()
    }, [dataClient, selectedClient, cliente]);
    useEffect(() => {
      searchClients()
    }, [cliente]);


    useEffect(() => {
      console.log("actualizando productos")
      insertProducts()
  }, [dataProducts]);

  useEffect(() => {
    searchProduct()
  }, [product]);

    function handleFile(event, dato) {
      const file = event.target.files[0];
  
      // Crear un nuevo objeto FileReader
      const reader = new FileReader();
  
      // Función que se ejecuta cuando se carga el archivo
      reader.onload = (event) => {
        // Obtener los datos del archivo
        const data = event.target.result;
  
        // Convertir los datos del archivo a un workbook
        const workbook = read(data, { type: 'binary' });
  
        // Obtener los datos de la primera hoja del workbook
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
  
        // Convertir los datos de la hoja en un objeto JSON
        const jsonData = utils.sheet_to_json(worksheet, {defval:''});
  
        // Actualizar el estado con los datos del archivo
        if (dato === 'clientes') {
          let correcto = true
          console.log(jsonData)
        jsonData.map ((m) => {
          if (correcto === true) {
            let a = m.hasOwnProperty("Código")
            let b = m.hasOwnProperty("Nombre")
            let c = m.hasOwnProperty("Persona Contacto")
            let d = m.hasOwnProperty("Teléfonos")
            let e = m.hasOwnProperty("Fax")
            let f = m.hasOwnProperty("Correo Electrónico")
            let g = m.hasOwnProperty("Limite Credito")
            let h = m.hasOwnProperty("Dias Credito")
            let i = m.hasOwnProperty("Credito Disponible")
            let j = m.hasOwnProperty("Precio de Venta")
            let k = m.hasOwnProperty("Ultima Venta a Contado")
            let l = m.hasOwnProperty("Ultima Venta a Crédito")
            if (!a || !b || !c || !d || !e || !f || !g || !h || !i || !j || !k || !l) {
              console.log(`a: ${a}, b: ${b}, c: ${c}, d: ${d}, e: ${e}, f: ${f}, g: ${g}, h: ${h}, i: ${i}, j: ${j}, k: ${k}, l: ${l},` )
              correcto = false
            }
          }
        })
        if (correcto) {
        updateClients(jsonData)
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El archivo insertado no corresponde a los clientes!',
          })
        }
        } else if (dato === 'productos'){
          let correcto = true
        jsonData.map ((m) => {
          if (correcto === true) {
            let a = m.hasOwnProperty("Código")
            let b = m.hasOwnProperty("Nombre Corto")
            let c = m.hasOwnProperty("Referencia")
            let d = m.hasOwnProperty("Marca")
            let e = m.hasOwnProperty("Modelo")
            let f = m.hasOwnProperty("Existencia Actual")
            let g = m.hasOwnProperty("Precio Oferta")
            let h = m.hasOwnProperty("Precio Mayor")
            let i = m.hasOwnProperty("Precio Minimo")

            if (!a || !b || !c || !d || !e || !f || !g || !h || !i) {
              console.log(`a: ${a}, b: ${b}, c: ${c}, d: ${d}, e: ${e}, f: ${f}, g: ${g}, h: ${h}, i: ${i}` )
              correcto = false
            }
          }
        })
        if (correcto) {
          updateProducts(jsonData)
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El archivo insertado no corresponde a los productos!',
          })
        }

        }
      };
  
      // Leer el archivo como un array buffer
      reader.readAsArrayBuffer(file);
    }

  
  

    const eliminarProducto = (value) => {
      console.log("entre", value)
      let sp = preShoppingCart.filter(cart => {
        if (cart.Código !== value) {
          return cart
        }
      })
      setpreShoppingCart(sp)

    }
    const addCart = (n) => {
      let json = sP
      json['cantidad'] = n
      sC["Precio de Venta"].trimEnd() == 'Precio Por Defecto' || sC["Precio de Venta"].trimEnd() == 'Precio Minimo' ? 
      json['precio'] = sP['Precio Minimo'] : sC["Precio de Venta"].trimEnd() == 'Precio Mayor' ? 
      json['precio'] = sP['Precio Mayor'] : sC["Precio de Venta"].trimEnd() == 'Precio Oferta' ? 
      json['precio'] = sP['Precio Oferta'] : console.log(sP)
      setpreShoppingCart(prevList => [...prevList, json])
    }

    useEffect(() => {
      setShoppingCart(preShoppingCart.sort((a,b) => {
        if (a.Referencia < b.Referencia) {
          return -1;
        } else if (a.Referencia > b.Referencia) {
          return 1;
        } else {
          return 0;
        }      
      }));
      const precioTotal = preShoppingCart.reduce((acumulador, producto) => acumulador + producto.precio * producto.cantidad, 0)
      setTotal(precioTotal)
      let i = 0
      preShoppingCart.map((m) => {
        i += parseInt(m["cantidad"]) 
        setItems(i)
      })
    }, [preShoppingCart]);
    

    const selectCart = () => {
      if (!sP) {
        Swal.fire({
          icon: 'error',
          title: 'Por favor, inserte un producto!',
        })
      } else {
        Swal.fire({
          icon: 'info',
          title: '¿Qué cantidad desea añadir?',
          input: 'number',
          showCancelButton: true,
        }).then((result) => {
          let value = Swal.getInput().value
          if (result.isConfirmed && value && value <= existencia && value > 0) {
            addCart(value)
          } else if (!value){
            Swal.fire({
              icon: 'error',
              title: 'Por favor, inserte la cantidad del producto!',
            })
          } else if(value > existencia) {
            console.log('entre aqui')
            Swal.fire({
              icon: 'error',
              title: 'No hay esa cantidad en stock!',
              html: `Cantida Máxima: ${existencia} <input type="number" max="${existencia}" min="0" id='inputSwNew'>`,
              showCancelButton: true,
            }).then((result) => {
              let value = document.getElementById('inputSwNew').value
              console.log(result, value)
              if (result.isConfirmed && value) {
                addCart(value)
              }
            })
          }
        });
      }
    }
  return (<>
    { !ve ? false :
      <div className="d-flex justify-content-center mt-3">
    <div className="row bg-light col-11 py-3"> <div className="col-6">Insertar Excel de Clientes: {"    "} <input type="file" onChange={(e) => handleFile(e, 'clientes')} /></div><div className="col-6">Insertar Excel de Productos: {"    "} <input type="file" onChange={(e) => handleFile(e, 'productos')} /></div> </div> </div>}
  <div className="d-flex justify-content-center mt-3">
    <div className="row bg-light col-11 py-3">
        <div className="col-12 row mb-3">
        <div className="col-2 row mx-1 d-flex align-items-center justify-content-start">Agregar Cliente:</div>
        <div className="col-8 row d-flex align-items-center justify-content-end"><Select options={clientes} onChange={(e) => {
        setSelectedClient(e)}} className="selectpd px-2" id='clientela'/> </div>
        <div className='col-2 d-flex justify-content-end'>  <div className="toyox" onClick={(e) => {
          setCliente(selectedClient.value)
        }}>Agregar</div></div> 
        </div>
        {
          cliente ?  (
            <>
        <div className="col-6 row mx-1 d-flex align-items-center">
        Cliente: {cliente}
        </div>
        <div className="col-4 row d-flex justify-content-end align-items-center">
        Rif: {rif}
        </div>
        <div className="col-2 d-flex justify-content-end">
          <div className="toyox" onClick={() => {
            setRif('')
            setCliente(null)
          }}>Eliminar</div>
        </div> </> ) :false
}
        <hr className='mt-2'/>
        <div className="col-12 row mb-3">
        <div className="col-2 d-flex align-items-center">Nro de Parte:</div>
        <div className="col-10 d-flex align-items-center"><Select options={partes} onChange={(e) => {
        setSelectedProduct(e)}} className="selectpd px-2"/><div className="toyox" onClick={(e) => {
          setProduct(selectedProduct.value)
        }}>Buscar</div></div>
        </div>
        <hr />
        <div className="col-10 d-flex justify-content-center">
        <table class="table">
<thead>
  <tr>
    <th class="tg-0pky">Precio Mayor</th>
    <th class="tg-0pky">Precio Menor</th>
    <th class="tg-0pky">Precio Oferta</th>
    <th class="tg-0pky">Código</th>
    <th class="tg-0pky">Descripción</th>
    <th class="tg-0pky">Modelo</th>
    <th class="tg-0pky">Existencia Actual</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky">{precioMayor}$</td>
    <td class="tg-0pky">{precioMenor}$</td>
    <td class="tg-0pky">{precioOferta}$</td>
    <td class="tg-0pky">{código}</td>
    <td class="tg-0pky">{nombreCorto}</td>
    <td class="tg-0pky">{marca}</td>
    <td class="tg-0pky">{existencia}</td>
  </tr>
</tbody>
</table>
    </div>
    <div className="col-2 d-flex justify-content-center align-items-center">
    {
      cliente ?
      <div className="toyox" onClick={selectCart}><box-icon name='cart-add' color='#ffffff' size='40px'></box-icon></div> :
      <div className="toyox-disabled"><box-icon name='cart-add' color='#eceaea' size='40px'></box-icon></div>
    }
    </div>
    <hr className='mt-2'/>
    <h3>Shopping Cart</h3>
    <div className="col-12 d-flex justify-content-center">
        <table class="table">
<thead>
  <tr>
    <th class="tg-0pky">Cantidad</th>
    <th class="tg-0pky">Precio</th>
    <th class="tg-0pky">Codigo</th>
    <th class="tg-0pky">Descripcion</th>
    <th class="tg-0pky">Marca</th>
    <th class="tg-0pky">Referencia</th>
    <th class="tg-0pky">Acciones</th>
  </tr>
</thead>
<tbody>
 {shoppingCart ? shoppingCart.map((m, i) => {
  return (
    <tr>
    <td class="tg-0pky">{m.cantidad}</td>
    {
      sC["Precio de Venta"].trimEnd() == 'Precio Por Defecto' || sC["Precio de Venta"].trimEnd() == 'Precio Minimo' ? 
      <td class="tg-0pky">{m["Precio Minimo"]}$</td> : sC["Precio de Venta"].trimEnd() == 'Precio Mayor' ? 
      <td class="tg-0pky">{m["Precio Mayor"]}$</td> : sC["Precio de Venta"].trimEnd() == 'Precio Oferta' ? 
      <td class="tg-0pky">{m["Precio Oferta"]}$</td> : console.log(sC)}
    <td class="tg-0pky">{m.Código}</td>
    <td class="tg-0pky">{m['Nombre Corto']}</td>
    <td class="tg-0pky">{m.Modelo}</td>
    <td class="tg-0pky">{m.Referencia}</td>
    <td class="tg-0pky"><div><button className='toyox' onClick={(e) => {
      eliminarProducto(m.Código)
    }}><box-icon name='trash' type='solid' color='#ffffff' size='20px'></box-icon></button></div></td>
    </tr>
  )
 }): false}
</tbody>
</table>
    </div>
    {console.log(shoppingCart, shoppingCart[0], !shoppingCart[0])}
    {!shoppingCart[0] ?    false: <> <hr />
    <div className="col-12 row mb-2"><div className="d-flex justify-content-center"> <div className="mx-2">Nota:</div> <textarea className='nota-text' onChange={(e) => {
      const {value} = e.target
      setNota(value)
    }} cols="60" rows="3"></textarea></div></div> </>}
 
    <div className="col-4 d-flex justify-content-center align-items-center">{dataProducts === [] ? <div className="btn btn-primary disabled">Inventario</div> : <div className="btn btn-primary" onClick={() => {entregarInventario(dataProducts)}}>Inventario</div> }</div>
    <div className="col-4 d-flex justify-content-center align-items-center"><div className="toyox" onClick={(e) => {
      setpreShoppingCart([])
    }}>Vaciar</div></div>
    <div className="col-4 d-flex justify-content-center align-items-center"><PDFDownloadLink document={<MyDocument datosCliente={sC} datos={shoppingCart} total={total} items={items} nota={nota}/>} fileName='Pedido.pdf'><div className="toyox" >Imprimir</div></PDFDownloadLink></div>
    </div>
  </div>
  </>)
};
