import { apiSlice } from '../api/apiSlice';

export const leaveRequestApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get all leave requests (Admin only)
        getLeaveRequests: builder.query({
            query: () => ({
                url: '/leave-requests',
                method: 'GET',
            }),
            providesTags: ['LeaveRequest'],
        }),

        // Get leave requests for authenticated employee only
        getMyLeaveRequests: builder.query({
            query: () => ({
                url: '/my-leave-requests',
                method: 'GET',
            }),
            providesTags: ['MyLeaveRequest'],
        }),

        // Create new leave request
        createLeaveRequest: builder.mutation({
            query: (requestData) => ({
                url: '/leave-requests',
                method: 'POST',
                body: requestData,
            }),
            invalidatesTags: ['LeaveRequest', 'MyLeaveRequest'],
        }),

        // Update leave request
        updateLeaveRequest: builder.mutation({
            query: ({ id, ...updateData }) => ({
                url: `/leave-requests/${id}`,
                method: 'PUT',
                body: updateData,
            }),
            invalidatesTags: ['LeaveRequest', 'MyLeaveRequest'],
        }),

        // Delete leave request
        deleteLeaveRequest: builder.mutation({
            query: (id) => ({
                url: `/leave-requests/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['LeaveRequest', 'MyLeaveRequest'],
        }),

        // Update leave request status (Admin only)
        updateLeaveRequestStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/leave-requests/${id}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['LeaveRequest', 'MyLeaveRequest'],
        }),
    }),
});

export const {
    useGetLeaveRequestsQuery,
    useGetMyLeaveRequestsQuery,
    useCreateLeaveRequestMutation,
    useUpdateLeaveRequestMutation,
    useDeleteLeaveRequestMutation,
    useUpdateLeaveRequestStatusMutation,
} = leaveRequestApiSlice;