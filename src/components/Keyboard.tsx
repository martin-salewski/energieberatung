import { Button } from "@/components/ui/button";
import { PopoverClose } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ArrowBigUp, CornerDownLeft, Delete, X } from "lucide-react";
import { useState } from "react";

export const keyboardLayout = {
    float: ["7 8 9 {close}", "4 5 6 {bksp}", "1 2 3 {return}", "0 0 {⎖} {return}"],
    int: ["7 8 9 {close}", "4 5 6 {bksp}", "1 2 3 {return}", "0 0 0 {return}"],
    text: [
        "q w e r t z u i o p {close}",
        "a s d f g h j k l {bksp} {bksp}",
        "{shift} {shift} y x c v b n m {shift} {shift}",
        "{...} @ , {space} {space} {space} {space} {space} . {return} {return}",
    ],
    TEXT: [
        "Q W E R T Z U I O P {close}",
        "A S D F G H J K L {bksp} {bksp}",
        "{shift} {shift} Y X C V B N M {shift} {shift}",
        "{...} @ , {space} {space} {space} {space} {space} . {return} {return}",
    ],
    symbols: [
        "1 2 3 4 5 6 7 8 9 0 {close}",
        "# $ % & - + ( ) / {bksp} {bksp}",
        "~ * \" _ ' : ; ! ? < >",
        "{...} @ , {space} {space} {space} {space} {space} . {return} {return}",
    ],
};
export interface KeyboardProps {
    onKeyPress: (button: string) => void;
    usedLayout?: keyof typeof keyboardLayout;
}
export function Keyboard({ onKeyPress, usedLayout = "float" }: KeyboardProps) {
    // const layout = { mynumeric: ["7 8 9 {close}", "4 5 6 {bksp}", "1 2 3 {return}", ". 0 , {return}"] };
    const [shift, setShift] = useState<boolean>(false);
    const [symbols, setSymbols] = useState<boolean>(false);
    const currentLayout = usedLayout === "text" ? (symbols ? "symbols" : shift ? "TEXT" : "text") : usedLayout;
    const vertical = keyboardLayout[usedLayout].length;
    const horizontal = keyboardLayout[usedLayout][0].split(" ").length;
    console.log("DIMENSIONS:", vertical, horizontal);
    return (
        <div
            className={cn(`grid place-items-stretch gap-1 rounded-md bg-popover p-1`)}
            style={{
                gridTemplateColumns: `repeat(${horizontal}, minmax(0,1fr))`,
                gridTemplateRows: `repeat(${vertical}, minmax(0,1fr))`,
            }}
        >
            {keyboardLayout[currentLayout]
                .map((rows) => rows.split(" "))
                .map((row, indexRow, rows) =>
                    row.map((keyString, indexCol) => {
                        // console.log(rows, indexRow, indexRow - 1, indexCol);
                        const currentKey = `${indexRow}${indexCol}`;
                        let keySpanVertically = 1;
                        if (indexRow > 0 && rows[indexRow - 1][indexCol] === keyString) keySpanVertically = 0;
                        else
                            for (let i = indexRow + 1; i < rows.length; ++i) {
                                if (rows[i][indexCol] === keyString) ++keySpanVertically;
                                else break;
                            }
                        let keySpanHorizontally = 1;
                        if (indexCol > 0 && row[indexCol - 1] === keyString) keySpanHorizontally = 0;
                        else
                            for (let i = indexCol + 1; i < row.length; ++i) {
                                if (row[i] === keyString) ++keySpanHorizontally;
                                else break;
                            }

                        const defaultButtonStyle = cn(
                            "bg-popover-foreground text-popover shadow-[0_0_3px_-1px_rgba(0,0,0,.3)] w-full h-full",
                        );
                        const spanStyle = {
                            gridColumn: `span ${keySpanHorizontally} / span ${keySpanHorizontally}`,
                            gridRow: `span ${keySpanVertically} / span ${keySpanVertically}`,
                        };
                        if (keyString === "{}") {
                        } else if (keySpanVertically === 0 || keySpanHorizontally === 0) return null;
                        if (keyString.startsWith("{") && keyString.endsWith("}")) {
                            const keyControl = keyString.slice(1, -1);
                            switch (keyControl) {
                                case "close": {
                                    return (
                                        <PopoverClose key={currentKey} asChild>
                                            <Button
                                                className={cn("h-full w-full")}
                                                style={spanStyle}
                                                variant={"destructive"}
                                                onMouseDown={(event) => event.preventDefault()}
                                                onTouchStart={(event) => event.preventDefault()} // TODO weiß nicht ob das bei touch reicht
                                            >
                                                <X />
                                            </Button>
                                        </PopoverClose>
                                    );
                                }
                                case "return": {
                                    return (
                                        <PopoverClose key={currentKey} asChild>
                                            <Button
                                                className={cn("h-full w-full")}
                                                style={spanStyle}
                                                key={currentKey}
                                                variant={"default"}
                                                // onClick={(event) => {
                                                //     event.preventDefault();
                                                // }}
                                                onMouseDown={(event) => event.preventDefault()}
                                                onTouchStart={(event) => event.preventDefault()} // TODO weiß nicht ob das bei touch reicht
                                            >
                                                <CornerDownLeft />
                                            </Button>
                                        </PopoverClose>
                                    );
                                }
                                case "bksp": {
                                    return (
                                        <Button
                                            key={currentKey}
                                            variant={"secondary"}
                                            className={cn("h-full w-full", defaultButtonStyle)}
                                            style={spanStyle}
                                            onClick={(event) => {
                                                event.preventDefault();
                                                onKeyPress(keyString);
                                            }}
                                            onMouseDown={(event) => event.preventDefault()}
                                            onTouchStart={(event) => event.preventDefault()} // TODO weiß nicht ob das bei touch reicht
                                        >
                                            <Delete />
                                        </Button>
                                    );
                                }
                                case "shift": {
                                    return (
                                        <Button
                                            key={currentKey}
                                            variant={"secondary"}
                                            className={cn("h-full w-full", defaultButtonStyle)}
                                            style={spanStyle}
                                            onClick={(event) => {
                                                event.preventDefault();
                                                // onKeyPress(keyString);
                                                setShift(!shift);
                                            }}
                                            onMouseDown={(event) => event.preventDefault()}
                                            onTouchStart={(event) => event.preventDefault()} // TODO weiß nicht ob das bei touch reicht
                                        >
                                            <ArrowBigUp fill={shift ? "currentcolor" : ""} />
                                        </Button>
                                    );
                                }
                                case "...": {
                                    return (
                                        <Button
                                            key={currentKey}
                                            variant={"secondary"}
                                            className={cn("h-full w-full", defaultButtonStyle)}
                                            style={spanStyle}
                                            onClick={(event) => {
                                                event.preventDefault();
                                                // onKeyPress(keyString);
                                                setSymbols(!symbols);
                                            }}
                                            onMouseDown={(event) => event.preventDefault()}
                                            onTouchStart={(event) => event.preventDefault()} // TODO weiß nicht ob das bei touch reicht
                                        >
                                            {symbols ? (shift ? "ABC" : "abc") : "?123"}
                                        </Button>
                                    );
                                }
                                case "space": {
                                    return (
                                        <Button
                                            key={currentKey}
                                            variant={"secondary"}
                                            className={cn("h-full w-full", defaultButtonStyle)}
                                            style={spanStyle}
                                            onClick={(event) => {
                                                event.preventDefault();
                                                onKeyPress(" ");
                                            }}
                                            onMouseDown={(event) => event.preventDefault()}
                                            onTouchStart={(event) => event.preventDefault()} // TODO weiß nicht ob das bei touch reicht
                                        >
                                            {"_"}
                                        </Button>
                                    );
                                }
                                case "⎖": {
                                    const currentDecimalSeparator = getDecimalSeparator() ?? "⎖";
                                    return (
                                        <Button
                                            key={currentKey}
                                            variant={"secondary"}
                                            className={cn("h-full w-full", defaultButtonStyle)}
                                            style={spanStyle}
                                            onClick={(event) => {
                                                event.preventDefault();
                                                onKeyPress(currentDecimalSeparator);
                                            }}
                                            onMouseDown={(event) => event.preventDefault()}
                                            onTouchStart={(event) => event.preventDefault()} // TODO weiß nicht ob das bei touch reicht
                                        >
                                            {currentDecimalSeparator}
                                        </Button>
                                    );
                                }
                                case "":
                                    return <div key={currentKey} />;
                                default:
                                    return <div key={currentKey} style={spanStyle} />;
                            }
                        } else
                            return (
                                <Button
                                    key={currentKey}
                                    variant={"secondary"}
                                    className={defaultButtonStyle}
                                    style={spanStyle}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        onKeyPress(keyString);
                                    }}
                                    onMouseDown={(event) => event.preventDefault()}
                                    onTouchStart={(event) => event.preventDefault()} // TODO weiß nicht ob das bei touch reicht
                                >
                                    {keyString === "{bksp}" ? <Delete /> : keyString === "{⎖}" ? "⎖" : keyString}
                                </Button>
                            );
                    }),
                )}
        </div>
    );
}
export function getDecimalSeparator() {
    const languages = navigator.languages as string[];
    const numberWithDecimalSeparator = 1.1;
    const separator = Intl.NumberFormat(languages)
        .formatToParts(numberWithDecimalSeparator)
        .find((part) => part.type === "decimal")?.value;
    return separator;
}
export function setDotAsDecimalSeparator(value: string) {
    const decimalSeparator = getDecimalSeparator() ?? ".";
    return value.replace(new RegExp(`[${decimalSeparator}]`, "g"), ".");
}
export function setLocaleAsDecimalSeparator(value: string) {
    const decimalSeparator = getDecimalSeparator() ?? ".";
    return value.replace(new RegExp(`[.]`, "g"), decimalSeparator);
}
