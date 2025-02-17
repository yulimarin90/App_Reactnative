import React, { useState } from "react";
import { Button, View, StyleSheet, TextInput, ScrollView, Alert, Text } from "react-native";
import firebase from "../database/firebase";
import EmojiSelector from 'react-native-emoji-selector';

const CreateProductoScreen = (props) => {
  const initialState = {
    nombre: "",
    descripcion: "",
    cantidad: "",
    preciounitario: "",
    emoji: "",
  };

  const [state, setState] = useState(initialState);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleChangeText = (value, nombre) => {
    setState({ ...state, [nombre]: value });
  };

  const handleEmojiSelect = emoji => {
    setState({ ...state, emoji: emoji }); // Actualizar el estado con el emoji seleccionado
  };

  const saveNewProduct = async () => {
    if (state.nombre === "" || state.preciounitario === "" || state.descripcion === "" || state.cantidad === "") {
      alert("Por favor llenar todos los campos");
    } else {
      try {
        const existingProductRef = await firebase.db.collection("productos")
          .where("nombre", "==", state.nombre)
          .where("descripcion", "==", state.descripcion)
          .where("preciounitario", "==", parseFloat(state.preciounitario))
          .where("emoji", "==", state.emoji)
          .get();
        
        if (existingProductRef.empty) {
          // No existe un producto con el mismo nombre, descripción y precio, se agrega uno nuevo
          await firebase.db.collection("productos").add({
            nombre: state.nombre,
            descripcion: state.descripcion,
            stock: parseInt(state.cantidad), // Stock inicializado con la cantidad especificada
            preciounitario: parseFloat(state.preciounitario),
            emoji: state.emoji,
          });
        } else {
          // Existe un producto con el mismo nombre, descripción y precio, se actualiza el stock
          existingProductRef.forEach(async (doc) => {
            const existingStock = doc.data().stock;
            await firebase.db.collection("productos").doc(doc.id).update({
              stock: existingStock + 1, // Sumar 1 al stock existente
            });
          });
        }
        
        setState(initialState); // Limpiar los campos después de agregar o actualizar el producto
        props.navigation.navigate("ProductoList");
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Función para manejar el borrado de compra
  const handleDeletePurchase = () => {
    setConfirmDelete(true); // Mostrar confirmación de borrado
  };

  // Función para confirmar el borrado
  const confirmDeletePurchase = async () => {
    setConfirmDelete(false); // Ocultar confirmación
    setState(initialState); // Limpiar los campos
  };

  return (
    <ScrollView style={styles.container}>
      {/* Inputs para nombre, descripción y precio unitario */}
      <TextInput
        placeholder="Nombre"
        onChangeText={(value) => handleChangeText(value, "nombre")}
        value={state.nombre}
      />
      <TextInput
        placeholder="Descripción"
        onChangeText={(value) => handleChangeText(value, "descripcion")}
        value={state.descripcion}
      />
      <TextInput
        placeholder="Cantidad"
        onChangeText={(value) => handleChangeText(value, "cantidad")}
        value={state.cantidad}
        keyboardType="numeric" // Teclado numérico para la entrada de cantidad
      />
      <TextInput
        placeholder="Precio Unitario"
        onChangeText={(value) => handleChangeText(value, "preciounitario")}
        value={state.preciounitario}
      />

      {/* Botón para guardar el producto */}
      <Button title="Guardar Producto" onPress={saveNewProduct} />

      {/* Confirmación de borrado */}
      {confirmDelete && (
        <View style={styles.confirmationContainer}>
          <Text>¿Estás seguro que deseas borrar la compra?</Text>
          <Button title="Confirmar" onPress={confirmDeletePurchase} />
          <Button title="Cancelar" onPress={() => setConfirmDelete(false)} />
        </View>
      )}

      {/* Botón para ver la lista de productos */}
      <Button title="Ver Lista de Productos" onPress={() => props.navigation.navigate('ProductoList')} color="green" />
      
      {/* Contenedor del EmojiSelector */}
     <View style={styles.emojiSelectorContainer}>
        {/* EmojiSelector */}
          <View style={styles.emojiSelector}>
            <EmojiSelector
              onEmojiSelected={handleEmojiSelect}
              showSearchBar={true}
              showTabs={true}
              
              showHistory={true}
              showSectionTitles={true}
              />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
  },
  confirmationContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  emojiSelectorContainer: {
    flexDirection: 'row', // Para alinear los botones y el emojiSelector horizontalmente
    justifyContent: 'space-between', // Para distribuir el espacio entre los botones y el emojiSelector
    alignItems: 'center', // Para centrar verticalmente los elementos
    marginTop: 20, // Espacio entre los botones y el emojiSelector
  },
  emojiSelector: {
    width: 300, // Ancho del cuadro de emojis
    height: 300, // Alto del cuadro de emojis
    borderRadius: 10, // Bordes redondeados
    overflow: 'hidden', // Para que los emojis no se salgan del cuadro
  },
});

export default CreateProductoScreen;
