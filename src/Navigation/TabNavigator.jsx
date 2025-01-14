import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import Schedule from '../pages/Schedule/Schedule'
import ScheduleSettings from '../pages/ScheduleSettings/ScheduleSettings'
import Settings from '../pages/Settings/Settings'

const Tab = createBottomTabNavigator()

export default function TabNavigator({ commonProps }) {
	return (
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
				{() => <Schedule {...commonProps} />}
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
