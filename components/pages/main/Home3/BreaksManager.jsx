import React from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

export default function BreaksManager({ breaks, setBreaks }) {
  const handleBreakChange = (value, index) => {
    const updatedBreaks = [...breaks];
    updatedBreaks[index] = Number(value);
    setBreaks(updatedBreaks);
  };

  const handleAddBreak = () => {
    setBreaks([...breaks, 10]); // Додаємо перерву на 10 хвилин за замовчуванням
  };

  const handleRemoveBreak = index => {
    const updatedBreaks = breaks.filter((_, i) => i !== index);
    setBreaks(updatedBreaks);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Редагувати перерви:</Text>
      <FlatList
        data={breaks}
        renderItem={({ item, index }) => (
          <View style={styles.breakContainer}>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={String(item)}
              onChangeText={value => handleBreakChange(value, index)}
            />
            <Button title="Видалити" onPress={() => handleRemoveBreak(index)} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button title="Додати перерву" onPress={handleAddBreak} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  breakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    padding: 5,
    marginRight: 10,
    width: 50,
    textAlign: 'center',
  },
});
