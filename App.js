import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet } from "react-native";
import 'react-native-gesture-handler';

// Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Components
import CreateUserScreen from "./Screens/CreateUserScreen";
import UserDetailScreen from "./Screens/UserDetailScreen";
import UsersList from "./Screens/UsersList";
import Home from "./Screens/HomeScreen";
import Home1 from "./Screens/HomeScreen1";
import Home2 from "./Screens/HomeScreen2";
import Home3 from "./Screens/HomeScreen3";
import ProductoList from "./Screens/ProductoList";
import CreateProductoScreen from "./Screens/CreateProductoScreen";
import ProductoDetailScreen from "./Screens/ProductoDetailScreen";
import Login from "./Screens/Login";
import RegistroUsuario from "./Screens/RegistroUsuario";
//import SignUp from "./screens/SignUp";
import CarritoCompras from "./Screens/CarritoCompras";
import MediosPago from "./Screens/MediosPago";
import Facturacion from "./Screens/Facturacion";
import LoginAdmin from "./Screens/Loginadmin";
import ProductoListsinmod from "./Screens/ProductoListsinmod";


const Stack = createStackNavigator();

function MyStack({Navigation}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#621FF7",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ title: "Bienvenido al Login" }}
      />
      <Stack.Screen
        name="Loginadmin"
        component={LoginAdmin}
        options={{ title: "Login administrador" }}
      />
      <Stack.Screen
        name="RegistroUsuario"
        component={RegistroUsuario}
        options={{ title: "Registro Usuario" }}
      />
      <Stack.Screen
        name="HomeScreen"
        component={Home}
        options={{ title: "Home administrador" }}
      />
      <Stack.Screen
        name="HomeScreen1"
        component={Home1}
        options={{ title: "Home administrador clientes" }}
      />
      <Stack.Screen
        name="HomeScreen2"
        component={Home2}
        options={{ title: "Home administrador productos" }}
      />
      <Stack.Screen
        name="HomeScreen3"
        component={Home3}
        options={{ title: "¡Bienvenido!" }}
      />
      <Stack.Screen
        name="UsersList"
        component={UsersList}
        options={{ title: "Lista de Clientes" }}
      />
      <Stack.Screen
        name="CreateUserScreen"
        component={CreateUserScreen}
        options={{ title: "Crear Usuario Nuevo" }}
      />
      <Stack.Screen
        name="UserDetailScreen"
        component={UserDetailScreen}
        options={{ title: "Detalles del Usuarios" }}
      />
      
      <Stack.Screen
        name="ProductoList"
        component={ProductoList}
        options={{ title: "Lista de Productos" }}
      />

      <Stack.Screen
        name="ProductoListsinmod"
        component={ProductoListsinmod}
        options={{ title: "Lista de Productos" }}
      />

      <Stack.Screen
        name="CreateProductoScreen"
        component={CreateProductoScreen}
        options={{ title: "Crear Producto Nuevo" }}
      />
      <Stack.Screen
        name="ProductoDetailScreen"
        component={ProductoDetailScreen}
        options={{ title: "Detalles del Producto" }}
      />
        <Stack.Screen
        name="CarritoCompras"
        component={CarritoCompras}
        options={{ title: "Carrito de Compras" }}
      />
       <Stack.Screen
        name="MediosPago"
        component={MediosPago}
        options={{ title: "Medios de pago" }}
      />
      <Stack.Screen
        name="Facturacion"
        component={Facturacion}
        options={{ title: "Facturacion" }}
      />
     
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});