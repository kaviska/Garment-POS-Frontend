"use client";
import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import ToastMessage from "@/components/dashboard/ToastMessage";
import { AlertColor } from "@mui/material";
import FormGenerator from "@/components/main/FormGenerator";
import { SelectChangeEvent } from "@mui/material/Select";

interface MaterialAddModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  description: string;
  type: string;
  unit: string;
  cost: string;
  quantity: string;
  supplier: string;
  gsm: string;
  color: string;
  image: File | null;
}

export default function MaterialAddModal({
  open,
  onClose,
  onSuccess,
}: MaterialAddModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    type: "",
    unit: "",
    cost: "",
    quantity: "",
    supplier: "",
    gsm: "",
    color: "",
    image: null,
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

  const inputFields = [
    { name: "name", label: "Material Name", type: "text", field: "text" },
    {
      name: "description",
      label: "Description",
      type: "text",
      field: "textArea",
    },
    { name: "type", label: "Type", type: "text", field: "text" },
    {
      name: "unit",
      label: "Unit",
      type: "selector",
      field: "selector",
      endPoint: "units",
    },
    { name: "cost", label: "Cost", type: "number", field: "number" },
    { name: "quantity", label: "Quantity", type: "number", field: "number" },
    { name: "supplier", label: "Supplier", type: "text", field: "text" },
    { name: "gsm", label: "GSM", type: "text", field: "text" },
    { name: "color", label: "Color", type: "text", field: "text" },
    {
      name: "image",
      label: "Material Image",
      type: "file",
      field: "file",
    },
  ];

  const handleChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | SelectChangeEvent
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
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      setToast({
        open: true,
        message: "Adding material...",
        severity: "info",
      });

      if (!formData.name) {
        setToast({
          open: true,
          message: "Material name is required",
          severity: "error",
        });
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("unit", formData.unit);
      formDataToSend.append("cost", formData.cost);
      formDataToSend.append("quantity", formData.quantity);
      formDataToSend.append("supplier", formData.supplier);
      formDataToSend.append("gsm", formData.gsm);
      formDataToSend.append("color", formData.color);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/materials`,
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
          message: "Material added successfully!",
          severity: "success",
        });

        // Reset form
        setFormData({
          name: "",
          description: "",
          type: "",
          unit: "",
          cost: "",
          quantity: "",
          supplier: "",
          gsm: "",
          color: "",
          image: null,
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
          message: errorData.message || "Failed to add material.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error adding material:", error);
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
        aria-labelledby="material-add-modal-title"
        aria-describedby="material-add-modal-description"
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
                id="material-add-modal-title"
              >
                Add New Material
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
                className="bg-[#53B175] hover:bg-[#4a9f68]"
              >
                Add Material
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      <ToastMessage
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.severity}
      />
    </>
  );
}
