import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CreateFundButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

const CreateFundButton = ({
  onClick = () => console.log("Create fund clicked"),
  disabled = false,
}: CreateFundButtonProps) => {
  return (
    <div className="bg-background">
      <Button
        size="lg"
        className="w-[200px] h-[48px] flex items-center gap-2"
        onClick={onClick}
        disabled={disabled}
      >
        <Plus className="h-5 w-5" />
        <span className="font-medium">Create Fund</span>
      </Button>
    </div>
  );
};

export default CreateFundButton;
