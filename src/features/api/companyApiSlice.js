import { apiSlice } from './apiSlice';

export const companyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get company information
    getCompanyInfo: builder.query({
      query: () => '/company',
      providesTags: ['Company'],
    }),

    // Update company information
    updateCompanyInfo: builder.mutation({
      query: (companyData) => ({
        url: '/company',
        method: 'POST',
        body: companyData,
      }),
      invalidatesTags: ['Company'],
    }),

    // Update HR information
    updateHRInfo: builder.mutation({
      query: (hrData) => ({
        url: '/company/hr',
        method: 'POST',
        body: hrData,
      }),
      invalidatesTags: ['Company'],
    }),

    // Get general settings (alternative endpoint)
    getGeneralSettings: builder.query({
      query: () => '/settings/general',
      providesTags: ['Company'],
    }),

    // Update general settings (both company and HR)
    updateGeneralSettings: builder.mutation({
      query: (settingsData) => ({
        url: '/settings/general',
        method: 'POST',
        body: settingsData,
      }),
      invalidatesTags: ['Company'],
    }),
  }),
});

export const {
  useGetCompanyInfoQuery,
  useUpdateCompanyInfoMutation,
  useUpdateHRInfoMutation,
  useGetGeneralSettingsQuery,
  useUpdateGeneralSettingsMutation,
} = companyApiSlice;
