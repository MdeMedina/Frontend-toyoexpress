import React, { useState, useEffect } from 'react';
import {read, utils} from 'xlsx';

function ExcelReader() {
  const [jsonData, setJsonData] = useState([]);

  // Función que se ejecuta cuando el usuario selecciona un archivo
  function handleFileUpload(event) {
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
      const Jsondata = utils.sheet_to_json(worksheet, { header: ['Producto', 'Trim. 1', 'Trim. 2', 'Total General'] });

      // Actualizar el estado con los datos del archivo
      setJsonData(Jsondata);
    };

    // Leer el archivo como un array buffer
    reader.readAsArrayBuffer(file);
  }

  const handleExcelFetch =  () => {
    
  }

  useEffect(() => {
 handleExcelFetch()
  }, [jsonData]);
  

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
}

export default ExcelReader;
