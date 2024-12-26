import { Link } from 'react-router-dom'
import s from './Nav.module.scss'

export default function Nav() {
	return (
		<div className={s.nav}>
			<h1>
				<span>Nav</span>
				<span>
					<p><Link to="/signup">signUp</Link></p>
					<p><Link to="/signin">signIn</Link></p>
					<p><Link to="/main">Main</Link></p>
					<p><Link to="/main/home">Home</Link></p>
					<p><Link to="/main/home2">Home2</Link></p>
					<p><Link to="/main/home3">Home3</Link></p>
				</span>
			</h1>
		</div>
	)
}
