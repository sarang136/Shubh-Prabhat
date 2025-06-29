import React, { useState } from 'react';
import mb from '../assets/mb.png';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useGetAllNewsQuery, useDeleteNewsMutation, useUpdateNewsMutation } from '../Redux/post';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const TotalNews = () => {
  const { data: newsList, isLoading, isError } = useGetAllNewsQuery("6853b28ec12e9e89dc1cf37a");
  const [deleteNews] = useDeleteNewsMutation();
  const [updateNews] = useUpdateNewsMutation();
  const { user } = useSelector((state) => state.auth);
  const reporterId = user?.reporter?._id;

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const statusFilter = params.get("status");

  const [selectedNews, setSelectedNews] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editModalData, setEditModalData] = useState(null);

  const newsArray = Array.isArray(newsList)
    ? newsList
    : Array.isArray(newsList?.data)
    ? newsList.data
    : [];

  const filteredNews = statusFilter
    ? newsArray.filter(item => item.product?.status === statusFilter)
    : newsArray;

  const handleReadMore = (item) => {
    setSelectedNews(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedNews(null);
    setShowModal(false);
  };

  const handleDeleteNews = async (id) => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      try {
        await deleteNews(id).unwrap();
        toast.success("News deleted successfully!");
      } catch (error) {
        console.error("Delete failed:", error);
        toast.error("Something went wrong while deleting.");
      }
    }
  };

  const handleEdit = (item) => {
    const product = item.product || {};
    setEditModalData({
      _id: product._id,
      MainHeadline: product.MainHeadline || '',
      Subheadline: product.Subheadline || '',
      Description: product.Description || '',
      status: product.status || '',
    });
  };

  const handleEditChange = (e) => {
    setEditModalData({
      ...editModalData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...editModalData,
        reporterId,
      };
      await updateNews({ id: editModalData._id, updatedData }).unwrap();
      toast.success("News updated successfully!");
      setEditModalData(null);
    } catch (err) {
      toast.error("Update failed!");
      console.error(err);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-[#D9D9D980] min-h-screen font-marathi">
      {isLoading && <p>Loading news...</p>}
      {isError && <p>Something went wrong while fetching news.</p>}

      {filteredNews.length === 0 ? (
        <div className="text-center text-gray-600 font-medium text-lg mt-10">
          {statusFilter ? `No Data fetched.` : 'No news data found.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredNews.map((item, index) => (
            <div
              key={index}
              className="bg-[#FFFFFF9C] rounded shadow-md p-4 h-full max-h-[500px] overflow-y-scroll flex flex-col justify-between"
            >
              <div>
                <h1 className="text-sm text-[#0000006B] font-normal mb-2">
                  {item.subcategoryName}
                </h1>

                <img
                  src={item.product.image || mb}
                  alt="News Banner"
                  className="w-full h-[200px] mb-4 rounded object-cover"
                />

                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <h1>Uploaded On: {item.uploadedOn || 'Unknown Date'}</h1>
                  <h1>
                    <span className={`${item.statusColor || 'text-green-600'} font-medium`}>
                      {item.product.status || 'Published'}
                    </span>
                  </h1>
                </div>

                <h1 className="mb-2 font-normal text-xl">
                  {item.product.MainHeadline || 'Untitled News'}
                </h1>
              </div>

              <div className="flex justify-between items-center mt-auto pt-4">
                <button
                  onClick={() => handleReadMore(item)}
                  className="text-red-600 border-b border-red-400 hover:text-red-700"
                >
                  Read More
                </button>

                <div className="flex gap-4 text-xl">
                  <FaEdit
                    className="text-blue-500 hover:text-blue-700 cursor-pointer"
                    title="Update"
                    onClick={() => handleEdit(item)}
                  />
                  <FaTrash
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    title="Delete"
                    onClick={() => handleDeleteNews(item.product._id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Read More Modal */}
      {showModal && selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] md:w-[60%] lg:w-[50%] max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-4 text-2xl text-gray-600 hover:text-red-600"
            >
              &times;
            </button>

            <h2 className="text-lg font-bold mb-2">
              {selectedNews?.product?.MainHeadline || 'No Title'}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {selectedNews?.product?.Subheadline}
            </p>

            <img
              src={selectedNews.product.image || mb}
              alt="Modal Banner"
              className="w-full rounded mb-4 max-h-[400px] object-contain"
            />

            <p className="text-base text-black leading-relaxed whitespace-pre-line">
              {selectedNews?.product?.Description || 'सविस्तर बातमी लवकरच उपलब्ध होईल.'}
            </p>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] md:w-[60%] lg:w-[40%] max-h-[90vh] overflow-y-auto relative space-y-4">
            <h2 className="text-lg font-bold text-center">Edit News</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <input
                type="text"
                name="MainHeadline"
                value={editModalData.MainHeadline}
                onChange={handleEditChange}
                className="w-full border p-2 rounded"
                placeholder="Main Headline"
              />
              <input
                type="text"
                name="Subheadline"
                value={editModalData.Subheadline}
                onChange={handleEditChange}
                className="w-full border p-2 rounded"
                placeholder="Subheadline"
              />
              <textarea
                name="Description"
                value={editModalData.Description}
                onChange={handleEditChange}
                className="w-full border p-2 rounded h-32 resize-none"
                placeholder="Description"
              />
              <input
                type="text"
                name="status"
                value={editModalData.status}
                onChange={handleEditChange}
                className="w-full border p-2 rounded"
                placeholder="Status (e.g., Published)"
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setEditModalData(null)}
                  className="border px-4 py-2 rounded text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#12294A] text-white px-6 py-2 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TotalNews;
