import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AutoSaveIntervalSettings from './components/AutoSaveIntervalSettings'
import SignOutButton from './components/SignOutButton'

const Settings = ({ autoSaveInterval, handleAutoSaveIntervalChange }) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Налаштування акаунту</Text>

			<AutoSaveIntervalSettings
				autoSaveInterval={autoSaveInterval}
				onIntervalChange={handleAutoSaveIntervalChange}
			/>

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
