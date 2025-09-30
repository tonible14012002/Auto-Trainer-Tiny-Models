import type { ComponentProps } from "react";
import { withForm } from "./withFormHook";
import { InferenceTextInput } from "@/components/common/InferenceTextInput";

type InferenceTextInputProps = ComponentProps<typeof InferenceTextInput>;

export const FormInferenceTextInput = withForm<string, InferenceTextInputProps>(InferenceTextInput);