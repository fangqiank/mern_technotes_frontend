import React, {useState, useEffect} from 'react'
import {useUpdateUserMutation, useDeleteUserMutation, /*selectUserById*/} from './userSlice'
import {useNavigate, useParams} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import {ROLES} from './roles'
// import { useSelector } from 'react-redux'
import { useGetUsersQuery } from './userSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import { useTitle } from '../../hooks/useTitle'

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

export const EditUser = () => {
	useTitle('techNotes: Edit User')
	
	const { id } = useParams()

  // const user = useSelector((state) => selectUserById(state, id))
	const {user} = useGetUsersQuery('uersList', {
		selectFromResult: ({data}) => ({
			user: data?.entities[id]
		})
	})

	if(!user)
		return (<PulseLoader color='fff' />)

  const content = <EditUserForm user={user} />

  return content
}

const EditUserForm = ({user}) => {
	// const {id} = useParams()
	
	// const user = useSelector(state => selectUserById(state, id))
  // console.log(user)

	const [updateUser, {
		isLoading, 
		error,
		isSuccess,
		isError,
	}] = useUpdateUserMutation()

	const [deleteUser, {
		// isLoading: isDeleting,
		isError: isDeleteError,
		isSuccess: isDeleteSuccess,
		error: deleteError,
	}] = useDeleteUserMutation()

	const navigate = useNavigate()

	const [username, setUsername] = useState(user.username)
	const [vaildUsername, setValidUsername] = useState(false)
	const [password, setPassword] = useState('')
	const [vaildPassword, setValidPassword] = useState(false)
	const [roles, setRoles] = useState(user.roles)
	const [active, setActive] = useState(user.active)

	let canSave =false
	password 
		? canSave = [roles?.length, vaildUsername, vaildPassword].every(Boolean) && !isLoading
		: canSave = [roles?.length, vaildUsername].every(Boolean) && !isLoading
	
	const handleChange = e => {
		const rolesArr = Array.from(e.target.selectedOptions, option => option.value)
		rolesArr.filter(role => Object.values(ROLES).includes(role))
		console.log(rolesArr)
		setRoles(rolesArr)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		if(password){
			await updateUser({id:user.id, username, password, roles, active})
		}else{
			await updateUser({id:user.id, username, roles, active})
		}
	}

	const handleDelete = async () => {
		if(window.confirm(`Are you sure you want to delete User: ${user?.username}?`)) {
			await deleteUser({id:user.id})
		}
	}

	useEffect(() => {
		setValidUsername(USER_REGEX.test(username))
	}, [username])

	useEffect(() => {
		setValidPassword(PWD_REGEX.test(password))
	},[password])

	useEffect(() => {
		if(isSuccess || isDeleteSuccess) {
			setUsername('')
			setPassword('')
			setRoles([])
			navigate('/dash/users')
		}
	}, [isSuccess, isDeleteSuccess ,navigate])

	return (
		<>
		  {user ? (
				<>
					<p className={isError || isDeleteError ? 'errmsg' : 'offscreen'}>
						{(error?.data.message || deleteError?.data.message) ?? ''}
					</p>

					<form 
						className="form"
						onSubmit={handleSubmit}
					>
						<div className="form__title-row">
							<h2>Edit User</h2>
							<div className="form__action-buttons">
								<button
									type='submit'
									className="icon-button"
									title='Save'
									disabled={!canSave}
								>
									<FontAwesomeIcon icon={faSave} />
								</button>

								<button
									type='button'
									className='icon-button'
									title='Delete'
									onClick={handleDelete}
								>
									<FontAwesomeIcon icon={faTrashCan} />
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
									[empty = no change]
								</span>
						</label>
						<input 
							type="password"
							className={`form__input ${password && !vaildPassword ? 'form__input--incomplete' : ''}`} 
							id='password'
							name='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>

						<label htmlFor="user-active" className="form__label form__checkbox-container">
							Active:
							<input
								className='form__checkbox'
								id='user-active'
								name='user-active'
								type='checkbox'
								checked={active}
								onChange={() => setActive(prev => !prev)} 
							/>
						</label>
					
						<label htmlFor="roles" className="form__label">
							Assigned Roles:
						</label>
						<select 
							name="roles" 
							id="roles"
							className={`form__select ${!Boolean(roles?.length) ? 'form__input--incomplete' : ''}`}
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
			) : (
				<PulseLoader color='#fff' />
			)
			} 
		</>

	)
}


