import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpRight } from "lucide-react";

interface CreateContributeFormProps {
  fundName?: string;
  onSubmit?: (data: CreateContributeFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export interface CreateContributeFormData {
  amount: string;
  contributorName: string;
  message: string;
}

const CreateContributeForm = ({
  fundName = "Example Fund",
  onSubmit = (data) => console.log("Contribution submitted:", data),
  onCancel = () => console.log("Contribution cancelled"),
  isLoading = false,
}: CreateContributeFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateContributeFormData>({
    defaultValues: {
      amount: "",
      contributorName: "",
      message: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-background w-[440px] space-y-6 p-6"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Fund</Label>
            <span className="text-sm text-muted-foreground">{fundName}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Contribution Amount</Label>
          <div className="relative">
            <Input
              id="amount"
              type="text"
              placeholder="0.00"
              {...register("amount", { required: "Amount is required" })}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              STRK
            </span>
          </div>
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contributorName">Contributor Name</Label>
          <Input
            id="contributorName"
            placeholder="Your name"
            {...register("contributorName", {
              required: "Contributor name is required",
            })}
          />
          {errors.contributorName && (
            <p className="text-sm text-red-500">
              {errors.contributorName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Add an optional message..."
            className="resize-none h-24"
            {...register("message")}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <ArrowUpRight className="h-4 w-4" />
          {isLoading ? "Processing..." : "Contribute"}
        </Button>
      </div>
    </form>
  );
};

export default CreateContributeForm;
