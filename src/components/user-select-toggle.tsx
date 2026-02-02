import { Button } from "@/components/ui/button";
import { TextCursorInput } from "lucide-react";
import { useEffect, useState } from "react";

export function UserSelectableToggle() {
    const root = window.document.documentElement;
    const [isUserSelectable, setIsUserSelectable] = useState<boolean>(!root.classList.contains("select-none"));

    useEffect(() => {
        // setIsUserSelectable(!root.classList.contains("select-none"))
        root.classList.remove("select-none", "select-auto");
        if (isUserSelectable) root.classList.add("select-auto");
        else root.classList.add("select-none");
    }, [isUserSelectable]);

    return (
        <Button
            onClick={() => {
                setIsUserSelectable(!isUserSelectable);
            }}
        >
            <TextCursorInput className="h-4 w-4" />
            {isUserSelectable ? "Text kann gerade ausgewählt werden" : "Text kann gerade nicht ausgewählt werden"}
        </Button>
    );
}
