"use client";
import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import ToastMessage from "@/components/dashboard/ToastMessage";
import { AlertColor } from "@mui/material";
import FormGenerator from "@/components/main/FormGenerator";
import ProductAdd from "@/components/AddModels/ProductAdd";
import SupplierAdd from "@/components/AddModels/SupplierAdd";
import VariationAdd from "@/components/AddModels/VariationAdd";
import VariationOptionAdd from "@/components/AddModels/VariationOptionAdd";
import AddIcon from "@mui/icons-material/Add";

interface StockAddModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productId?: string; // Optional product ID to pre-fill
}

interface FormData {
  product_id: string;
  quantity: string;
  web_price: string;
  pos_price: string;
  web_discount: string;
  pos_discount: string;
  supplier_id: string;
  image: File | null;
  cost: string;
  variation_id: string;
  variations: string[];
  purchase_date: string;
  alert_quantity: number;
  barcode: string;
}

interface Variation {
  id: number;
  name: string;
}

export default function StockAddModal({
  open,
  onClose,
  onSuccess,
  productId,
}: StockAddModalProps) {
  const [formData, setFormData] = useState<FormData>({
    product_id: productId || "",
    quantity: "",
    web_price: "",
    pos_price: "",
    web_discount: "",
    pos_discount: "",
    supplier_id: "",
    cost: "",
    variation_id: "",
    variations: [],
    image: null,
    purchase_date: new Date().toISOString().split("T")[0],
    alert_quantity: 10,
    barcode: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
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

  const [variation, setVariation] = useState<Variation[]>([]);
  const [variationOptions, setVariationOptions] = useState<Variation[]>([]);
  const [uiChange, setUiChange] = useState(1);

  // Modal states
  const [productModelOpen, setProductModelOpen] = useState(false);
  const [supplierModelOpen, setSupplierModelOpen] = useState(false);
  const [variationModelOpen, setVariationModelOpen] = useState(false);
  const [variationOptionModelOpen, setVariationOptionModelOpen] = useState(false);

  // Modal handlers
  const handleAddProductClick = () => setProductModelOpen(true);
  const handleAddSupplierClick = () => setSupplierModelOpen(true);
  const handleAddVariationClick = () => setVariationModelOpen(true);
  const handleAddVariationOptionClick = () => setVariationOptionModelOpen(true);

  const handleCloseProductModal = () => {
    setProductModelOpen(false);
    setUiChange((prev) => prev + 1);
  };

  const handleCloseSupplierModal = () => setSupplierModelOpen(false);
  const handleCloseVariationModal = () => setVariationModelOpen(false);
  const handleCloseVariationOptionModal = () => setVariationOptionModelOpen(false);

  // Success handlers
  const handleProductAddSuccess = () => {
    setProductModelOpen(false);
    setUiChange((prev) => prev + 1);
    setToast({
      open: true,
      message: "Product added successfully!",
      severity: "success",
    });
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleSupplierAddSuccess = () => {
    setSupplierModelOpen(false);
    setToast({
      open: true,
      message: "Supplier added successfully!",
      severity: "success",
    });
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleVariationAddSuccess = () => {
    setVariationModelOpen(false);
    loadVariations();
    setToast({
      open: true,
      message: "Variation added successfully!",
      severity: "success",
    });
  };

  const handleVariationOptionAddSuccess = () => {
    setVariationOptionModelOpen(false);
    if (formData.variation_id) {
      loadVariationOptions(parseInt(formData.variation_id, 10));
    }
    setToast({
      open: true,
      message: "Variation option added successfully!",
      severity: "success",
    });
  };

  // Load variations and options
  const loadVariations = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/variations`
      );
      const data = await response.json();
      setVariation(data.data);
    } catch (error) {
      console.error("Error fetching variations:", error);
    }
  };

  const loadVariationOptions = async (variationId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/variation-options?variation_id=${variationId}`
      );
      const data = await response.json();
      setVariationOptions(data.data);
    } catch (error) {
      console.error("Error fetching variation options:", error);
    }
  };

  useEffect(() => {
    if (open) {
      loadVariations();
      // Set product_id if provided
      if (productId) {
        setFormData((prev) => ({ ...prev, product_id: productId }));
      }
    }
  }, [open, productId]);

  const inputFields = [
    ...(productId
      ? []
      : [
          {
            name: "product_id",
            label: "Product",
            type: "selector",
            field: "selector",
            endPoint: "products?all-products",
          },
        ]),
    { name: "quantity", label: "Quantity", type: "number", field: "number" },
    { name: "web_price", label: "Web Price", type: "number", field: "number" },
    { name: "pos_price", label: "POS Price", type: "number", field: "number" },
    {
      name: "web_discount",
      label: "Web Discount",
      type: "number",
      field: "number",
    },
    {
      name: "pos_discount",
      label: "POS Discount",
      type: "number",
      field: "number",
    },
    {
      name: "supplier_id",
      label: "Supplier",
      type: "selector",
      field: "selector",
      endPoint: "suppliers",
    },
    {
      name: "purchase_date",
      label: "Purchase Date",
      type: "date",
      field: "date",
    },
    { name: "cost", label: "Cost", type: "number", field: "number" },
    { name: "alert_quantity", label: "Alert Quantity", type: "number", field: "number" },
    { name: "barcode", label: "Bar Code", type: "text", field: "text" },
    {
      name: "image",
      label: "Image",
      type: "file",
      field: "file",
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;

    if (
      e.target instanceof HTMLInputElement &&
      e.target.type === "file" &&
      e.target.files
    ) {
      setFormData({ ...formData, [name]: e.target.files[0] });
      return;
    }

    if (name === "variation_id") {
      const selectedVariationId = parseInt(value, 10);
      loadVariationOptions(selectedVariationId);
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleVariationOptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | SelectChangeEvent<string>
  ) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      variations: [value],
    }));
  };

  const handleSubmit = async () => {
    try {
      setToast({
        open: true,
        message: "Adding stock...",
        severity: "info",
      });

      if (
        !formData.product_id ||
        !formData.quantity ||
        !formData.web_price ||
        !formData.pos_price ||
        !formData.web_discount ||
        !formData.pos_discount ||
        !formData.supplier_id ||
        !formData.cost
      ) {
        setToast({
          open: true,
          message: "Please fill all the required fields",
          severity: "error",
        });
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("product_id", formData.product_id);
      formDataToSend.append("quantity", formData.quantity);
      formDataToSend.append("web_price", formData.web_price);
      formDataToSend.append("pos_price", formData.pos_price);
      formDataToSend.append("web_discount", formData.web_discount);
      formDataToSend.append("pos_discount", formData.pos_discount);
      formDataToSend.append("supplier_id", formData.supplier_id);
      formDataToSend.append("cost", formData.cost);
      formDataToSend.append("purchase_date", formData.purchase_date);
      formDataToSend.append("alert_quantity", String(formData.alert_quantity));
      formDataToSend.append("barcode", formData.barcode);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
      if (formData.variation_id) {
        formDataToSend.append("variation_id", formData.variation_id);
      }
      if (formData.variations && formData.variations.length > 0) {
        formData.variations.forEach((v, idx) => {
          formDataToSend.append(`variations[${idx}]`, v);
        });
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/stocks`,
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
          message: "Stock added successfully!",
          severity: "success",
        });

        // Reset form
        setFormData({
          product_id: productId || "",
          quantity: "",
          web_price: "",
          pos_price: "",
          web_discount: "",
          pos_discount: "",
          supplier_id: "",
          cost: "",
          variation_id: "",
          variations: [],
          image: null,
          purchase_date: new Date().toISOString().split("T")[0],
          alert_quantity: 10,
          barcode: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
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
          message: errorData.message || "Failed to add stock.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error adding stock:", error);
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
        aria-labelledby="stock-add-modal-title"
        aria-describedby="stock-add-modal-description"
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
            minWidth: 800,
            maxWidth: 1000,
            width: "90%",
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2
                className="text-xl font-bold text-gray-900"
                id="stock-add-modal-title"
              >
                Add New Stock
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
            {/* Add buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={handleAddProductClick}
                className="px-3 py-2 justify-center items-center flex gap-3 cursor-pointer bg-amber-400 text-white rounded-[8px] w-full sm:w-auto"
              >
                <AddIcon /> Add Product
              </button>
              <button
                onClick={handleAddSupplierClick}
                className="px-3 py-2 justify-center items-center flex gap-3 cursor-pointer bg-blue-400 text-white rounded-[8px] w-full sm:w-auto"
              >
                <AddIcon /> Add Supplier
              </button>
              <button
                onClick={handleAddVariationClick}
                className="px-3 py-2 justify-center items-center flex gap-3 cursor-pointer bg-green-400 text-white rounded-[8px] w-full sm:w-auto"
              >
                <AddIcon /> Add Variation
              </button>
              <button
                onClick={handleAddVariationOptionClick}
                className="px-3 py-2 justify-center items-center flex gap-3 cursor-pointer bg-purple-400 text-white rounded-[8px] w-full sm:w-auto"
              >
                <AddIcon /> Add Variation Option
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {uiChange === 1 ? inputFields.map((field) => (
                <FormGenerator
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  type={field.type}
                  value={formData[field.name as keyof FormData]}
                  onChange={handleChange}
                  endPoint={field.endPoint}
                />
              )) : inputFields.map((field) => (
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

              {/* Variation Selector */}
              <FormControl fullWidth>
                <InputLabel id="variation-label">Variation</InputLabel>
                <Select
                  labelId="variation-label"
                  id="variation-select"
                  value={formData.variation_id || ""}
                  name="variation_id"
                  label="Variation"
                  onChange={handleChange}
                  sx={{ minWidth: 120, height: 50, fontSize: 14 }}
                >
                  <MenuItem value="">
                    <em>Select Variation</em>
                  </MenuItem>
                  {variation.map((varItem) => (
                    <MenuItem key={varItem.id} value={varItem.id}>
                      {varItem.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Variation Option Selector */}
              <FormControl fullWidth>
                <InputLabel id="variation-option-label">Variation Option</InputLabel>
                <Select
                  labelId="variation-option-label"
                  id="variation-option-select"
                  value={formData.variations[0] || ""}
                  name="variation_option"
                  label="Variation Option"
                  onChange={handleVariationOptionChange}
                  disabled={!formData.variation_id}
                  sx={{ minWidth: 120, height: 50, fontSize: 14 }}
                >
                  <MenuItem value="">
                    <em>Select Variation Option</em>
                  </MenuItem>
                  {variationOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="outlined" onClick={onClose} fullWidth>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                fullWidth
                className="bg-[#53B175] hover:bg-[#4a9f68]"
              >
                Add Stock
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Product Add Modal */}
      <ProductAdd
        productModelOpen={productModelOpen}
        handleCloseUpdateModal={handleCloseProductModal}
        onUpdateSuccess={handleProductAddSuccess}
      />

      {/* Supplier Add Modal */}
      <SupplierAdd
        supplierModelOpen={supplierModelOpen}
        handleCloseAddModal={handleCloseSupplierModal}
        onAddSuccess={handleSupplierAddSuccess}
      />

      {/* Variation Add Modal */}
      <VariationAdd
        variationModelOpen={variationModelOpen}
        handleCloseAddModal={handleCloseVariationModal}
        onAddSuccess={handleVariationAddSuccess}
      />

      {/* Variation Option Add Modal */}
      <VariationOptionAdd
        variationOptionModelOpen={variationOptionModelOpen}
        handleCloseAddModal={handleCloseVariationOptionModal}
        onAddSuccess={handleVariationOptionAddSuccess}
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
