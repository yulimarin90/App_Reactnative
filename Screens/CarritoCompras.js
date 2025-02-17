import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Button, ScrollView } from "react-native";
import firebase from "../database/firebase";

const Carrito = ({ route, navigation }) => {
  const { productosSeleccionados, cedula, clienteData } = route.params;
  const [inventario, setInventario] = useState([]);

  useEffect(() => {
    const cargarInventario = async () => {
      try {
        const snapshot = await firebase.db.collection("productos").get();
        const productos = snapshot.docs.map(doc => doc.data());
        setInventario(productos);
      } catch (error) {
        console.log("Error al cargar el inventario:", error);
      }
    };

    cargarInventario();
  }, []);

  const subtotal = productosSeleccionados.reduce((total, producto) => {
    return total + producto.cantidad * producto.preciounitario;
  }, 0);

  const descuento = subtotal * 0.05;
  const totalConDescuento = subtotal - descuento;

  const fechaActual = new Date().toLocaleDateString();

  const handleCompraProductos = async () => {
    try {
      const productosParaFactura = productosSeleccionados.map(producto => ({
        nombre: producto.nombre,
        preciounitario: producto.preciounitario,
        cantidad: producto.cantidad,
        descripcion: producto.descripcion,
        //emoji: producto.emoji,
      }));
  
      await firebase.db.collection("facturas").add({
        cedula: cedula,
        cliente: {
            nombre: clienteData.nombre,
            apellido: clienteData.apellido,
            email: clienteData.email,
            phone: clienteData.phone,
            fecha: clienteData.fecha,
        },
        productos: productosParaFactura,
        total: totalConDescuento,
        fechaCompra: new Date().toISOString(),
      });


      navigation.navigate("Facturacion", { cedula: cedula });
    } catch (error) {
      console.log(error);
    }
  };

  const handleBorrarCompra = async () => {
    try {
      // Devolver productos al inventario
      const inventarioActualizado = [...inventario];
      productosSeleccionados.forEach(productoCarrito => {
        const index = inventarioActualizado.findIndex(producto => producto.nombre === productoCarrito.nombre);
        if (index !== -1) {
          inventarioActualizado[index].stock += productoCarrito.cantidad; // Asumiendo que hay una propiedad "stock" en los productos
        }
      });
      setInventario(inventarioActualizado);

      // Limpiar productos seleccionados del carrito sin afectar el inventario
      navigation.goBack();
    } catch (error) {
      console.log("Error al devolver productos al inventario:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.clienteContainer}>
        <Text style={styles.clienteText}>Datos del cliente:</Text>
        <Text>Nombre: {clienteData.nombre}</Text>
        <Text>Apellido: {clienteData.apellido}</Text>
        <Text>Email: {clienteData.email}</Text>
        <Text>Phone: {clienteData.phone}</Text>
        <Text>Fecha: {clienteData.fecha}</Text>
      </View>
      <View style={styles.carritoContainer}>
        <Text style={styles.title}>Carrito de compras</Text>
        {/*<Text style={styles.fecha}>Fecha: {fechaActual}</Text>*/}
        <Text style={styles.cedula}>Cédula del cliente: {cedula}</Text>
        <FlatList
          data={productosSeleccionados}
          renderItem={({ item }) => (
            <View style={styles.productoContainer}>
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text style={styles.cantidad}>Cantidad: {item.cantidad}</Text>
              <Text>Precio: ${item.preciounitario}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
        <View style={styles.subtotalContainer}>
          <Text>Subtotal: ${subtotal}</Text>
          <Text>Descuento (5%): $-{descuento}</Text>
          <Text style={styles.total}>Total con Descuento: ${totalConDescuento}</Text>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <Button title="Comprar Productos" onPress={handleCompraProductos} />
        <Button title="Borrar Compra" onPress={handleBorrarCompra} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  clienteContainer: {
    position: "center",
    top: 10,
    right: 1,
    zIndex: 1,
  },
  clienteText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  carritoContainer: {
    marginTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  fecha: {
    fontSize: 16,
    marginBottom: 10,
  },
  cedula: {
    marginBottom: 10,
  },
  productoContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cantidad: {
    fontStyle: "italic",
    marginBottom: 5,
  },
  subtotalContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  buttonsContainer: {
    marginTop: 20,
  },
});

export default Carrito;
