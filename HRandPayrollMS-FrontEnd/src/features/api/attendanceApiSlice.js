import { apiSlice } from "./apiSlice";

export const attendanceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all attendances (Admin only)
    getAttendances: builder.query({
      query: () => "/attendances",
      transformResponse: (response) => {
        return response;
      },
      providesTags: ["Attendance"],
    }),
    
    // Get current employee's attendances only
    getMyAttendances: builder.query({
      query: () => "/my-attendances",
      providesTags: ["MyAttendance"],
    }),
    
    // Create new attendance record (Admin)
    createAttendance: builder.mutation({
      query: (newAttendance) => ({
        url: "/attendances",
        method: "POST",
        body: newAttendance,
      }),
      invalidatesTags: ["MyAttendance", "Attendance"],
    }),

    // Create new attendance record (Employee)
    createMyAttendance: builder.mutation({
      query: (newAttendance) => ({
        url: "/my-attendances",
        method: "POST",
        body: newAttendance,
      }),
      invalidatesTags: ["MyAttendance"],
    }),
    
    // Update attendance record (Admin)
    updateAttendance: builder.mutation({
      query: ({ id, ...attendance }) => ({
        url: `/attendances/${id}`,
        method: "PUT",
        body: attendance,
      }),
      invalidatesTags: ["MyAttendance", "Attendance"],
    }),

    // Update attendance record (Employee)
    updateMyAttendance: builder.mutation({
      query: ({ id, ...attendance }) => ({
        url: `/my-attendances/${id}`,
        method: "PUT",
        body: attendance,
      }),
      invalidatesTags: ["MyAttendance"],
    }),
    
    // Delete attendance record (Admin)
    deleteAttendance: builder.mutation({
      query: (id) => ({
        url: `/attendances/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MyAttendance", "Attendance"],
    }),

    // Delete attendance record (Employee)
    deleteMyAttendance: builder.mutation({
      query: (id) => ({
        url: `/my-attendances/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MyAttendance"],
    }),
  }),
});

export const {
  useGetAttendancesQuery,
  useGetMyAttendancesQuery,
  useCreateAttendanceMutation,
  useCreateMyAttendanceMutation,
  useUpdateAttendanceMutation,
  useUpdateMyAttendanceMutation,
  useDeleteAttendanceMutation,
  useDeleteMyAttendanceMutation,
} = attendanceApiSlice;