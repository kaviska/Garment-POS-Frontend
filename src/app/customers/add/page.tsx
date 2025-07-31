"use client";
import Title from "@/components/main/Title";
import { useState } from "react";
import ToastMessage from "@/components/dashboard/ToastMessage";
import FormGenerator from "@/components/main/FormGenerator";
import { AlertColor } from "@mui/material";

interface CustomerFormData {
  name: string;
  email: string;
  mobile: string;
  postal_code: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
}

export default function AddCustomer() {
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    email: "",
    mobile: "",
    postal_code: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
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
    { name: "name", label: "Name", type: "text", field: "text" },
    { name: "email", label: "Email", type: "email", field: "text" },
    { name: "mobile", label: "Mobile", type: "text", field: "text" },
    { name: "postal_code", label: "Postal Code", type: "text", field: "text" },
    { name: "address_line_1", label: "Address Line 1", type: "text", field: "text" },
    { name: "address_line_2", label: "Address Line 2", type: "text", field: "text" },
    { name: "city", label: "City", type: "text", field: "text" },
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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.email || !formData.mobile) {
      setToast({
        open: true,
        message: "Please fill all required fields",
        severity: "error",
      });
      return;
    }

    try {
      setToast({
        open: true,
        message: "Adding customer...",
        severity: "info",
      });

      const payload = {
        ...formData,
        password: "Malidunew@123",
        password_confirmation: "Malidunew@123",
        device_name: "web",
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setToast({
          open: true,
          message: "Customer added successfully!",
          severity: "success",
        });
        setFormData({
          name: "",
          email: "",
          mobile: "",
          postal_code: "",
          address_line_1: "",
          address_line_2: "",
          city: "",
        });
      } else {
        const errorData = await response.json();
        setToast({
          open: true,
          message: errorData.message || "Failed to add customer.",
          severity: "error",
        });
      }
    } catch (error) {
      setToast({
        open: true,
        message: "An error has occurred",
        severity: "error",
      });
    }
  };

  return (
    <div>
      <Title
        title="Add Customer"
        breadCrumbs={[
          { label: "Customers", href: "/customers" },
        ]}
        active="Add Customer"
      />

      <div className="mt-7">
        <div className="grid grid-cols-2 cols-1 gap-6">
          {inputFields.map((field) => (
            <FormGenerator
              key={field.name}
              name={field.name}
              label={field.label}
              type={field.type}
              value={formData[field.name as keyof CustomerFormData]}
              onChange={handleChange}
            />
          ))}
        </div>
        <div className="mt-5 flex gap-3">
          <button
            className="px-3 py-3 rounded-[6px] w-full bg-[#53B175] cursor-pointer text-white"
            onClick={handleSubmit}
          >
            Add Customer
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
