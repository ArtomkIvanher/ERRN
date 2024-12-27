import { signOut } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import {
	Button,
	FlatList,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native'
import { auth } from '../../../../firebase'
import { getSchedule, saveSchedule } from '../../../../firestore'
import AutoSaveManager from './AutoSaveManager'
import ResetDB from './ResetDB'
import ScheduleManager from './ScheduleManager'
import SubjectsManager from './SubjectsManager'

export default function Home3() {
	const [schedule, setSchedule] = useState(null)
	const [authUser, setAuthUser] = useState(null)
	const [autoSaveInterval, setAutoSaveInterval] = useState(30) // Мінімум 30 секунд
	const [isUnsavedChanges, setIsUnsavedChanges] = useState(false)

	useEffect(() => {
		const user = auth.currentUser
		if (user) {
			setAuthUser(user)
			loadSchedule(user.uid)
		}
	}, [])

	const loadSchedule = async (userId) => {
		const userSchedule = await getSchedule(userId)
		const loadedSchedule = userSchedule || {
			auto_save: 30,
			subjects: [],
			schedule: [],
		}
		setSchedule(loadedSchedule)
		setAutoSaveInterval(loadedSchedule.auto_save || 30)
	}

	const handleSaveChanges = () => {
		if (authUser && schedule) {
			saveSchedule(authUser.uid, schedule)
				.then(() => console.log('Збереження виконано вручну'))
				.catch((err) => console.error('Помилка збереження:', err))
			setIsUnsavedChanges(false)
		}
	}

	const handleDataChange = () => {
		setIsUnsavedChanges(true)
	}

	const handleAutoSaveIntervalChange = (value) => {
		const newInterval = Math.max(30, value)
		setAutoSaveInterval(newInterval)
		setSchedule((prev) => ({
			...prev,
			auto_save: newInterval,
		}))
		setIsUnsavedChanges(true)
	}

	const handleAutoSaveComplete = () => {
		setIsUnsavedChanges(false)
	}

	const handleSignOut = async () => {
		try {
			await signOut(auth)
			console.log('Вихід виконано успішно')
		} catch (error) {
			console.error('Помилка виходу:', error.message)
		}
	}

	const renderContent = () => (
		<View style={styles.container}>
			<Text style={styles.title}>
				Розклад користувача: {authUser.email}
			</Text>

			<View style={styles.inputContainer}>
				<Text>Автозбереження кожні (секунд): </Text>
				<TextInput
					style={styles.input}
					keyboardType="number-pad"
					value={String(autoSaveInterval)}
					onChangeText={(text) => handleAutoSaveIntervalChange(Number(text))}
				/>
			</View>

			<Button title="Зберегти зараз" onPress={handleSaveChanges} />

			<SubjectsManager
				subjects={schedule.subjects}
				setSubjects={(subjects) => {
					setSchedule((prev) => ({ ...prev, subjects }))
					handleDataChange()
				}}
				onAddSubject={(newSubject) => {
					setSchedule((prev) => ({
						...prev,
						subjects: [...prev.subjects, { ...newSubject, id: Date.now() }],
					}))
					handleDataChange()
				}}
			/>

			<ScheduleManager
				schedule={schedule}
				setSchedule={(updatedSchedule) => {
					setSchedule(updatedSchedule)
					handleDataChange()
				}}
				subjects={schedule.subjects}
			/>

			<AutoSaveManager
				authUser={authUser}
				schedule={schedule}
				saveSchedule={saveSchedule}
				isUnsavedChanges={isUnsavedChanges}
				onAutoSaveComplete={handleAutoSaveComplete}
				autoSaveInterval={autoSaveInterval}
			/>

			<ResetDB />

			<View style={styles.signOutContainer}>
				<Button
					title="Вийти з акаунту"
					color="red"
					onPress={handleSignOut}
				/>
			</View>
		</View>
	)

	return authUser && schedule ? (
		<FlatList
			data={[{}]} // Мокові дані
			renderItem={renderContent}
			keyExtractor={(_, index) => String(index)}
		/>
	) : (
		<Text>Завантаження...</Text>
	)
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: '#fff',
		padding: 10,
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
	},
	input: {
		flex: 1,
		borderColor: '#ccc',
		borderWidth: 1,
		padding: 10,
		marginRight: 10,
	},
	signOutContainer: {
		marginTop: 20,
		alignItems: 'center',
	},
})
