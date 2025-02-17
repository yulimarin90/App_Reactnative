import React, { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, View, FlatList, ScrollView, Alert, Text, Modal, TextInput, TouchableOpacity } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import firebase from "../database/firebase";

const ProductoList = (props) => {
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [selectedCantidad, setSelectedCantidad] = useState(0);
  const [productosEnCarrito, setProductosEnCarrito] = useState([]);
  const scrollViewRef = useRef();
  const [mensajeError, setMensajeError] = useState("");
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [cedula, setCedula] = useState(""); // Estado para almacenar la cédula ingresada en el modal
  const [showCantidadModal, setShowCantidadModal] = useState(false); // Modal para seleccionar cantidad

  useEffect(() => {
    firebase.db.collection("productos").onSnapshot((querySnapshot) => {
      const productos = [];
      querySnapshot.docs.forEach((doc) => {
        const { nombre, descripcion, stock, preciounitario, emoji } = doc.data();
        productos.push({
          id: doc.id,
          nombre,
          descripcion,
          stock,
          preciounitario,
          emoji,
          cantidad: 0,
        });
      });
      setProductos(productos);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    });
  }, []);

  const handleCompra = async () => {
    const productosSeleccionados = productos.filter(producto => producto.cantidad > 0);
    if (productosSeleccionados.length === 0) {
      setMensajeError("Por favor, debes seleccionar al menos un producto de la lista.");
      return;
    } else {
      setMensajeError("");
    }
    // Verificar si hay suficiente stock para los productos seleccionados
    for (const producto of productosSeleccionados) {
      if (producto.cantidad > producto.stock) {
        setMensajeError("La cantidad de productos seleccionados es mayor al stock disponible.");
        return;
        // Si hay suficiente stock, abrir el modal para ingresar la cédula del cliente
      }
    }
    try {
      // Actualizar el stock de los productos seleccionados
      const updates = productosSeleccionados.map(async (producto) => {
        const updatedStock = producto.stock - producto.cantidad;
        await firebase.db.collection("productos").doc(producto.id).update({ stock: updatedStock });
      });

      await Promise.all(updates); // Esperar a que todas las actualizaciones se completen antes de continuar
    } catch (error) {
      console.log("Error al actualizar el stock:", error);
      setMensajeError("Error al actualizar el stock.");
      return;
    }

    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    try {
      const productRef = firebase.db.collection("productos").doc(id);
      await productRef.delete();
      setProductos(productos.filter(producto => producto.id !== id)); // Actualizar el estado para reflejar el cambio
      Alert.alert("Producto eliminado", "El producto ha sido eliminado correctamente.");
    } catch (error) {
      console.error("Error eliminando producto: ", error);
      Alert.alert("Error", "Hubo un problema eliminando el producto.");
    }
  };

  const handleModalAccept = async () => {
    setShowModal(false);
    try {
      const clienteRef = firebase.db.collection("clientes").where("cedula", "==", cedula);
      const snapshot = await clienteRef.get();

      if (snapshot.empty) {
        Alert.alert("Error", "La cédula no corresponde a ningún cliente existente.");
        return;
      }

      // Si la cédula está registrada, obtener los datos del cliente
      let clienteData = {};
      snapshot.forEach(doc => {
        clienteData = doc.data();
      });

      // Aquí puedes mostrar los datos del cliente, por ejemplo:
      console.log("Datos del cliente:", clienteData);

      // Llevar los productos seleccionados al carrito junto con la información de la cédula y los datos del cliente
      props.navigation.navigate("CarritoCompras", { productosSeleccionados: productosEnCarrito, cedula: cedula, clienteData: clienteData });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSeleccionProducto = (producto) => {
    const productoExistenteIndex = productosEnCarrito.findIndex(p => p.id === producto.id);
    if (productoExistenteIndex !== -1) {
      // Si el producto ya está en el carrito, actualiza la cantidad
      const updatedProductosEnCarrito = [...productosEnCarrito];
      updatedProductosEnCarrito[productoExistenteIndex].cantidad = producto.cantidad;
      setProductosEnCarrito(updatedProductosEnCarrito);
    } else {
      // Si el producto no está en el carrito, agrégalo
      setProductosEnCarrito(prevProductosEnCarrito => [...prevProductosEnCarrito, producto]);
      
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <ListItem>
        <ListItem.Chevron />
        <Avatar
          source={{ uri: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg" }}
          rounded
          title={item.emoji} // Usar el emoji como título del Avatar
          overlayContainerStyle={{ backgroundColor: '#cccccc' }} // Estilo del contenedor del Avatar
          titleStyle={{ fontSize: 30 }} // Tamaño del texto del emoji
        />
        <ListItem.Content>
          <ListItem.Title>{item.nombre}</ListItem.Title>
          <ListItem.Title>{item.descripcion}</ListItem.Title>
          <ListItem.Title>${item.preciounitario}</ListItem.Title>
          <Text>Stock: {item.stock}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => {
              setSelectedProducto({ ...item, index });
              setShowCantidadModal(true);
              
            }}
            
          >
            <Text style={styles.quantityButtonText}>{item.cantidad || "Seleccionar cantidad"}</Text>
          </TouchableOpacity>
          <Button title="Eliminar"
            style={styles.deleteButton}
            onPress={() => handleEliminar(item.id)}
          />
            
        </ListItem.Content>
      </ListItem>
    </View>
  );

  const renderCantidadItem = ({ item }) => (
    <TouchableOpacity
      style={styles.quantityItem}
      onPress={() => {
        const updatedProductos = [...productos];
        updatedProductos[selectedProducto.index].cantidad = item;
        setProductos(updatedProductos);
        handleSeleccionProducto(updatedProductos[selectedProducto.index]);
        setShowCantidadModal(false);
      }}
    >
      <Text style={styles.quantityItemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <Button
        onPress={() => props.navigation.navigate("CreateProductoScreen")}
        title="Crear Producto"
      />
      <Button
        onPress={handleCompra}
        title="Seleccionar Productos"
      />
      {mensajeError ? <Text style={styles.error}>{mensajeError}</Text> : null}
      <ScrollView ref={scrollViewRef} style={styles.scrollView}>
        <FlatList
          data={productos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </ScrollView>

      {/* Modal para ingresar la cédula del cliente */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Por favor ingrese la cédula del cliente</Text>
            <TextInput
              placeholder="Cédula del cliente"
              autoCompleteType="cc-number"
              style={styles.inputGroup}
              value={cedula}
              onChangeText={setCedula}
            />
            <Button title="Aceptar" onPress={handleModalAccept} />
          </View>
        </View>
      </Modal>

      {/* Modal para seleccionar la cantidad */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCantidadModal}
        onRequestClose={() => {
          setShowCantidadModal(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Seleccionar cantidad</Text>
            <FlatList
              data={[...Array(11).keys()]}
              keyExtractor={(item) => item.toString()}
              renderItem={renderCantidadItem}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  itemContainer: {
    flex: 1,
    margin: 10,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  quantityButton: {
    marginTop: 10,
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
  },
  quantityItem: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    marginVertical: 2,
    borderRadius: 5,
    alignItems: 'center',
  },
  quantityItemText: {
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#ff6666',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    color: 'white',
  },
});

export default ProductoList;

