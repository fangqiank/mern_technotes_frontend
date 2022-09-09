import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from '../../api/apiSlice'

const usersAdapter = createEntityAdapter({})

const initState = usersAdapter.getInitialState()

export const userSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: '/users',
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,

        // keepUnusedDataFor: 5,
      }),

      transformResponse: (data) => {
        const loadedUsers = data.map((user) => ({
          ...user,
          id: user._id,
        }))

        return usersAdapter.setAll(initState, loadedUsers)
      },

      providesTags: (res, err, arg) => {
        if (res?.ids) {
          return [
            { type: 'User', id: 'LIST' },
            ...res.ids.map((id) => ({
              type: 'User',
              id,
            })),
          ]
        } else {
          return [{ type: 'User', id: 'LIST' }]
        }
      },
    }),

    addNewUser: builder.mutation({
      query: (newUser) => ({
        url: '/users',
        method: 'POST',
        body: {
          ...newUser,
        },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    updateUser: builder.mutation({
      query: (updatedUser) => ({
        url: '/users',
        method: 'PATCH',
        body: {
          ...updatedUser,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
    }),

    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: '/users',
        method: 'DELETE',
        body: { id },
      }),

      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userSlice

//returns the query result object
export const selectUsersResult = userSlice.endpoints.getUsers.select()

//creates memorized selector
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data, // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors((state) => selectUsersData(state) ?? initState)
