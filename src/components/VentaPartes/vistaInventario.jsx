import { PDFViewer } from '@react-pdf/renderer';
import React, {useEffect, useState} from 'react';

import Pako from 'pako';
import { useParams } from 'react-router-dom';
import Inventario from './inventario';
import { backendUrl } from '../../lib/data/server';

const VistaInventario = () => {
    const [data, setdata] = useState();
    
    const getProducts = async () => {
        const response = await fetch(`${backendUrl()}/excel/products`)
        let data = await response.json()
        data = data.excel
        let arr = data.filter((m) => m['Existencia Actual'] > 0)
        setdata(arr)
      }

      useEffect(() => {
        getProducts()
      }, [])

      useEffect(() => {
        console.log(data);
      

      }, [data]);
      

  return (
    <div style={{height: '99.9vh'}}>
    { data ? 
        <PDFViewer className='pdfView'>
            <Inventario datos={data}/>
        </PDFViewer>  : false
    }
    </div>
        );
};

export default VistaInventario;