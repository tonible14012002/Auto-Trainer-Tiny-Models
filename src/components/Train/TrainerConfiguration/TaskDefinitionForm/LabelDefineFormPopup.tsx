import { FormInput } from "@/components/common/Form/FormInput";
import { FormTextArea } from "@/components/common/Form/FormTextArea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const schema = z.object({
  name: z.string().min(1, "Label name is required"),
  explanation: z.string().min(1, "Explanation is required"),
  examples: z.string().min(1, "Examples are required"),
});

type LabelDefineFormData = z.infer<typeof schema>;

interface LabelDefineFormPopupProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (data: LabelDefineFormData) => void;
  initialData?: LabelDefineFormData;
  trigger?: ReactNode;
}

export const LabelDefineFormPopup = (props: LabelDefineFormPopupProps) => {
  const { trigger, onSave, initialData, open: controlledOpen, onOpenChange } = props;
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled open state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const formInstance = useForm<LabelDefineFormData>({
    defaultValues: {
      name: "",
      explanation: "",
      examples: "",
    },
    resolver: zodResolver(schema),
  });

  const onClose = () => {
    setOpen(false);
    formInstance.reset();
  };

  const onSubmit = formInstance.handleSubmit((data) => {
    onSave?.(data);
    setOpen(false);
    formInstance.reset();
  });

  // Load initial data when popup opens
  useEffect(() => {
    if (open) {
      if (initialData) {
        formInstance.reset(initialData);
      } else {
        formInstance.reset({
          name: "",
          explanation: "",
          examples: "",
        });
      }
    }
  }, [open, initialData, formInstance]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <Form {...formInstance}>
        <DialogContent className="max-w-2xl">
          <form onSubmit={onSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Define Label</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <FormInput
                name="name"
                label="Label Name"
                placeholder="LABEL_NAME"
              />
              <FormTextArea
                name="explanation"
                label="Label Definition"
                placeholder="Messages that express intent to make a payment, pay bills, transfer money, or complete transactions..."
                rows={3}
              />
              <FormTextArea
                name="examples"
                label="Examples (Few Shots)"
                placeholder="I want to pay my electricity bill&#10;Can I transfer $100 to John?&#10;How do I make a payment?"
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
};
