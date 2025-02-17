import React, { useState, useEffect } from "react";
import { Button, StyleSheet } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

import firebase from "../database/firebase";

const UserList = (props) => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    firebase.db.collection("clientes").onSnapshot((querySnapshot) => {
      const clientes = [];
      querySnapshot.docs.forEach((doc) => {
        const { cedula, nombre, apellido, email, phone, fecha, rol, activo } = doc.data();
        clientes.push({
          id: doc.id,
          cedula,
          nombre,
          apellido,
          email,
          phone,
          fecha,
          rol,
          activo
        });
      });
      setClientes(clientes);
    });
  }, []);

  return (
    <ScrollView>
      <Button
        bottomDivider title="Volver al Home" onPress={() => props.navigation.navigate('HomeScreen')} color="blue" 
      />
      {/* Espacio */}
      <Button
        onPress={() => props.navigation.navigate("CreateUserScreen")}
        title="Crear Cliente"
      />

      {clientes.map((user) => {
        return (
          <ListItem
            key={user.id}
            bottomDivider
            onPress={() => {
              props.navigation.navigate("UserDetailScreen", {
                userId: user.id,
              });
            }}
          >
            <ListItem.Chevron />
            <Avatar
              source={{
                uri:
                  "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
              }}
              rounded
            />
            <ListItem.Content>
            <ListItem.Title>{user.cedula}</ListItem.Title>
              <ListItem.Title>{user.nombre}</ListItem.Title>
              <ListItem.Title>{user.apellido}</ListItem.Title>
              <ListItem.Title>{user.phone}</ListItem.Title>
              <ListItem.Subtitle>{user.email}</ListItem.Subtitle>
              <ListItem.Subtitle>{user.fecha}</ListItem.Subtitle>
              <ListItem.Subtitle>{user.rol}</ListItem.Subtitle>
              <ListItem.Subtitle>{user.activo}</ListItem.Subtitle>
            </ListItem.Content>
            
          </ListItem>
          
        );
      })}
    </ScrollView>
  );
};

export default UserList;