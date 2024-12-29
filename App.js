import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import SignIn from './components/pages/auth/SignIn'
import SignUp from './components/pages/auth/SignUp'
import Home from './components/pages/main/Home/Home'
import { auth } from './firebase'

const Stack = createStackNavigator()

export default function App() {
	const [user, setUser] = useState(null)

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, user => {
			setUser(user)
		})
		return unsubscribe
	}, [])

	return (
		<NavigationContainer>
			<Stack.Navigator>
				{user ? (
					<Stack.Screen
						name='Homeу'
						component={Home}
						options={{ title: 'Home' }}
					/>
				) : (
					<>
						<Stack.Screen
							name='SignIn'
							component={SignIn}
							options={{ title: 'Sign In' }}
						/>
						<Stack.Screen
							name='SignUp'
							component={SignUp}
							options={{ title: 'Sign Up' }}
						/>
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	)
}
