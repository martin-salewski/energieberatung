import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { DefaultCustom } from "@/zustand/useVariableStore";
import { getDecimalSeparator } from "@/components/Keyboard";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const disableSpinner =
    "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]";

const Input = React.forwardRef<
    HTMLInputElement,
    InputProps & {
        defaultCustom?: DefaultCustom;
    }
>(({ className, type, defaultCustom, ...props }, ref) => {
    return (
        <div className={cn("", className)}>
            <input
                autoComplete={"off"}
                type={type}
                className={cn(
                    "flex h-10 w-full min-w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    "user-invalid:border user-invalid:border-mainz-red",
                    "data-[default-custom=Default]:border-mainz-yellow",
                    "data-[default-custom=Custom]:border-mainz-yellow-dark",
                    "data-[default-custom]:invalid:border-mainz-red",

                    disableSpinner,
                    className,
                )}
                ref={ref}
                data-default-custom={defaultCustom}
                {...props}
            />
            {defaultCustom && (
                <p className={cn("text-start text-[0.5rem]/[0.7rem]", "text-mainz-yellow")}>
                    {defaultCustom === DefaultCustom.Custom
                        ? "ist überschrieben"
                        : defaultCustom === DefaultCustom.Default
                          ? "kann überschrieben werden"
                          : ""}
                </p>
            )}
        </div>
    );
});
Input.displayName = "Input";

export { Input, InputWithUnit, InputWithLabel };

export type InputWithUnitProps = InputProps & {
    unit: React.JSX.Element;
    unitTitle?: string;
    defaultCustom?: DefaultCustom;
};
const InputWithUnit = React.forwardRef<HTMLInputElement, InputWithUnitProps>(
    ({ className, type, unit, unitTitle, defaultCustom, ...props }, ref) => {
        const id = React.useId();
        return (
            <div className={cn("", className)}>
                <div
                    className={cn(
                        "flex h-10 w-full min-w-24 rounded-md text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                        props.disabled ? "opacity-50" : "",
                    )}
                >
                    <input
                        autoComplete={"off"}
                        type={type}
                        id={id}
                        className={cn(
                            "peer flex w-full rounded-l-md border border-r-[0.5px] border-input bg-background px-3 py-2 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed",
                            // "default:bg-mainz-cyan placeholder-shown:bg-mainz-yellow valid:bg-mainz-green",
                            // "invalid:ring-2 invalid:ring-mainz-red invalid:ring-offset-2 invalid:ring-offset-background",
                            // "invalid:underline invalid:decoration-mainz-red invalid:decoration-4",
                            // "invalid:border-mainz-red-dark invalid:bg-mainz-red",
                            "user-invalid:border-b user-invalid:border-l user-invalid:border-t user-invalid:border-b-mainz-red user-invalid:border-l-mainz-red user-invalid:border-t-mainz-red",
                            // "data-[default-custom=Default]:bg-mainz-yellow",
                            // "data-[default-custom=Custom]:border-y-mainz-yellow data-[default-custom=Custom]:border-l-mainz-yellow",
                            "data-[default-custom=Default]:border-y-mainz-yellow data-[default-custom=Default]:border-l-mainz-yellow",
                            "data-[default-custom=Custom]:border-y-mainz-yellow-dark data-[default-custom=Custom]:border-l-mainz-yellow-dark",
                            "data-[default-custom]:invalid:border-y-mainz-red data-[default-custom]:invalid:border-l-mainz-red",

                            disableSpinner,
                        )}
                        ref={ref}
                        data-default-custom={defaultCustom}
                        {...props}
                    />
                    <Label
                        htmlFor={props.id ?? id}
                        title={unitTitle ?? ""}
                        className={cn(
                            "peer-disabled:opacity-100",
                            "place-content-center text-nowrap rounded-r-md border-y border-l-[0.5px] border-r border-input bg-background p-2",
                            // "peer-invalid:border-mainz-red-dark peer-invalid:bg-mainz-red",
                            "peer-user-invalid:border-y peer-user-invalid:border-r peer-user-invalid:border-y-mainz-red peer-user-invalid:border-r-mainz-red",
                            "peer-data-[default-custom=Default]:border-y-mainz-yellow peer-data-[default-custom=Default]:border-r-mainz-yellow",
                            "peer-data-[default-custom=Custom]:border-y-mainz-yellow-dark peer-data-[default-custom=Custom]:border-r-mainz-yellow-dark",
                            // "peer-invalid:ring-2 peer-invalid:ring-mainz-red peer-invalid:ring-offset-2 peer-invalid:ring-offset-background",
                            // "peer-data-[default-custom=Default]:bg-mainz-yellow",
                            // "peer-data-[default-custom=Custom]:border-y-mainz-yellow peer-data-[default-custom=Custom]:border-r-mainz-yellow",
                            "peer-data-[default-custom]:peer-invalid:border-y-mainz-red peer-data-[default-custom]:peer-invalid:border-r-mainz-red",
                        )}
                    >
                        {unit}
                    </Label>
                </div>
                {defaultCustom && (
                    <p className={cn("text-start text-[0.5rem]/[0.7rem]", "text-mainz-yellow")}>
                        {defaultCustom === DefaultCustom.Custom
                            ? "ist überschrieben"
                            : defaultCustom === DefaultCustom.Default
                              ? "kann überschrieben werden"
                              : ""}
                    </p>
                )}
            </div>
        );
    },
);

const InputWithLabel = React.forwardRef<HTMLInputElement, InputProps & { label: React.JSX.Element }>(
    ({ className, type, label, ...props }, ref) => {
        const id = React.useId();
        return (
            <div>
                <Label htmlFor={id}>{label}</Label>
                <Input type={type} id={id} ref={ref} {...props} />
            </div>
        );
    },
);

export const INPUT_PATTERN_FLOAT_POSITIVE = `^\\d*[${getDecimalSeparator()}]?\\d+$`;
export const INPUT_PATTERN_INTEGER_POSITIVE = `^\\d+$`;
export const INPUT_PATTERN_POSTALCODE = `^\\d{5}$`;
export const INPUT_PATTERN_PERCENTAGE = `^(100[${getDecimalSeparator()}]0*|0*\\d{1,2}([${getDecimalSeparator()}]\\d+)?)$`; //TODO weiß nicht ob das eltzte fragezeichen bzw auch die capturing group unnötig sind
export const INPUT_PATTERN_EMAIL_ADDRESS = `^.+@.+$`;
