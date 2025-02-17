import React, { useEffect, useState } from "react";
import { ScrollView, Button, View, Alert, ActivityIndicator, StyleSheet, TextInput, Modal, Text } from "react-native";
import firebase from "../database/firebase";

const ProductoDetailScreen = (props) => {
  const initialState = {
    id: "",
    nombre: "",
    descripcion: "",
    preciounitario: "",
    stock: 0,
  };

  const [user, setUser] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [carrito, setCarrito] = useState([]);
  const [cedula, setCedula] = useState("");
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal

  const handleTextChange = (value, prop) => {
    setUser({ ...user, [prop]: value });
  };

  const getUserById = async (id) => {
    const dbRef = firebase.db.collection("productos").doc(id);
    const doc = await dbRef.get();
    const userData = doc.data();
    setUser({ ...userData, id: doc.id });
    setLoading(false);
  };

  const deleteUser = async () => {
    setLoading(true);
    const dbRef = firebase.db.collection("productos").doc(props.route.params.userId);
    await dbRef.delete();
    setLoading(false);
    props.navigation.navigate("ProductoList");
  };

  const buyProduct = async () => {
    setShowModal(true); // Mostrar el modal para ingresar la cédula del cliente
  };

  const handleCedulaChange = (value) => {
    setCedula(value);
  };

  const handleAccept = async () => {
    setShowModal(false);
    try {
      const clienteRef = firebase.db.collection("clientes").where("cedula", "==", cedula);
      const snapshot = await clienteRef.get();

      if (snapshot.empty) {
        setMensajeError("Error", "La cédula no está registrada en nuestra base de datos.");
        return;
      }

      // Si la cédula está registrada, continuar con la operación
      if (user.stock > 0) {
        try {
          // Reducir el stock del producto en 1
          const updatedStock = user.stock - 1;

          // Actualizar el documento del producto en la base de datos
          const userRef = firebase.db.collection("productos").doc(user.id);
          await userRef.update({
            stock: updatedStock,
          });

          // Agregar el producto al carrito
          const updatedProduct = { ...user, stock: updatedStock };
          const updatedCarrito = [...carrito, updatedProduct];
          setCarrito(updatedCarrito);

          // Navegar a la pantalla del carrito
          props.navigation.navigate("CarritoCompras", { carrito: updatedCarrito, cedulacliente: cedula });

           setMensajeError("Compra exitosa", "El producto ha sido comprado.");
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserById(props.route.params.userId);
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        <TextInput
          placeholder="Nombre"
          autoCompleteType="off"
          style={styles.inputGroup}
          value={user.nombre}
          onChangeText={(value) => handleTextChange(value, "nombre")}
        />
      </View>
      <View>
        <TextInput
          placeholder="Descripción"
          autoCompleteType="off"
          style={styles.inputGroup}
          value={user.descripcion}
          onChangeText={(value) => handleTextChange(value, "descripcion")}
        />
      </View>
      <View>
        <TextInput
          placeholder="Precio Unitario"
          autoCompleteType="off"
          style={styles.inputGroup}
          value={user.preciounitario}
          onChangeText={(value) => handleTextChange(value, "preciounitario")}
        />
      </View>
      <View>
        <Button title="Comprar" onPress={buyProduct} color="#19AC52" />
      </View>
      <View style={styles.btn}>
        <Button title="Delete" onPress={openConfirmationAlert} color="red" />
      </View>
      <View>
        <Button title="Actualizar" onPress={updateUser} color="#19AC52" />
      </View>

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
              onChangeText={handleCedulaChange}
            />
            <Button title="Aceptar" onPress={handleAccept} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputGroup: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
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
});

export default ProductoDetailScreen;