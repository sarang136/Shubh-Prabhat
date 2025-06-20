import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://shubh-prabhat-news-backend.onrender.com",
  }),
  tagTypes: ["post"],
  endpoints: (builder) => ({

    addPost: builder.mutation({
      query: (post) => ({
        url: '/reporter/auth/login',
        method: 'POST',
        body: post,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
      invalidatesTags: ["post"],
    }),

    register: builder.mutation({
      query: (register) => ({
        url: '/reporter/auth/register',
        method: 'POST',
        body: register,
      }),
      invalidatesTags: ["post"],
    }),

    verify: builder.mutation({
      query: (verify) => ({
        url: '/reporter/auth/verify-otp',
        method: 'POST',
        body: verify,
      }),
      invalidatesTags: ["post"],
    }),

    logout: builder.mutation({
      query: (body) => ({
        url: '/reporter/auth/logout',
        method: 'POST',
        body,
      }),
    }),


    addNews: builder.mutation({
      query: (formData) => ({
        url: '/admin/subcategories/createProductByReporter',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ["post"],
    }),

    addBlogs: builder.mutation({
      query: (formData) => ({
        url: '/admin/offer/add',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ["post"],
    }),

    // QUERIES
    getAllNews: builder.query({
      query: (id) => ({
        url: `/admin/subcategories/getByreporter/${id}`
      }),
      providesTags: ["post"],
    }),

    getAllCategories: builder.query({
      query: () => ({
        url: "admin/categories/getall",
      }),
      providesTags: ["post"],
    }),

    getAllSubCategories: builder.query({
      query: () => ({
        url: "/admin/subcategories/getall",
      }),
      providesTags: ["post"],
    }),

    getPendingBlogs: builder.query({
      query: (id) => ({
        url: `/admin/offer/pending/${id}`,
      }),
      providesTags: ["post"],
    }),

    getRejectedBlogs: builder.query({
      query: (id) => ({
        url: `/admin/offer/rejected/${id}`,
      }),
      providesTags: ["post"],
    }),

    getApprovedBlogs: builder.query({
      query: (id) => ({
        url: `/admin/offer/approved/${id}`,
      }),
      providesTags: ["post"],
    }),






    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/admin/offer/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["post"],
    }),

    deleteNews: builder.mutation({
      query: (id) => ({
        url: `/admin/subcategories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["post"],
    }),

    updateBlog: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/admin/offer/update/${id}`,
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: ['post'],
    }),

    updateNews: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/admin/subcategories/${id}`,
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: ['post'],
    }),
  }),
});

export const {
  useAddPostMutation,
  useRegisterMutation,
  useVerifyMutation,
  useGetAllNewsQuery,
  useGetAllCategoriesQuery,
  useGetAllSubCategoriesQuery,
  useAddNewsMutation,
  useAddBlogsMutation,
  useGetPendingBlogsQuery,
  useGetApprovedBlogsQuery,
  useGetRejectedBlogsQuery,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
  useLogoutMutation,
  useDeleteNewsMutation,
  useUpdateNewsMutation,
} = postApi;
