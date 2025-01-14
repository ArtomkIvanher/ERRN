import React, { useState } from 'react'
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'

const AutoSaveIntervalSettings = ({ autoSaveInterval, onIntervalChange }) => {
	const [tempInterval, setTempInterval] = useState(autoSaveInterval)

	const confirmIntervalChange = () => {
		const correctedInterval = tempInterval < 30 ? 30 : tempInterval
		setTempInterval(correctedInterval) // Оновлюємо локальний стан
		onIntervalChange(correctedInterval) // Передаємо зміни в батьківський компонент
	}

	const isValueChanged = tempInterval !== autoSaveInterval

	return (
		<View style={styles.inputContainer}>
			<Text>Інтервал автозбереження (секунди):</Text>
			<TextInput
				style={styles.input}
				keyboardType='number-pad'
				value={String(tempInterval)}
				onChangeText={value => setTempInterval(Number(value))}
			/>
			<TouchableOpacity
				style={[styles.confirmButton, !isValueChanged && styles.disabledButton]}
				onPress={confirmIntervalChange}
				disabled={!isValueChanged}
			>
				<Text style={styles.confirmButtonText}>Підтвердити</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	inputContainer: {
		marginBottom: 20,
		alignItems: 'center',
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		borderRadius: 5,
		width: '60%',
		textAlign: 'center',
	},
	confirmButton: {
		backgroundColor: '#007bff',
		paddingVertical: 10,
		paddingHorizontal: 15,
		borderRadius: 5,
		marginTop: 10,
	},
	confirmButtonText: {
		color: '#fff',
		fontWeight: 'bold',
	},
	disabledButton: {
		backgroundColor: '#ccc',
	},
})

export default AutoSaveIntervalSettings
