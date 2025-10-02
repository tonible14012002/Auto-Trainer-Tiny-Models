import type { ComponentProps } from "react";
import { withForm } from "./withFormHook";
import { Checkbox } from "@/components/ui/checkbox";

type CheckboxProps = ComponentProps<typeof Checkbox>;


/*
* Indeterminate state is not supported for form component
*/
export const FormCheckbox = withForm<boolean, CheckboxProps>(Checkbox, {
    getValue: (val) => ({
        checked: val
    }),
    getOnValueChange: (onChange) => ({
        onCheckedChange: (checked) => onChange(checked === 'indeterminate' ? false : checked)
    })
})