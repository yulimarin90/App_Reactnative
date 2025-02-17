import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Login from './Login';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import firebase from "../database/firebase";
import { getFirestore } from "firebase/firestore";


export default function RegistroUsuario(props) {
    const [cedula, setcedula]= useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('');
    const [fecha, setFecha] = useState('');
    const [phone, setPhone] = useState('');
    const [activo, setActivo] = useState(false);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState();


// Configurar Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBlXOnhjkwJLvip2J0Lnek5Ygwzmn0PC8g",
    authDomain: "crud1-dfb56.firebaseapp.com",
    projectId: "crud1-dfb56",
    storageBucket: "crud1-dfb56.firebasestorage.app",
    messagingSenderId: "584447348768",
    appId: "1:584447348768:web:1da90595afcb4484602c45"
};

const app = initializeApp(firebaseConfig);
console.log("Firebase initialized:", app);
const auth = getAuth(app);

    /*
    */

    const registro = async () => {
        const app = initializeApp(firebaseConfig);
        console.log("Firebase initialized:", app);
        const auth = getAuth(app);

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        await firebase.db.collection("clientes").add({
                cedula: cedula,
                nombre: nombre,
                apellido: apellido,
                email: email,
                phone: phone,
                rol: "",
                fecha: fecha,
                activo: false
            });
       
            setErrorModalVisible(false);
            // Navegación hacia la pantalla de inicio de sesión solo después de un registro exitoso
            props.navigation.navigate('Login');
        } catch (error) {
            console.log("Error de autenticación:", error);
            setErrorMessage('No se pudo registrar al usuario');
            setErrorModalVisible(true);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Registro de Usuario</Text>
            <TextInput
                style={styles.input}
                placeholder="cedula"
                onChangeText={setcedula}
                value={cedula}
            />
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                onChangeText={setNombre}
                value={nombre}
            />
            <TextInput
                style={styles.input}
                placeholder="Apellido"
                onChangeText={setApellido}
                value={apellido}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
            />
            <TextInput
                style={styles.input}
                placeholder="Phone"
                onChangeText={setPhone}
                value={phone}
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={registro}>
                <Text>Registrarse</Text>
            </TouchableOpacity>
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
    container: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        width: '95%',
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
    input: {
        paddingVertical: 20,
        backgroundColor: '#cccccc40',
        borderRadius: 30,
        marginVertical: 10
    },
    button: {
        backgroundColor: '#525FE1',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '95%',
        alignItems: 'center'
    }
});
