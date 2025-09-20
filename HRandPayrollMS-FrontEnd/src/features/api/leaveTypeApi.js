import { apiSlice } from "./apiSlice";

export const leaveTypeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLeaveTypes: builder.query({
      query: () => "/leave-types",
      providesTags: ["LeaveType"],
    }),
    addLeaveType: builder.mutation({
      query: (data) => ({
        url: "/leave-types",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LeaveType"],
    }),
    updateLeaveType: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/leave-types/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "LeaveType", id }],
    }),
    deleteLeaveType: builder.mutation({
      query: (id) => ({
        url: `/leave-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LeaveType"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLeaveTypesQuery,
  useAddLeaveTypeMutation,
  useUpdateLeaveTypeMutation,
  useDeleteLeaveTypeMutation,
} = leaveTypeApi;
