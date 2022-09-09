import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const DashFooter = () => {
	const {username, permissions: {status}} = useAuth()
	const navigate = useNavigate()
  const { pathname } = useLocation()

	const onGoHomeClicked = () => navigate('/dash')

	let goHomeButton = null
	
	if (pathname !== '/dash') {
		goHomeButton = (
			<button
					className="dash-footer__button icon-button"
					title="Home"
					onClick={onGoHomeClicked}
			>
					<FontAwesomeIcon icon={faHouse} />
			</button>
		)
	}

	return (
		<footer className="dash-footer">
			{goHomeButton}
			<p>Current User: <span style={{color: 'blueviolet', fontWeight:'bold', fontStyle: 'italic'}}>{username}</span></p>
			<p>Status: <span style={{color: status === 'Employee' ? '#7f7f7f' : '#1a9cdf'}}>{status}</span></p>
		</footer>
	)
}
