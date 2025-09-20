import { apiSlice } from "./apiSlice";

export const employeeSalariesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all employee salaries
    getEmployeeSalaries: builder.query({
      query: () => "/employee-salaries",
      transformResponse: (response) => response.data, // Extract data from wrapper
      providesTags: ["EmployeeSalaries"],
    }),

    // Get single employee salary
    getEmployeeSalary: builder.query({
      query: (id) => `/employee-salaries/${id}`,
      providesTags: (result, error, id) => [{ type: "EmployeeSalaries", id }],
    }),

    // Create new employee salary
    createEmployeeSalary: builder.mutation({
      query: (newEmployeeSalary) => ({
        url: "/employee-salaries",
        method: "POST",
        body: newEmployeeSalary,
      }),
      invalidatesTags: ["EmployeeSalaries"],
    }),

    // Update employee salary
    updateEmployeeSalary: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/employee-salaries/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "EmployeeSalaries", id },
      ],
    }),

    // Delete employee salary
    deleteEmployeeSalary: builder.mutation({
      query: (id) => ({
        url: `/employee-salaries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EmployeeSalaries"],
    }),
  }),
});

export const {
  useGetEmployeeSalariesQuery,
  useGetEmployeeSalaryQuery,
  useCreateEmployeeSalaryMutation,
  useUpdateEmployeeSalaryMutation,
  useDeleteEmployeeSalaryMutation,
} = employeeSalariesApiSlice;