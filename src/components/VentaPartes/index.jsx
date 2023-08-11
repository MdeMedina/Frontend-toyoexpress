import React, { useState, useEffect } from 'react';
import { Form, Dropdown } from 'react-bootstrap';
import { read, utils, writeFile } from 'xlsx';
import 'boxicons'
import pako from 'pako';
import Select from 'react-select'
import ExcelFileReader from '../sub-components/ExcelReader';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import {PDFDownloadLink, pdf} from '@react-pdf/renderer';
import MyDocument from './documento';
import { backendUrl, frontUrl } from '../../lib/data/server';
import MultiAttachmentInput from './multi';
import { json } from 'react-router-dom';
import excec from '../img/sheets.png'
import ltx from '../img/letra-x.png'



const components = {
  DropdownIndicator: 'hola'
};
export const VentaProductos = () => {
  useEffect(() => {
    const sidebar = document.getElementById("sidebar");
    const navDiv = document.querySelector(".navDiv");
    console.log(navDiv);
    console.log(sidebar.classList.contains("close"));

    if (!sidebar.classList.contains("close")) {
      console.log("si lo tengo");
      sidebar.classList.toggle("close");
      // navDiv.classList.toggle("close");
    }
  }, []);
  let vc = JSON.parse(localStorage.getItem("permissions")).verClientes;
  let cv = JSON.parse(localStorage.getItem("cVend"))
    const [searchQuery, setSearchQuery] = useState('');
    const [cargaClientes, setCargaClientes] = useState()
    const [statusCliente, setStatusCliente] = useState(null)
    const [statusProducto, setStatusProducto] = useState(null) 
    const [cargaProductos, setCargaProductos] = useState()
    const [menu1, setMenu1] = useState(false);
    const [menu2, setMenu2] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [archivoClientes, setarchivoClientes] = useState('');
    const [archivoProductos, setarchivoProductos] = useState('');
    const [completeProducts, setCompleteProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pdfName, setPdfName] = useState('')
    const [cantidad, setcantidad] = useState(1);
    const [Corr, setCorr] = useState('');
    const [newCorr, setNewCorr] = useState(0);
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
    const [correoCliente, setCorreoCliente] = useState(true)
    const [correoMsn, setCorreoMsn] = useState('')
    const [fecha, setFecha] = useState('')


    

const ve = JSON.parse(localStorage.getItem("permissions")).verExcel
    const updateProducts = async (data) => {
      let update = await fetch(`${backendUrl()}/excel/updateProducts`, {
        method: 'PUT',
        body: JSON.stringify(data),
      headers: new Headers({ 'Content-type': 'application/json'})
      })     
       if (update.ok) {
        let status = await update.status
        updateFecha()
        return status

      } else {
        throw new Error('Error al actualizar los productos');
      }
      
    } 

    const updateStock = async (i, dd) => {
      let data = {
        stock: shoppingCart[i].cantidad,
        codigo: shoppingCart[i].Código
      }
      let update = await fetch(`${backendUrl()}/excel/stock`, {
        method: 'PUT',
        body: JSON.stringify(data),
      headers: new Headers({ 'Content-type': 'application/json'})
      })     
       if (update.ok) {
        if (i == shoppingCart.length - 1 && dd === 'correo') {
        Swal.fire({
          icon: 'success',
          title:'El pedido se ha enviado correctamente!'
        }).then(() => {
          window.location= '/products'
        })
      }
        let status = await update.status
        return status
      } else {
        throw new Error('Error al actualizar el stock');
      }
      
    } 


    useEffect(() => {
      console.log('primer useEffect')
      getFecha()
    }, [])

    const getFecha = async () => {
      const response = await fetch(`${backendUrl()}/excel/fecha`)
      let data = await response.json()
      console.log('fecha', data)
      data = data.fecha
      setFecha(data)
    };

    function formatDate(timestamp) {
      const date = new Date(timestamp);
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      
      let hours = date.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      const formattedDate = `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
      
      return formattedDate;
    }

    const updateFecha = async () => {
      let now = formatDate(Date.now())
      let data = [{
        fecha: now,
      }]
      let update = await fetch(`${backendUrl()}/excel/actFecha`, {
        method: 'PUT',
        body: JSON.stringify(data),
      headers: new Headers({ 'Content-type': 'application/json'})
      })     
      let newData = await update.json()
      newData = newData.fecha[0].fecha
      setFecha(newData)
    }
    useEffect(() => {
      if (cargaClientes){
        if(cargaClientes.target.files[0] !== undefined) {
      setarchivoClientes(cargaClientes.target.files[0].name);
        }
      }

    }, [cargaClientes]);
    useEffect(() => {
      if (cargaProductos){
        if(cargaProductos.target.files[0] !== undefined) {
      setarchivoProductos(cargaProductos.target.files[0].name);
        }
      }
    

    }, [cargaProductos]);

    


    useEffect(() => {
      if (!cargaClientes){
        soltarAlarmas()
      }
      else if(!cargaProductos) {
        soltarAlarmas()
      }else if (statusCliente && statusProducto) {
        soltarAlarmas()
      }
    }, [statusCliente, statusProducto]);



    const generarPDF = async () => {
      const blob = await pdf(<MyDocument datosCliente={sC} datos={shoppingCart} total={total} items={items} nota={nota} correlativo={Corr}/>).toBlob();
            // Crear un objeto FormData y agregar el Blob bajo la clave "myFile"
            const formData = new FormData();
            formData.append('myFile', blob, 'file.pdf');
              // Enviar el objeto FormData al servidor
      try {
        await fetch(`${backendUrl()}/upload/`, {
          method: 'POST',
          body: formData,
        }).then(async (response) => {
          if (response.ok){
          let data  = await response.json()

          data = data.data
         setPdfName(data)
          }
        });
        // Manejar la respuesta de la solicitud, si es necesario
      } catch (error) {
        // Manejar errores, si los hay
      }
    }
    

    useEffect(() => {
      if (pdfName){
        generadorEmail()
    }
    }, [pdfName]);

    const generadorEmail = () => {
      Swal.fire({
        icon: 'info',
        title: 'El pedido se esta generando', 
        timer: 3000, 
        timerProgressBar: true,
        showConfirmButton: false
      }).then(() => {
        
        selectEmail()
      })
    }
    

    async function handleSendMail  (email, msn) {
      const mailOptions = {
        filename: pdfName,
        email: email,
        nota: msn
      }
      await fetch(`${backendUrl()}/upload/sendMail`, {
        method: 'POST',
        body: JSON.stringify(mailOptions),
      headers: new Headers({ 'Content-type': 'application/json'})
      }).then((response) => {
        setCorreoMsn('')
        setCorreoCliente(true)
      });

    }
    
    

    const updateClients = async (data) => {
      let update = await fetch(`${backendUrl()}/excel/updateClients`, {
        method: 'PUT',
        body: JSON.stringify(data),
      headers: new Headers({ 'Content-type': 'application/json'})
      })
      if (update.ok) {
        let status = await update.status
        return status
      } else {
        throw new Error('Error al actualizar los clientes');
      }

    }
    


    const getClient = async () => {
      const response = await fetch(`${backendUrl()}/excel/clients`)
      let data = await response.json()
      data=data.excel
      console.log(cv)
      if (vc) {
        setDataClient(data)
      } else if (cv) {
        let num;
        if (cv > 0 && cv <= 9) {
          num = `0${cv}`
        } else {
          num = `${cv}`
        }
       data = data.filter((cliente) => {
        return num == cliente['Vendedores Código']
        })
        console.log(data)
        setDataClient(data)
      }
    }
    const getProducts = async () => {
      setLoading(true)
    await fetch(`${backendUrl()}/excel/productsComplete`).then(async (response) => {
        let data = await response.json()
        data = data.excel
        Swal.close()
        entregarInventario(data)
      })
    }

    const handleButtonClick = () => {
      getProducts()
      Swal.fire({
        title: 'Cargando...',
        text: 'Espere un momento mientras se carga inventario...',
        allowOutsideClick: false,
        showConfirmButton: false,
      })
    };

    const getSimpleProducts = async (search) => {
      console.log(search)
      const response = await fetch(`${backendUrl()}/excel/products`, {
        method:'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({Código: search})
      })
      let data = await response.json()
      data = data.excel
     setDataProducts(data)
    }

    const getSimpleClients = async (search) => {
      console.log(search)
      const response = await fetch(`${backendUrl()}/excel/clients`, {
        method:'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({Nombre: search})
      })
      let data = await response.json()
      data = data.excel
      if (vc) {
        setDataClient(data)
      } else if (cv) {
        let num;
        if (cv > 0 && cv <= 9) {
          num = `0${cv}`
        } else {
          num = `${cv}`
        }
       data = data.filter((cliente) => {
        return num == cliente['Vendedores Código']
        })
        console.log(data)
        setDataClient(data)
      }
    }

    const pdfInventario = () => {
      // Redirige a la ruta con los datos como parte de la URL
      window.location.href=`${frontUrl()}/pdf`;
    }


    const modeloProducto = () => {
      let nExcel = [];
          let obj = {
          "Código": "",
          "Nombre Corto": "",
          "Referencia": "",
          "Marca": "",
          "Modelo": "",
          "Existencia Actual": "",
          "Precio Oferta": "",
          "Precio Mayor": "",
          "Precio Minimo": "",
          };
        nExcel.push(obj);

      // Convertir a hoja de Excel
    const worksheet = utils.json_to_sheet(nExcel);
   
    // Crear libro de Excel y agregar hoja
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Hoja1');
  
    // Escribir archivo de Excel
    writeFile(workbook, 'modeloProducto.xlsx');
    }

    const modeloCliente = () => {

      let nExcel = [];

          let obj = {
            "Código": "",
            "Nombre": "",
            "Persona Contacto": "",
            "Teléfonos": "",
            "Correo Electrónico": "",
            "Limite Credito": "",
            "Dias Credito": "",
            "Credito Disponible": "",
            "Precio de Venta": "",
            "Ultima Venta a Crédito": "",
            "Vendedores Nombre": "",
            "Vendedores Código": "",
  
          };
        nExcel.push(obj);

      // Convertir a hoja de Excel
    const worksheet = utils.json_to_sheet(nExcel);
   
    // Crear libro de Excel y agregar hoja
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Hoja1');
  
    // Escribir archivo de Excel
    writeFile(workbook, 'modeloCliente.xlsx');
    }
  

    const excelInventario = (data) => {
      let arr = data
      let nExcel = [];
      arr.map((m) => {
        if (m["Existencia Actual"] > 0) {
          let obj = {
            Código: m.Código,
            "Descripcion": m["Nombre Corto"],
            Marca: m.Modelo,
            "Precio": `${m["Precio Minimo"].toFixed(2)}$`,
  
          };
        nExcel.push(obj);}
      });
      // Convertir a hoja de Excel
    const worksheet = utils.json_to_sheet(nExcel);
   
    // Crear libro de Excel y agregar hoja
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Hoja1');
  
    // Escribir archivo de Excel
    writeFile(workbook, 'Inventario.xlsx');
    }
  
  const traerCor = async () => {
    let cor = await fetch(`${backendUrl()}/pdf/`)
    let data = await cor.json()
    data = data[data.length-1].cor
    setNewCorr(data)
    let prop = data + 1
    console.log(prop >= 9)
    if (prop < 9) {
      console.log('entre en menor a 9');
      setCorr(`00000${prop}`);
    } else if (prop >= 9 && prop < 99) {
      console.log('entre en menor a 99');
      setCorr(`0000${prop}`);
    } else if (prop >= 99 && prop < 999) {
      console.log('entre en menor a 999');
      setCorr(`000${prop}`);
    } else if (prop >= 999 && prop < 9999) {
      console.log('entre en menor a 9999');
      setCorr(`00${prop}`);
    } else if (prop >= 9999 && prop < 99999) {
      console.log('entre en menor a 99999');
      setCorr(`0${prop}`);
    } else if (prop >= 99999 && prop < 999999) {
      console.log('entre en menor a 999999');
      setCorr(`${prop}`);
    }

  }

  useEffect(() => {
    traerCor();
  }, []);
  


  
  
    
  const crearCor = async () => {
    let data = {cor: newCorr + 1}
    let creation = await fetch(`${backendUrl()}/pdf/create`, {
      method: 'POST',
      body: JSON.stringify(data),
    headers: new Headers({ 'Content-type': 'application/json'})
    })     
    if (creation.ok) {
      let status = await creation
      traerCor()
      return status
    } else {
      throw new Error('Error al crear el correlativo');
    }

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
    let arr = []
    dataClient.map((c) => {

      arr.push({value: c.Nombre, label: c.Nombre})
    })
    setClientes(arr)
   }

   const searchClients = () => {
    dataClient.map((c) => {
      console.log('entre')
      console.log(c)
     if (c.Nombre === cliente) {
      setSC(c)
      setRif(c.Código)
     }
    })
   }

   const insertProducts = () => {
    let arr = []
    dataProducts.map((c) => {
      arr.push({value: c.Código, label: c.Código})
    })
    setPartes(arr)
   }

   const searchProduct = () => {
    dataProducts.map((c) => {
     if (c.Código === product) {
      console.log('entre en codigo de sp')
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
    }, [dataClient]);
    useEffect(() => {
      console.log('hola')
      searchClients()
    }, [cliente]);


    useEffect(() => {
      console.log("actualizando productos")
      insertProducts()
  }, [dataProducts]);

  useEffect(() => {
    searchProduct()
  }, [product]);

  function preHandleFile() {
    handleFile(cargaClientes, cargaProductos)

  }
  function soltarAlarmas (){
    if (statusCliente == 200 && statusProducto === null) {
      Swal.fire({
        icon: 'success',
        title:'el archivo de clientes ha sido cargado correctamente!',
      })
    } else if (statusProducto == 200 && statusCliente === null) {
      Swal.fire({
        icon: 'success',
        title:'el archivo de productos ha sido cargado correctamente!',
      }) } else if (statusCliente == 200 && statusProducto == 200) {
        Swal.fire({
          icon: 'success',
          title:'Todos los archivos han sido cargados correctamente!',
        })
      }
     else if (statusCliente == 200 && (statusProducto !== 200 && statusProducto !== null)){
      Swal.fire({
        icon: 'success',
        title:'el archivo de clientes ha sido cargado correctamente!',
      }).then(() => {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error con la carga de los productos!'
        })
      })
    } else if (statusProducto == 200 && (statusCliente !== 200 && statusCliente !== null)){
      Swal.fire({
        icon: 'success',
        title:'el archivo de productos ha sido cargado correctamente!',
      }).then(() => {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error con la carga de los clientes!'
        })
      })
    } else if ((statusCliente !== 200 && statusCliente !== null) &&  (statusProducto !== 200 && statusProducto !== null)) {
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error con la carga de los excel!'
      })
    }
  }
  function quitarAcentos(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  } 

  function formatearPropiedades(array) {
    return array.map(objeto => {
      const nuevoObjeto = {};
      for (const clave in objeto) {
        if (objeto.hasOwnProperty(clave)) {
   const nuevaClave = quitarAcentos(clave)
          nuevoObjeto[nuevaClave] = objeto[clave];
        }
      }
      return nuevoObjeto;
    });
  }

  
    const handleFile = async (event1, event2) => {
      let file1;
      let file2;
      let dato1;
      let dato2;
      if (cargaClientes) {
      file1 = event1.target.files[0];
       dato1 = 'clientes'
      }
      if (cargaProductos) {
         file2 = event2.target.files[0];
         dato2 = 'productos'
      }
  

      // Crear un nuevo objeto FileReader
      const reader1 = new FileReader();
      const reader2 = new FileReader()
  
      // Función que se ejecuta cuando se carga el archivo
      reader1.onload = async (event) => {
        const data = event.target.result;
        const workbook = read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let jsonData = utils.sheet_to_json(worksheet, { defval: '' });
        jsonData = formatearPropiedades(jsonData)
        console.log(jsonData,"json")
          let correcto = true;
          let arrErr = [];
          jsonData.map((m) => {
            if (correcto === true) {
              let a = m.hasOwnProperty("Codigo");
              let b = m.hasOwnProperty("Nombre");
              let c = m.hasOwnProperty("Persona Contacto");
              let d = m.hasOwnProperty("Telefonos");
              let f = m.hasOwnProperty("Correo Electronico");
              let g = m.hasOwnProperty("Limite Credito");
              let h = m.hasOwnProperty("Dias Credito");
              let i = m.hasOwnProperty("Credito Disponible");
              let j = m.hasOwnProperty("Precio de Venta");
              let l = m.hasOwnProperty("Ultima Venta a Credito");
              let n = m.hasOwnProperty("Vendedores Codigo")
              let o = m.hasOwnProperty("Vendedores Nombre")
              if (!a || !b || !c || !d  || !f || !g || !h || !i || !j  || !l  || !n || !o) {
                if (!a){
                  arrErr.push('No se encuentra el apartado de "Código" en el excel!')
                }
                if (!b){
                  arrErr.push('No se encuentra el apartado de "Nombre" en el excel!')
                }
                if (!c){
                  arrErr.push('No se encuentra el apartado de "Persona Contacto" en el excel!')
                }
                if (!d){
                  arrErr.push('No se encuentra el apartado de "Teléfonos" en el excel!')
                }
                if (!f){
                  arrErr.push('No se encuentra el apartado de "Correo Electrónico" en el excel!')
                }
                if (!g){
                  arrErr.push('No se encuentra el apartado de "Limite Credito" en el excel!')
                }
                if (!h){
                  arrErr.push('No se encuentra el apartado de "Dias Credito" en el excel!')
                }
                if (!i){
                  arrErr.push('No se encuentra el apartado de "Credito Disponible" en el excel!')
                }
                if (!j){
                  arrErr.push('No se encuentra el apartado de "Precio de Venta" en el excel!')
                }
                if (!l){
                  arrErr.push('No se encuentra el apartado de "Ultima Venta a Crédito" en el excel!')
                }
                if (!n){
                  arrErr.push('No se encuentra el apartado de "Vendedores Código" en el excel!')
                }
                if (!o){
                  arrErr.push('No se encuentra el apartado de "Vendedores Nombre" en el excel!')
                }
                correcto = false;
              }
            }
          });
          if (correcto) {
            const newArr = jsonData.map(obj => {
              return {
                Código: obj.Codigo,
                "Nombre": obj["Nombre"],
                "Persona Contacto": obj["Persona Contacto"],
                "Teléfonos": obj["Telefonos"],
                "Correo Electrónico": obj["Correo Electronico"],
                "Limite Credito": obj["Limite Credito"],
                "Dias Credito": obj["Dias Credito"],
                "Credito Disponible": obj["Credito Disponible"],
                "Precio de Venta": obj["Precio de Venta"],
                "Ultima Venta a Crédito": obj["Ultima Venta a Credito"],
                "Vendedores Código": obj["Vendedores Codigo"],
                "Vendedores Nombre": obj["Vendedores Nombre"],
              };
            });
            let status = await updateClients(newArr);
            setStatusCliente(status)
          } else {
            MySwal.fire({
              icon: 'error',
              title: 'Oops... ha ocurrido un error en el excel de clientes',
              html: <>
                  {arrErr.map((d) => {
                return <li className='my-2' style={{fontSize: "15px"}}>{d}</li>
              })}
              Por favor, recuerde escribir los nombres como se le indica en el modelo
              </>,
            });
          }

      };
      reader2.onload = async (event) => {
        const data = event.target.result;
        const workbook = read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let jsonData = utils.sheet_to_json(worksheet, { defval: '' });
        jsonData = formatearPropiedades(jsonData)
        console.log(jsonData,"json")
          let correcto = true;
          let arrErr = []
          jsonData.map((m) => {
            if (correcto === true) {
              let a = m.hasOwnProperty("Codigo");
              let b = m.hasOwnProperty("Nombre Corto");
              let c = m.hasOwnProperty("Referencia");
              let d = m.hasOwnProperty("Marca");
              let e = m.hasOwnProperty("Modelo");
              let f = m.hasOwnProperty("Existencia Actual");
              let g = m.hasOwnProperty("Precio Oferta");
              let h = m.hasOwnProperty("Precio Mayor");
              let i = m.hasOwnProperty("Precio Minimo");
    
              if (!a || !b || !c || !d || !e || !f || !g || !h || !i) {
                if (!a){
                  arrErr.push('No se encuentra el apartado de "Código" en el excel!')
                }
                if (!b){
                  arrErr.push('No se encuentra el apartado de "Nombre Corto" en el excel!')
                }
                if (!c){
                  arrErr.push('No se encuentra el apartado de "Referencia" en el excel!')
                }
                if (!d){
                  arrErr.push('No se encuentra el apartado de "Marca" en el excel!')
                }
                if (!e){
                  arrErr.push('No se encuentra el apartado de "Modelo" en el excel!')
                }
                if (!f){
                  arrErr.push('No se encuentra el apartado de "Existencia Actual" en el excel!')
                }
                if (!g){
                  arrErr.push('No se encuentra el apartado de "Precio Oferta" en el excel!')
                }
                if (!h){
                  arrErr.push('No se encuentra el apartado de "Precio Mayor" en el excel!')
                }
                if (!i){
                  arrErr.push('No se encuentra el apartado de "Precio Minimo" en el excel!')
                }
                correcto = false;
              }
            }
          });
          if (correcto) {
            const newArr = jsonData.map(obj => {
              return {
                "Código": obj["Codigo"],
                "Nombre Corto": obj["Nombre Corto"],
                Referencia: obj.Referencia,
                Marca: obj.Marca,
                Modelo: obj.Modelo,
                "Existencia Actual": obj["Existencia Actual"],
                "Precio Oferta": obj["Precio Oferta"],
                "Precio Mayor": obj["Precio Mayor"],
                "Precio Minimo": obj["Precio Minimo"],
              };
            });
            let status = await updateProducts(newArr);
            setStatusProducto(status)
          } else {
            MySwal.fire({
              icon: 'error',
              title: 'Oops... ha ocurrido un error en el excel de productos',
              html: <>
              {arrErr.map((d) => {
                return <li className='my-2' style={{fontSize: "15px"}}>{d}</li>
              })}
              Por favor, recuerde escribir los nombres como se le indica en el modelo
              </>,
            });
          }
      };
      // Leer el archivo como un array buffer
      if (cargaClientes) {
       reader1.readAsArrayBuffer(file1);
      }
      if (cargaProductos) {
       reader2.readAsArrayBuffer(file2);
      }
    };
    

    

  
  

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
      console.log(sC)
      json['cantidad'] = n
      sC["Precio de Venta"].trimEnd() == 'Precio Por Defecto' || sC["Precio de Venta"].trimEnd() == 'Precio Minimo' ? 
      json['precio'] = sP['Precio Minimo'] : sC["Precio de Venta"].trimEnd() == 'Precio Mayor' ? 
      json['precio'] = sP['Precio Mayor'] : sC["Precio de Venta"].trimEnd() == 'Precio Oferta' ? 
      json['precio'] = sP['Precio Oferta'] : console.log(sP)
      setpreShoppingCart(prevList => [...prevList, json])
      setSelectedProduct(null)
      setPrecioOferta('')
      setexistencia(0)
      setPrecioMenor('')
      setCódigo('')
      setNombreCorto('')
      setMarca('')
    }

    

    useEffect(() => {
      setShoppingCart(preShoppingCart.sort((a,b) => {
        console.log(a.Referencia, b.Referencia, a.Referencia < b.Referencia)
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

const MySwal = withReactContent(Swal)

    const selectEmail = () => {
      let att = [];
      const handleAttachments = (newAttachments) => {
        console.log(newAttachments);
        att = newAttachments
      };
         MySwal.fire({
          icon: 'info',

          html: <>
          <p><h5>¿Cuales son los destinatarios?</h5></p>
          <div className="row my-3">
           <div className="col-8 d-flex justify-content-center"><label htmlFor="correoCliente" className='labelCorreo'>{sC["Correo Electrónico"]}</label></div>
           <div className="col-4 d-flex justify-content-center"><input type="checkbox"  id="correoCliente" defaultChecked onChange={(e) => {
            setCorreoCliente(e.target.checked)
           }}/></div>
          </div>
          <MultiAttachmentInput onAttachmentsChange={handleAttachments}/>
          <div className="col-12 d-flex justify-content-start"><label htmlFor="correoNota">Mensaje:</label></div>
          <div className="col-12 d-flex justify-content-start"><input className='form-control' type="textbox" name="" id="correoNota" onChange={(e) => {
            setCorreoMsn(e.target.value)
           }}/></div>
          
          </>,
          showCancelButton: true,
        }).then(async (result) => {

          if (result.isConfirmed ) {
            let msn = document.getElementById('correoNota').value
            if (!att[0] && !correoCliente) {
              Swal.fire({
                icon: 'error',
                title: 'No ha insertado ningun correo al que enviar el archivo!',
              }) 
            } else {
              if (correoCliente) {
                att.push(sC["Correo Electrónico"])
              }
              att.push("pedidos@toyoxpress.com")
              att.push("toyoxpressca@gmail.com")
              console.log(att)
              await att.map(correo => {
                handleSendMail(correo, msn)
              })
                shoppingCart.map((m, i) => {
                  updateStock(i, 'correo')
                })
            }
          }
        });
      }
    
      useEffect(() => {
        if(selectedProduct && product) {
          setPartes([])
        }
      }, [selectedProduct, product]);
      

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
          value = parseInt(value)
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
    };

    useEffect(() => {
      if(partes[0]){
        setMenu1(true)
      } else {
        setMenu1(false)
      }
    }, [partes])
    useEffect(() => {
      if(clientes[0]){
        setMenu2(true)
      } else {
        setMenu2(false)
      }
    }, [clientes])

  return (<>
     { !ve ? false :
      <div className="d-flex justify-content-center mt-3">
    <div className="row bg-light col-11 py-3 d-flex justify-content-center"> 
    <div className="col-6 d-flex justify-content-center"> <div className="model d-flex align-items-center" onClick={modeloCliente}> <img src={excec} alt="" className='execModel'/>  Modelo Excel  </div></div>
    <div className="col-6 d-flex justify-content-center"> <div className="model d-flex align-items-center" onClick={modeloProducto}> <img src={excec} alt="" className='execModel'/> Modelo Excel </div></div>
{ !cargaClientes ?  <div className="col-6 d-flex justify-content-center text-center"> <label htmlFor="archivoClientes" className='btn btn-primary'>Inserte Excel de Clientes</label>  <input type="file" className='Inp' id='archivoClientes' onChange={(e) => setCargaClientes(e)} /></div> : <><div className="col-6 d-flex justify-content-center text-center"> <label htmlFor="archivoClientes" className='btn btn-primary disabled'>Excel insertado!</label>  <input type="file" className='Inp' id='archivoClientes'  /></div></>}
    {!cargaProductos ? <div className="col-6 d-flex justify-content-center text-center"><label htmlFor="archivoProductos" className='btn btn-primary'>Inserte Excel de Productos</label> <input type="file" className='Inp' id='archivoProductos' onChange={(e) => setCargaProductos(e)} /></div> : <div className="col-6 d-flex justify-content-center text-center"><label htmlFor="archivoProductos" className='btn btn-primary disabled'>Excel insertado!</label> <input type="file" className='Inp' id='archivoProductos' /></div> }
    { cargaClientes ? <div className="col-6 d-flex justify-content-center "><div className="execut "><div className="ltx" onClick={() => {
      setCargaClientes(null)
      setarchivoClientes(null)
    }}><img src={ltx} alt="" className='img-ltx'/></div><div className="d-flex justify-content-center"><img src={excec} alt="" className='excecP'/></div><div className="col-12 mt-1">{archivoClientes}</div></div></div> : false}
   {cargaProductos ? <div className="col-6 d-flex justify-content-center "><div className="execut "><div className="ltx" onClick={() => {
      setCargaProductos(null)
      setarchivoProductos(null)
    }}><img src={ltx} alt="" className='img-ltx'/></div><div className="d-flex justify-content-center"><img src={excec} alt="" className='excecP'/></div><div className="col-12 mt-1">{archivoProductos}</div></div></div> : false}
    <div className="col-11"><div className="toyox my-3" onClick={preHandleFile}>Procesar</div></div>    <div className="col-12 d-flex justify-content-center">Ultima actualizacion: {fecha}</div></div> 

    </div>} 
  <div className="d-flex justify-content-center row mt-3 ">
    <div className="row bg-light col-11 py-4">
        <div className="col-12 d-flex justify-content-center row mb-3 mx-0">
        <div className="col-sm-2 mx-1 d-flex align-items-center justify-content-center">Agregar Cliente:</div>
 <div className="col-sm-9 d-flex align-items-center justify-content-center"> <Select options={clientes} components={components} menuIsOpen={menu2} value={selectedClient} isClearable={true} onChange={(e) => {
  console.log(e)
       if (e === null) {
        setSelectedClient(null)
        setCliente(null)
       } else {
        setSelectedClient(e)
        setCliente(e.value)
       }
}} placeholder='Introduce el nombre del cliente' onInputChange={(e) => {
          if (e.length >= 4) {
          getSimpleClients(e)
          } else {
            setClientes([])
          }
        }} className="selectpd px-2"  id='clientela'/>
        </div>
        </div>
        <hr className='mt-2'/>
        <div className="col-12 row mb-3 mx-0 d-flex justify-content-center">
        <div className="col-sm-2 d-flex align-items-center justify-content-center">Nro de Parte:</div>
        <div className="col-sm-9 d-flex align-items-center justify-content-center"> <Select options={partes} components={components} menuIsOpen={menu1} isClearable={true} value={selectedProduct} onChange={(e) => {
          if (e === null) {
            setSelectedProduct(null)
          } else {
          console.log(e)
         setSelectedProduct(e)
          }
        setProduct(e.value) }} placeholder='Introduce el número de parte' onInputChange={(e) => {
          if (e.length >= 5) {
            console.log('entre');
          getSimpleProducts(e)
          } else {
            setPartes([])
          }
        }} className="selectpd px-2"/>
        </div>
        </div>
        <hr />
        <div className=" col-sm-12 col-md-11  paltable"> 
        <table class="table ">
<thead>
  <tr>
    <th class="tg-0pky">Código</th>
    <th class="tg-0pky">Descripción</th>
    <th class="tg-0pky">Precio</th>
    <th class="tg-0pky">Precio 2</th>
    <th class="tg-0pky">Marca</th>
    <th class="tg-0pky">Existencia Actual</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky">{código}</td>
    <td class="tg-0pky">{nombreCorto}</td>
    <td class="tg-0pky">{precioMenor}</td>
    <td class="tg-0pky">{precioOferta}</td>
    <td class="tg-0pky">{marca}</td>
    { existencia == 0 ? 
    <td class="tg-0pky" style={{color: 'red'}}>{existencia}</td> :
    <td class="tg-0pky">{existencia}</td>
}

  </tr>
</tbody>
</table>
    </div>
    <div className="boton-container col-md-1 align-items-center">
    {
      cliente ?
      <div className="toyox-cart" onClick={() => {selectCart()}}><box-icon name='cart-add' color='#ffffff' size='20px'></box-icon></div> :
      <div className="toyox-disabled"><box-icon name='cart-add' color='#eceaea' size='20px'></box-icon></div>
    }
    </div>
    <hr className='mt-2'/>
    <h3 className='sp'>Shopping Cart</h3>
    <div className="col-sm-12 paltable">
        <table class="table">
<thead>
  <tr>
    <th class="tg-0pky">Codigo</th>
    <th class="tg-0pky">Descripcion</th>
    <th class="tg-0pky">Precio</th>
    <th class="tg-0pky">Marca</th>
    <th class="tg-0pky">Referencia</th>
    <th class="tg-0pky">Cantidad</th>
    <th class="tg-0pky">Acciones</th>
  </tr>
</thead>
<tbody>
 {shoppingCart ? shoppingCart.map((m, i) => {
  return (
    <tr>
      <td class="tg-0pky">{m.Código}</td>
      <td class="tg-0pky">{m['Nombre Corto']}</td>
    {
      sC["Precio de Venta"].trimEnd() == 'Precio Por Defecto' || sC["Precio de Venta"].trimEnd() == 'Precio Minimo' ? 
      <td class="tg-0pky">{m["Precio Minimo"]}</td> : sC["Precio de Venta"].trimEnd() == 'Precio Mayor' ? 
      <td class="tg-0pky">{m["Precio Mayor"]}</td> : sC["Precio de Venta"].trimEnd() == 'Precio Oferta' ? 
      <td class="tg-0pky">{m["Precio Oferta"]}</td> : console.log(sC)}
    <td class="tg-0pky">{m.Modelo}</td>
    <td class="tg-0pky">{m.Referencia}</td>
    <td class="tg-0pky">{m.cantidad}</td>
    <td class="tg-0pky"><div><button className='toyox' onClick={(e) => {
      eliminarProducto(m.Código)
    }}><box-icon name='trash' type='solid' color='#ffffff' size='20px'></box-icon></button></div></td>
    </tr>
  )
 }): false}
</tbody>
</table>
    </div>
    {!shoppingCart[0] ?    false: <> <hr />
    <div className="col-12 row mb-2"><div className="d-flex justify-content-center"> <div className="mx-2">Nota:</div> <textarea className='nota-text' onChange={(e) => {
      const {value} = e.target
      setNota(value)
    }} cols="60" rows="3"></textarea></div></div> </>}
 
    <div className="col-4 d-flex justify-content-center align-items-center"> <div className="btn btn-primary" onClick={() => {handleButtonClick()}} disabled={loading}>Inventario</div></div>
    <div className="col-4 d-flex justify-content-center align-items-center" onClick={() => {
      crearCor()
      shoppingCart.map((m, i) => {
        updateStock(i, 'desc')
      })
    }}>
      <PDFDownloadLink document={<MyDocument datosCliente={sC} datos={shoppingCart} total={total} items={items} nota={nota} correlativo={Corr}/>} fileName='Pedido.pdf'>
        <div className="toyox" >Descargar</div>
        </PDFDownloadLink>
        </div>

    {!shoppingCart[0] ?  <div className="col-4 d-flex justify-content-center align-items-center">
      <div className="toyox-disabled">Enviar</div>
    </div> :     <div className="col-4 d-flex justify-content-center align-items-center" onClick={() => {
      if (!pdfName) {
        generarPDF()
        crearCor()
      } else {
        generadorEmail()
      }
    }}>
      <div className="toyox">Enviar</div>
    </div>}
    <hr  className='mt-2'/>
    <div className="col-12 d-flex justify-content-center align-items-center"><div className="toyox" onClick={(e) => {
      setpreShoppingCart([])
    }}>Vaciar</div></div>
  </div>
    </div>
  </>)
};
