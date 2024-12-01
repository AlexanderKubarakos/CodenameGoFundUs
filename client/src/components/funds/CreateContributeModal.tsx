import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateContributeForm, { CreateContributeFormData } from "./CreateContributeForm";

interface CreateContributeModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  fundName?: string;
  onSubmit?: (data: CreateContributeFormData) => void;
  isLoading?: boolean;
}

const CreateContributeModal = ({
  isOpen = true,
  onOpenChange = () => console.log("Modal state changed"),
  fundName = "Example Fund",
  onSubmit = (data) => console.log("Contribution submitted:", data),
  isLoading = false,
}: CreateContributeModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background sm:max-w-[500px] h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Contribute to Fund
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <CreateContributeForm
            fundName={fundName}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContributeModal;