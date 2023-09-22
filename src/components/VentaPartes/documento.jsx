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
    marginRight: 20,
    boxSizing: "border-box",
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: "flex-end"
  },
  containerHU: {
    flexDirection: 'row', // Alinea los hijos horizontalmente
    justifyContent: 'space-between', // Espacio entre los hijos
    alignItems: 'center', // Alinea los hijos verticalmente
    // Puedes ajustar otros estilos según tus necesidades
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  letters: {
fontSize : 10,
width: "50%",
},
  cliente: {
    width: '100%',
    fontSize: 9,
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: 2
  },

 encabezado: {
    width: '16%', padding: 10, borderBottomWidth: 1,borderTopWidth:1, fontSize: 8, fontWeight: "bold",
 },
 encabezadoPrecio: {
  width: '5%', padding: 10, borderBottomWidth: 1,borderTopWidth:1, fontSize: 8, fontWeight: "bold",
},
 encabezadoDesc: {
  width: '37%', padding: 10, borderBottomWidth: 1, borderTopWidth:1, fontSize: 8, fontWeight: "bold", 
},



 celda: {
    width: '16%', paddingHorizontal: 10, paddingVertical:3, fontSize: 7, 
 },
 celdaPrecio: {
  width: '5%', paddingHorizontal: 10, paddingVertical:3, fontSize: 7, 
},
 finales: {
  width: '33.3%', paddingVertical:3, fontSize: 12, 
},
nota: {
  width: '100%', paddingVertical:3, fontSize: 12, display: 'flex', justifyContent: 'center',
},
 celdaDesc: {
  width: '37%', paddingHorizontal: 10, paddingVertical:3, fontSize: 7, 
},
});


// Create Document Component
const MyDocument = ({datosCliente, datos, total, items, nota, correlativo, hora, User}) => 
    (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={{flex: 1}}>
    <View style={styles.container}>
        <View style={styles.column}>
        <View style={{marginBottom: 10}}>
        <Text>Pedido {correlativo}</Text>
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
        <View style={styles.containerHU}>
          <View><Text style={styles.letters} >Fecha: {hora}</Text><Text style={styles.letters}>Usuario: {User}</Text></View>
        </View>
        <View style={styles.table}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.encabezado}>Código</Text>
            <Text style={styles.encabezadoDesc}>Descripción</Text>
            <Text style={styles.encabezado}>Marca</Text>
            <Text style={{width: '11%', padding: 10, borderBottomWidth: 1,borderTopWidth:1, fontSize: 8, fontWeight: "bold"}}>Referencia</Text>
            <Text style={styles.encabezadoPrecio}>Cant.</Text>
            <Text style={styles.encabezadoPrecio}>P.U.</Text>
            <Text style={{width: '10%', padding: 10, borderBottomWidth: 1,borderTopWidth:1, fontSize: 8, fontWeight: "bold"}}>Total</Text>
          </View>
        {datos.map(d => (
        <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.celda}>{d["Código"]}</Text>
                      <Text style={styles.celdaDesc}>{d["Nombre Corto"]}</Text>
                      <Text style={styles.celda}>{d["Modelo"]}</Text>
                      <Text style={{width: '11%', paddingHorizontal: 10, paddingVertical:3, fontSize: 7}}>{d["Referencia"]}</Text>
                      <Text style={styles.celdaPrecio}>{`${d["cantidad"]}`}</Text>
                      <Text style={styles.celdaPrecio}>{`${d["precio"]}`}</Text>
                      <Text style={{width: '10%', paddingHorizontal: 10, paddingVertical:3, fontSize: 7, }}>{`${d["total"]}`}</Text>
        </View>
        ))}
        </View>
        <View style={{paddingHorizontal: 20,      flex: 1,    flexDirection: 'column', // Alinea los hijos verticalmente
    alignItems: 'flex-end'}}>
        <View style={{justifyContent: 'flex-end', height: '80%',   marginBottom: 5,       display: "flex",
        flexDirection: "row", 
        alignItems: "space-between",}}><Text style={styles.finales}>Total: {total.toFixed(2)}</Text><Text style={styles.finales}>Lineas: {datos.length}</Text><Text style={styles.finales}>Items: {items} </Text></View>
                <View style={{justifyContent: 'flex-end', marginBottom: 30,         display: "flex",
        flexDirection: "row",
        alignItems: "space-between",}}>
        <Text style={styles.nota}><Text style={{}}>Nota:</Text> <Text style={{width: '30%', fontSize: 10}}>{nota}</Text></Text>
        </View>
        </View>
        </View>
    </Page>
  </Document>
);

export default MyDocument