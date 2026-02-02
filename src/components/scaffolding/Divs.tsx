import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

export const DivRadioGroupItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("flex items-center space-x-2", className)} {...props} />
    ),
);
export const DivCheckbox = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("flex items-center space-x-2", className)} {...props} />
    ),
);
export const DivCheckboxSubgrid = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("col-span-full flex items-center space-x-2", className)} {...props} />
    ),
);
export const DivGroup1 = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("grid h-min gap-4 md:gap-8", className)} {...props} />
));
export const DivGroup2 = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("grid h-min gap-2 md:gap-4", className)} {...props} />
));
export const DivGroup2Subgrid = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("col-span-full grid h-min grid-cols-subgrid gap-2 md:gap-4", className)}
            {...props}
        />
    ),
);
export const DivGroup3 = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("ml-6 grid h-min gap-2 md:gap-4", className)} {...props} />
));
export const DivGroup3Subgrid = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("col-span-full ml-6 grid h-min grid-cols-subgrid gap-2 md:gap-4", className)}
            {...props}
        />
    ),
);
export const DivInput = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("grid h-min items-center gap-2 sm:grid-cols-[1fr_auto] md:gap-4", className)}
        {...props}
    />
));
export const DivInputSubgrid = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("col-span-full grid h-min grid-cols-subgrid items-center gap-2 md:gap-4", className)}
            {...props}
        />
    ),
);
export const DivSmall = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("sm:max-w-40", className)} {...props} />
));
export const DivSelect = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("grid h-min grid-cols-[1fr_auto] items-center gap-2 md:gap-4", className)}
        {...props}
    />
));
export const DivSelectSubgrid = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "col-span-full grid h-min grid-cols-subgrid gap-2 sm:col-auto sm:row-span-full sm:grid-rows-subgrid md:gap-4",
                className,
            )}
            {...props}
        />
    ),
);
