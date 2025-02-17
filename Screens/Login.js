import React, { useState } from 'react';
import { Text, StyleSheet, View, Image, TextInput, TouchableOpacity, Modal, Button } from 'react-native';
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

const secretAdminPassword = "123456";

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const logueo = async () => {
    try {
      // Validar campos de entrada
      if (!email || !password) {
        setErrorMessage('Por favor, ingrese correo y contraseña.');
        setErrorModalVisible(true);
        setEmail('');
        setPassword('');
        return;
      }
  
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Consultar la información del usuario desde Firestore usando el correo electrónico
      const userQuerySnapshot = await firebase.firestore().collection('clientes').where('email', '==', email).get();
  
      // Verificar si se encontró algún usuario con el correo electrónico proporcionado
      if (!userQuerySnapshot.empty) {
        // Obtener el primer documento (asumiendo que solo hay un usuario con ese correo electrónico)
        const userData = userQuerySnapshot.docs[0].data();
  
        // Verificar si el usuario está activo
        if (userData.activo === true) {
          // Verificar el rol del usuario y redirigirlo a la pantalla correspondiente
          const rolesToScreens = {
            0: 'HomeScreen',
            1: 'HomeScreen1',
            2: 'HomeScreen2',
            3: 'HomeScreen3'
          };
  
          const userRole = userData.rol;
          if (userRole in rolesToScreens) {
            setEmail('');
            setPassword('');
            navigation.navigate(rolesToScreens[userRole]);
          } else {
            setErrorMessage('Rol no definido');
            setErrorModalVisible(true);
          }
        } else {
          setErrorMessage('Usuario inactivo');
          setErrorModalVisible(true);
        }
      } else {
        setErrorMessage('El usuario o contraseña son incorrectos');
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage('No se pudo iniciar sesión');
      setErrorModalVisible(true);
    }
  };
  
  const registro = () => {
    navigation.navigate('RegistroUsuario');
  };



  const handleAdminLogin = () => {
    setAdminModalVisible(true);
  };

  const validateAdminPassword = () => {
    // Aquí debes comparar la contraseña ingresada con la contraseña secreta definida en tu código
    if (adminPassword === secretAdminPassword) {
      setAdminModalVisible(false);
      navigation.navigate('Loginadmin'); // Redirige a la pantalla de login de administrador
    } else {
      setErrorMessage('Clave de administrador incorrecta');
      setErrorModalVisible(true);
    }
  };
  

  const closeModal = () => {
    setAdminPassword(''); // Reiniciar el estado de la contraseña de administrador
    setErrorMessage(''); // Reiniciar el estado del mensaje de error
    setErrorModalVisible(false);
    setAdminModalVisible(false);
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
            value={email}
          />
        </View>
        <Text style={styles.label}><Text style={styles.bold}>Contraseña</Text></Text>
        <View style={styles.cajatexto}>
          <TextInput
            placeholder='password'
            style={{ paddingHorizontal: 15 }}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            value={password} 
          />
        </View>


        <View style={styles.padreboton}>
          <TouchableOpacity style={styles.cajaboton} onPress={logueo}>
            <Text style={styles.textoboton}>Iniciar sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cajaboton} onPress={registro}>
            <Text style={styles.textoboton}>Registrarse</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cajaboton} onPress={handleAdminLogin}>
            <Text style={styles.textoboton}>Administrador</Text>
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
    

     {/* Modal para la clave de administrador y mensajes de error */}
     <CustomModal 
  visible={adminModalVisible || errorModalVisible} 
  errorMessage={errorMessage} 
  closeModal={closeModal} 
  validateAdminPassword={validateAdminPassword}
  setAdminPassword={setAdminPassword} // Pasar setAdminPassword como prop
/>
    </View>
  );
}

const CustomModal = ({ visible, errorMessage, closeModal, validateAdminPassword, setAdminPassword}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={closeModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {errorMessage ? (
            <>
              <Text style={styles.modalText}>{errorMessage}</Text>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.closeText}>Cerrar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.modalText}>Ingrese la clave de administrador:</Text>
              <TextInput
                placeholder="Clave"
                style={styles.input}
                onChangeText={(text) => setAdminPassword(text)}
                secureTextEntry={true}
              />
              <TouchableOpacity style={styles.confirmButton} onPress={validateAdminPassword}>
  <Text style={styles.confirmButtonText}>Confirmar</Text>
</TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};


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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  closeText: {
    marginTop: 10,
    color: 'blue'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginBottom: 20
  },
  confirmButton: {
    backgroundColor: '#525FE1',
    borderRadius: 30,
    paddingVertical: 20,
    width: 150,
    alignItems: 'center'
  },
  confirmButtonText: {
    color: 'white'
  }
});