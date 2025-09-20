import { apiSlice } from "./apiSlice";

export const employeeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all employees
    getEmployees: builder.query({
      query: () => "/employees",
      transformResponse: (response) => {
        // Laravel controller returns data directly, not wrapped in data property
        return response;
      },
      providesTags: ["Employee"],
    }),
    
    // Get single employee
    getEmployee: builder.query({
      query: (id) => `/employees/${id}`,
      providesTags: (result, error, id) => [{ type: "Employee", id }],
    }),
    
    // Get current employee profile
    getEmployeeProfile: builder.query({
      query: () => "/employee/profile",
      providesTags: ["EmployeeProfile"],
    }),
    
    // Create new employee
    createEmployee: builder.mutation({
      query: (newEmployee) => ({
        url: "/employees",
        method: "POST",
        body: newEmployee,
      }),
      invalidatesTags: ["Employee"],
    }),
    
    // Update employee
    updateEmployee: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/employees/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Employee", id }],
    }),
    
    // Delete employee
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/employees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Employee"],
    }),
    
    // Get all departments
    getDepartments: builder.query({
      query: () => "/departments",
      providesTags: ["Department"],
    }),
    
    // Get all designations
    getDesignations: builder.query({
      query: () => "/designations",
      providesTags: ["Designation"],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeQuery,
  useGetEmployeeProfileQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetDepartmentsQuery,
  useGetDesignationsQuery,
} = employeeApiSlice;
