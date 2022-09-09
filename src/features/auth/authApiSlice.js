import { apiSlice } from '../../api/apiSlice'
import { logout, setCredentials } from './authSlice'

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth',
        method: 'post',
        body: {
          ...credentials,
        },
      }),
    }),

    sendLogout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'post',
      }),

      async onQueryStarted(arg, props) {
        // console.log(props)
        const {
          dispatch,
          getState,
          queryFulfilled,
          requestId,
          extra,
          getCacheEntry,
        } = props

        try {
          const result = await queryFulfilled
          // console.log(result)
          const { data } = result
          console.log(data)

          dispatch(logout())
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState())
          }, 1000)
        } catch (err) {
          console.log(err)
        }
      },
    }),

    refresh: builder.mutation({
      query: () => ({
        url: '/auth/refresh',
        method: 'get',
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // console.log(data)
          const { accessToken } = data
          dispatch(setCredentials({ accessToken }))
        } catch (err) {
          console.log(err)
        }
      },
    }),
  }),
})

export const {
  useLoginMutation,
  useSendLogoutMutation,
  useRefreshMutation,
} = authApiSlice
