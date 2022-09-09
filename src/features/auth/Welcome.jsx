import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useTitle } from '../../hooks/useTitle'

export const Welcome = () => {
	const {username, permissions: {isAdmin, isManager}}  = useAuth()

	useTitle(`techNotes: ${username}`)

	const date = new Date()
  const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)
	
	return (
		<section className="welcome">

			<p>{today}</p>

			<h1>Welcome {username}!</h1>

			<p><Link to="/dash/notes">View techNotes</Link></p>
			<p><Link to="/dash/notes/add">Add New techNote</Link></p>
			{(isManager || isAdmin) && (<p><Link to="/dash/users">View User Settings</Link></p>)}
			{(isManager || isAdmin) && (<p><Link to="/dash/users/add">Add New User</Link></p>)}

		</section>
	)
}
