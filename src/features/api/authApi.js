import { apiSlice } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    refreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: "/refresh-token",
        method: "POST",
        body: { refresh_token: refreshToken },
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: (resetData) => ({
        url: "/reset-password",
        method: "POST",
        body: resetData,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (verificationData) => ({
        url: "/email/verify",
        method: "POST",
        body: verificationData,
      }),
    }),
    getCurrentUser: builder.query({
      query: () => "/user",
      providesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useGetCurrentUserQuery,
} = authApi;
