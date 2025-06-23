import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useSelector } from "react-redux";
import {
  useGetAllCategoriesQuery,
  useGetAllSubCategoriesQuery,
} from "../Redux/Categories";
import { useAddNewsMutation } from "../Redux/newsAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddNewsForm = ({ buttonLabel = "+ Add News", defaultValues = {} }) => {
  const { data: categoryData = [] } = useGetAllCategoriesQuery();
  const [selectedCategoryId, setSelectedCategoryId] = useState(defaultValues.serviceId || "");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(defaultValues.subcategoryId || "");
  const [mainHeadline, setMainHeadline] = useState(defaultValues.MainHeadline || "");
  const [subheadline, setSubheadline] = useState(defaultValues.Subheadline || "");
  const [description, setDescription] = useState(defaultValues.Description || "");
  const [imageFile, setImageFile] = useState(null);

  const auth = useSelector((state) => state.auth);
  const reporterId = auth?.user?.reporter?._id;

  const { data: subCategoryData, isFetching } = useGetAllSubCategoriesQuery(
    selectedCategoryId,
    { skip: !selectedCategoryId }
  );
  const subcategories = subCategoryData?.product?.subcategories || [];

  const [addNews, { isLoading }] = useAddNewsMutation();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedCategoryId ||
      !selectedSubCategoryId ||
      !mainHeadline ||
      !subheadline ||
      !description ||
      !imageFile ||
      !reporterId
    ) {
      alert("Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("serviceId", selectedCategoryId);
    formData.append("subcategoryId", selectedSubCategoryId);
    formData.append("MainHeadline", mainHeadline);
    formData.append("Subheadline", subheadline);
    formData.append("Description", description);
    formData.append("image", imageFile);
    formData.append("reporterId", reporterId); 

    try {
      await addNews(formData).unwrap();
      toast.success("News added successfully!");
      navigate("/totalnews");
      setSelectedCategoryId("");
      setSelectedSubCategoryId("");
      setMainHeadline("");
      setSubheadline("");
      setDescription("");
      setImageFile(null);
    } catch (error) {
      console.error("Failed to add news:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-tiro py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 md:p-10 rounded shadow-md w-full sm:w-10/12 lg:w-6/12 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
        encType="multipart/form-data"
      >
        <select
          value={selectedCategoryId}
          onChange={(e) => {
            setSelectedCategoryId(e.target.value);
            setSelectedSubCategoryId("");
          }}
          className="border border-gray-300 p-2 rounded"
        >
          <option value="">Select Category</option>
          {categoryData.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={selectedSubCategoryId}
          onChange={(e) => setSelectedSubCategoryId(e.target.value)}
          className="border border-gray-300 p-2 rounded"
          disabled={!selectedCategoryId || isFetching}
        >
          <option value="">
            {isFetching ? "Loading Subjects..." : "Select Subject"}
          </option>
          {subcategories.length > 0 ? (
            subcategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))
          ) : (
            !isFetching && <option disabled>No subjects available</option>
          )}
        </select>

        <input
          type="text"
          placeholder="Main Headline"
          value={mainHeadline}
          onChange={(e) => setMainHeadline(e.target.value)}
          className="border border-gray-300 p-2 rounded col-span-1"
        />

        <input
          type="text"
          placeholder="Subheadline"
          value={subheadline}
          onChange={(e) => setSubheadline(e.target.value)}
          className="border border-gray-300 p-2 rounded col-span-1"
        />

        <textarea
          rows="4"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 p-2 rounded col-span-1 md:col-span-2 resize-none"
        ></textarea>

        <label className="border border-gray-300 p-4 rounded flex flex-col items-center justify-center cursor-pointer h-full overflow-hidden col-span-1 md:col-span-2">
          <FiUpload className="mb-2 text-gray-500" size={20} />
          <span className="text-gray-500 text-sm">
            {imageFile ? imageFile.name : "Upload Image"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="hidden"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className={`col-span-1 md:col-span-2 bg-[#12294A] text-white px-4 py-2 rounded transition ${
            isLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#0e1f3a]"
          }`}
        >
          {isLoading ? "Adding..." : buttonLabel}
        </button>
      </form>
    </div>
  );
};

export default AddNewsForm;
