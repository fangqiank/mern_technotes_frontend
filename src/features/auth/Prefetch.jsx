import { store } from '../../store'
import { noteSlice } from '../notes/noteSlice'
import { userSlice } from '../users/userSlice'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

export const Prefetch = () => {
  useEffect(() => {
    // console.log('subscribe')
    // const notes = store.dispatch(noteSlice.endpoints.getNotes.initiate())
    //const users = store.dispatch(userSlice.endpoints.getUsers.initiate())

    // console.log('Prefetch.jsx: users: ', users)
    store.dispatch(noteSlice.util.prefetch('getNotes', 'notesList', {force: true}))

    store.dispatch(userSlice.util.prefetch('getUsers', 'usersList', {force: true}))

    // return () => {
    //   console.log('unsubscribe')
    //   notes.unsubscribe()
    //   users.unsubscribe()
    // }
  }, [])

  return <Outlet />
}
