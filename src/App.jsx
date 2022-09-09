import { Routes, Route } from 'react-router-dom'
import {Layout} from './components/Layout'
import {Public} from './components/Public'
import {Login} from './features/auth/Login'
import {PersistLogin} from './features/auth/PersistLogin'
import {DashLayout} from './components/DashLayout'
import {Welcome} from './features/auth/Welcome'
import {NoteList} from './features/notes/NoteList'
import {UserList} from './features/users/UserList'
import {EditUser} from './features/users/EditUser'
import {AddUser} from './features/users/AddUser'
import {EditNote} from './features/notes/EditNote'
import {AddNote} from './features/notes/AddNote'
import {Prefetch} from './features/auth/Prefetch'
import {ROLES} from './features/users/roles'
import {RequireAuth} from './components/RequireAuth'
import {useTitle} from './hooks/useTitle'

function App() {
  useTitle('Dan D. Repairs')
  
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        <Route element={<PersistLogin />}>  
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]}/>}>
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>

                <Route index element={<Welcome />} />
                
                <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}/>}>  
                  <Route path="users">
                    <Route index element={<UserList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="add" element={<AddUser />} />
                  </Route>
                </Route>

                <Route path="notes">
                  <Route index element={<NoteList />} />
                  <Route path=":id" element={<EditNote />} />
                  <Route path="add" element={<AddNote />} />
                </Route>

              </Route>{/* End Dash */}
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
