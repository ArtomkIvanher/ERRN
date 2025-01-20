import React, { useEffect, useState } from 'react'
import {
	FlatList,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'

export default function ScheduleManager({
	schedule,
	setSchedule,
	subjects,
	themeColors,
	accent,
}) {
	const [initialized, setInitialized] = useState(false)
	const [showRepeatMenu, setShowRepeatMenu] = useState(false)
	const [selectedSubject, setSelectedSubject] = useState(null)
	const [showSubjectModal, setShowSubjectModal] = useState(false)
	const [showColorModal, setShowColorModal] = useState(false)
	const [selectedColorSubject, setSelectedColorSubject] = useState(null)

	const daysOfWeek = [
		'Понеділок',
		'Вівторок',
		'Середа',
		'Четвер',
		'П’ятниця',
		'Субота',
		'Неділя',
	]

	useEffect(() => {
		if (!initialized && schedule?.repeat) {
			const updatedSchedule = { ...schedule }
			let needsUpdate = false

			updatedSchedule.schedule = updatedSchedule.schedule.map(day => {
				const updatedDay = {}
				for (let i = 1; i <= 4; i++) {
					if (!day[`week${i}`]) {
						updatedDay[`week${i}`] = [0]
						needsUpdate = true
					} else {
						updatedDay[`week${i}`] = day[`week${i}`]
					}
				}
				return updatedDay
			})

			if (needsUpdate) {
				setSchedule(updatedSchedule)
			}
			setInitialized(true)
		}
	}, [schedule, setSchedule, initialized])

	const handleSubjectChange = (
		dayIndex,
		weekPart,
		subjectIndex,
		newSubjectId
	) => {
		const updatedSchedule = { ...schedule }
		updatedSchedule.schedule[dayIndex][weekPart][subjectIndex] = newSubjectId
		setSchedule(updatedSchedule)
	}

	const openSubjectModal = (dayIndex, weekPart, subjectIndex) => {
		setSelectedSubject({ dayIndex, weekPart, subjectIndex })
		setShowSubjectModal(true)
	}

	const handleSelectSubject = subjectId => {
		if (selectedSubject) {
			const { dayIndex, weekPart, subjectIndex } = selectedSubject
			handleSubjectChange(dayIndex, weekPart, subjectIndex, subjectId)
		}
		setShowSubjectModal(false)
	}

	const handleAddDefaultSubject = (dayIndex, weekPart) => {
		const updatedSchedule = { ...schedule }
		if (!updatedSchedule.schedule[dayIndex][weekPart]) {
			updatedSchedule.schedule[dayIndex][weekPart] = []
		}
		updatedSchedule.schedule[dayIndex][weekPart].push(0)
		setSchedule(updatedSchedule)
	}

	const handleRemoveSubject = (dayIndex, weekPart, subjectIndex) => {
		const updatedSchedule = { ...schedule }
		updatedSchedule.schedule[dayIndex][weekPart] = updatedSchedule.schedule[
			dayIndex
		][weekPart].filter((_, index) => index !== subjectIndex)
		setSchedule(updatedSchedule)
	}

	if (!schedule || !schedule.schedule) {
		return <Text>Loading schedule...</Text>
	}

	if (!Array.isArray(schedule.schedule)) {
		return <Text>Invalid schedule data</Text>
	}

	return (
		<View style={styles.container}>
			{schedule.schedule.map((day, dayIndex) => (
				<View key={dayIndex} style={styles.dayContainer}>
					<Text style={[styles.dayTitle, { color: themeColors.textColor }]}>
						{daysOfWeek[dayIndex]}
					</Text>
					{Object.keys(day)
						.sort(
							(a, b) =>
								parseInt(a.replace('week', '')) -
								parseInt(b.replace('week', ''))
						)
						.slice(0, schedule.repeat)
						.map(weekPart => (
							<View key={weekPart} style={styles.weekPartContainer}>
								<Text
									style={[
										styles.weekPartTitle,
										{ color: themeColors.textColor },
									]}
								>
									{weekPart}
								</Text>

								{day[weekPart].map((subjectId, subjectIndex) => (
									<View key={subjectIndex} style={styles.subjectContainer}>
										<TouchableOpacity
											style={styles.subjectButton}
											onPress={() =>
												openSubjectModal(dayIndex, weekPart, subjectIndex)
											}
										>
											<Text style={styles.subjectButtonText}>
												{subjects.find(s => s.id === subjectId)?.name ||
													'Вибрати предмет'}
											</Text>
										</TouchableOpacity>

										<TouchableOpacity
											style={styles.removeSubjectButton}
											onPress={() =>
												handleRemoveSubject(dayIndex, weekPart, subjectIndex)
											}
										>
											<Text style={styles.removeSubjectButtonText}>В</Text>
										</TouchableOpacity>
									</View>
								))}
								<TouchableOpacity
									style={[styles.addSubjectButton, { backgroundColor: accent }]}
									onPress={() => handleAddDefaultSubject(dayIndex, weekPart)}
								>
									<Text
										style={[
											styles.addSubjectButtonText,
											{ color: themeColors.textColor },
										]}
									>
										Додати пару
									</Text>
								</TouchableOpacity>
							</View>
						))}
				</View>
			))}

			{showSubjectModal && (
				<Modal
					transparent={true}
					animationType='slide'
					visible={showSubjectModal}
				>
					<View style={styles.modalContainer}>
						<View
							style={[
								styles.modalContent,
								{ backgroundColor: themeColors.backgroundColor2 },
							]}
						>
							<Text
								style={[styles.modalTitle, { color: themeColors.textColor }]}
							>
								Виберіть предмет
							</Text>
							<FlatList
								data={subjects}
								keyExtractor={item => item.id.toString()}
								renderItem={({ item }) => (
									<TouchableOpacity
										style={styles.subjectOption}
										onPress={() => handleSelectSubject(item.id)}
									>
										<Text
											style={[
												styles.subjectOptionText,
												{ color: themeColors.textColor },
											]}
										>
											{item.name}
										</Text>
									</TouchableOpacity>
								)}
							/>
							<TouchableOpacity
								style={styles.closeModalButton}
								onPress={() => setShowSubjectModal(false)}
							>
								<Text style={styles.closeModalButtonText}>Закрити</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	// Стили залишаються аналогічними з додаванням стилів для модального вікна
	modalContainer: {
		flex: 1,
		flexDirection: 'column-reverse',
		backgroundColor: 'rgba(0, 0, 0, 0)',
	},
	modalContent: {
		backgroundColor: '#ddd',
		padding: 20,
		borderRadius: 10,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	subjectOption: {
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
	},
	subjectOptionText: {
		fontSize: 16,
	},
	closeModalButton: {
		backgroundColor: '#FF5733',
		padding: 10,
		borderRadius: 5,
		marginTop: 10,
	},
	closeModalButtonText: {
		color: '#fff',
		textAlign: 'center',
		fontSize: 16,
	},
	container: {
		padding: 20,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	repeatContainer: {
		marginBottom: 20,
	},
	repeatLabel: {
		fontSize: 16,
		marginBottom: 10,
	},
	repeatButton: {
		backgroundColor: '#4CAF50',
		padding: 10,
		borderRadius: 5,
		marginBottom: 10,
	},
	repeatButtonText: {
		color: '#fff',
		fontSize: 16,
		textAlign: 'center',
	},
	repeatMenu: {
		marginTop: 10,
	},
	repeatOption: {
		padding: 10,
		backgroundColor: '#f0f0f0',
		marginBottom: 5,
		borderRadius: 5,
	},
	repeatOptionText: {
		fontSize: 16,
		textAlign: 'center',
	},
	dayContainer: {
		marginBottom: 20,
	},
	dayTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	weekPartContainer: {
		marginBottom: 10,
	},
	weekPartTitle: {
		fontSize: 16,
		marginBottom: 5,
	},
	addSubjectButton: {
		backgroundColor: '#2196F3',
		padding: 10,
		borderRadius: 5,
		marginBottom: 10,
	},
	addSubjectButtonText: {
		color: '#fff',
		fontSize: 16,
		textAlign: 'center',
	},
	subjectContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between', // Розташування кнопок у рядку
		marginBottom: 10,
		borderRadius: 5,
	},
	picker: {
		height: 50,
		width: '100%',
		marginBottom: 10,
	},
	removeSubjectButton: {
		backgroundColor: '#FF5733',
		padding: 10,
		borderRadius: 5,
	},
	removeSubjectButtonText: {
		color: '#fff',
		fontSize: 16,
		textAlign: 'center',
	},

	subjectButton: {
		flex: 1, // Займає все доступне місце
		paddingVertical: 10,
		paddingHorizontal: 15,
		borderRadius: 5,
		backgroundColor: '#4CAF50',
		marginRight: 10, // Простір між кнопкою вибору та видалення
	},
	subjectButtonText: {
		color: '#fff',
		fontSize: 16,
		textAlign: 'center',
	},
	removeSubjectButton: {
		width: '10%',
		paddingVertical: 10,
		paddingHorizontal: 15,
		borderRadius: 5,
		backgroundColor: '#fF5733',
	},
	removeSubjectButtonText: {
		color: '#fff',
		fontSize: 16,
		textAlign: 'center',
	},
	repeatButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10,
	},
	weekButton: {
		flex: 1,
		marginHorizontal: 5,
		paddingVertical: 10,
		borderRadius: 5,
		backgroundColor: '#f0f0f0',
		alignItems: 'center',
	},
	weekButtonActive: {
		backgroundColor: '#4CAF50',
	},
	weekButtonText: {
		fontSize: 16,
		color: '#000',
	},
	weekButtonTextActive: {
		color: '#fff',
	},
})
