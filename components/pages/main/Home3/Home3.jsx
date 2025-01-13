import DateTimePicker from '@react-native-community/datetimepicker'
import React, { useEffect, useState } from 'react'
import {
	Button,
	FlatList,
	Platform,
	RefreshControl,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import BreaksManager from './BreaksManager'
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
	onAutoSaveIntervalChange,
	isUnsavedChanges,
	refreshing,
	onRefresh,
	onDataChange,
	onSignOut,
	setSchedule,
	handleAutoSaveIntervalChange,
}) {
	const [showPicker, setShowPicker] = useState(false) // Контролює видимість календаря
	const [selectedDate, setSelectedDate] = useState(new Date()) // Обрана дата
	const [tempAutoSaveInterval, setTempAutoSaveInterval] =
		useState(autoSaveInterval) // Тимчасове значення інтервалу

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

	// Функція для обробки підтвердження інтервалу автозбереження
	const confirmAutoSaveInterval = () => {
		const correctedInterval =
			tempAutoSaveInterval < 30 ? 30 : tempAutoSaveInterval
		setTempAutoSaveInterval(correctedInterval) // Оновлюємо стан, щоб змінити значення в полі
		handleAutoSaveIntervalChange(correctedInterval) // Передаємо оновлене значення
	}

	const isValueChanged = tempAutoSaveInterval !== autoSaveInterval;

	// Перевірка наявності даних
	if (!schedule || !authUser) {
		return (
			<View style={styles.loadingContainer}>
				<Text>Завантаження даних...</Text>
			</View>
		)
	}

	return (
		<FlatList
			data={[{}]}
			renderItem={() => (
				<View style={styles.container}>
					<Text style={styles.title}>
						Розклад користувача: {authUser.email}
					</Text>

					{/* Налаштування інтервалу автозбереження */}
					<View style={styles.inputContainer}>
						<Text>Інтервал автозбереження (секунди):</Text>
						<TextInput
							style={styles.input}
							keyboardType='number-pad'
							value={String(tempAutoSaveInterval)}
							onChangeText={value => setTempAutoSaveInterval(Number(value))}
						/>

						<TouchableOpacity
							style={[
								styles.confirmButton,
								!isValueChanged && styles.disabledButton,
							]}
							onPress={confirmAutoSaveInterval}
							disabled={!isValueChanged}
						>
							<Text style={styles.confirmButtonText}>Підтвердити</Text>
						</TouchableOpacity>
					</View>

					<BreaksManager
						breaks={schedule.breaks}
						setBreaks={breaks => {
							const updatedSchedule = { ...schedule, breaks }
							setSchedule(updatedSchedule)
							onDataChange(updatedSchedule)
						}}
					/>

					<SubjectsManager
						subjects={schedule.subjects}
						setSubjects={subjects => {
							const updatedSchedule = { ...schedule, subjects }
							setSchedule(updatedSchedule)
							onDataChange(updatedSchedule) // Передаємо оновлений  провірка 2
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
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		borderRadius: 5,
		width: '50%',
		textAlign: 'center',
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
	confirmButton: {
		backgroundColor: '#007bff',
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderRadius: 10,
		alignItems: 'center',
		marginTop: 10,
	},
	confirmButtonText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 16,
	},
	disabledButton: {
		backgroundColor: '#ccc',
	},
})
