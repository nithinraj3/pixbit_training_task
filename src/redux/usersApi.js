import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
  reducerPath: "users",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://training.pixbit.in/api/`,
    prepareHeaders: (headers) => {
      const token = JSON.parse(localStorage.getItem("loginUser"));

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Employee", "Designation"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query(data) {
        return {
          url: `register`,
          method: "POST",
          body: data,
        };
      },
    }),
    login: builder.mutation({
      query(data) {
        return {
          url: `login`,
          method: "POST",
          body: data,
        };
      },
    }),
    getEmployees: builder.query({
      query: () => {
        return {
          url: `employees`,
        };
      },
      providesTags: ["Employee"],
    }),
    createEmployee: builder.mutation({
      query(data) {
        return {
          url: `employees`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Employee"],
    }),
    updateEmployee: builder.mutation({
      query(data) {
        const { id, ...employee } = data;
        return {
          url: `employees/${id}`,
          method: "PUT",
          body: employee,
        };
      },
      invalidatesTags: ["Employee"],
    }),
    deleteEmployee: builder.mutation({
      query(id) {
        return {
          url: `employees/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Employee"],
    }),
    getDesignations: builder.query({
      query: () => {
        return {
          url: `designations`,
          method: "GET",
        };
      },
      providesTags: ["Designation"],
    }),
    createDesignation: builder.mutation({
      query(data) {
        return {
          url: `designations`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Designation"],
    }),
    updateDesignation: builder.mutation({
      query(data) {
        const { id, ...list } = data;
        return {
          url: `designations/${id}`,
          method: "PUT",
          body: list,
        };
      },
      invalidatesTags: ["Designation"],
    }),
    deleteDesignation: builder.mutation({
      query: (id) => {
        return {
          url: `designations/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Designation"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetDesignationsQuery,
  useCreateDesignationMutation,
  useUpdateDesignationMutation,
  useDeleteDesignationMutation,
} = usersApi;
