import React, { useState } from "react";
import {
  Button,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
 
import firebase from "../database/firebase";
 
const CreateUserScreen = (props) => {
  const initalState = {
    cedula: "",
    nombre: "",
    apellido: "",
    email: "",
    phone: "",
    fecha: "",
    rol: "",
    activo: ""
  };
 
  const [state, setState] = useState(initalState);
 
  //esto hace que en el campo nombre debe de estar lleno
  const handleChangeText = (value, nombre) => {
    setState({ ...state, [nombre]: value });
  };
 
  const saveNewUser = async () => {
    if (state.nombre === "") {
      alert("Por favor llenar los campos");
    } else {
 
      try {
        await firebase.db.collection("clientes").add({
          cedula: state.cedula,
          nombre: state.nombre,
          apellido: state.apellido,
          email: state.email,
          phone: state.phone,
          fecha: state.fecha,
          rol: state.rol,
          activo: state.activo
        });

        setState(initalState);
        props.navigation.navigate("UsersList");
      } catch (error) {
        console.log(error)
      }
    }
  };
 
  return (
    <ScrollView style={styles.container}>
      {/* nombre cedula */}
      <View style={styles.inputGroup}>
        <TextInput
          placeholder="cedula"
          onChangeText={(value) => handleChangeText(value, "cedula")}
          value={state.cedula}
        />
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          placeholder="nombre"
          onChangeText={(value) => handleChangeText(value, "nombre")}
          value={state.nombre}
        />
      </View>
 
      {/* apellido Input */}
      <View style={styles.inputGroup}>
        <TextInput
          placeholder="apellido"
          onChangeText={(value) => handleChangeText(value, "apellido")}
          value={state.apellido}
        />
      </View>
 
      {/* Email Input */}
      <View style={styles.inputGroup}>
        <TextInput
          placeholder="Email"
          multiline={true}
          numberOfLines={4}
          onChangeText={(value) => handleChangeText(value, "email")}
          value={state.email}
        />
      </View>
 
      {/* phone Input */}
      <View style={styles.inputGroup}>
        <TextInput
          placeholder="phone"
          onChangeText={(value) => handleChangeText(value, "phone")}
          value={state.phone}
        />
      </View>
 
      {/* fecha Input */}
      <View style={styles.inputGroup}>
        <TextInput
          placeholder="fecha"
          onChangeText={(value) => handleChangeText(value, "fecha")}
          value={state.fecha}
        />
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          placeholder="rol"
          onChangeText={(value) => handleChangeText(value, "rol")}
          value={state.rol}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <TextInput
          placeholder="activo"
          onChangeText={(value) => handleChangeText(value, "activo")}
          value={state.activo}
        />
      </View>
 
      <View style={styles.button}>
        <Button title="Guardar Usuario" onPress={() => saveNewUser()} />
      </View>
     
      <View style={styles.button} >
        <Button bottomDivider title="Ver Lista de Usuarios" onPress={() => props.navigation.navigate('UsersList')} color="green" />
      </View>
    </ScrollView>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
  },
  inputGroup: {
    flex: 1,
    padding: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  loader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginBottom: 7,
  },
});
 
export default CreateUserScreen;