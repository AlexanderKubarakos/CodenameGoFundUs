import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CreateFundFormProps {
  onSubmit?: (data: CreateFundFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export interface CreateFundFormData {
  name: string;
  description: string;
  isPublic: boolean;
  approvalType: "none" | "majority" | "custom";
  approvalThreshold?: number;
}

const CreateFundForm = ({
  onSubmit = (data) => console.log("Form submitted:", data),
  onCancel = () => console.log("Form cancelled"),
  isLoading = false,
}: CreateFundFormProps) => {
  const { register, handleSubmit, watch, setValue } =
    useForm<CreateFundFormData>({
      defaultValues: {
        name: "",
        description: "",
        isPublic: true,
        approvalType: "majority",
        approvalThreshold: 51,
      },
    });

  const approvalType = watch("approvalType");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-background w-[520px] space-y-6 p-6"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Fund Name</Label>
          <Input
            id="name"
            placeholder="Enter fund name"
            {...register("name")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="Describe your fund's purpose"
            {...register("description")}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="isPublic">Public Fund</Label>
          <Switch
            id="isPublic"
            checked={watch("isPublic")}
            onCheckedChange={(checked) => setValue("isPublic", checked)}
          />
        </div>

        <Tabs defaultValue="preset" className="w-full">
          <Label>Withdrawal Approval Requirements</Label>
          <TabsList className="grid w-full grid-cols-2 mt-2">
            <TabsTrigger value="preset">Preset Options</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          <TabsContent value="preset" className="mt-4">
            <RadioGroup
              defaultValue="majority"
              value={approvalType}
              onValueChange={(value: CreateFundFormData["approvalType"]) => {
                setValue("approvalType", value);
                if (value === "none") setValue("approvalThreshold", 0);
                if (value === "majority") setValue("approvalThreshold", 51);
              }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="r1" />
                <Label htmlFor="r1">No Approval (0%)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="majority" id="r2" />
                <Label htmlFor="r2">Majority (51%)</Label>
              </div>
            </RadioGroup>
          </TabsContent>
          <TabsContent value="custom" className="mt-4">
            <div className="space-y-2">
              <Label htmlFor="approvalThreshold">Custom Threshold (%)</Label>
              <Input
                id="approvalThreshold"
                type="number"
                min="1"
                max="100"
                placeholder="Enter percentage"
                {...register("approvalThreshold", { valueAsNumber: true })}
                onChange={(e) => {
                  setValue("approvalType", "custom");
                  setValue("approvalThreshold", parseInt(e.target.value));
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
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
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Fund"}
        </Button>
      </div>
    </form>
  );
};

export default CreateFundForm;
