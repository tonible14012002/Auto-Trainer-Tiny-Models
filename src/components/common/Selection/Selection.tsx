import React from "react";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
	SelectLabel,
} from "../../ui/select";

export type SelectionOption = {
	label: string;
	value: string;
};

export type SelectionProps = {
	options: SelectionOption[];
	value: string;
	onChange: (value: string) => void;
	label?: string;
	placeholder?: string;
	disabled?: boolean;
	size?: "sm" | "default";
	className?: string;
};

export const Selection: React.FC<SelectionProps> = ({
	options,
	value,
	onChange,
	label,
	placeholder = "Select...",
	disabled = false,
	size = "default",
	className,
}) => {
	return (
		<div className={className}>
			{label && <SelectLabel>{label}</SelectLabel>}
			<Select value={value} onValueChange={onChange} disabled={disabled}>
				<SelectTrigger size={size} className="w-full">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};
