import React, { useState } from 'react';
import {
  useAddBlogsMutation,
  useGetPendingBlogsQuery,
  useDeleteBlogMutation,
  useUpdateBlogMutation
} from '../Redux/BlogsApi';
import { useSelector } from 'react-redux';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { FaEdit } from 'react-icons/fa';

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

const Blogs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [readModalData, setReadModalData] = useState(null);
  const [headline, setHeadline] = useState('');
  const [subHeadline, setSubHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [activeTab, setActiveTab] = useState('Approved');
  const [selectedBlog, setSelectedBlog] = useState(null);

  const auth = useSelector((state) => state.auth);
  const reporterId = auth?.user?.reporter?._id;
  console.log(reporterId);
  const shopId = auth?.user?.shop?._id;

  const [addBlogs, { isLoading: loading }] = useAddBlogsMutation(reporterId);
  const [deleteBlog] = useDeleteBlogMutation();
  const [updateBlog, { isLoading }] = useUpdateBlogMutation();
  const { data: pendingBlogs, refetch } = useGetPendingBlogsQuery(reporterId, {
    skip: !reporterId,
  });

  const totalBlogCount = pendingBlogs?.data?.length || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!headline || !description || !image) {
      toast.error('Please fill all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('reporterId', reporterId);
    formData.append('shopId', shopId);
    formData.append('MainHeadline', headline);
    formData.append('Subheadline', subHeadline);
    formData.append('Description', description);
    formData.append('image', image);

    try {
      await addBlogs(formData).unwrap();
      toast.success("Blog added successfully!");
      setHeadline('');
      setSubHeadline('');
      setDescription('');
      setImage(null);
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(id).unwrap();
        toast.success('Blog deleted successfully.');
        refetch();
      } catch (err) {
        toast.error('Failed to delete blog.');
      }
    }
  };

  const tabStatuses = ['Approved', 'Pending', 'Rejected'];

  return (
    <div className="p-4 sm:p-6">
      {/* Top Header and Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <p className="font-bold text-xl sm:text-2xl flex items-center">
          Total Blogs <span className="ml-2 text-gray-500">({totalBlogCount})</span>
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-2 sm:mt-0 px-4 sm:px-6 py-2 border rounded-lg bg-[#12294A] text-white text-sm sm:text-base"
        >
          Add Blog
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-gray-100 p-3 sm:p-4 rounded mb-6 flex justify-center sm:justify-start flex-wrap gap-4">

        {tabStatuses.map((tab) => {
          const count =
            pendingBlogs?.data?.filter(blog => blog.status?.toLowerCase() === tab.toLowerCase())?.length || 0;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 rounded text-[10px] sm:text-base flex items-center gap-2 ${activeTab === tab ? 'bg-[#12294A] text-white' : 'bg-white'}`}
            >
              {tab}
              <span
                className={`text-[6px] px-1 py-1 rounded-full sm:text-xs sm:px-2 ${activeTab === tab ? 'bg-white text-[#12294A]' : 'bg-[#12294A] text-white'}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Blog Cards */}
      <div>
        {pendingBlogs?.data?.filter(blog => blog.status.toLowerCase() === activeTab.toLowerCase())?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingBlogs.data
              .filter(blog => blog.status.toLowerCase() === activeTab.toLowerCase())
              .map((data, index) => (
                <div key={index} className="bg-white p-3 rounded shadow">
                  <img
                    src={data.image?.startsWith('http') ? data.image : `http://localhost:5000/${data.image}`}
                    alt="Blog"
                    className="w-full h-40 object-cover rounded"
                  />
                  <p className="text-xs italic mt-2 text-gray-500">
                    Updated on: {new Date(data.updatedAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                  <p className="font-semibold mt-2 line-clamp-2">{data.MainHeadline}</p>
                  <p className="text-sm text-gray-600">{data.Subheadline}</p>
                  <div className="flex justify-between items-end">
                    <p className="text-sm text-red-500 underline mt-4 cursor-pointer" onClick={() => setReadModalData(data)}>
                      Read More
                    </p>
                    <div className="flex gap-2">
                      <FaEdit size={20} className="text-blue-500 hover:text-blue-700 cursor-pointer" />
                      <MdDelete size={20} className="text-red-400 hover:text-black cursor-pointer" onClick={() => handleDelete(data._id)} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-10">No Data Found</div>
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md sm:max-w-md md:max-w-lg">
            <h2 className="text-xl font-bold mb-4">Add Blog</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Main Headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Subheadline"
                value={subHeadline}
                onChange={(e) => setSubHeadline(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded h-24 resize-none"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full"
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 bg-[#12294A] text-white rounded hover:bg-[#0e1f3a] transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Adding..." : "Add Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Blogs;
