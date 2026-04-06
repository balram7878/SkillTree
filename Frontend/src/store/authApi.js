import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://skilltree-n3rh.onrender.com/api";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (data) => ({
        url: "/auth/signup",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    // Called when user clicks the email link → /verify-email?token=TOKEN
    verifyEmail: builder.query({
      query: (token) => ({
        url: `/auth/verify-email?token=${token}`,
        method: "GET",
      }),
    }),

    resendVerification: builder.mutation({
      query: (email) => ({
        url: "/auth/resend-verification",
        method: "POST",
        body: { email },
      }),
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    // token and password both go in the request body
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { token, password },
      }),
    }),

    getMe: builder.query({
      query: () => "/auth/me",
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    getServerStatus: builder.query({
      query: () => "/health",
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useVerifyEmailQuery,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMeQuery,
  useLogoutMutation,
  useGetServerStatusQuery
} = authApi;
