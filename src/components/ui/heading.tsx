import * as React from "react";
import * as HeadingPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const headingVariants = cva(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

const Heading = React.forwardRef<
    React.ElementRef<typeof HeadingPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof HeadingPrimitive.Root> & VariantProps<typeof headingVariants>
>(({ className, ...props }, ref) => (
    <HeadingPrimitive.Root ref={ref} className={cn(headingVariants(), className)} {...props} />
));
Heading.displayName = HeadingPrimitive.Root.displayName;

export { Heading };

export const Heading1 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => {
        return (
            <h1
                ref={ref}
                className={cn("mb-3 mt-16 hyphens-auto break-words text-5xl font-semibold text-gray-700", className)}
                {...props}
            />
        );
    },
);
export const Heading2 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => {
        return (
            <h2
                ref={ref}
                className={cn("col-span-full hyphens-auto break-words text-2xl font-semibold text-gray-700", className)}
                {...props}
            />
        );
    },
);
export const Heading3 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => {
        return (
            <h3
                ref={ref}
                className={cn("text-l col-span-full hyphens-auto break-words font-semibold text-gray-700", className)}
                {...props}
            />
        );
    },
);
export const Heading4 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => {
        return <h4 ref={ref} className={cn("", className)} {...props} />;
    },
);
export const HeadingBold = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => {
        return <h2 ref={ref} className={cn("text-left text-2xl uppercase text-gray-700", className)} {...props} />;
    },
);
