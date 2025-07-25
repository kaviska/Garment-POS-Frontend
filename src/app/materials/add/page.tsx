"use client";
import Title from "@/components/main/Title";
import { useState } from "react";
import ToastMessage from "@/components/dashboard/ToastMessage";
import FormGenerator from "@/components/main/FormGenerator";
import { AlertColor } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

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

export default function Add() {
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
    <div className="">
      <Title
        title="Create Material"
        breadCrumbs={[
          { label: "Material", href: "/material" },
          { label: "Materials", href: "/material" },
        ]}
        active="add material"
      />

      <div className="mt-7">
        <div className="grid grid-cols-2 cols-1 gap-6">
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
        <div className="mt-5">
          <button
            className="px-3 py-3 rounded-[6px] w-full bg-[#53B175] cursor-pointer text-white"
            onClick={handleSubmit}
          >
            Add Material
          </button>
        </div>
      </div>

      <ToastMessage
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.severity}
      />
    </div>
  );
}
