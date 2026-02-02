import { FullscreenToggle } from "@/components/fullscreen-toggle";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { UserSelectableToggle } from "@/components/user-select-toggle";
import { StepKey } from "@/main";
import { Pointer } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function S00SplashScreen() {
    const navigate = useNavigate();
    return (
        <div className="duration-1000 animate-in fade-in">
            <div
                onClick={() => {
                    navigate(`/${StepKey.TypeOfBuilding}`);
                }}
                className="text-grey-700 flex h-screen cursor-pointer flex-col items-center justify-center"
            >
                <Button variant={"ghost"} className="text-center text-xl font-normal md:text-3xl">
                    Zum Starten das Display berühren
                </Button>
                <Pointer className="mt-4 block animate-bounce delay-1000" />
            </div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button className="absolute bottom-8 right-8 text-background" variant="ghost">
                        Einstellungen
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Einstellungen</SheetTitle>
                        <SheetDescription>
                            Hier können Einstellungen für das Programm vorgenommen werden.
                        </SheetDescription>
                    </SheetHeader>
                    <ModeToggle />
                    <Button className="block" variant={"link"} onClick={() => navigate(`/${StepKey.Testing}`)}>
                        weiter zur Testseite
                    </Button>
                    <FullscreenToggle />
                    <UserSelectableToggle />
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default S00SplashScreen;
