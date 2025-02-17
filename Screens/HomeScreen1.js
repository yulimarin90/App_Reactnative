import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
 
const HomeScreen1 = ({ navigation }) => {
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

      <Button
    title="Compras"
    onPress={() => navigation.navigate('ProductoListsinmod')}
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
 
export default HomeScreen1;