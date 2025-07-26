"use client";
import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import ToastMessage from "@/components/dashboard/ToastMessage";
import { AlertColor } from "@mui/material";
import FormGenerator from "@/components/main/FormGenerator";
import BrandAdd from "@/components/AddModels/BrandAdd";
import CategoryAdd from "@/components/AddModels/CategoryAdd";
import AddIcon from "@mui/icons-material/Add";

interface ProductAddModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  slug: string;
  description: string;
  category_id: string;
  brand_id: string;
  primary_image: File | null;
}

// Function to generate slug
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export default function ProductAddModal({
  open,
  onClose,
  onSuccess,
}: ProductAddModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    slug: "",
    description: "",
    category_id: "",
    brand_id: "",
    primary_image: null,
  });

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const [brandModelOpen, setBrandModelOpen] = useState(false);
  const [categoryModelOpen, setCategoryModelOpen] = useState(false);

  const handleAddBrandClick = () => setBrandModelOpen(true);
  const handleAddCategoryClick = () => setCategoryModelOpen(true);

  const handleCloseBrandModal = () => setBrandModelOpen(false);
  const handleCloseCategoryModal = () => setCategoryModelOpen(false);

  const handleBrandAddSuccess = () => {
    setBrandModelOpen(false);
    setToast({
      open: true,
      message: "Brand added successfully!",
      severity: "success",
    });
    // Refresh the form to reload brands
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleCategoryAddSuccess = () => {
    setCategoryModelOpen(false);
    setToast({
      open: true,
      message: "Category added successfully!",
      severity: "success",
    });
    // Refresh the form to reload categories
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const inputFields = [
    { name: "name", label: "Product Name", type: "text", field: "text" },
    { name: "slug", label: "Product Slug", type: "text", field: "text" },
    {
      name: "description",
      label: "Description",
      type: "text",
      field: "textArea",
    },
    {
      name: "category_id",
      label: "Category",
      type: "selector",
      filed: "Selector",
      endPoint: "categories?limit=100000",
    },
    {
      name: "brand_id",
      label: "Brand",
      type: "selector",
      filed: "Selector",
      endPoint: "brands?limit=100000",
    },
    {
      name: "primary_image",
      label: "Primary Image",
      type: "file",
      field: "file",
    },
  ];

  const handleChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;

    if (
      e.target instanceof HTMLInputElement &&
      e.target.type === "file" &&
      e.target.files
    ) {
      setFormData({ ...formData, [name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Automatically generate slug when the product name changes
  useEffect(() => {
    if (formData.name) {
      const slug = generateSlug(formData.name);
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.name]);

  const handleSubmit = async () => {
    try {
      setToast({
        open: true,
        message: "Adding product...",
        severity: "info",
      });

      if (
        !formData.name ||
        !formData.slug ||
        !formData.description ||
        !formData.category_id ||
        !formData.brand_id
      ) {
        setToast({
          open: true,
          message: "Please fill all the required fields",
          severity: "error",
        });
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("slug", formData.slug);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category_id", formData.category_id);
      formDataToSend.append("brand_id", formData.brand_id);
      formDataToSend.append("type", "variant"); // Always send "variant"
      formDataToSend.append("web_availability", "true"); // Always send "true"

      if (formData.primary_image) {
        formDataToSend.append("primary_image", formData.primary_image);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/products`,
        {
          method: "POST",
          body: formDataToSend,
          headers: {
            Authorization:
              "Bearer 3|85MPD3fuiEGXIJYlvgV0PCOhLPVEzLL2JBBJl349f9ff23f6",
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        setToast({
          open: true,
          message: "Product added successfully!",
          severity: "success",
        });

        // Reset form
        setFormData({
          name: "",
          slug: "",
          description: "",
          category_id: "",
          brand_id: "",
          primary_image: null,
        });

        // Close modal and trigger success callback
        setTimeout(() => {
          onClose();
          onSuccess();
        }, 1500);
      } else {
        const errorData = await response.json();
        setToast({
          open: true,
          message: errorData.message || "Failed to add product.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setToast({
        open: true,
        message: "An error has occurred",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="product-add-modal-title"
        aria-describedby="product-add-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 0,
            minWidth: 600,
            maxWidth: 800,
            width: "90%",
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2
                className="text-xl font-bold text-gray-900"
                id="product-add-modal-title"
              >
                Add New Product
              </h2>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                onClick={onClose}
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Add Brand and Category buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={handleAddBrandClick}
                className="px-3 py-2 justify-center items-center flex gap-3 cursor-pointer bg-pink-400 text-white rounded-[8px] w-full sm:w-auto"
              >
                <AddIcon /> Add Brand
              </button>
              <button
                onClick={handleAddCategoryClick}
                className="px-3 py-2 justify-center items-center flex gap-3 cursor-pointer bg-teal-400 text-white rounded-[8px] w-full sm:w-auto"
              >
                <AddIcon /> Add Category
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {inputFields.map((field) => (
                <FormGenerator
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  type={field.type}
                  value={formData[field.name as keyof FormData]}
                  onChange={handleChange}
                  endPoint={field.endPoint}
                />
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="outlined" onClick={onClose} fullWidth>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                fullWidth
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Product
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Brand Add Modal */}
      <BrandAdd
        brandModelOpen={brandModelOpen}
        handleCloseAddModal={handleCloseBrandModal}
        onAddSuccess={handleBrandAddSuccess}
      />

      {/* Category Add Modal */}
      <CategoryAdd
        categoryModelOpen={categoryModelOpen}
        handleCloseAddModal={handleCloseCategoryModal}
        onAddSuccess={handleCategoryAddSuccess}
      />

      <ToastMessage
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.severity}
      />
    </>
  );
}
