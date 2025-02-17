import React, { useState } from 'react';
import { Text, StyleSheet, View, Image, TextInput, TouchableOpacity, Modal } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { useNavigation } from '@react-navigation/native';
import 'react-native-gesture-handler';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import 'firebase/compat/auth';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBlXOnhjkwJLvip2J0Lnek5Ygwzmn0PC8g",
  authDomain: "crud1-dfb56.firebaseapp.com",
  projectId: "crud1-dfb56",
  storageBucket: "crud1-dfb56.firebasestorage.app",
  messagingSenderId: "584447348768",
  appId: "1:584447348768:web:1da90595afcb4484602c45"
};
const appfirebase = initializeApp(firebaseConfig);
const auth = getAuth(appfirebase);

export default function LoginAdmin() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const logueo = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.log(error);
      setErrorMessage('El usuario o contraseña son incorrectos');
      setErrorModalVisible(true);
    }
  };

  const registro = () => {
    navigation.navigate('RegistroUsuario');
  };

  return (
    <View style={styles.padre}>
      <View>
        <Image source={require('../assets/imagen2.jpg')} style={styles.profile} />
      </View>

      <View style={styles.tarjeta}>
        <Text style={styles.label}><Text style={styles.bold}>Correo</Text></Text>
        <View style={styles.cajatexto}>
          <TextInput
            placeholder='correo@gmail.com'
            style={{ paddingHorizontal: 15 }}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <Text style={styles.label}><Text style={styles.bold}>Contraseña</Text></Text>
        <View style={styles.cajatexto}>
          <TextInput
            placeholder='password'
            style={{ paddingHorizontal: 15 }}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
        </View>


        <View style={styles.padreboton}>
          <TouchableOpacity style={styles.cajaboton} onPress={logueo}>
            <Text style={styles.textoboton}>Iniciar sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cajaboton} onPress={registro}>
            <Text style={styles.textoboton}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 5 }}>
            <Text>{errorMessage}</Text>
            <TouchableOpacity onPress={() => setErrorModalVisible(false)}>
              <Text style={{ marginTop: 10, color: 'blue' }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  padre: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: 'white'
  },
  tarjeta: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    padding: 20,
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  cajatexto: {
    paddingVertical: 20,
    backgroundColor: '#cccccc40',
    borderRadius: 30,
    marginVertical: 10
  },
  padreboton: {
    alignItems: 'center'
  },
  cajaboton: {
    backgroundColor: '#525FE1',
    borderRadius: 30,
    paddingVertical: 20,
    width: 150,
    marginTop: 20
  },
  textoboton: {
    textAlign: 'center',
    color: 'white'
  },
  label: {
    fontSize: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
});
