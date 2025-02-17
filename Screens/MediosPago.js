import React, { useState } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";

const MediosPago = () => {
  const [selectedMedioPago, setSelectedMedioPago] = useState(null);

  const handleSelectMedioPago = (medioPago) => {
    setSelectedMedioPago(medioPago);
  };

  const renderMedioPagoOption = (nombreMedio) => {
    return (
      <TouchableOpacity
        style={[
          styles.medioPagoOption,
          selectedMedioPago === nombreMedio && styles.selectedMedioPagoOption,
        ]}
        onPress={() => handleSelectMedioPago(nombreMedio)}
      >
        <Text>{nombreMedio}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona un medio de pago:</Text>
      {renderMedioPagoOption("Tarjeta de Crédito/Débito")}
      {renderMedioPagoOption("PSE")}
      {renderMedioPagoOption("Pago contra Entrega")}
      <Button
        title="Continuar"
        disabled={!selectedMedioPago}
        onPress={handleContinuar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  medioPagoOption: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  selectedMedioPagoOption: {
    backgroundColor: "#e0e0e0",
  },
});

export default MediosPago;