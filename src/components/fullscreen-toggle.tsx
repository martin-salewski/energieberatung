import { Button } from "@/components/ui/button";
import { Maximize, Minimize } from "lucide-react";
import { useEffect, useState } from "react";

export function FullscreenToggle() {
    const [isFullscreen, setIsFullscreen] = useState<boolean>();
    useEffect(() => {
        const eventListener = () => {
            setIsFullscreen(document.fullscreenElement !== null);
        };
        addEventListener("fullscreenchange", eventListener);
        return () => {
            removeEventListener("fullscreenchange", eventListener);
        };
    }, []);

    return (
        <Button
            title={`press to ${isFullscreen ? "exit" : "enter"} fullscreen`}
            onClick={() => {
                if (document.fullscreenElement) {
                    document
                        .exitFullscreen()
                        .then(() => console.log("Document Exited from Full screen mode"))
                        .catch((err) => console.error(err));
                } else {
                    document.documentElement.requestFullscreen();
                }
            }}
        >
            {isFullscreen ? <Minimize className="mr-2 h-4 w-4" /> : <Maximize className="mr-2 h-4 w-4" />}
            Toggle fullscreen
        </Button>
    );
}
