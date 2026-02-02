import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { KeysWhereValueHasCondition, VariableStore, useVariableStoreBase } from "@/zustand/useVariableStore";

const RadioGroup = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & {
        label?: string;
        zustandKey: KeysWhereValueHasCondition<VariableStore, string | null>;
    }
>(({ className, label, zustandKey, ...props }, ref) => {
    return (
        <div className={cn("flex flex-col gap-y-1", className)}>
            {label != null && <Label>{label}</Label>}
            <RadioGroupPrimitive.Root
                className="ml-2 grid gap-2"
                onValueChange={(value) => {
                    useVariableStoreBase.setState(() => ({ [zustandKey]: value }));
                }}
                {...props}
                ref={ref}
            />
        </div>
    );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => {
    return (
        <div className="flex items-center gap-x-2">
            <RadioGroupPrimitive.Item
                ref={ref}
                className={cn(
                    "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className,
                )}
                {...props}
            >
                <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                    <Circle className="h-2.5 w-2.5 fill-current text-current" />
                </RadioGroupPrimitive.Indicator>
            </RadioGroupPrimitive.Item>
            {children}
        </div>
    );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
