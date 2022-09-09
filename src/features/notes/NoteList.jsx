import React from 'react'
import {useGetNotesQuery} from './noteSlice'
import Note from './Note'
import { useAuth } from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'
import { useTitle } from '../../hooks/useTitle'

export const NoteList = () => {
	useTitle('techNotes: Notes List')

	const {username, permissions:{isAdmin, isManager}} = useAuth()

	const {
		data: notes,
		isLoading,
		isSuccess, 
		isError,
		error
	} = useGetNotesQuery('notesList', {
		pollingInterval: 15000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true
	})

	let content = null

	if (isLoading) 
		content = <PulseLoader color='#fff'/>

	if (isError)
		content = <p className='errmsg'>{error?.data?.message}</p>
	
	if (isSuccess) {
		const {ids, entities} = notes

		// console.log(entities)

		let filterIds
		if(isAdmin ||  isManager)
			filterIds = [...ids]
		else
			filterIds = ids.filter(id => entities[id].username === username.toLowerCase())

		const tableContent = ids?.length && (
			filterIds.map(id => <Note key={id} noteId={id} />
		)) 

		content = (
			<table className="table table--notes">
				<thead className="table__thead">
					<tr>
						<th scope="col" className="table__th note__status">Status</th>
						<th scope="col" className="table__th note__created">Created</th>
						<th scope="col" className="table__th note__updated">Updated</th>
						<th scope="col" className="table__th note__title">Title</th>
						<th scope="col" className="table__th note__username">Owner</th>
						<th scope="col" className="table__th note__edit">Edit</th>
					</tr>
				</thead>
				<tbody>
					{tableContent}
				</tbody>
			</table>
		)
	}

	return (
		content
	)
}
