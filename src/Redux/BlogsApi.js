import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BlogsApi = createApi({
    reducerPath: 'BlogsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL}`,
    }),
    tagTypes: ['post'],
    endpoints: (builder) => ({

        addBlogs: builder.mutation({
            query: (formData) => ({
                url: '/admin/offer/add',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ["post"],
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

        updateBlog: builder.mutation({
            query: ({ id, updatedData }) => ({
                url: `/admin/offer/update/${id}`,
                method: 'PUT',
                body: updatedData,
            }),
            invalidatesTags: ['post'],
        }),
    }),
});

export const {
    useAddBlogsMutation,
    useDeleteBlogMutation,
    useGetApprovedBlogsQuery,
    useGetPendingBlogsQuery,
    useGetRejectedBlogsQuery,
    useUpdateBlogMutation,

} = BlogsApi;

export default BlogsApi;
