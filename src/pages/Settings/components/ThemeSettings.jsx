import React, { useState } from 'react'
import { Button, Picker, StyleSheet, Text, View } from 'react-native'

const ThemeSettings = ({ currentTheme, onThemeChange }) => {
	const [selectedMode, setSelectedMode] = useState(currentTheme[0])
	const [selectedColor, setSelectedColor] = useState(currentTheme[1])

	const handleSaveTheme = () => {
		onThemeChange([selectedMode, selectedColor])
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Виберіть тему</Text>
			<Picker
				selectedValue={selectedMode}
				onValueChange={itemValue => setSelectedMode(itemValue)}
				style={styles.picker}
			>
				<Picker.Item label='Темна' value='dark' />
				<Picker.Item label='Світла' value='light' />
			</Picker>

			<Text style={styles.title}>Виберіть колір</Text>
			<Picker
				selectedValue={selectedColor}
				onValueChange={itemValue => setSelectedColor(itemValue)}
				style={styles.picker}
			>
				<Picker.Item label='Червоний' value='red' />
				<Picker.Item label='Синій' value='blue' />
				<Picker.Item label='Зелений' value='green' />
				<Picker.Item label='Фіолетовий' value='purple' />
				<Picker.Item label='Сірий' value='gray' />
				<Picker.Item label='Жовтий' value='yellow' />
				<Picker.Item label='Рожевий' value='pink' />
			</Picker>

			<Button title='Зберегти тему' onPress={handleSaveTheme} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 20,
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	picker: {
		height: 50,
		width: 150,
	},
})

export default ThemeSettings
