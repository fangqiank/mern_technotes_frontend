import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
// import { useSelector } from 'react-redux'
import { useAddNewNoteMutation } from './noteSlice'
// import { selectAllUsers } from '../users/userSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { useGetUsersQuery } from '../users/userSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import { useTitle } from '../../hooks/useTitle'

export const AddNote = () => {
	// const users = useSelector(selectAllUsers)
	useTitle('techNotes: New Note')

	const {users} = useGetUsersQuery('usersList', {
		selectFromResult: ({data}) => ({
			users: data?.ids.map(id => data?.entities[id])
		})
	})

	if(!users?.length)
		return <PulseLoader color='#fff'/>

	const [addNewNote, {
		isLoading,
		isSuccess,
		isError,
		error
	}] = useAddNewNoteMutation()

	const navigate = useNavigate()
	
	const [title, setTitle] = useState('')
	const [text, setText] = useState('')
	const [userId, setUserId] = useState(users[0].id) 

	useEffect(() => {
		if(isSuccess){
			setTitle('')
			setText('')
			setUserId('')

			navigate('/dash/notes')
		}
	}, [isSuccess, navigate])

	const canSave = [title, text, userId].every(Boolean) && !isLoading

	const handleSubmit = async e => {
		e.preventDefault()

		if(canSave){
			await addNewNote({
				title,
				text,
				user: userId
			})
		}
	}

	return (
		<>
			<p className={isError ? 'errmsg' : 'offscreen'}>
				{error?.data?.message}
			</p>

			<form 
				className="form"
				onSubmit={handleSubmit}
			>
				<div className="form__title-row">
					<h2>New Note</h2>
					<div className="form__action-buttons">
						<button
							className="icon-button"
							type="submit"
							title='save'
							disabled={!canSave}
						>
							<FontAwesomeIcon icon={faSave} />
						</button>
					</div>
				</div>

				<label 
					htmlFor="title"
					className='form__label'
				>
					Title:
				</label>
				<input
					className={`form-input ${!title && 'form-input--incomplete'}`} 
					type="text" 
					id="title"
					name='title'
					autoComplete='off'
					value={title}
					onChange={e => setTitle(e.target.value)}
				/>

				<label 
					htmlFor="text" 
					className="form__label"
				>
					Text:	
				</label>
				<textarea
					className={`form-input form__input--text ${!text && 'form-input--incomplete'}`}
					name="text" 
					id="text" 
					value={text}
					onChange={e => setText(e.target.value)}
				></textarea>

				<label htmlFor="username" className="form_label form__checkbox-container">
					Assign to:
				</label>
				<select 
					name="username" 
					id="username" 
					className="form__select"
					value={userId}
					onChange={e => setUserId(e.target.value)}
				>
					<option value="">Select a user: </option>
					{users.map(user => (
						<option
							key={user.id}
							value={user.id}
						>
							{user.username}
						</option>
					))}
				</select>
			</form>
		</>
	) 
}
	
