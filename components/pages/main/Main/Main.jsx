import { Outlet } from 'react-router-dom'
import Nav from '../../../nav/Nav'
import s from './Main.module.scss'
import AuthDetails from '../../auth/AuthDetails'

export default function Main() {
	return (
		<div className={s.main}>
			<h1>Main</h1>
			<AuthDetails />
			<Nav />
			<Outlet />
		</div>
	)
}
