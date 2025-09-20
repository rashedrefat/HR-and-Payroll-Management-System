import { apiSlice } from "./apiSlice";

export const incrementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getIncrements: builder.query({
      query: () => "/increments",
      providesTags: ["Increment"],
    }),
    addIncrement: builder.mutation({
      query: (body) => ({
        url: "/increments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Increment"],
    }),
    updateIncrement: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/increments/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Increment"],
    }),
    deleteIncrement: builder.mutation({
      query: (id) => ({
        url: `/increments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Increment"],
    }),
  }),
});

export const {
  useGetIncrementsQuery,
  useAddIncrementMutation,
  useUpdateIncrementMutation,
  useDeleteIncrementMutation,
} = incrementApi;
