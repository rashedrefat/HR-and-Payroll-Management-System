import { apiSlice } from "./apiSlice";

export const designationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDesignations: builder.query({
      query: () => "/designations",
      providesTags: ["Designation"],
    }),
    addDesignation: builder.mutation({
      query: (body) => ({
        url: "/designations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Designation"],
    }),
    updateDesignation: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/designations/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Designation"],
    }),
    deleteDesignation: builder.mutation({
      query: (id) => ({
        url: `/designations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Designation"],
    }),
  }),
});

export const {
  useGetDesignationsQuery,
  useAddDesignationMutation,
  useUpdateDesignationMutation,
  useDeleteDesignationMutation,
} = designationApi;
