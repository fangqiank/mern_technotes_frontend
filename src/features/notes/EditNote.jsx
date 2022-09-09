import React, {useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {/*selectNoteById*/useUpdateNoteMutation, useDeleteNoteMutation } from './noteSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { useAuth } from '../../hooks/useAuth'
import { useGetNotesQuery } from './noteSlice'
import { useGetUsersQuery } from '../users/userSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import { useTitle } from '../../hooks/useTitle'


export const EditNote = () => {
	useTitle('techNotes: Edit Note')
	
	const {username, permissions:{isAdmin, isManager}} = useAuth()

	const { id } = useParams()

  //const note = useSelector(state => selectNoteById(state, id))
  //const users = useSelector(selectAllUsers)
  
	const { note } = useGetNotesQuery("notesList", {
        selectFromResult: ({ data }) => ({
            note: data?.entities[id]
        }),
  })
	
	const {users} = useGetUsersQuery('usersList', {
		selectFromResult: ({data}) => ({
			users: data?.ids.map(id => data?.entities[id])
		})
	}) 

	if(!note || !users?.length)
		return <PulseLoader color='#fff'/>

	if(!isAdmin && !isManager){
		if(note.username !== username){
			return <p className='errmsg'>No Access</p>
		}
	}

	// const note = useSelector(state => selectNoteById(state, id))
	// const users = useSelector(selectAllUsers)
	// const {permissions: {isAdmin, isManager}} = useAuth()

	const [updateNote, {
		isLoading,
		isSuccess,
		isError,
		error
	}] = useUpdateNoteMutation()

	const [deleteNote, {
		// isLoading: isDeleting,
		isSuccess: isDeleted,
		isError: isDeleteError,
		error: deleteError
	}] = useDeleteNoteMutation()

	const navigate = useNavigate()

	const [title, setTitle] = useState(note.title)
	const [text, setText] = useState(note.text)
	const [completed, setCompleted] = useState(note.completed)
	const [userId, setUserId] = useState(note.user)

	const canSave = [title, text, userId].every(Boolean) && !isLoading

	const handleSubmit = async e => {
		e.preventDefault()

		if(canSave){
			await updateNote({
				id: note.id,
				title,
				text,
				completed,
				user: userId
			})
		}
	}

	const handleDelete = async () => {
		if(window.confirm(`Are you sure you want to delete this note: ${note.title}?`)){
			await deleteNote({
				id: note.id
			})
		}
	}

	useEffect(() => {
		if(isSuccess || isDeleted){
			setTitle('')
			setText('')
			setUserId('')

			navigate('/dash/notes')
		}
	}, [isDeleted, isSuccess, navigate])

	return (
		<>
			<p className={isError || isDeleteError ? 'errmsg' : 'offscreen'}>
				{error?.data?.message || deleteError?.data?.message}
			</p>

			<form 
				className="form"
				onSubmit={handleSubmit}
			>
				<div className="form__title-row">
					<h2>Edit Note #{note.ticket}</h2>
					<div className="form__action-buttons">
						<button
							type='submit'
							className="icon-button"
							title="Save"
							disabled={!canSave}
						>
							<FontAwesomeIcon icon={faSave} />
						</button>

						{(isManager || isAdmin) && (<button
							type='button'
							className="icon-button"
							title="Delete"
							onClick={handleDelete}
						>
							<FontAwesomeIcon icon={faTrashCan} />
						</button>)}
					</div>
				</div>

				<label 
					className="form__label"
					htmlFor="title"
				>
					Title:
				</label>
				<input 
					type="text" 
					className={`form__input ${!title ? 'form__input--incomplete' : ''}`}
					name="title"
					id="title"
					autoComplete='off'
					value={title}
					onChange={e => setTitle(e.target.value)}
				/>

				<label 
					className="form__label"
					htmlFor="note-text"
				>
					Text:
				</label>
				<textarea 
					className={`form__input form__input--text ${!text ? 'form__input--incomplete' : ''}`}
					name="note-text"
					id="note-text"
					autoComplete='off'
					value={text}
					onChange={e => setText(e.target.value)}
				/>

				<div className="form__row">
					<div className="form__devider">
						<label 
							htmlFor="note-completed" 
							className="form__label form__checkbox-container"
						>
							Work complete:
							
							<input
								className='form__checkbox'
								id='note-completed'
								name='note-completed'
								type='checkbox'
								checked={completed}
								onChange={() => setCompleted(prev => !prev)}
							/>
						</label>

						<label 
							htmlFor="note-username" 
							className="form_label form__checkbox-container"
						>
							Assign to:
						</label>
						<select 
							name="note-username" 
							id="noteusername" 
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
					</div>

					<div className="form__divider">
						<p className="form_created">
							Created:
							{' '}
							{new Date(note.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}
						</p>
						<p className="form__updated">
							Updated:
							{' '}
							{
								new Date(note.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
							}
						</p>
					</div>
				</div>			
			</form>
		</>
	)
}
