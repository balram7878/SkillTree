import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL =
  import.meta.env.VITE_RAG_API_BASE_URL ||
  "https://skilltree-1-rag.onrender.com/api";

export const ragApi = createApi({
  reducerPath: "ragApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getQuestions: builder.mutation({
      query: (data) => ({
        url: "/skill/questions",
        method: "POST",
        body: data,
      }),
    }),
    submitAnswers: builder.mutation({
      query: (answers) => ({
        url: "/skill/evaluate",
        method: "POST",
        body: answers,
      }),
    }),
    getServerStatus: builder.query({
      query: () => ({
        url: "/health",
      }),
    }),
  }),
});

export const {
  useGetQuestionsMutation,
  useSubmitAnswersMutation,
  useGetServerStatusQuery,
} = ragApi;
