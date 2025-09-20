import { apiSlice } from "./apiSlice";

export const shiftApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShifts: builder.query({
      query: () => "/shifts",
      providesTags: ["Shift"],
    }),
    getShift: builder.query({
      query: (id) => `/shifts/${id}`,
      providesTags: (result, error, id) => [{ type: "Shift", id }],
    }),
    addShift: builder.mutation({
      query: (data) => ({
        url: "/shifts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Shift"],
    }),
    updateShift: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/shifts/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Shift", id }],
    }),
    deleteShift: builder.mutation({
      query: (id) => ({
        url: `/shifts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Shift"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetShiftsQuery,
  useGetShiftQuery,
  useAddShiftMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
} = shiftApi;
