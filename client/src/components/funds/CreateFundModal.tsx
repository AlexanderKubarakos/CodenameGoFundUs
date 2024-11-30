import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateFundForm from "./CreateFundForm";

interface CreateFundFormData {
  name: string;
  description: string;
  isPublic: boolean;
  approvalType: "1/2" | "1/3" | "majority" | "none" | "variable";
  approvalThreshold?: number;
}

interface CreateFundModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: CreateFundFormData) => void;
  isLoading?: boolean;
}

const CreateFundModal = ({
  isOpen = true,
  onOpenChange = () => console.log("Modal state changed"),
  onSubmit = (data) => console.log("Form submitted:", data),
  isLoading = false,
}: CreateFundModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background sm:max-w-[600px] h-[700px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Create New Fund
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <CreateFundForm
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFundModal;
