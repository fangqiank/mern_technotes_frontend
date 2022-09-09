import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from '../../api/apiSlice'

const notesAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
})

const initState = notesAdapter.getInitialState()

export const noteSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => ({
        url: '/notes',
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
      // keepUnusedDataFor: 5,
      transformResponse: (data) => {
        const loadedNotes = data.map((note) => ({
          ...note,
          id: note._id,
        }))

        return notesAdapter.setAll(initState, loadedNotes)
      },

      providesTags: (res, err, arg) => {
        if (res?.ids) {
          return [
            { type: 'Note', id: 'LIST' },
            ...res.ids.map((id) => ({
              type: 'Note',
              id,
            })),
          ]
        } else {
          return [{ type: 'Note', id: 'LIST' }]
        }
      },
    }),

    addNewNote: builder.mutation({
      query: (newNote) => ({
        url: '/notes',
        method: 'POST',
        body: { ...newNote },
      }),
      invalidatesTags: [{ type: 'Note', id: 'LIST' }],
    }),

    updateNote: builder.mutation({
      query: (updatedNote) => ({
        url: '/notes',
        method: 'PATCH',
        body: { ...updatedNote },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Note', id: arg.id }],
    }),

    deleteNote: builder.mutation({
      query: (id) => ({
        url: '/notes',
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Note', id: arg.id }],
    }),
  }),
})

export const {
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = noteSlice

//returns the query result object
export const selectNotesResult = noteSlice.endpoints.getNotes.select()

//creates memorized selector
const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data, // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
  // Pass in a selector that returns the users slice of state
} = notesAdapter.getSelectors((state) => selectNotesData(state) ?? initState)
