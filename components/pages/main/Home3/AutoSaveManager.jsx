import React, { useEffect, useRef, useState } from 'react'
import { Animated, Easing, StyleSheet, Text } from 'react-native'

export default function AutoSaveManager({
	authUser,
	schedule,
	handleSaveChanges,
	onAutoSaveComplete,
	isUnsavedChanges,
	autoSaveInterval,
}) {
	const timerRef = useRef(null)
	const [timeLeft, setTimeLeft] = useState(autoSaveInterval)
	const [isSaving, setIsSaving] = useState(false)
	const [showSavedMessage, setShowSavedMessage] = useState(false)

	const heightAnim = useRef(new Animated.Value(0)).current

	useEffect(() => {
		if (isUnsavedChanges) {
			startAutoSave()
			Animated.timing(heightAnim, {
				toValue: 30, // Висота панелі
				duration: 500,
				easing: Easing.out(Easing.quad),
				useNativeDriver: false,
			}).start()
		} else if (!showSavedMessage) {
			Animated.timing(heightAnim, {
				toValue: 0, // Сховати панель
				duration: 500,
				easing: Easing.in(Easing.quad),
				useNativeDriver: false,
			}).start(() => stopAutoSave())
		}
		return () => stopAutoSave()
	}, [isUnsavedChanges, autoSaveInterval, showSavedMessage])

	const startAutoSave = () => {
		stopAutoSave()
		setTimeLeft(autoSaveInterval)

		timerRef.current = setInterval(() => {
			setTimeLeft(prevTime => {
				if (prevTime > 1) return prevTime - 1
				saveChanges()
				return autoSaveInterval
			})
		}, 1000)
	}

	const saveChanges = () => {
		if (authUser && schedule && !isSaving) {
			setIsSaving(true)

			handleSaveChanges(authUser.uid, schedule)
				.then(() => {
					console.log('Автозбереження виконано')
					if (onAutoSaveComplete) {
						setTimeout(onAutoSaveComplete, 0)
					}
					// Показуємо повідомлення "Збережено" на 5 секунд
					setShowSavedMessage(true)
					setTimeout(() => {
						setShowSavedMessage(false)
					}, 5000)
				})
				.catch(err => console.error('Помилка автозбереження:', err))
				.finally(() => {
					setIsSaving(false)
				})
		}
	}

	const stopAutoSave = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current)
			timerRef.current = null
		}
	}

	return (
		<Animated.View
			style={[
				styles.container,
				{
					height: heightAnim, // Анімація висоти
				},
			]}
		>
			{isSaving ? (
				<Text style={styles.text}>Збереження...</Text>
			) : showSavedMessage ? (
				<Text style={styles.text}>Збережено</Text>
			) : isUnsavedChanges ? (
				<Text style={styles.text}>Час до автозбереження: {timeLeft} сек.</Text>
			) : (
				<Text style={styles.text}>Всі зміни збережені.</Text>
			)}
		</Animated.View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#ffcc00',
		alignItems: 'center',
		overflow: 'hidden', // Ховаємо зайвий контент під час анімації
		height: 10,
	},
	text: {
		fontSize: 12,
		fontWeight: 'bold',
		color: '#333',
	},
})
