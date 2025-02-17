import React from 'react';
import { View, Button, StyleSheet } from 'react-native';


const Home = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button
          onPress={() => navigation.navigate('Login')}
          title="Cerrar sesión"
          color="#000000" 
        />
      ),
    });
  }, [navigation]);

  
  return (
    <View style={styles.container}>
      <Button 
        title="Clientes"
        onPress={() => navigation.navigate('CreateUserScreen')}
      />
      {/* Separador */}
      <Button
        title="Productos" 
        onPress={() => navigation.navigate('CreateProductoScreen')}
      />
      {/* Separador */}
      <Button
        title="Compras"
        onPress={() => navigation.navigate('ProductoList')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 77,
    
  },
});

export default Home;

