import type { ComponentProps } from "react";
import { withForm } from "./withFormHook";
import { Selection } from "../Selection/Selection";
import type { SelectionOption } from "../Selection/Selection";

export type FormSelectionProps = Omit<
  ComponentProps<typeof Selection>,
  "onChange" | "value"
> & {
  name: string;
  options: SelectionOption[];
  value?: string;
  onChange?: (value: string) => void;
};

export const FormSelection = withForm<string, FormSelectionProps>((props) => {
  // value and onChange are injected by withForm
  const { value, onChange, ...rest } = props;
  return (
    <Selection
      value={value ?? ""}
      onChange={onChange ?? (() => {})}
      {...rest}
    />
  );
});
