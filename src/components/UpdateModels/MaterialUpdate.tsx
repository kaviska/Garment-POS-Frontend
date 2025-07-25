import React, { useEffect, useState } from "react";
import { Modal, Box, Button, Typography, AlertColor, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FormGenerator from "@/components/main/FormGenerator";
import ToastMessage from "@/components/dashboard/ToastMessage";

interface Material {
  id: number | string;
  name: string;
  description: string;
  type: string;
  unit: string;
  cost: string;
  quantity: string;
  supplier: string;
  gsm: string;
  color: string;
  image?: string | File | null;
}

interface UpdateProps {
  materialModelOpen: boolean;
  handleCloseUpdateModal: () => void;
  initialData: Material | null;
  onUpdateSuccess: () => void;
}

export default function MaterialUpdate({
  materialModelOpen,
  handleCloseUpdateModal,
  initialData,
  onUpdateSuccess,
}: UpdateProps) {
  const [formData, setFormData] = useState<Material>({
    id: "",
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

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || "",
        name: initialData.name || "",
        description: initialData.description || "",
        type: initialData.type || "",
        unit: initialData.unit || "",
        cost: initialData.cost || "",
        quantity: initialData.quantity || "",
        supplier: initialData.supplier || "",
        gsm: initialData.gsm || "",
        color: initialData.color || "",
        image: initialData.image || null,
      });
    }
  }, [initialData, materialModelOpen]);

  const inputFields = [
    { name: "name", label: "Material Name", type: "text", field: "text" },
    { name: "description", label: "Description", type: "text", field: "textArea" },
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
      preview: typeof initialData?.image === "string" ? initialData?.image : undefined,
    },
  ];

  const handleChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;

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

  const handleUpdate = async () => {
    try {
      setToast({
        open: true,
        message: "Updating material...",
        severity: "info",
      });

      if (!initialData) return;

      const formDataToSend = new FormData();
      formDataToSend.append("id", String(formData.id));

      // Only send changed fields
      if (formData.name !== initialData.name) {
        formDataToSend.append("name", formData.name);
      }
      if (formData.description !== initialData.description) {
        formDataToSend.append("description", formData.description);
      }
      if (formData.type !== initialData.type) {
        formDataToSend.append("type", formData.type);
      }
      if (formData.unit !== initialData.unit) {
        formDataToSend.append("unit", formData.unit);
      }
      if (formData.cost !== initialData.cost) {
        formDataToSend.append("cost", formData.cost);
      }
      if (formData.quantity !== initialData.quantity) {
        formDataToSend.append("quantity", formData.quantity);
      }
      if (formData.supplier !== initialData.supplier) {
        formDataToSend.append("supplier", formData.supplier);
      }
      if (formData.gsm !== initialData.gsm) {
        formDataToSend.append("gsm", formData.gsm);
      }
      if (formData.color !== initialData.color) {
        formDataToSend.append("color", formData.color);
      }

      // If image changed or is a new file
      if (
        formData.image instanceof File ||
        (typeof formData.image === "string" &&
          formData.image !== initialData.image)
      ) {
        formDataToSend.append("image", formData.image as File);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/materials/update`,
        {
          method: "POST",
          body: formDataToSend,
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        setToast({
          open: true,
          message: "Material updated successfully!",
          severity: "success",
        });
        handleCloseUpdateModal();
        onUpdateSuccess();
      } else {
        const errorData = await response.json();
        setToast({
          open: true,
          message: errorData.message || "Failed to update material.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error updating material:", error);
      setToast({
        open: true,
        message: "An error has occurred",
        severity: "error",
      });
    }
  };

  return (
    <div>
      <Modal open={materialModelOpen} onClose={handleCloseUpdateModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            maxHeight: "80vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {/* Close Icon */}
          <IconButton
            aria-label="close"
            onClick={handleCloseUpdateModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
              zIndex: 10,
            }}
            size="large"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Update Material
          </Typography>
          <div className="grid grid-cols-1 gap-8">
            {inputFields.map((field) => (
              <FormGenerator
                key={field.name}
                name={field.name}
                label={field.label}
                type={field.type}
                value={
                  field.type === "file"
                    ? undefined
                    : formData[field.name as keyof Material]
                }
                onChange={handleChange}
                endPoint={field.endPoint}
                previewUpadte={String(field.preview) || ""}
              />
            ))}
          </div>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleUpdate}
            sx={{ mt: 2 }}
          >
            Update Material
          </Button>
        </Box>
      </Modal>
      <ToastMessage
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.severity}
      />
    </div>
  );
}
