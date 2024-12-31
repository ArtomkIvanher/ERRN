import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { signOut } from 'firebase/auth'
import React, { useEffect, useRef, useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { auth } from '../../../../firebase'
import { getSchedule, saveSchedule } from '../../../../firestore'
import Home2 from '../Home2/Home2'
import AutoSaveManager from '../Home3/AutoSaveManager'
import Home3 from '../Home3/Home3'

const Tab = createBottomTabNavigator()

export default function Home() {
	const [schedule, setSchedule] = useState(null) // Дані розкладу
	const [authUser, setAuthUser] = useState(null) // Авторизований користувач
	const [autoSaveInterval, setAutoSaveInterval] = useState(30) // Інтервал автозбереження
	const [isUnsavedChanges, setIsUnsavedChanges] = useState(false) // Чи є незбережені зміни
	const [lessonTimes, setLessonTimes] = useState([]) // Масив часу пар
	const [startingWeek, setStartingWeek] = useState(1) // Початковий тиждень
	const timerRef = useRef(null)

	// Завантаження користувача та даних
	useEffect(() => {
		const user = auth.currentUser
		if (user) {
			setAuthUser(user) // Зберігаємо користувача
			loadSchedule(user.uid) // Завантажуємо розклад для користувача
		}
	}, [])

	useEffect(() => {
		if (isUnsavedChanges) {
			timerRef.current = setInterval(
				() => handleSaveChanges(),
				autoSaveInterval * 1000
			)
		}
		return () => clearInterval(timerRef.current)
	}, [isUnsavedChanges, autoSaveInterval])

	// Завантаження розкладу з Firebase
	const loadSchedule = async userId => {
		try {
			const userSchedule = await getSchedule(userId)
			const loadedSchedule = userSchedule || {
				auto_save: 30,
				subjects: [],
				schedule: [],
				starting_week: 1, // За замовчуванням перший тиждень
			}
			setSchedule(loadedSchedule)
			setStartingWeek(loadedSchedule.starting_week || 1)
			setAutoSaveInterval(loadedSchedule.auto_save || 30)
			calculateLessonTimes(
				loadedSchedule.start_time,
				loadedSchedule.duration,
				loadedSchedule.breaks
			)
		} catch (error) {
			console.error('Помилка завантаження розкладу:', error)
		}
	}

	const updateStartingWeek = week => {
		const formattedDate = new Date(
			week.getFullYear(),
			week.getMonth(),
			week.getDate()
		)
			.toISOString()
			.split('T')[0] // Формат YYYY-MM-DD
		const updatedSchedule = { ...schedule, starting_week: formattedDate }
		setSchedule(updatedSchedule)
		setStartingWeek(formattedDate)
		setIsUnsavedChanges(true)
	}

	// Обчислення часу пар
	const calculateLessonTimes = (startTime, duration, breaks) => {
		try {
			const [hours, minutes] = startTime.split(':').map(Number)
			if (isNaN(hours) || isNaN(minutes)) {
				throw new Error(`Некоректний формат start_time: ${startTime}`)
			}

			const start = new Date()
			start.setHours(hours, minutes, 0)

			const times = []
			let currentTime = new Date(start)

			breaks.forEach((breakDuration, index) => {
				const endOfLesson = new Date(
					currentTime.getTime() + duration * 60 * 1000
				)
				times.push({
					lesson: index + 1,
					start: currentTime.toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit',
					}),
					end: endOfLesson.toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit',
					}),
				})
				currentTime = new Date(
					endOfLesson.getTime() + breakDuration * 60 * 1000
				)
			})

			setLessonTimes(times)
		} catch (error) {
			console.error('Помилка обчислення часу пар:', error.message)
		}
	}

	// Збереження розкладу
	const handleSaveChanges = async () => {
		if (authUser && schedule) {
			try {
				await saveSchedule(authUser.uid, schedule)
				console.log('Збереження виконано')
				setIsUnsavedChanges(false)
			} catch (error) {
				console.error('Помилка збереження:', error)
			}
		}
	}

	// Оновлення інтервалу автозбереження
	const handleAutoSaveIntervalChange = interval => {
		setAutoSaveInterval(interval)
		setSchedule(prevSchedule => ({ ...prevSchedule, auto_save: interval }))
		setIsUnsavedChanges(true)
	}

	const handleSignOut = async () => {
		try {
			await signOut(auth)
			console.log('Вихід виконано успішно')
		} catch (error) {
			console.error('Помилка виходу:', error.message)
		}
	}

	const handleDataChange = updatedSchedule => {
		setSchedule(updatedSchedule)
		setIsUnsavedChanges(true)
	}

	const commonProps = {
		schedule,
		authUser,
		autoSaveInterval,
		isUnsavedChanges,
		setSchedule,
		handleSaveChanges,
		onSignOut: handleSignOut,
		onDataChange: handleDataChange,
		lessonTimes,
		updateStartingWeek,
		startingWeek,
		handleAutoSaveIntervalChange,
	}

	return (
		<View style={{ flex: 1 }}>
			<View style={styles.container}>

				{/* Кнопка "Зберегти зараз" */}
				{isUnsavedChanges && (
					<Button title='Зберегти зараз' onPress={handleSaveChanges} />
				)}

				{/* Панель вкладок */}
				<Tab.Navigator
					screenOptions={{
						tabBarStyle: {
							backgroundColor: '#fff', // Колір фону панелі
							borderTopWidth: 1, // Ширина верхнього бордера
							borderTopColor: '#ddd', // Колір верхнього бордера
							paddingBottom: 15, // Відступ знизу
							paddingTop: 5, // Відступ зверху
							height: 70,
						},
						tabBarLabelStyle: {
							fontSize: 12, // Розмір тексту
							fontWeight: 'bold', // Жирність тексту
							color: '#333', // Колір тексту
						},
						tabBarActiveTintColor: '#007AFF', // Колір активної вкладки
						tabBarInactiveTintColor: '#8e8e93', // Колір неактивних вкладок
					}}
				>
					<Tab.Screen
						name='Home3_1'
						options={{
							tabBarLabel: 'Розклад', // Текст під вкладкою
							tabBarIcon: ({ color, size }) => (
								<Icon name='calendar' size={size} color={color} /> // Ваш іконковий компонент
							),
							headerShown: false,
						}}
					>
						{() => <Home2 {...commonProps} />}
					</Tab.Screen>
					<Tab.Screen
						name='Home3_2'
						options={{
							tabBarLabel: 'Налаштування', // Текст під вкладкою
							tabBarIcon: ({ color, size }) => (
								<Icon name='settings' size={size} color={color} /> // Ваш іконковий компонент
							),
							headerShown: false,
						}}
					>
						{() => <Home3 {...commonProps} />}
					</Tab.Screen>
				</Tab.Navigator>
			</View>

			{/* Таймер автозбереження поверх всього */}
			{isUnsavedChanges && (
				<AutoSaveManager
					authUser={authUser}
					schedule={schedule}
					saveSchedule={handleSaveChanges}
					onAutoSaveComplete={() => setIsUnsavedChanges(false)}
					isUnsavedChanges={isUnsavedChanges}
					autoSaveInterval={autoSaveInterval}
				/>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
		paddingHorizontal: 10,
	},
	input: {
		flex: 1,
		borderColor: '#ccc',
		borderWidth: 1,
		padding: 10,
		marginRight: 10,
	},
})
