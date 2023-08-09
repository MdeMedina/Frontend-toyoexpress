import { PDFViewer } from '@react-pdf/renderer';
import React, {useEffect, useState} from 'react';

import Pako from 'pako';
import { useParams } from 'react-router-dom';
import Inventario from './inventario';
import { backendUrl } from '../../lib/data/server';
import loading from "./loading.gif"

const VistaInventario = () => {
    const [data, setdata] = useState();
    
    const getProducts = async () => {
        const response = await fetch(`${backendUrl()}/excel/productsComplete`)
        let data = await response.json()
        data = data.excel
        let arr = data
        arr = arr.filter((data) => {
          return data['Existencia Actual'] > 0
        })
        setdata(arr)
      }

      useEffect(() => {
        getProducts()
      }, [])

      useEffect(() => {
        console.log(data);
      

      }, [data]);
      

  return (
    <div style={{height: '100vh'}} className='d-flex justify-content-center align-items-center '>
    { data ? <>
      { data ? 
          <PDFViewer className='pdfView'>
              <Inventario datos={data}/>
          </PDFViewer>  : false
      }
      </> : <>
      <div className="row d-flex justify-content-center">
        <div className="col-12 d-flex justify-content-center"><h4 >Por favor espere, el inventario se esta cargando...</h4>
      </div>
      <div className="col-12 d-flex justify-content-center"><img src={loading} alt="loading" /></div>
      </div>

      </>}
      </div>

        );
};

export default VistaInventario;