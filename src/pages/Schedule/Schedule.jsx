import React, { useState } from 'react'
import {
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import themes from '../../config/themes'

const screenWidth = Dimensions.get('window').width

export default function Schedule({ schedule, lessonTimes, theme }) {
	const [currentDate, setCurrentDate] = useState(new Date())

	const [currentTheme, accentColor] = theme || ['light', 'blue']
	const themeColors =
		themes[currentTheme] || themes.light
	const accent =
		themes.accentColors[accentColor] ||
		themes.accentColors.blue

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
							<View
								key={index}
								style={[
									styles.subjectContainer,
									{ backgroundColor: accent },
								]}
							>
								<Text
									style={[styles.subjectName, { color: themeColors.textColorScheduleCard }]}
								>
									Пара {index + 1}: {subject?.name || '—'}
								</Text>
								{timeInfo.start && timeInfo.end && (
									<Text
										style={[
											styles.lessonTime,
											{ color: themeColors.textColor2 },
										]}
									>
										{timeInfo.start} - {timeInfo.end}
									</Text>
								)}
								<Text
									style={[
										styles.subjectDetails,
										{ color: themeColors.textColor2 },
									]}
								>
									Викладач: {subject?.teacher || '—'}
								</Text>
							</View>
						)
					})
				) : (
					<Text
						style={[styles.noDataText, { color: themeColors.textColor2 }]}
					>
						Немає даних
					</Text>
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
		<View
			style={[
				styles.container,
				{ backgroundColor: themeColors.backgroundColor },
			]}
		>
			<View style={styles.headerContainer}>
				<Text style={[styles.dayOfWeekText, { color: themeColors.textColor }]}>
					{daysOfWeek[getDayIndex(currentDate)]}
				</Text>
				<Text style={[styles.dateText, { color: themeColors.textColor }]}>
					{currentDate.toLocaleDateString('uk-UA')}
				</Text>
			</View>
			<View style={styles.navigationContainer}>
				<TouchableOpacity
					style={[styles.navButton, { backgroundColor: themeColors.backgroundColor2 }]}
					onPress={() => changeDate(-1)}
				>
					<Text style={styles.navButtonText}>Назад</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.navButton, { backgroundColor: themeColors.backgroundColor2 }]}
					onPress={() => changeDate(1)}
				>
					<Text style={styles.navButtonText}>Вперед</Text>
				</TouchableOpacity>
			</View>
			{renderDay(currentDate)}
			{!isToday && (
				<TouchableOpacity
					style={[styles.todayButton, { backgroundColor: accent }]}
					onPress={() => setCurrentDate(new Date())}
				>
					<Text style={styles.textColorScheduleCard}>На сьогодні</Text>
				</TouchableOpacity>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20 },
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	dayOfWeekText: { fontSize: 20, fontWeight: 'bold' },
	dateText: { fontSize: 16 },
	navigationContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 20,
	},
	navButton: {
		padding: 10,
		borderRadius: 5,
	},
	navButtonText: { color: '#fff', fontSize: 16 },
	dayContainer: { flex: 1 },
	subjectContainer: {
		padding: 10,
		borderRadius: 5,
		marginBottom: 10,
	},
	subjectName: { fontSize: 16, fontWeight: 'bold' },
	lessonTime: { fontSize: 14 },
	subjectDetails: { fontSize: 14 },
	noDataText: { fontSize: 14 },
	todayButton: {
		position: 'absolute',
		bottom: 20,
		left: 20,
		right: 20,
		padding: 15,
		borderRadius: 5,
		alignItems: 'center',
	},
	todayButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
})
