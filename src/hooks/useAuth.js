import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../features/auth/authSlice'
import jwtDecode from 'jwt-decode'
import { ROLES } from '../features/users/roles'

const toTitleCase = (phrase) => {
  return phrase
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const useAuth = () => {
  const token = useSelector(selectCurrentToken)

  const permissions = {
    isAdmin: false,
    isManager: false,
    status: 'Employee',
  }

  let { isManager, isAdmin, status } = permissions

  if (token) {
    const decoded = jwtDecode(token)
    const { username, roles } = decoded.UserInfo

    isManager = roles.includes(ROLES.MANAGER)
    isAdmin = roles.includes(ROLES.ADMIN)

    if (isManager) status = toTitleCase(ROLES.MANAGER)
    if (isAdmin) status = toTitleCase(ROLES.ADMIN)

    return {
      username,
      roles,
      permissions: { isAdmin, isManager, status },
    }
  }

  return {
    username: '',
    roles: [],
    permissions: { isAdmin, isManager, status },
  }
}
