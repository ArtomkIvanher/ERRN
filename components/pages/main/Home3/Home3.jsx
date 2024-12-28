import React from 'react'
import {
	Button,
	FlatList,
	RefreshControl,
	StyleSheet,
	Text,
	View,
} from 'react-native'
import ResetDB from './ResetDB'
import ScheduleManager from './ScheduleManager'
import SubjectsManager from './SubjectsManager'

export default function Home3({
	schedule,
	authUser,
	autoSaveInterval,
	isUnsavedChanges,
	refreshing,
	onRefresh,
	onSaveChanges,
	onDataChange,
	onAutoSaveIntervalChange,
	onAutoSaveComplete,
	onSignOut,
	setSchedule,
}) {
	if (!authUser || !schedule) {
		return <Text>Завантаження...</Text>
	}

	return (
		<FlatList
			data={[{}]}
			renderItem={() => (
				<View style={styles.container}>
					<Text style={styles.title}>
						Розклад користувача: {authUser.email}
					</Text>

					<SubjectsManager
						subjects={schedule.subjects}
						setSubjects={subjects => {
							const updatedSchedule = { ...schedule, subjects }
							setSchedule(updatedSchedule)
							onDataChange(updatedSchedule) // Передаємо оновлений розклад
						}}
						onAddSubject={newSubject => {
							const updatedSubjects = [
								...schedule.subjects,
								{ ...newSubject, id: Date.now() },
							]
							const updatedSchedule = {
								...schedule,
								subjects: updatedSubjects,
							}
							setSchedule(updatedSchedule)
							onDataChange(updatedSchedule) // Передаємо оновлений розклад
						}}
					/>

					<ScheduleManager
						schedule={schedule}
						setSchedule={updatedSchedule => {
							setSchedule(updatedSchedule)
							onDataChange(updatedSchedule) // Передаємо оновлений розклад
						}}
						subjects={schedule.subjects}
					/>

					<ResetDB />

					<View style={styles.signOutContainer}>
						<Button title='Вийти з акаунту' color='red' onPress={onSignOut} />
					</View>
				</View>
			)}
			keyExtractor={(_, index) => String(index)}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		/>
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
