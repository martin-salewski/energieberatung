import { Keyboard, keyboardLayout, setLocaleAsDecimalSeparator } from "@/components/Keyboard";
import { OBJOptionalNachkomma } from "@/components/steps/Testing";
import { Input, InputProps } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DefaultCustom } from "@/zustand/useVariableStore";
import { PopoverArrow } from "@radix-ui/react-popover";
import { forwardRef, useImperativeHandle, useRef } from "react";

export interface InputWithKeyboardDefaultCustomProps extends InputProps {
    onChangeCallback: (value: string, validity: ValidityState) => void;
    defaultCustom: DefaultCustom;
    currentLayout?: keyof typeof keyboardLayout;
    formatFunction?: (value1: string | number | readonly string[] | undefined) => string; // eigentlich HTMLInputElement["value"] aber das gibt in typescript nur "string" raus.
}
export const InputWithKeyboardDefaultCustom = forwardRef<HTMLInputElement, InputWithKeyboardDefaultCustomProps>(
    ({ onChangeCallback, value, defaultCustom, currentLayout, formatFunction, ...props }, ref) => {
        const inputRef = useRef<HTMLInputElement>(null);
        const defaultDefaultValueFormatFunction = (value1: typeof value) =>
            setLocaleAsDecimalSeparator((value1 ?? 0).toString());
        const defaultPlaceholderFormatFunction = (value1: typeof value) =>
            (value1 ?? 0).toLocaleString(navigator.languages, OBJOptionalNachkomma);
        useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Input
                        // disabled
                        ref={inputRef}
                        type="text"
                        onChange={(event) => onChangeCallback(event.target.value, event.target.validity)}
                        onBlur={(event) => {
                            // event.target.reportValidity(); // prevents clicking something else in chromium
                            event.target.checkValidity(); // useless?
                        }}
                        placeholder={
                            defaultCustom === DefaultCustom.Default
                                ? formatFunction !== undefined
                                    ? formatFunction(value)
                                    : defaultPlaceholderFormatFunction(value)
                                : ""
                        }
                        // defaultValue={
                        //     depth !== null ? setLocaleAsDecimalSeparator(depth.toString()) : ""
                        // }
                        defaultValue={
                            defaultCustom === DefaultCustom.Custom
                                ? formatFunction !== undefined
                                    ? formatFunction(value)
                                    : defaultDefaultValueFormatFunction(value)
                                : ""
                        }
                        // onChange={(value) => {
                        //     isNaN(value.target.valueAsNumber);
                        //     useVariableStoreBase.setState((state) => ({
                        //         building_Dimensions: {
                        //             ...state.building_Dimensions,
                        //             area: {
                        //                 ...state.building_Dimensions.area,
                        //                 chosen: isNaN(value.target.valueAsNumber)
                        //                     ? DefaultCustom.Default
                        //                     : DefaultCustom.Custom,
                        //                 _customValue: isNaN(value.target.valueAsNumber) ? null : value.target.valueAsNumber,
                        //             },
                        //         },
                        //     }));
                        // }}
                        defaultCustom={defaultCustom}
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
