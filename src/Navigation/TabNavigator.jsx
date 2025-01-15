import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import themes from '../config/themes'
import Schedule from '../pages/Schedule/Schedule'
import ScheduleSettings from '../pages/ScheduleSettings/ScheduleSettings'
import Settings from '../pages/Settings/Settings'

const Tab = createBottomTabNavigator()

export default function TabNavigator({ commonProps }) {
	const [currentTheme, accentColor] = commonProps.theme || ['light', 'blue']
	const themeColors = themes[currentTheme] || themes.light
	const accent = themes.accentColors[accentColor] || themes.accentColors.blue

	return (
		<Tab.Navigator
			screenOptions={{
				tabBarStyle: {
					backgroundColor: themeColors.backgroundColor, // Фон панелі з теми
					borderTopWidth: 1, // Ширина верхнього бордера
					borderTopColor: '#ddd', // Колір верхнього бордера
					paddingBottom: 15, // Відступ знизу
					paddingTop: 5, // Відступ зверху
					height: 70,
				},
				tabBarLabelStyle: {
					fontSize: 12, // Розмір тексту
					fontWeight: 'bold', // Жирність тексту
					color: themeColors.textColor, // Колір тексту з теми
				},
				tabBarActiveTintColor: accent, // Колір активної вкладки
				tabBarInactiveTintColor: themeColors.textColor, // Колір неактивних вкладок
			}}
		>
			<Tab.Screen
				name='Home3_1'
				options={{
					tabBarLabel: 'Розклад', // Текст під вкладкою
					tabBarIcon: ({ color, size }) => (
						<Icon name='calendar' size={size} color={color} /> // Іконка
					),
					headerShown: false,
				}}
			>
				{() => <Schedule {...commonProps} />}
			</Tab.Screen>
			<Tab.Screen
				name='Home3_2'
				options={{
					tabBarLabel: 'Налаштування', // Текст під вкладкою
					tabBarIcon: ({ color, size }) => (
						<Icon name='settings' size={size} color={color} /> // Іконка
					),
					headerShown: false,
				}}
			>
				{() => <ScheduleSettings {...commonProps} />}
			</Tab.Screen>

			<Tab.Screen
				name='AccountSettings'
				options={{
					tabBarLabel: 'Акаунт',
					tabBarIcon: ({ color, size }) => (
						<Icon name='person' size={size} color={color} />
					),
					headerShown: false,
				}}
			>
				{() => <Settings {...commonProps} />}
			</Tab.Screen>
		</Tab.Navigator>
	)
}
