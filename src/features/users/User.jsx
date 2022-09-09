import React, {memo} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
// import { useSelector } from 'react-redux'

// import {selectUserById} from './userSlice'
import { useGetUsersQuery } from './userSlice'

const User = ({userId}) => {
	// const user = useSelector(state => selectUserById(state, userId))
  const {user} = useGetUsersQuery('usersList', {
		selectFromResult: ({data}) => ({
			user: data?.entities[userId]
		})
	}) 

	const navigate = useNavigate()

	const handleEdit = () => navigate(`/dash/users/${userId}`)

	const userRolesString = user?.roles.toString().replaceAll(',', ', ')

	const cellStatus = user?.active ? '' : 'table__cell--inactive'

	return (
		<>
	    {user ? (
				<tr className="table__row user">
					<td className={`table__cell ${cellStatus}`}>{user.username}</td>
					<td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
					<td className={`table__cell ${cellStatus}`}>
						<button
							className="icon-button table__button"
							onClick={handleEdit}
						>
							<FontAwesomeIcon icon={faPenToSquare} />
						</button>
					</td>
				</tr>
			) :  null}		
		</>
	)
}

const memoizedUser = memo(User)

export default memoizedUser

