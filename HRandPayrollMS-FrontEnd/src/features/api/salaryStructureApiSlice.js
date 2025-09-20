import { apiSlice } from "./apiSlice";

export const salaryStructureApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all salary structures
    getSalaryStructures: builder.query({
      query: () => "/salary-structures",
      providesTags: ["SalaryStructure"],
    }),

    // Get single salary structure
    getSalaryStructure: builder.query({
      query: (id) => `/salary-structures/${id}`,
      providesTags: (result, error, id) => [{ type: "SalaryStructure", id }],
    }),

    // Create new salary structure
    createSalaryStructure: builder.mutation({
      query: (newSalaryStructure) => ({
        url: "/salary-structures",
        method: "POST",
        body: newSalaryStructure,
      }),
      invalidatesTags: ["SalaryStructure"],
    }),

    // Update salary structure
    updateSalaryStructure: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/salary-structures/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "SalaryStructure", id },
        "SalaryStructure",
      ],
    }),

    // Delete salary structure
    deleteSalaryStructure: builder.mutation({
      query: (id) => ({
        url: `/salary-structures/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SalaryStructure"],
    }),
  }),
});

export const {
  useGetSalaryStructuresQuery,
  useGetSalaryStructureQuery,
  useCreateSalaryStructureMutation,
  useUpdateSalaryStructureMutation,
  useDeleteSalaryStructureMutation,
} = salaryStructureApiSlice;