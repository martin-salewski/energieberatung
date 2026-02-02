import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { NavigateFunction } from "react-router-dom";
import { ChevronLeft, ChevronRight, HomeIcon } from "lucide-react";
import { useVariableStore } from "@/zustand/useVariableStore";

export function StepsScaffolding({
    className,
    title,
    children,
    navigate,
    next,
    preNext,
    last = -1,
    isIn3DModel = false,
}: {
    className?: string;
    title?: ReactNode;
    children?: ReactNode;
    navigate: NavigateFunction;
    // wenn undefined -> buttons werden disabled
    // wenn null -> buttons werden nicht angezeigt
    last?: string | number | undefined | null; //gut, undefined wird es nicht geben, wenn es einen default wert gibt
    next: string | number | undefined | null;
    preNext?: () => void;
    isIn3DModel?: boolean;
}) {
    function lastStep() {
        if (last === undefined) return;
        else if (last === null) return;
        else if (typeof last === "number") navigate(last);
        else if (typeof last === "string") navigate(last);
    }
    function nextStep() {
        if (next === undefined) return;
        else if (next === null) return;
        else {
            preNext?.();
            if (typeof next === "number") navigate(next);
            else if (typeof next === "string") navigate(next);
        }
    }
    const resetStore = useVariableStore.use.reset();
    return (
        <div className="mx-auto flex min-h-screen w-full max-w-screen-lg flex-col gap-4 overflow-auto px-16">
            {title}
            {children != null && <div className={cn("grow pb-0", className)}>{children}</div>}
            {last === null ? (
                <div />
            ) : (
                <Button
                    className={cn(
                        "bottom-16 left-16 gap-4 rounded-full border border-gray-700 bg-white pl-2 pr-8 text-lg font-normal text-gray-700 drop-shadow-xl print:hidden",
                        isIn3DModel ? "absolute" : "fixed",
                    )}
                    disabled={last === undefined}
                    onClick={lastStep}
                >
                    <ChevronLeft className="h-5 w-5" />
                    Zurück
                </Button>
            )}
            {next === null ? (
                <div />
            ) : (
                <Button
                    className={cn(
                        "bottom-16 right-16 gap-4 rounded-full pl-8 pr-2 text-lg font-normal text-white drop-shadow-xl print:hidden",
                        isIn3DModel ? "absolute" : "fixed",
                    )}
                    disabled={next === undefined}
                    onClick={nextStep}
                >
                    Weiter
                    <ChevronRight className="h-5 w-5" />
                </Button>
            )}
            <Button
                variant={"ghost"}
                onClick={() => {
                    navigate("/");
                    resetStore();
                    window.location.reload();
                }}
                className={cn("left-8 top-8 hover:cursor-pointer print:hidden", isIn3DModel ? "absolute" : "fixed")}
            >
                <HomeIcon />
            </Button>
        </div>
    );
}
