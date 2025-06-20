import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload } from 'react-icons/fi';
import {
  useGetAllCategoriesQuery,
  useGetAllSubCategoriesQuery,
  useAddNewsMutation,
} from '../Redux/post';

const News = () => {
  const navigate = useNavigate();

  const { data: categoryData, isLoading, isError } = useGetAllCategoriesQuery("6853b28ec12e9e89dc1cf37a");
  const { data: subCategoriesData } = useGetAllSubCategoriesQuery("6853b28ec12e9e89dc1cf37a");
  const [addNews] = useAddNewsMutation();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(""); 
  const [headline, setHeadline] = useState("");
  const [subHeadline, setSubHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const serviceId = "68513056fa94f06bda5bbc45";
  const reporterId = "6853b28ec12e9e89dc1cf37a";

  const categories = Array.isArray(categoryData) ? categoryData : [];
  const subCategories = Array.isArray(subCategoriesData?.subcategories) ? subCategoriesData?.subcategories : [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory || !selectedSubCategoryId || !headline || !description || !image) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("serviceId", serviceId);
    formData.append("subcategoryId", selectedSubCategoryId);
    formData.append("MainHeadline", headline);
    formData.append("Subheadline", subHeadline);
    formData.append("Description", description);
    formData.append("reporterId", reporterId);
    formData.append("image", image);

    try {
      await addNews(formData).unwrap();
      navigate('/dashboard');
    } catch (error) {
      console.error("Failed to add news:", error);
      alert("Something went wrong while adding the news.");
    }
  };

  return (
    <div className='p-6 bg-gray-100 font-marathi min-h-screen flex justify-center'>
      <div className='w-full max-w-xl bg-white p-6 shadow-md'>
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className='flex gap-4'>
            <select
              name="category"
              className="w-full p-3 border rounded"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="" disabled>Select Category</option>
              {categories.map((item) => (
                <option key={item._id} value={item.name}>{item.name}</option>
              ))}
            </select>

            <select
              name="subcategory"
              className="w-full p-3 border rounded"
              value={selectedSubCategoryId}
              onChange={(e) => setSelectedSubCategoryId(e.target.value)}
            >
              <option value="" disabled>Select Sub Category</option>
              {subCategories.map((item) => (
                <option key={item._id} value={item._id}>{item.name}</option> // sending ID
              ))}
            </select>
          </div>

          <div className='flex gap-4'>
            <input
              type="text"
              name="headline"
              placeholder="Main Headline"
              className="w-full p-3 border rounded"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
            <input
              type="text"
              name="subHeadline"
              placeholder="Sub Headline"
              className="w-full p-3 border rounded"
              value={subHeadline}
              onChange={(e) => setSubHeadline(e.target.value)}
            />
          </div>

          <div className='flex gap-4'>
            <textarea
              name="description"
              placeholder="Description"
              className="w-full h-28 p-3 border rounded resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label className="w-full h-28 border rounded flex items-center justify-center cursor-pointer bg-white text-gray-600 hover:text-blue-800">
              <FiUpload className="text-2xl mr-2" />
              <span>Upload Image</span>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          </div>

          <div className='text-center'>
            <button type="submit" className="bg-[#12294A] text-white px-6 py-2 rounded hover:bg-[#0e1f3a]">
              + Add News
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default News;
