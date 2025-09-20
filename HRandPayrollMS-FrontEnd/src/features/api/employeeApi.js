import { apiSlice } from "./apiSlice";

export const employeeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: () => "/employees",
      providesTags: ["Employee"],
    }),
  }),
});

export const { useGetEmployeesQuery } = employeeApi;
