import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AutoSaveIntervalSettings from './components/AutoSaveIntervalSettings'
import SignOutButton from './components/SignOutButton'
import ThemeSettings from './components/ThemeSettings'

const Settings = ({
	autoSaveInterval,
	handleAutoSaveIntervalChange,
	theme,
	onThemeChange,
}) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Налаштування акаунту</Text>

			<AutoSaveIntervalSettings
				autoSaveInterval={autoSaveInterval}
				onIntervalChange={handleAutoSaveIntervalChange}
			/>

			<ThemeSettings currentTheme={theme} onThemeChange={onThemeChange} />

			<SignOutButton />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f9f9f9',
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 20,
	},
})

export default Settings
