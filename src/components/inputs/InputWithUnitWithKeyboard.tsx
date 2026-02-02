import { Keyboard, keyboardLayout } from "@/components/Keyboard";
import { InputWithUnit, InputWithUnitProps } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PopoverArrow } from "@radix-ui/react-popover";
// import { PopoverArrow } from "@radix-ui/react-popover";
import { forwardRef, useImperativeHandle, useRef } from "react";

export interface InputWithUnitWithKeyboardProps extends InputWithUnitProps {
    currentLayout?: keyof typeof keyboardLayout;
    onChangeCallback: (value: string, validity: ValidityState) => void;
}
export const InputWithUnitWithKeyboard = forwardRef<HTMLInputElement, InputWithUnitWithKeyboardProps>(
    (
        {
            className,
            type,
            onChangeCallback,
            currentLayout,

            ...props
        }: InputWithUnitWithKeyboardProps,
        ref,
    ) => {
        const inputRef = useRef<HTMLInputElement>(null);
        useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
        return (
            <Popover>
                <PopoverTrigger asChild>
                    <InputWithUnit
                        // disabled
                        ref={inputRef}
                        type="text"
                        onChange={(event) => onChangeCallback(event.target.value, event.target.validity)}
                        onBlur={(event) => {
                            // event.target.reportValidity(); // prevents clicking something else in chromium
                            event.target.checkValidity(); // useless?
                        }}
                        {...props}
                    />
                </PopoverTrigger>
                <PopoverContent onOpenAutoFocus={(event) => event.preventDefault()} className="p-1">
                    <PopoverArrow className="fill-border drop-shadow-md" />
                    <Keyboard
                        onKeyPress={(button) => {
                            console.log(button);
                            if (inputRef.current) {
                                if (button === "{bksp}") inputRef.current.value = inputRef.current.value.slice(0, -1);
                                else if (button.startsWith("{") && button.endsWith("}")) {
                                    // nothing
                                } else inputRef.current.value += button;
                                onChangeCallback(inputRef.current.value, inputRef.current.validity);
                            }
                        }}
                        usedLayout={currentLayout}
                    />
                </PopoverContent>
            </Popover>
        );
    },
);
