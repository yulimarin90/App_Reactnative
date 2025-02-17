import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, StyleSheet, Linking } from "react-native";
import firebase from "../database/firebase";

const FacturaPDF = ({ route, navigation }) => {
  const { cedula } = route.params;
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.db.collection("facturas").where("cedula", "==", cedula).onSnapshot((querySnapshot) => {
      const facturas = [];
      querySnapshot.docs.forEach((doc) => {
        const facturaData = doc.data();
        const productos = facturaData.productos.map((producto) => ({
          nombre: producto.nombre,
          preciounitario: producto.preciounitario,
          cantidad: producto.cantidad,
          descripcion: producto.descripcion,
        }));
        const cliente = {
          // cedula: facturaData.cedula,
          nombre: facturaData.cliente.nombre,
          apellido: facturaData.cliente.apellido,
          email: facturaData.cliente.email,
          phone: facturaData.cliente.phone,
          fecha: facturaData.cliente.fecha,
        };
        facturas.push({
          id: doc.id,
          cedula: facturaData.cedula,
          cliente: cliente,
          productos: productos,
          fechaCompra: facturaData.fechaCompra,
          total: facturaData.total,
        });
      });
      setFacturas(facturas);
    });

    return () => unsubscribe();
  }, [cedula]);

  const enviarFacturaPorCorreo = (email, factura) => {
    let cuerpoCorreo = `Datos del Cliente:\n`;
    cuerpoCorreo += `Nombre: ${factura.cliente.nombre} ${factura.cliente.apellido}\n`;
    cuerpoCorreo += `Email: ${factura.cliente.email}\n`;
    cuerpoCorreo += `Teléfono: ${factura.cliente.phone}\n\n`;

    cuerpoCorreo += `Productos Comprados:\n`;
    let precioUnitarioTotal = 0;
    factura.productos.forEach((producto) => {
      cuerpoCorreo += `\nNombre: ${producto.nombre}\n`;
      cuerpoCorreo += `Cantidad: ${producto.cantidad}\n`;
      cuerpoCorreo += `Precio Unitario: $${producto.preciounitario}\n`;
      precioUnitarioTotal += producto.preciounitario * producto.cantidad;
      
    });

    let subtotal = precioUnitarioTotal;
    let totalConDescuento = subtotal * 0.95; // Aplicar 5% de descuento
    // let descuento = subtotal - totalConDescuento;
// cuerpoCorreo += `\nPrecio Unitario Total: $${precioUnitarioTotal}\n`; //SE AÑADIO
    cuerpoCorreo += `\nSubtotal (Sin Descuento): $${subtotal}\n`;
    cuerpoCorreo += `Total con Descuento (5% de descuento): $${totalConDescuento}\n`;
    // cuerpoCorreo += `Descuento (5%): $${descuento}\n`;

    Linking.openURL(`mailto:${email}?subject=Factura&body=${encodeURIComponent(cuerpoCorreo)}`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <Text style={styles.title}>Datos del Cliente:</Text>
      <Text>Nombre: {item.cliente.nombre} {item.cliente.apellido}</Text>
      <Text>Email: {item.cliente.email}</Text>
      <Text>Teléfono: {item.cliente.phone}</Text>
      
      <Text style={styles.title}>Productos Comprados:</Text>
      <Text>Fecha: {item.fechaCompra}</Text>
      {item.productos.map((producto, index) => (
        <View key={index}>
          <Text>Nombre: {producto.nombre}</Text>
          <Text>Cantidad: {producto.cantidad}</Text>
          <Text>Precio Unitario: ${producto.preciounitario}</Text>
        </View>
      ))}
      <Text>Total con Descuento (5% de descuento): ${item.total}</Text>

      <Button
        title="Enviar factura por correo"
        onPress={() => enviarFacturaPorCorreo(item.cliente.email, item)}
      />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Button
        title="Volver al Home"
        onPress={() => navigation.navigate("HomeScreen")}
      />
      <FlatList
        data={facturas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
});

export default FacturaPDF;
