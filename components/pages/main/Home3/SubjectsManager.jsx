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
				<TouchableOpacity style={styles.addButton} onPress={handleAddSubject}>
					<Text style={styles.addButtonText}>Додати предмет</Text>
				</TouchableOpacity>

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
		flex: 1,
	},
	header: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 20,
		textAlign: 'center',
	},
	subHeader: {
		fontSize: 18,
		fontWeight: '600',
		color: '#555',
		marginTop: 20,
		marginBottom: 10,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 12,
		marginBottom: 15,
		borderRadius: 8,
		backgroundColor: '#fff',
		fontSize: 16,
	},
	subjectItem: {
		marginBottom: 15,
		padding: 15,
		backgroundColor: '#fff',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#ddd',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3, // Для Android
	},
	subjectDetails: {
		marginBottom: 10,
	},
	subjectText: {
		fontSize: 16,
		fontWeight: '500',
		color: '#333',
	},
	actions: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10,
	},
	actionButton: {
		color: '#007BFF',
		fontWeight: '600',
		fontSize: 14,
		padding: 5,
	},
	addButton: {
		backgroundColor: '#28a745',
		padding: 15,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 10,
	},
	addButtonText: {
		color: '#fff',
		fontWeight: '600',
		fontSize: 16,
	},
	cancelButton: {
		backgroundColor: '#dc3545',
		padding: 10,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 10,
	},
	cancelButtonText: {
		color: '#fff',
		fontWeight: '600',
		fontSize: 16,
	},
})
