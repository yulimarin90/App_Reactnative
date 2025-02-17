import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Button,
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from "../database/firebase";
 
const UserDetailScreen = (props) => {
  const initialState = {
    id: "",
    cedula: "",
    apellido: "",
    nombre: "",
    email: "",
    phone: "",
    fecha: "",
    rol: "",
    activo: ""
  };
 
  const [user, setUser] = useState(initialState);
  const [loading, setLoading] = useState(true);
 
  const handleTextChange = (value, prop) => {
    setUser({ ...user, [prop]: value });
  };
 
  const getUserById = async (id) => {
    const dbRef = firebase.db.collection("clientes").doc(id);
    const doc = await dbRef.get();
    const user = doc.data();
    setUser({ ...user, id: doc.id });
    setLoading(false);
  };
 
  
    const deleteUser = async () => {
     setLoading(true);
     console.log("User ID to delete:", props.route.params.userId); // Verificar el ID del usuario a eliminar
     const dbRef = firebase.db.collection("clientes").doc(props.route.params.userId);
     try {
       await dbRef.delete();
       console.log("User deleted successfully.");
       setLoading(false);
       props.navigation.navigate("UsersList");
     } catch (error) {
       console.error("Error deleting user:", error);
       setLoading(false);
       // Aquí puedes mostrar una alerta o realizar otra acción para informar al usuario sobre el error.
     }
   }; 

 {/* const openConfirmationAlert = () => {
    Alert.alert(
      "Removing the User",
      "Are you sure?",
      [
        { text: "Yes", onPress: () => deleteUser() },
        { text: "No", onPress: () => console.log("canceled") },
      ],
      {
        cancelable: true,
      }
    );
  }; */}

  // Función para convertir la entrada de texto a booleano
const parseBoolean = (value) => {
  // Verifica si el valor es una cadena de texto
  if (typeof value !== 'string') {
    // Si no es una cadena de texto, devuelve false
    return false;
  }
  // Convierte a minúsculas y elimina espacios en blanco extra
  const lowerCaseValue = value.trim().toLowerCase();
  // Comprueba si es "true" (verdadero) o "false" (falso)
  return lowerCaseValue === "true";
};
  
  const updateUser = async () => {
    const userRef = firebase.db.collection("clientes").doc(user.id);
    const activoBool = parseBoolean(user.activo);
    await userRef.set({
      cedula: user.cedula,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      phone: user.phone,
      rol: user.rol,
      activo: activoBool,
      fecha: user.fecha
    });
    setUser(initialState); // Reiniciar el estado del usuario a initialState
    props.navigation.navigate("UsersList");
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
          placeholder="cedula"
          autoCompleteType="username"
          style={styles.inputGroup}
          value={user.cedula}
          onChangeText={(value) => handleTextChange(value, "cedula")}
        />
      </View>
      <View>
        <TextInput
          placeholder="Nombre"
          autoCompleteType="username"
          style={styles.inputGroup}
          value={user.nombre}
          onChangeText={(value) => handleTextChange(value, "nombre")}
        />
      </View>
      <View>
        <TextInput
          placeholder="Apellido"
          autoCompleteType="username"
          style={styles.inputGroup}
          value={user.apellido}
          onChangeText={(value) => handleTextChange(value, "apellido")}
        />
      </View>
      <View>
        <TextInput
          autoCompleteType="email"
          placeholder="Email"
          style={styles.inputGroup}
          value={user.email}
          onChangeText={(value) => handleTextChange(value, "email")}
        />
      </View>
      <View>
        <TextInput
          placeholder="Phone"
          autoCompleteType="tel"
          style={styles.inputGroup}
          value={user.phone}
          onChangeText={(value) => handleTextChange(value, "phone")}
        />
      </View>
      
      <View>
        <TextInput
          placeholder="fecha"
          autoCompleteType="tel"
          style={styles.inputGroup}
          value={user.fecha}
          onChangeText={(value) => handleTextChange(value, "fecha")}
        />
      </View>
      <View>
        <TextInput
          placeholder="rol"
          autoCompleteType="tel"
          style={styles.inputGroup}
          value={user.rol}
          onChangeText={(value) => handleTextChange(value, "rol")}
        />
      </View>
      <View>
        <TextInput
          placeholder="activo"
          autoCompleteType="tel"
          style={styles.inputGroup}
          value={user.activo}
          onChangeText={(value) => handleTextChange(value, "activo")}
        />
      </View>
      <View style={styles.btn}>
        <Button
          title="Delete"
          onPress={() => deleteUser()}
          color="red"
        />
      </View>
      <View>
        <Button
          title="Actualizar"
          onPress={() => updateUser()} 
          color="#19AC52"
        />
      </View>
    </ScrollView>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
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
  inputGroup: {
    flex: 1,
    padding: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  btn: {
    marginBottom: 7,
  },
});
 
export default UserDetailScreen;
