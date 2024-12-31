import React, { useState } from 'react'
import {
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'

const screenWidth = Dimensions.get('window').width

export default function DynamicDayRenderer({ schedule, lessonTimes }) {
	const [currentDate, setCurrentDate] = useState(new Date())

	const daysOfWeek = [
		'Понеділок',
		'Вівторок',
		'Середа',
		'Четвер',
		'П’ятниця',
		'Субота',
		'Неділя',
	]

	const subjects = schedule?.subjects || []
	const repeatWeeks = schedule?.repeat || 1
	const mondayFirstWeek = schedule?.starting_week
		? new Date(schedule.starting_week)
		: null

	const getDayIndex = date => (date.getDay() === 0 ? 6 : date.getDay() - 1)

	const calculateCurrentWeek = date => {
		if (!mondayFirstWeek) return 1
		const diffDays = Math.floor(
			(date - mondayFirstWeek) / (1000 * 60 * 60 * 24)
		)
		return (
			(((Math.floor(diffDays / 7) % repeatWeeks) + repeatWeeks) % repeatWeeks) +
			1
		)
	}

	const getDaySchedule = date => {
		const dayIndex = getDayIndex(date)
		if (!schedule?.schedule) return []
		const currentWeek = calculateCurrentWeek(date)
		return schedule.schedule[dayIndex]?.[`week${currentWeek}`] || []
	}

	const renderDay = date => {
		const scheduleForDay = getDaySchedule(date)
		return (
			<View style={styles.dayContainer}>
				{scheduleForDay.length > 0 ? (
					scheduleForDay.map((subjectId, index) => {
						const subject = subjects.find(s => s.id === subjectId)
						const timeInfo = lessonTimes?.[index] || {}
						return (
							<View key={index} style={styles.subjectContainer}>
								<Text style={styles.subjectName}>
									Пара {index + 1}: {subject?.name || '—'}
								</Text>
								{timeInfo.start && timeInfo.end && (
									<Text style={styles.lessonTime}>
										{timeInfo.start} - {timeInfo.end}
									</Text>
								)}
								<Text style={styles.subjectDetails}>
									Викладач: {subject?.teacher || '—'}
								</Text>
							</View>
						)
					})
				) : (
					<Text style={styles.noDataText}>Немає даних</Text>
				)}
			</View>
		)
	}

	const changeDate = direction => {
		const newDate = new Date(currentDate)
		newDate.setDate(currentDate.getDate() + direction)
		setCurrentDate(newDate)
	}

	const isToday = currentDate.toDateString() === new Date().toDateString()

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<Text style={styles.dayOfWeekText}>
					{daysOfWeek[getDayIndex(currentDate)]}
				</Text>
				<Text style={styles.dateText}>
					{currentDate.toLocaleDateString('uk-UA')}
				</Text>
			</View>
			<View style={styles.navigationContainer}>
				<TouchableOpacity
					style={styles.navButton}
					onPress={() => changeDate(-1)}
				>
					<Text style={styles.navButtonText}>Назад</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.navButton}
					onPress={() => changeDate(1)}
				>
					<Text style={styles.navButtonText}>Вперед</Text>
				</TouchableOpacity>
			</View>
			{renderDay(currentDate)}
			{!isToday && (
				<TouchableOpacity
					style={styles.todayButton}
					onPress={() => setCurrentDate(new Date())}
				>
					<Text style={styles.todayButtonText}>На сьогодні</Text>
				</TouchableOpacity>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	dayOfWeekText: { fontSize: 20, fontWeight: 'bold' },
	dateText: { fontSize: 16, color: '#555' },
	navigationContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 20,
	},
	navButton: {
		padding: 10,
		backgroundColor: '#007bff',
		borderRadius: 5,
	},
	navButtonText: { color: '#fff', fontSize: 16 },
	dayContainer: { flex: 1 },
	dayHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
	subjectContainer: {
		padding: 10,
		backgroundColor: '#eaf4fc',
		borderRadius: 5,
		marginBottom: 10,
	},
	subjectName: { fontSize: 16, fontWeight: 'bold' },
	lessonTime: { fontSize: 14, color: '#333' },
	subjectDetails: { fontSize: 14, color: '#555' },
	noDataText: { fontSize: 14, color: '#777' },
	todayButton: {
		position: 'absolute',
		bottom: 20,
		left: 20,
		right: 20,
		padding: 15,
		backgroundColor: '#28a745',
		borderRadius: 5,
		alignItems: 'center',
	},
	todayButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
})
