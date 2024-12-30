import DateTimePicker from '@react-native-community/datetimepicker'
import React, { useEffect, useState } from 'react'
import {
	Button,
	FlatList,
	Platform,
	RefreshControl,
	StyleSheet,
	Text,
	View,
} from 'react-native'
import ResetDB from './ResetDB'
import ScheduleManager from './ScheduleManager'
import SubjectsManager from './SubjectsManager'

// Для веб-версії
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

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
	const [showPicker, setShowPicker] = useState(false) // Контролює видимість календаря
	const [selectedDate, setSelectedDate] = useState(new Date()) // Обрана дата

	// Ініціалізація дати з Firebase
	useEffect(() => {
		if (schedule?.starting_week) {
			setSelectedDate(new Date(schedule.starting_week))
		}
	}, [schedule])

	// Функція для обчислення понеділка поточного тижня
	const getMondayOfWeek = date => {
		const copiedDate = new Date(
			Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
		) // Переконання, що час очищений
		const day = copiedDate.getUTCDay() // Отримуємо день тижня (0 - неділя, 1 - понеділок, ...)
		const diff = day === 0 ? -6 : 1 - day // Якщо неділя (0), зміщення -6
		copiedDate.setUTCDate(copiedDate.getUTCDate() + diff) // Зсув до понеділка
		return copiedDate // Повертаємо понеділок
	}

	// Обробка вибору дати
	const handleDateSelection = date => {
		if (!date) return
		const cleanDate = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate()
		) // Очистка часу
		const monday = getMondayOfWeek(cleanDate)
		console.log('Обрана дата:', cleanDate)
		console.log('Понеділок тижня:', monday)

		setSelectedDate(cleanDate)
		setShowPicker(false) // Закриваємо календар

		// Оновлюємо початковий тиждень у розкладі
		onDataChange({
			...schedule,
			starting_week: monday.toISOString().split('T')[0], // ISO формат
		})
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

					{/* Кнопка для відкриття календаря */}
					<View style={styles.inputContainer}>
						<Button
							title={`Вибрати дату (${
								getMondayOfWeek(selectedDate).toISOString().split('T')[0]
							})`}
							onPress={() => setShowPicker(!showPicker)}
						/>

						{showPicker && (
							<View
								style={
									Platform.OS === 'web'
										? styles.webPicker
										: styles.pickerContainer
								}
							>
								{Platform.OS === 'web' ? (
									// React-datepicker для веба
									<DatePicker
										selected={selectedDate}
										onChange={date => handleDateSelection(date)}
										inline
									/>
								) : (
									<DateTimePicker
										value={selectedDate}
										mode='date'
										display='default'
										onChange={(event, date) => handleDateSelection(date)}
									/>
								)}
							</View>
						)}
					</View>

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
		flexDirection: 'column',
		alignItems: 'center',
		marginBottom: 20,
	},
	pickerContainer: {
		marginTop: 10,
		backgroundColor: 'white',
		padding: 10,
		borderRadius: 10,
		elevation: 5,
	},
	webPicker: {
		marginTop: 10,
		width: '100%',
	},
	signOutContainer: {
		marginTop: 20,
		alignItems: 'center',
	},
})
