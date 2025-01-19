import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function DaySchedule({
	date,
	getDaySchedule,
	subjects,
	lessonTimes,
	accent,
	themeColors,
	teachers,
}) {
	const scheduleForDay = getDaySchedule(date)

	return (
		<View style={styles.dayContainer}>
			{scheduleForDay.length > 0 ? (
				scheduleForDay.map((subjectId, index) => {
					// Знайти предмет за id
					const subject = subjects.find(s => s.id === subjectId)
					// Знайти вчителя за id
					const teacher = teachers.find(t => t.id === subject?.teacher)
					// Отримати інформацію про час
					const timeInfo = lessonTimes?.[index] || {}

					return (
						<View
							key={index}
							style={[styles.subjectContainer, { backgroundColor: accent }]}
						>
							<Text
								style={[styles.subjectName, { color: themeColors.textColor }]}
							>
								{subject?.name || '—'}
							</Text>
							{timeInfo.start && timeInfo.end && (
								<Text
									style={[styles.lessonTime, { color: themeColors.textColor2 }]}
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
								Викладач: {teacher?.name || '—'}
							</Text>
						</View>
					)
				})
			) : (
				<Text style={[styles.noDataText, { color: themeColors.textColor2 }]}>
					Немає даних
				</Text>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
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
})
