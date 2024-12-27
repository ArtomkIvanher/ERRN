import React, { useState } from 'react'
import {
	Button,
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'

export default function SubjectsManager({
	subjects,
	setSubjects,
	onAddSubject,
}) {
	const [newSubject, setNewSubject] = useState({
		name: '',
		teacher: '',
		zoom_link: '',
	})
	const [editingSubject, setEditingSubject] = useState(null)

	const handleAddSubject = () => {
		onAddSubject(newSubject)
		setNewSubject({ name: '', teacher: '', zoom_link: '' })
	}

	const handleRemoveSubject = id => {
		setSubjects(subjects.filter(subject => subject.id !== id))
	}

	const handleEditSubject = subject => {
		setEditingSubject(subject)
	}

	const handleSaveEdit = () => {
		setSubjects(
			subjects.map(subject =>
				subject.id === editingSubject.id ? editingSubject : subject
			)
		)
		setEditingSubject(null)
	}

	const handleCancelEdit = () => {
		setEditingSubject(null)
	}

	if (!subjects) {
		return <Text>Loading subjects...</Text>
	}

	if (!Array.isArray(subjects) || subjects.length === 0) {
		return <Text>No subjects available</Text>
	}

	return (
		<ScrollView>
			<View style={styles.container}>
				<Text style={styles.header}>Додати новий предмет</Text>
				<TextInput
					style={styles.input}
					placeholder='Назва предмету'
					value={newSubject.name}
					onChangeText={text => setNewSubject({ ...newSubject, name: text })}
				/>
				<TextInput
					style={styles.input}
					placeholder='Викладач'
					value={newSubject.teacher}
					onChangeText={text => setNewSubject({ ...newSubject, teacher: text })}
				/>
				<TextInput
					style={styles.input}
					placeholder='Zoom лінк'
					value={newSubject.zoom_link}
					onChangeText={text =>
						setNewSubject({ ...newSubject, zoom_link: text })
					}
				/>
				<Button title='Додати предмет' onPress={handleAddSubject} />

				<Text style={styles.subHeader}>Список предметів:</Text>
				<FlatList
					data={subjects}
					keyExtractor={item => item.id.toString()}
					renderItem={({ item }) => (
						<View style={styles.subjectItem}>
							{editingSubject && editingSubject.id === item.id ? (
								<View>
									<TextInput
										style={styles.input}
										placeholder='Назва предмету'
										value={editingSubject.name}
										onChangeText={text =>
											setEditingSubject({ ...editingSubject, name: text })
										}
									/>
									<TextInput
										style={styles.input}
										placeholder='Викладач'
										value={editingSubject.teacher}
										onChangeText={text =>
											setEditingSubject({ ...editingSubject, teacher: text })
										}
									/>
									<TextInput
										style={styles.input}
										placeholder='Zoom лінк'
										value={editingSubject.zoom_link}
										onChangeText={text =>
											setEditingSubject({ ...editingSubject, zoom_link: text })
										}
									/>
									<Button title='Зберегти' onPress={handleSaveEdit} />
									<Button title='Скасувати' onPress={handleCancelEdit} />
								</View>
							) : (
								<View style={styles.subjectDetails}>
									<Text style={styles.subjectText}>
										{item.name} - {item.teacher}
									</Text>
									<View style={styles.actions}>
										<TouchableOpacity onPress={() => handleEditSubject(item)}>
											<Text style={styles.actionButton}>Редагувати</Text>
										</TouchableOpacity>
										<TouchableOpacity
											onPress={() => handleRemoveSubject(item.id)}
										>
											<Text style={styles.actionButton}>Видалити</Text>
										</TouchableOpacity>
									</View>
								</View>
							)}
						</View>
					)}
				/>
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
		backgroundColor: '#f9f9f9',
	},
	header: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	subHeader: {
		fontSize: 18,
		fontWeight: '600',
		marginTop: 20,
		marginBottom: 10,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		marginBottom: 10,
		borderRadius: 5,
		backgroundColor: '#fff',
	},
	subjectItem: {
		marginBottom: 15,
		padding: 10,
		backgroundColor: '#fff',
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#ddd',
	},
	subjectDetails: {
		marginBottom: 10,
	},
	subjectText: {
		fontSize: 16,
		fontWeight: '500',
	},
	actions: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10,
	},
	actionButton: {
		color: '#007BFF',
		fontWeight: '600',
	},
})
