import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import themes from '../../../config/themes'

const ThemeSettings = ({ currentTheme, onThemeChange }) => {
	const [selectedMode, setSelectedMode] = useState(currentTheme[0])
	const [selectedColor, setSelectedColor] = useState(currentTheme[1])

	// Оновлюємо тему при кожній зміні вибору
	useEffect(() => {
		onThemeChange([selectedMode, selectedColor])
	}, [selectedMode, selectedColor])

	const renderColorOption = colorName => {
		const colorValue = themes.accentColors[colorName]

		return (
			<TouchableOpacity
				key={colorName}
				style={[
					styles.colorOption,
					{ backgroundColor: colorValue },
					selectedColor === colorName && styles.selectedColor,
				]}
				onPress={() => setSelectedColor(colorName)}
			/>
		)
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Виберіть тему</Text>
			<View style={styles.themeContainer}>
				<TouchableOpacity
					style={[
						styles.themeButton,
						selectedMode === 'dark' && styles.selectedTheme,
					]}
					onPress={() => setSelectedMode('dark')}
				>
					<Text style={styles.themeButtonText}>Темна</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.themeButton,
						selectedMode === 'light' && styles.selectedTheme,
					]}
					onPress={() => setSelectedMode('light')}
				>
					<Text style={styles.themeButtonText}>Світла</Text>
				</TouchableOpacity>
			</View>

			<Text style={styles.title}>Виберіть колір</Text>
			<View style={styles.colorsContainer}>
				{Object.keys(themes.accentColors).map(colorName =>
					renderColorOption(colorName)
				)}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 20,
		padding: 20,
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	themeContainer: {
		flexDirection: 'row',
		marginBottom: 20,
	},
	themeButton: {
		flex: 1,
		padding: 10,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#ccc',
		marginRight: 10,
		borderRadius: 5,
	},
	themeButtonText: {
		fontSize: 14,
		fontWeight: 'bold',
	},
	selectedTheme: {
		borderColor: '#007AFF',
	},
	colorsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginBottom: 20,
	},
	colorOption: {
		width: 40,
		height: 40,
		borderRadius: 20,
		marginRight: 10,
		marginBottom: 10,
	},
	selectedColor: {
		borderWidth: 3,
		borderColor: '#007AFF',
	},
})

export default ThemeSettings
