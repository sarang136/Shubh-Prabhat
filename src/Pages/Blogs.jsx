import React, { useState } from 'react';
import {
  useAddBlogsMutation,
  useGetPendingBlogsQuery,
  useDeleteBlogMutation,
  useUpdateBlogMutation
} from '../Redux/post';
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
  const shopId = auth?.user?.shop?._id;

  const [addBlogs] = useAddBlogsMutation();
  const [deleteBlog] = useDeleteBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const { data: pendingBlogs } = useGetPendingBlogsQuery(reporterId, {
    skip: !reporterId,
  });

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
      setIsModalOpen(false);
      setHeadline('');
      setSubHeadline('');
      setDescription('');
      setImage(null);
      toast.success("Blog added successfully!");
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(id).unwrap();
        toast.success('Blog deleted successfully.');
      } catch (err) {
        toast.error('Failed to delete blog.');
      }
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBlog.MainHeadline || !selectedBlog.Description) {
      toast.error("Please fill required fields.");
      return;
    }

    const updatedData = {
      MainHeadline: selectedBlog.MainHeadline,
      Subheadline: selectedBlog.Subheadline,
      Description: selectedBlog.Description,
    };

    if (selectedBlog.newImage) {
      const base64Image = await toBase64(selectedBlog.newImage);
      updatedData.image = base64Image;
    }

    try {
      await updateBlog({ id: selectedBlog._id, updatedData }).unwrap();
      toast.success("Blog updated successfully!");
      setIsUpdateModalOpen(false);
      setSelectedBlog(null);
    } catch (err) {
      toast.error("Update failed.");
    }
  };

  const tabStatuses = ['Approved', 'Pending', 'Rejected'];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <p className="font-bold text-2xl flex items-center">Total Blogs</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 border rounded-lg bg-[#12294A] text-white"
        >
          Add Blog
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded mb-6 flex gap-4">
        {tabStatuses.map((tab) => {
          const count =
            pendingBlogs?.data?.filter(blog => blog.status?.toLowerCase() === tab.toLowerCase())?.length || 0;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded flex items-center gap-2 ${activeTab === tab ? 'bg-[#12294A] text-white' : 'bg-white'}`}
            >
              {tab}
              <span className={`text-xs px-2 py-1 rounded-full ${activeTab === tab ? 'bg-white text-[#12294A]' : 'bg-[#12294A] text-white'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div>
        {pendingBlogs?.data?.filter(blog => blog.status.toLowerCase() === activeTab.toLowerCase())?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pendingBlogs.data
              .filter(blog => blog.status.toLowerCase() === activeTab.toLowerCase())
              .map((data, index) => (
                <div key={index} className="bg-white p-3 rounded shadow">
                  <img
                    src={data.image?.startsWith('http') ? data.image : `http://localhost:5000/${data.image}`}
                    alt="Blog"
                    className="w-full h-40 object-cover rounded"
                  />
                  <p className="text-[12px] italic mt-2">
                    Updated on: {new Date(data.updatedAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                  <p className="font-semibold mt-2">{data.MainHeadline}</p>
                  <p className="text-sm text-gray-600">{data.Subheadline}</p>
                  <div className="flex justify-between items-end">
                    <p className="text-sm text-red-500 underline mt-4 cursor-pointer" onClick={() => setReadModalData(data)}>
                      Read More
                    </p>
                    <div className="flex gap-2">
                      <FaEdit
                        size={20}
                        onClick={() => {
                          setSelectedBlog({ ...data, newImage: null });
                          setIsUpdateModalOpen(true);
                        }}
                        className="text-blue-500 hover:text-blue-700 cursor-pointer"
                      />
                      <MdDelete
                        size={20}
                        onClick={() => handleDelete(data._id)}
                        className="text-red-400 hover:text-black cursor-pointer"
                      />
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">Add Blog</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Main Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} className="w-full p-2 border rounded" />
              <input type="text" placeholder="Subheadline" value={subHeadline} onChange={(e) => setSubHeadline(e.target.value)} className="w-full p-2 border rounded" />
              <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded h-24 resize-none" />
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full" />
              <div className="flex justify-between">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-[#12294A] text-white rounded hover:bg-[#0e1f3a]">Add Blog</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {isUpdateModalOpen && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">Update Blog</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <input type="text" value={selectedBlog.MainHeadline} onChange={(e) => setSelectedBlog({ ...selectedBlog, MainHeadline: e.target.value })} className="w-full p-2 border rounded" />
              <input type="text" value={selectedBlog.Subheadline} onChange={(e) => setSelectedBlog({ ...selectedBlog, Subheadline: e.target.value })} className="w-full p-2 border rounded" />
              <textarea value={selectedBlog.Description} onChange={(e) => setSelectedBlog({ ...selectedBlog, Description: e.target.value })} className="w-full p-2 border rounded h-24 resize-none" />
              <input type="file" accept="image/*" onChange={(e) => setSelectedBlog({ ...selectedBlog, newImage: e.target.files[0] })} className="w-full" />
              <div className="flex justify-between">
                <button type="button" onClick={() => setIsUpdateModalOpen(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-[#12294A] text-white rounded hover:bg-[#0e1f3a]">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Read More Modal */}
      {readModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full space-y-4 overflow-y-scroll max-h-[70vh]">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{readModalData.MainHeadline}</h2>
              <button onClick={() => setReadModalData(null)} className="text-xl text-gray-500 hover:text-black">&times;</button>
            </div>
            <p className="text-gray-700">{readModalData.Subheadline}</p>
            <img src={readModalData.image?.startsWith('http') ? readModalData.image : `http://localhost:5000/${readModalData.image}`} alt="Blog Full" className="w-full object-contain max-h-[400px] rounded" />
            <p className="text-[14px] italic text-gray-500">
              Uploaded on: {new Date(readModalData.updatedAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
            <p className="text-base text-gray-800">{readModalData.Description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
