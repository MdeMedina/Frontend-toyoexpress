import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
// Create styles
const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "95%",
        height:"135px",
        alignItems: 'flex-start',
        marginLeft: "auto",
        marginRight: "auto",
        borderWidth: 1,
        borderColor: "black",
        marginBottom: 20,
      },
      table: {
        width: "95%",
        display: "flex",
        justifyContent: "space-between",
        marginLeft: "auto",
        marginRight: "auto",
      },
  column: {
    width: "50%",
    marginLeft: 5,
    marginRight: 20,
    boxSizing: "border-box",
    padding: 10,
  },

  columnImage: {
    width: "50%",
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 0,
    boxSizing: "border-box",
    padding: 10,
  },
  image: {
    width: 110,
    height: 110
  },
  cliente: {
    width: '100%',
    fontSize: 9,
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: 2
  },

 encabezado: {
    width: '15%', padding: 10, borderBottomWidth: 1, fontSize: 9, fontWeight: 500
 },
 encabezadoDesc: {
  width: '55%', padding: 10, borderBottomWidth: 1, fontSize: 9, fontWeight: 500
},


 celda: {
    width: '25%', paddingHorizontal: 10, paddingVertical:3, fontSize: 6
 },
 celdaZero: {
  color: 'red', width: '15%', paddingHorizontal: 10, paddingVertical:3, fontSize: 6// Cambia el color de la fuente a rojo
},
 finales: {
  width: '33.3%', paddingHorizontal: 10, paddingVertical:3, fontSize: 12, 
},
nota: {
  width: '100%', paddingHorizontal: 10, paddingVertical:3, fontSize: 12, display: 'flex', justifyContent: 'center'
},
 celdaDesc: {
  width: '55%', paddingHorizontal: 10, paddingVertical:3, fontSize: 6
},
});


// Create Document Component
const Inventario = ({datosCliente, datos}) => 
    (
  <Document>
    <Page size="A4" style={{paddingVertical: 20}}>
      <View style={{flex: 1}}>
    <View style={styles.container}>
        <View style={styles.column}>
        <View style={{marginBottom: 10}}>
        <Text>Inventario</Text>
        </View>
        </View>
        <View style={styles.columnImage}>
        <Image source={require('../img/favicon.ico')} style={styles.image}/>
        </View>
        </View>
        <View style={styles.table}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{
    width: '15%', padding: 10, borderBottomWidth: 1, fontSize: 9, fontWeight: 500
 }}>Código</Text>
            <Text style={styles.encabezadoDesc}>Descripción</Text>
            <Text style={{width: '15%', padding: 10, borderBottomWidth: 1, fontSize: 9, fontWeight: 500,textAlign: 'right'}}>Marca</Text>
            <Text style={{...styles.encabezado, textAlign: 'right'}}>Precio</Text>

          </View>
        {datos.map(d => (
        <View style={{ flexDirection: 'row' }}>
                      <Text style={{ width: '15%', paddingHorizontal: 10, paddingVertical:3, fontSize: 6}}>{d["Código"]}</Text>
                      <Text style={styles.celdaDesc}>{d["Nombre Corto"]}</Text>
                      <Text style={{ width: '15%', paddingHorizontal: 10, paddingVertical:3, fontSize: 6, textAlign: 'right' }}>{d["Modelo"]}</Text>
<Text style={{ width: '15%', paddingHorizontal: 10, paddingVertical:3, fontSize: 6, textAlign: 'right' }}>{d["Precio Minimo"].toFixed(2)}</Text>
        </View>
        ))}
        </View>
        </View>
    </Page>
  </Document>
);

export default Inventario