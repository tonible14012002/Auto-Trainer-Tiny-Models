"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ReactNode, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { FormInput } from "@/components/common/Form/FormInput";
import { useCreateTrainer, useInvalidateTrainers } from "@/hooks/trainer";
import { toast } from "sonner";
import { FormTextArea } from "@/components/common/Form/FormTextArea";

interface TrainerCreatePopupProps {
  trigger?: ReactNode;
  onSuccess?: (trainerId: number) => void;
}

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

export const TrainerCreatePopup = (props: TrainerCreatePopupProps) => {
  const { trigger, onSuccess } = props;

  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync, isPending } = useCreateTrainer();
  const invalidateTrainers = useInvalidateTrainers();

  const formInstance = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
    disabled: isPending,
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const { data: newTrainer } = await mutateAsync({
        name: data.name,
        description: data.description,
      });

      toast.success("Trainer created successfully", {
        description: "Your trainer configuration has been created.",
      });

      setIsOpen(false);
      formInstance.reset();
      invalidateTrainers();

      if (onSuccess) {
        onSuccess(newTrainer.id);
      }
    } catch (error) {
      toast.error("Failed to create trainer", {
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <FormProvider {...formInstance}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="!max-w-[420px]" loading={isPending}>
          <form
            onSubmit={formInstance.handleSubmit(onSubmit)}
            className="grid gap-4"
          >
            <DialogHeader>
              <DialogTitle>New Trainer</DialogTitle>
              <DialogDescription>
                Create a new trainer configuration for fine-tuning your models.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <FormInput name="name" label="Name" placeholder="Untitled" />
              <FormTextArea name="description" label="Description" />
            </div>
            <DialogFooter>
              <DialogTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogTrigger>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
};