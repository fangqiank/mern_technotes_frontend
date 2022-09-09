import React, {useState, useEffect} from 'react'
import {useAddNewUserMutation} from './userSlice'
import {useNavigate} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import {ROLES} from './roles'
import { useTitle } from '../../hooks/useTitle'

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

export const AddUser = () => {
  useTitle('techNotes: New User')
	
	const [addUser, {
		isLoading, 
		error,
		isSuccess,
		isError,
	}] = useAddNewUserMutation()

	const navigate = useNavigate()

	const [username, setUsername] = useState('')
	const [vaildUsername, setValidUsername] = useState(false)
	const [password, setPassword] = useState('')
	const [vaildPassword, setValidPassword] = useState(false)
	const [roles, setRoles] = useState(['EMPLOYEE'])

	const canSave = [roles.length, vaildUsername, vaildPassword].every(Boolean) && !isLoading

	const handleChange = e => {
		const rolesArr = Array.from(e.target.selectedOptions, option => option.value)
		rolesArr.filter(role => Object.values(ROLES).includes(role))
		console.log(rolesArr)
		setRoles(rolesArr)
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		if(canSave) {
			addUser({username, password, roles})
		}
	}

	useEffect(() => {
		setValidUsername(USER_REGEX.test(username))
	}, [username])

	useEffect(() => {
		setValidPassword(PWD_REGEX.test(password))
	},[password])

	useEffect(() => {
		if(isSuccess) {
			setUsername('')
			setPassword('')
			setRoles([])
			navigate('/dash/users')
		}
	}, [isSuccess, navigate])

	return (
		<>
			<p className={isError ? 'errmsg' : 'offscreen'}>
				{error?.data.message}
			</p>

			<form 
				className="form"
				onSubmit={handleSubmit}
			>
				<div className="form__title-row">
					<h2>New User</h2>
					<div className="form__action-buttons">
						<button
							className="icon-button"
							title='Save'
							disabled={!canSave}
						>
							<FontAwesomeIcon icon={faSave} />
						</button>
					</div>
				</div>	

				<label htmlFor="username" className="form__label">
					Username:
					{' '} 
					<span className='nowrap'>
						[3-20 letters]
					</span>
				</label>
				<input 
					type="text"
					className={`form__input ${!vaildUsername ? 'form__input--incomplete' : ''}`}
					id='username'
					name='username'
					autoComplete='off'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>

				<label htmlFor="password" className="form__label">
					Passowrd:
						{' '} 
						<span className='nowrap'>
							[4-12 letters, numbers, or !@#$%]
						</span>
				</label>
				<input 
					type="password"
					className={`form__input ${!vaildPassword ? 'form__input--incomplete' : ''}`} 
					id='password'
					name='password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			
				<label htmlFor="roles" className="form__label">
					Assigned Roles:
				</label>
				<select 
					name="roles" 
					id="roles"
					className={`form__select ${!Boolean(roles.length) ? 'form__input--incomplete' : ''}`}
					multiple
					size={3}
					value={roles}
					onChange={handleChange}
				>
					<option value="">Select a role: </option>
					{Object.values(ROLES).map(role => (
						<option
							key={role}
							value={role}
						>
							{role}
						</option>
					))}
				</select>
			</form>
		</>
	)
}
