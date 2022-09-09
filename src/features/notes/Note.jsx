import React, {memo} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'

// import { useSelector } from 'react-redux'
// import { selectNoteById } from './noteSlice'
import { useGetNotesQuery } from './noteSlice'

const Note = ({noteId}) => {
	// const note = useSelector(state => selectNoteById(state, noteId))
	const {note} = useGetNotesQuery('notesList', {
		selectFromResult : ({data}) => ({
			note: data?.entities[noteId]
		})
	})

	const navigate = useNavigate()

	const created = new Date(note?.createdAt).toLocaleString('en-US', {day: 'numeric', month: 'long', year: 'numeric'})

	const updated = new Date(note?.updatedAt).toLocaleString('en-US', {day: 'numeric', month: 'long', year: 'numeric'})

	const handleEdit = () => navigate(`/dash/notes/${noteId}`)

	return (
		<>
			{note ? (
				<tr className='table__row'>
					<td className="table__cell note__status">
						{note.completed ? (<span className='note__status--completed'>Completed</span>) : (<span className='note__status--open'>Open</span>)}
					</td>
					<td className="table__cell note__created">{created}</td>
					<td className="table__cell note__updated">{updated}</td>
					<td className="table__cell note__title">{note.title}</td>
					<td className="table__cell note__username">{note.username}</td>

					<td className='table__cell'>
						<button 
							className='icon-button table__button' 
							onClick={handleEdit}
						>
							<FontAwesomeIcon icon={faPenToSquare} />
						</button>
					</td>
				</tr>
				) : null
			}
		</>
  )
}

const memoizedNote = memo(Note)

export default memoizedNote