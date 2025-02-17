import React from 'react';
import { View, Button, StyleSheet, ImageBackground, TextInput, Text } from 'react-native';
import { Animated, Easing } from 'react-native';

const HomeScreen3 = ({ navigation }) => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button
          onPress={() => navigation.navigate('Login')}
          title="Cerrar sesión"
          color="#000000" 
        />
      ),
      headerRight: () => (
        <Animated.View style={{ transform: [{ translateX }] }}>
          <Text style={styles.neonText}>Open 24 horas {'\u{1F6D2}'}</Text>
        </Animated.View>
      ),
    });
  }, [navigation, translateX]);


  return (
    <ImageBackground source={require('../assets/fondo12.jpg')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.topRightButton}>
          <Button
            title="Ver productos disponibles"
            onPress={() => navigation.navigate('ProductoListsinmod')}
          />
        </View>
        <View style={styles.middleTextInput}>
          <Text style={styles.staticText}>¡Bienvenido a Fantasía Bazar, donde los deseos se convierten en realidad!</Text>
        </View>
        <View style={styles.middleTextInput}>
          <Text style={styles.staticText}>Adéntrate en nuestro mágico menú de productos. En Fantasía Bazar encontrarás todo lo que tu corazón anhela y más.</Text>
        </View>
        <View style={styles.middleTextInput}>
          <Text style={styles.staticText}>¿Cómo puedes hacer realidad tus fantasías? Es más fácil de lo que imaginas. Simplemente recorre nuestros pasillos virtuales, elige tus tesoros favoritos y agrégalos a tu carrito de maravillas. Y antes de que te des cuenta, tus sueños estarán en camino hacia ti.</Text>
        </View>
        <View style={styles.middleTextInput}>
          <Text style={styles.staticText}>¡Pero espera, hay más! Para desbloquear aún más la magia de Fantasía Bazar, no olvides añadir tu cédula a tu compra, para generar tu factura con un solo click. Con ella, te convertirás en el protagonista de tu propia aventura de compras.</Text>
        </View>
        <View style={styles.middleTextInput}>
          <Text style={styles.staticText}>Así que, querido visitante, ¡prepárate para una experiencia de compra como ninguna otra! En Fantasía Bazar, cada compra es un paso más cerca de hacer tus sueños realidad.</Text>
        </View>
        
      </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    resizeMode: "cover",
    justifyContent: "center"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  topRightButton: {
    position: 'center',
    top: 30,
    right: 10,
  },
  middleTextInput: {
    flex: 1,
    justifyContent: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    textAlignVertical: 'top', // Alinea el texto en la parte superior del TextInput
  },
  staticText: {
    fontStyle: 'italic', // Estilo de letra cursiva
    fontSize: 18, // Tamaño de fuente más grande
    color: 'white', // Color blanco
    textAlign: "justify",
  },
  neonText: {
    fontSize: 23,
    color: '#00FF00',
    textShadowColor: '#00FF00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  
 
});

export default HomeScreen3;
