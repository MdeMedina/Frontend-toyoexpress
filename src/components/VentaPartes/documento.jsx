import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
// Create styles
const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "95%",
        height:"15%",
        alignItems: 'flex-start',
        marginLeft: "auto",
        marginRight: "auto",
        borderWidth: 1,
        borderColor: "black",
        marginTop: 20,
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
    width: '12.5%', padding: 10, borderBottomWidth: 1, fontSize: 8, fontWeight: "bold"
 },


 celda: {
    width: '12.5%', paddingHorizontal: 10, paddingVertical:3, fontSize: 7, 
 },
 finales: {
  width: '33.3%', paddingHorizontal: 10, paddingVertical:3, fontSize: 12, 
},
nota: {
  width: '100%', paddingHorizontal: 10, paddingVertical:3, fontSize: 12, display: 'flex', justifyContent: 'center'
},
 celdaDesc: {
  width: '50%', paddingHorizontal: 10, paddingVertical:3, fontSize: 7
},
});


// Create Document Component
const MyDocument = ({datosCliente, datos, total, items, nota}) => 
    (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={{flex: 1}}>
    <View style={styles.container}>
        <View style={styles.column}>
        <View style={{marginBottom: 10}}>
        <Text>Presupuesto</Text>
        </View>
        <View style={{ display: 'flex',
    justifyContent: 'flex-start',}}>
          <Text style={styles.cliente}> Razón Social: {datosCliente["Nombre"]}</Text>
          <Text style={styles.cliente}> Rif: {datosCliente["Código"]}</Text>
          <Text style={styles.cliente}> Teléfono: {datosCliente["Teléfonos"]}</Text>
 {datosCliente["Correo Electrónico"] ?  <Text style={styles.cliente}> Correo Electrónico: {datosCliente["Correo Electrónico"]}</Text> : false} 
        </View>
        </View>
        <View style={styles.columnImage}>
        <Image source={require('../img/favicon.ico')} style={styles.image}/>
        </View>
        </View>
        <View style={styles.table}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.encabezado}>Código</Text>
            <Text style={styles.encabezado}>Descripción</Text>
            <Text style={styles.encabezado}></Text>
            <Text style={styles.encabezado}></Text>
            <Text style={styles.encabezado}>Cantidad</Text>
            <Text style={styles.encabezado}>Referencia</Text>
            <Text style={styles.encabezado}>Marca</Text>
            <Text style={styles.encabezado}>Precio</Text>
          </View>
        {datos.map(d => (
        <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.celda}>{d["Código"]}</Text>
                      <Text style={styles.celdaDesc}>{d["Nombre Corto"]}</Text>
                      <Text style={styles.celda}>{`${d["cantidad"]}`}</Text>
                      <Text style={styles.celda}>{d["Referencia"]}</Text>
                      <Text style={styles.celda}>{d["Modelo"]}</Text>
                      <Text style={styles.celda}>{`${d["precio"]}`}</Text>
        </View>
        ))}
        </View>
        <View style={{justifyContent: 'flex-end', height: '80%',   marginBottom: 5,       display: "flex",
        flexDirection: "row", 
        alignItems: "space-between",}}><Text style={styles.finales}>Total: {total}</Text><Text style={styles.finales}>Lineas: {datos.length}</Text><Text style={styles.finales}>Items: {items} </Text></View>
                <View style={{justifyContent: 'flex-end', marginBottom: 30,         display: "flex",
        flexDirection: "row",
        alignItems: "space-between",}}>
        <Text style={styles.nota}><Text style={{}}>Nota:</Text> <Text style={{width: '30%', fontSize: 10}}>{nota}</Text></Text>
        </View>
        </View>
    </Page>
  </Document>
);

export default MyDocument