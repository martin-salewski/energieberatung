import { Canvas, /* PrimitiveProps, useFrame, */ useThree } from "@react-three/fiber";

import { /* CameraControls, */ Environment, Html, OrbitControls } from "@react-three/drei";
import { /* Mesh, PerspectiveCamera, */ PointLight, PointLightHelper /* , SpotLight, Vector3 */ } from "three";
import { basepath, StepKey } from "@/main";
import { NavigateFunction, useNavigate, useOutlet } from "react-router-dom";
import { StrictMode, Suspense, createContext, useEffect, useRef } from "react";
// import { config, useSpring } from "@react-spring/three";
import { StepsScaffolding } from "@/components/scaffolding/StepsScaffolding";
import { Button } from "@/components/ui/button";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useLoader } from "@react-three/fiber";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
    AngledOrFlat,
    DefaultCustom,
    HeatedUnheated,
    InsulationStandard,
    RestrictionsWallInside,
    RestrictionsWallOutside,
    RoofType,
    useVariableStoreBase,
} from "@/zustand/useVariableStore";
import { ConstructionPart } from "@/tables/HeatTransferCoefficientBasedOnComponentAndConstructionYear";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getMath } from "@/tables/mathFormulars";
import { InputWithUnit } from "@/components/ui/input";
import {
    getAvailableInsulationTypes,
    InsulationZoneType,
    mapRoofTypeToInsulationZoneType,
} from "@/tables/availableInsulationTypesOfComponent";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CornerDownRight, TriangleAlert } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { DivCheckbox, DivGroup2, DivGroup3, DivRadioGroupItem, DivSmall } from "@/components/scaffolding/Divs";
import city from "@/assets/potsdamer_platz_1k.hdr";
import { Heading1, Heading3 } from "@/components/ui/heading";
export const RouterContext = createContext<{ navigate: NavigateFunction } | undefined>(undefined);

function positionOffset(n: number) {
    const offset = -1.3;
    return n + offset;
}
export function S07NewInsulation() {
    const navigate = useNavigate();
    const outlet = useOutlet();

    return (
        <div className={"h-screen w-full overflow-hidden" /*  + " bg-gradient-to-r from-cyan-500 to-blue-500" */}>
            {/* TODO nochmal schauen, warum das suspence hier nichts bringt. Dachte eigentlich, dass es dann eben nur die navigation anzeigt */}
            {/* <Suspense
                    fallback={
                        <h1>loading</h1>
                        // <StepsScaffolding
                        //     navigate={navigate}
                        //     next={`/${StepKey.BuildingOuterChanges}/${StepKey.DataOuterWall}`}
                        // />
                    }
                > */}

            <Canvas shadows={"soft"} camera={{ position: [-5, positionOffset(4), 10], fov: 75 }}>
                <Html fullscreen zIndexRange={[0]}>
                    <StrictMode>
                        <StepsScaffolding
                            className="grid place-items-center"
                            navigate={navigate}
                            title={<Heading1 className="">Auswahl der Sanierungmaßnahmen</Heading1>}
                            last={`/${StepKey.ResultsAfterGeneralData}`}
                            next={`/${StepKey.ResultsAfterInsulation}`}
                            isIn3DModel={true}
                            // title={<h1>Gebäudehülle</h1>}
                        />
                        {/* {outlet == null ? (
                            
                        ) : (
                            <RouterContext.Provider value={{ navigate }}>
                                <div>{outlet}</div>
                            </RouterContext.Provider>
                        )} */}
                    </StrictMode>
                </Html>
                {/* <ScreenSizer> */}
                <Scene /* shouldBeLeft={outlet != null} */ />
                {outlet === null && (
                    <group>
                        <Html position={[-1, positionOffset(4), 0.5]}>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        className="hover:bg-slate-700"
                                        // onClick={() => {
                                        //     navigate(`/${StepKey.NewInsulation}/`);
                                        // }}
                                    >
                                        Dach
                                    </Button>
                                </SheetTrigger>
                                <SheetContent background={"none"}>
                                    <SheetHeader>
                                        <SheetTitle>Dach / oberste Gechossdecke</SheetTitle>
                                        {/* <SheetDescription>
                                            Die Bauteile, die an die beheizten Räume angrenzen, sollten gedämmt werden.
                                        </SheetDescription> */}
                                    </SheetHeader>
                                    <Roof />
                                </SheetContent>
                            </Sheet>
                        </Html>
                        <Html position={[0.8, positionOffset(1.5), 1.8]}>
                            <Sheet>
                                <SheetTrigger>
                                    <Button
                                        className="hover:bg-slate-700"
                                        // onClick={() => {
                                        //     navigate(`/${StepKey.NewInsulation}/`);
                                        // }}
                                    >
                                        Außenwand
                                    </Button>
                                </SheetTrigger>
                                <SheetContent background={"none"}>
                                    <SheetHeader>
                                        <SheetTitle>Außenwand</SheetTitle>
                                    </SheetHeader>
                                    <OuterWall />
                                </SheetContent>
                            </Sheet>
                        </Html>
                        <Html position={[-3.2, positionOffset(1), 0.8]}>
                            <Sheet>
                                <SheetTrigger>
                                    <Button
                                        className="hover:bg-slate-700"
                                        // onClick={() => {
                                        //     navigate(`/${StepKey.NewInsulation}/`);
                                        // }}
                                    >
                                        Fenster
                                    </Button>
                                </SheetTrigger>
                                <SheetContent background={"none"}>
                                    <SheetHeader>
                                        <SheetTitle>Fenster</SheetTitle>
                                    </SheetHeader>
                                    <Windows />
                                </SheetContent>
                            </Sheet>
                        </Html>
                        <Html position={[-2, positionOffset(-0.2), 2]}>
                            <Sheet>
                                <SheetTrigger>
                                    <Button
                                        className="hover:bg-slate-700"
                                        // onClick={() => {
                                        //     navigate(`/${StepKey.NewInsulation}/`);
                                        // }}
                                    >
                                        Kellerdecke
                                    </Button>
                                </SheetTrigger>
                                <SheetContent background={"none"}>
                                    <SheetHeader>
                                        <SheetTitle>Kellerdecke</SheetTitle>
                                    </SheetHeader>
                                    <BottomSide />
                                </SheetContent>
                            </Sheet>
                        </Html>
                    </group>
                )}
                {/* </ScreenSizer> */}
                <OrbitControls enablePan={false} enableDamping enableRotate enableZoom={false} />
                <Environment
                    background={false} // can be true, false or "only" (which only sets the background) (default: false)
                    backgroundRotation={[0, Math.PI / -2, 0]} // optional rotation (default: 0, only works with three 0.163 and up)
                    environmentIntensity={0.8} // optional intensity factor (default: 1, only works with three 0.163 and up)
                    environmentRotation={[0, Math.PI / -2, 0]} // optional rotation (default: 0, only works with three 0.163 and up)
                    // files={["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]}
                    files={city}
                    // path="/"
                    // preset="city"
                    scene={undefined} // adds the ability to pass a custom THREE.Scene, can also be a ref
                    encoding={undefined} // adds the ability to pass a custom THREE.TextureEncoding (default: THREE.sRGBEncoding for an array of files and THREE.LinearEncoding for a single texture)
                />
            </Canvas>
            {/* </Suspense> */}
        </div>
    );
}
function Einfamilienhaus(props: any) {
    // Verwende den GLTFLoader, um das glTF-Modell zu laden
    const gltf = useLoader(GLTFLoader, basepath + "gltf/Ein.gltf"); // Pfad zur glTF-Datei

    return <primitive {...props} object={gltf.scene} position={[0, -0.1, 0]} />; // Das geladene Modell anzeigen
}

function Scene(/* { shouldBeLeft }: { shouldBeLeft: boolean } */) {
    const lightRef = useRef<PointLight>(null!);
    const helperRef = useRef<PointLightHelper>(null!);
    const { scene /* , camera */ } = useThree();

    // useEffect(() => {
    //     camera.lookAt(0, 1.5, 0);
    //     // set({ camera: cameraRef.current });
    // }, [camera]);

    useEffect(() => {
        if (lightRef.current && helperRef.current) {
            helperRef.current.light = lightRef.current;
            scene.add(helperRef.current.light);
        }
    }, [scene, lightRef, helperRef]);
    // const { positionX } = useSpring({ positionX: shouldBeLeft ? -2.2 : 2.2, config: config.gentle });
    return (
        <group position={[0, positionOffset(0), 0]}>
            <Suspense>
                <Einfamilienhaus />
            </Suspense>

            <mesh rotation={[Math.PI * -0.5, 0, 0, "XYZ"]} position={[0, -1, 0]} receiveShadow>
                <planeGeometry args={[100, 10, 1, 1]} />
                <shadowMaterial opacity={0.5} />
                {/* <meshStandardMaterial color={0x44aa88} /> */}
            </mesh>
            {/* <pointLightHelper ref={helperRef} /> */}
            {/* das spotlight könnte dann auch einfach ein pointLight sein theoretisch */}
            {/* {lightRef.current != null && <spotLightHelper args={[lightRef.current]} />} */}
            {/* 
                <rectAreaLight
                    castShadow
                    args={[0xffffff, 4, 4, 1]}
                    position={[0, 1, 0]}
                    rotation={[Math.PI * -0.5, 0, 0, "XYZ"]}
                /> */}
        </group>
    );
}

function Roof() {
    const OBJnachkomma = {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    };
    const roofType = useVariableStoreBase((state) => state.building_ConstructionParts[ConstructionPart.TopSide].type);
    const angledOrFlat = useVariableStoreBase(
        (state) => state.building_ConstructionParts[ConstructionPart.TopSide].angledOrFlat,
    );

    const standard = useVariableStoreBase(
        (state) => state.building_ConstructionParts[ConstructionPart.TopSide].targetedStandard,
    );
    const thermalTransferCoefficient = useVariableStoreBase((state) =>
        state.building_ConstructionParts[ConstructionPart.TopSide].thermalTransmissionCoefficient[
            state.building_ConstructionParts[ConstructionPart.TopSide].thermalTransmissionCoefficient.chosen
        ](),
    );
    const lambda = useVariableStoreBase((state) =>
        state.building_ConstructionParts[ConstructionPart.TopSide].lambda[
            state.building_ConstructionParts[ConstructionPart.TopSide].lambda.chosen
        ](),
    );
    const insulationType = useVariableStoreBase(
        (state) => state.building_ConstructionParts[ConstructionPart.TopSide].insulationType,
    );
    // const usesAngledRoof = useVariableStoreBase(
    //     (state) => state.building_ConstructionParts[ConstructionPart.TopSide].usesAngledRoofAndNoFlatRoof,
    // );
    const thickness = useVariableStoreBase((state) =>
        state.building_ConstructionParts[ConstructionPart.TopSide].insulationThickness(),
    );
    useEffect(() => {
        if (angledOrFlat === null) return undefined;
        useVariableStoreBase.setState((state) => ({
            building_ConstructionParts: {
                ...state.building_ConstructionParts,
                [ConstructionPart.TopSide]: {
                    ...state.building_ConstructionParts[ConstructionPart.TopSide],
                    type:
                        angledOrFlat === AngledOrFlat.Angled
                            ? RoofType.PitchedRoof
                            : state.building_ConstructionParts[ConstructionPart.TopSide].type,
                },
            },
        }));
    }, [angledOrFlat]);
    return (
        <DivGroup2 className="py-4">
            <DivGroup2>
                <Label htmlFor="rooftype">
                    <Heading3>Bauteil</Heading3>
                </Label>
                <DivGroup3>
                    <RadioGroup id="rooftype" value={roofType ?? ""}>
                        {Object.values(RoofType).map((type) => {
                            return (
                                <DivRadioGroupItem key={type}>
                                    <RadioGroupItem
                                        id={type}
                                        disabled={
                                            (angledOrFlat === AngledOrFlat.Angled && type !== RoofType.PitchedRoof) ||
                                            (angledOrFlat === AngledOrFlat.Flat && type === RoofType.PitchedRoof)
                                        }
                                        value={type}
                                        onClick={() =>
                                            useVariableStoreBase.setState((state) => ({
                                                building_ConstructionParts: {
                                                    ...state.building_ConstructionParts,
                                                    [ConstructionPart.TopSide]: {
                                                        ...state.building_ConstructionParts[ConstructionPart.TopSide],
                                                        type: type,
                                                    },
                                                },
                                            }))
                                        }
                                    />
                                    <Label htmlFor={type}>
                                        {type === RoofType.FlatRoof ? (
                                            "Flachdach"
                                        ) : type === RoofType.InvertedRoof ? (
                                            "Umkehrdach"
                                        ) : type === RoofType.PitchedRoof ? (
                                            "Schrägdach"
                                        ) : type === RoofType.TopFloorCeiling ? (
                                            "Oberste Geschossdecke"
                                        ) : (
                                            <></>
                                        )}
                                    </Label>
                                </DivRadioGroupItem>
                            );
                        })}
                    </RadioGroup>
                </DivGroup3>
            </DivGroup2>
            <DivGroup2>
                <Label htmlFor="wantedStandard">
                    <Heading3>Angestrebter Energiestandard</Heading3>
                </Label>
                <DivGroup3>
                    <RadioGroup id="wantedStandard" value={standard ?? ""}>
                        {Object.values(InsulationStandard).map((type) => {
                            return (
                                <DivRadioGroupItem
                                    key={
                                        type
                                    } /*  className="col-span-full grid grid-cols-subgrid items-center gap-2" */
                                >
                                    <RadioGroupItem
                                        id={type}
                                        value={type}
                                        onClick={() =>
                                            useVariableStoreBase.setState((state) => ({
                                                building_ConstructionParts: {
                                                    ...state.building_ConstructionParts,
                                                    [ConstructionPart.TopSide]: {
                                                        ...state.building_ConstructionParts[ConstructionPart.TopSide],
                                                        targetedStandard: type,
                                                    },
                                                },
                                            }))
                                        }
                                    />
                                    <Label htmlFor={type}>
                                        {type === InsulationStandard.BEG ? (
                                            "BEG (Bundesförderung für effiziente Gebäude)"
                                        ) : type === InsulationStandard.GEG ? (
                                            "GEG (Gebäudeenergiegesetz)"
                                        ) : (
                                            <></>
                                        )}
                                    </Label>
                                </DivRadioGroupItem>
                            );
                        })}
                    </RadioGroup>
                </DivGroup3>

                <div className="grid grid-cols-[auto_1fr_30%] items-center gap-2">
                    <CornerDownRight className="mb-2 size-5" />
                    <Label htmlFor="thermalTransmissionCoefficient">Wärmedurchgangskoeffizient:</Label>
                    <DivSmall>
                        <InputWithUnit
                            type="number"
                            id="consumption"
                            // disabled={standard !== null}
                            unit={getMath("W/((m^2)*K)").formula}
                            placeholder={
                                thermalTransferCoefficient === undefined ? "0" : `${thermalTransferCoefficient}`
                            }
                            value={thermalTransferCoefficient ?? ""}
                            onChange={(value) => {
                                useVariableStoreBase.setState((state) => ({
                                    building_ConstructionParts: {
                                        ...state.building_ConstructionParts,
                                        [ConstructionPart.TopSide]: {
                                            ...state.building_ConstructionParts[ConstructionPart.TopSide],
                                            thermalTransmissionCoefficient: {
                                                ...state.building_ConstructionParts[ConstructionPart.TopSide]
                                                    .thermalTransmissionCoefficient,
                                                chosen: isNaN(value.target.valueAsNumber)
                                                    ? DefaultCustom.Default
                                                    : DefaultCustom.Custom,
                                                _customValue: isNaN(value.target.valueAsNumber)
                                                    ? null
                                                    : value.target.valueAsNumber,
                                            },
                                        },
                                    },
                                }));
                            }}
                            unitTitle={getMath("W/((m^2)*K)").title}
                        />
                    </DivSmall>
                </div>
            </DivGroup2>
            <DivGroup2>
                <Label htmlFor="wantedStandard">
                    <Heading3>Dämmmaterial</Heading3>
                </Label>
                {roofType === null && (
                    <Alert>
                        <TriangleAlert className="h-4 w-4" />
                        <AlertDescription>
                            Hier werden passende Dämmmaterialien angezeigt, sobald ein zu dämmendes Bauteil ausgewählt
                            ist.
                        </AlertDescription>
                    </Alert>
                )}
                <DivGroup3>
                    <RadioGroup id="wantedStandard" value={insulationType ?? ""}>
                        {roofType !== null &&
                            Array.from(getAvailableInsulationTypes(mapRoofTypeToInsulationZoneType(roofType))).map(
                                (type) => {
                                    return (
                                        <DivRadioGroupItem
                                            key={
                                                type
                                            } /*  className="col-span-full grid grid-cols-subgrid items-center gap-2" */
                                        >
                                            <RadioGroupItem
                                                id={type}
                                                value={type}
                                                onClick={() =>
                                                    useVariableStoreBase.setState((state) => ({
                                                        building_ConstructionParts: {
                                                            ...state.building_ConstructionParts,
                                                            [ConstructionPart.TopSide]: {
                                                                ...state.building_ConstructionParts[
                                                                    ConstructionPart.TopSide
                                                                ],
                                                                insulationType: type,
                                                            },
                                                        },
                                                    }))
                                                }
                                            />
                                            <Label htmlFor={type}>{type}</Label>
                                        </DivRadioGroupItem>
                                    );
                                },
                            )}
                    </RadioGroup>
                </DivGroup3>

                <div className="grid grid-cols-[auto_1fr_30%] items-center gap-2">
                    <CornerDownRight className="mb-2 size-5" />
                    <Label htmlFor="lambda">Wärmeleitfähigkeit:</Label>
                    <DivSmall>
                        <InputWithUnit
                            type="number"
                            id="lambda"
                            disabled={
                                lambda === undefined
                            } /* sollte wohl kein problem sein, weil bei NaN setzt er es auf default was einen wert ausgeben sollte, wenn man etwas ausgewählt hat */
                            unit={getMath("W/(m*K)").formula}
                            placeholder={lambda === undefined ? "0" : `${lambda}`}
                            value={lambda ?? ""}
                            onChange={(value) => {
                                useVariableStoreBase.setState((state) => ({
                                    building_ConstructionParts: {
                                        ...state.building_ConstructionParts,
                                        [ConstructionPart.TopSide]: {
                                            ...state.building_ConstructionParts[ConstructionPart.TopSide],
                                            lambda: {
                                                ...state.building_ConstructionParts[ConstructionPart.TopSide].lambda,
                                                chosen: isNaN(value.target.valueAsNumber)
                                                    ? DefaultCustom.Default
                                                    : DefaultCustom.Custom,
                                                _customValue: isNaN(value.target.valueAsNumber)
                                                    ? null
                                                    : value.target.valueAsNumber,
                                            },
                                        },
                                    },
                                }));
                            }}
                            unitTitle={getMath("W/(m*K)").title}
                        />
                    </DivSmall>
                </div>

                {thickness !== undefined && (
                    <>
                        <Separator />
                        <h3>
                            Die benötigte Dämmung sollte ca.{" "}
                            <span className="font-bold">
                                {`${thickness.toLocaleString(navigator.languages, OBJnachkomma)}`}
                            </span>{" "}
                            cm dick sein.
                        </h3>
                    </>
                )}
            </DivGroup2>
        </DivGroup2>
    );
}

function OuterWall() {
    const OBJnachkomma = {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    };
    const restrictionTypeOuter = useVariableStoreBase(
        (state) => state.building_ConstructionParts[ConstructionPart.OuterWall].restrictions.outside,
    );
    const isRestrictedOuter =
        restrictionTypeOuter.distanceToStreetProblematic ||
        restrictionTypeOuter.enoughRoofOverhang ||
        restrictionTypeOuter.monumentalProtection;

    const restrictionTypeInner = useVariableStoreBase(
        (state) => state.building_ConstructionParts[ConstructionPart.OuterWall].restrictions.inside,
    );
    const isRestrictedInner =
        restrictionTypeInner.monumentalProtection ||
        restrictionTypeInner.distanceToHeatingElement ||
        restrictionTypeInner.livingAreaCouldGetToSmall;
    const standard = useVariableStoreBase(
        (state) => state.building_ConstructionParts[ConstructionPart.OuterWall].targetedStandard,
    );
    const thermalTransferCoefficient = useVariableStoreBase((state) =>
        state.building_ConstructionParts[ConstructionPart.OuterWall].thermalTransmissionCoefficient[
            state.building_ConstructionParts[ConstructionPart.OuterWall].thermalTransmissionCoefficient.chosen
        ](),
    );
    const lambda = useVariableStoreBase((state) =>
        state.building_ConstructionParts[ConstructionPart.OuterWall].lambda[
            state.building_ConstructionParts[ConstructionPart.OuterWall].lambda.chosen
        ](),
    );
    const insulationType = useVariableStoreBase(
        (state) => state.building_ConstructionParts[ConstructionPart.OuterWall].insulationType,
    );
    const thickness = useVariableStoreBase((state) =>
        state.building_ConstructionParts[ConstructionPart.OuterWall].insulationThickness(),
    );
    return (
        <DivGroup2 className="py-4">
            <DivGroup2>
                <Label>
                    <Heading3>Vorhandene Einschränkungen bei der Außenwanddämmung</Heading3>
                </Label>
                <DivGroup3>
                    {Object.values(RestrictionsWallOutside).map((type) => {
                        return (
                            <DivCheckbox>
                                <Checkbox
                                    id={`outside${type}`}
                                    checked={restrictionTypeOuter[type]}
                                    onCheckedChange={(value) => {
                                        if (value === true || value === false) {
                                            useVariableStoreBase.setState((state) => ({
                                                building_ConstructionParts: {
                                                    ...state.building_ConstructionParts,
                                                    [ConstructionPart.OuterWall]: {
                                                        ...state.building_ConstructionParts[ConstructionPart.OuterWall],
                                                        restrictions: {
                                                            ...state.building_ConstructionParts[
                                                                ConstructionPart.OuterWall
                                                            ].restrictions,
                                                            outside: {
                                                                ...state.building_ConstructionParts[
                                                                    ConstructionPart.OuterWall
                                                                ].restrictions.outside,
                                                                [type]: value,
                                                            },
                                                        },
                                                    },
                                                },
                                            }));
                                        }
                                    }}
                                />
                                <Label htmlFor={`outside${type}`}>
                                    {type === RestrictionsWallOutside.DistanceToStreetProblematic ? (
                                        "Grenzabstände (z. B. zur Straße)"
                                    ) : type === RestrictionsWallOutside.EnoughRoofOverhang ? (
                                        "Ausreichend Dachüberstand"
                                    ) : type === RestrictionsWallOutside.MonumentalProtection ? (
                                        "Denkmalschutz außen"
                                    ) : (
                                        <></>
                                    )}
                                </Label>
                            </DivCheckbox>
                        );
                    })}
                    {isRestrictedOuter && (
                        <Alert>
                            <TriangleAlert className="h-4 w-4" />
                            <AlertDescription>
                                Leider ist durch die vorliegenden Einschränkungen die Außenwanddämmung nicht möglich.
                            </AlertDescription>
                        </Alert>
                    )}
                </DivGroup3>
            </DivGroup2>
            <DivGroup2>
                <Label>
                    <Heading3>Vorhandene Einschränkungen bei der Innenwanddämmung</Heading3>
                </Label>
                <DivGroup3>
                    {Object.values(RestrictionsWallInside).map((type) => {
                        return (
                            <DivCheckbox>
                                <Checkbox
                                    id={`inside${type}`}
                                    checked={restrictionTypeInner[type]}
                                    disabled={!isRestrictedOuter}
                                    onCheckedChange={(value) => {
                                        if (value === true || value === false) {
                                            useVariableStoreBase.setState((state) => ({
                                                building_ConstructionParts: {
                                                    ...state.building_ConstructionParts,
                                                    [ConstructionPart.OuterWall]: {
                                                        ...state.building_ConstructionParts[ConstructionPart.OuterWall],
                                                        restrictions: {
                                                            ...state.building_ConstructionParts[
                                                                ConstructionPart.OuterWall
                                                            ].restrictions,
                                                            inside: {
                                                                ...state.building_ConstructionParts[
                                                                    ConstructionPart.OuterWall
                                                                ].restrictions.inside,
                                                                [type]: value,
                                                            },
                                                        },
                                                    },
                                                },
                                            }));
                                        }
                                    }}
                                />
                                <Label htmlFor={`inside${type}`}>
                                    {type === RestrictionsWallInside.MonumentalProtection ? (
                                        "Denkmalschutz innen"
                                    ) : type === RestrictionsWallInside.DistanceToHeatingElement ? (
                                        "Abstand zwischen Heizkörper und Wand unter 2 cm"
                                    ) : type === RestrictionsWallInside.LivingAreaCouldGetToSmall ? (
                                        "Wohnraumverlust problematisch"
                                    ) : (
                                        <></>
                                    )}
                                </Label>
                            </DivCheckbox>
                        );
                    })}
                    {isRestrictedInner && (
                        <Alert>
                            <TriangleAlert className="h-4 w-4" />
                            <AlertDescription>
                                Leider ist durch die vorliegenden Einschränkungen die Innenwanddämmung nicht möglich.
                            </AlertDescription>
                        </Alert>
                    )}
                </DivGroup3>
            </DivGroup2>
            {(isRestrictedOuter === false || isRestrictedInner === false) && (
                <>
                    <DivGroup2>
                        <Label htmlFor="wantedStandard">
                            <Heading3>Angestrebter Energiestandard</Heading3>
                        </Label>
                        <DivGroup3>
                            <RadioGroup id="wantedStandard" value={standard ?? ""}>
                                {Object.values(InsulationStandard).map((type) => {
                                    return (
                                        <DivRadioGroupItem
                                            key={
                                                type
                                            } /*  className="col-span-full grid grid-cols-subgrid items-center gap-2" */
                                        >
                                            <RadioGroupItem
                                                id={type}
                                                value={type}
                                                onClick={() =>
                                                    useVariableStoreBase.setState((state) => ({
                                                        building_ConstructionParts: {
                                                            ...state.building_ConstructionParts,
                                                            [ConstructionPart.OuterWall]: {
                                                                ...state.building_ConstructionParts[
                                                                    ConstructionPart.OuterWall
                                                                ],
                                                                targetedStandard: type,
                                                            },
                                                        },
                                                    }))
                                                }
                                            />
                                            <Label htmlFor={type}>
                                                {type === InsulationStandard.BEG ? (
                                                    "BEG (Bundesförderung für effiziente Gebäude)"
                                                ) : type === InsulationStandard.GEG ? (
                                                    "GEG (Gebäudeenergiegesetz)"
                                                ) : (
                                                    <></>
                                                )}
                                            </Label>
                                        </DivRadioGroupItem>
                                    );
                                })}
                            </RadioGroup>
                        </DivGroup3>
                    </DivGroup2>

                    <div className="grid grid-cols-[auto_1fr_30%] items-center gap-2">
                        <CornerDownRight className="mb-2 size-5" />
                        <Label htmlFor="thermalTransmissionCoefficient">Wärmedurchgangskoeffizient:</Label>

                        <DivSmall>
                            <InputWithUnit
                                type="number"
                                id="thermalTransmissionCoefficient"
                                // disabled={standard !== null}
                                unit={getMath("W/((m^2)*K)").formula}
                                placeholder={
                                    thermalTransferCoefficient === undefined ? "0" : `${thermalTransferCoefficient}`
                                }
                                value={thermalTransferCoefficient ?? ""}
                                onChange={(value) => {
                                    useVariableStoreBase.setState((state) => ({
                                        building_ConstructionParts: {
                                            ...state.building_ConstructionParts,
                                            [ConstructionPart.OuterWall]: {
                                                ...state.building_ConstructionParts[ConstructionPart.OuterWall],
                                                thermalTransmissionCoefficient: {
                                                    ...state.building_ConstructionParts[ConstructionPart.OuterWall]
                                                        .thermalTransmissionCoefficient,
                                                    chosen: isNaN(value.target.valueAsNumber)
                                                        ? DefaultCustom.Default
                                                        : DefaultCustom.Custom,
                                                    _customValue: isNaN(value.target.valueAsNumber)
                                                        ? null
                                                        : value.target.valueAsNumber,
                                                },
                                            },
                                        },
                                    }));
                                }}
                                unitTitle={getMath("W/((m^2)*K)").title}
                            />
                        </DivSmall>
                    </div>

                    <DivGroup2>
                        <Label htmlFor="wantedStandard">
                            <Heading3>Dämmmaterial</Heading3>
                        </Label>
                        <DivGroup3>
                            <RadioGroup id="wantedStandard" value={insulationType ?? ""}>
                                {isRestrictedOuter === false ? (
                                    Array.from(getAvailableInsulationTypes(InsulationZoneType.WallOutside)).map(
                                        (type) => {
                                            return (
                                                <DivRadioGroupItem
                                                    key={type}
                                                    /* className="col-span-full grid grid-cols-subgrid items-center gap-2" */
                                                >
                                                    <RadioGroupItem
                                                        id={type}
                                                        value={type}
                                                        onClick={() =>
                                                            useVariableStoreBase.setState((state) => ({
                                                                building_ConstructionParts: {
                                                                    ...state.building_ConstructionParts,
                                                                    [ConstructionPart.OuterWall]: {
                                                                        ...state.building_ConstructionParts[
                                                                            ConstructionPart.OuterWall
                                                                        ],
                                                                        insulationType: type,
                                                                    },
                                                                },
                                                            }))
                                                        }
                                                    />
                                                    <Label htmlFor={type}>{type}</Label>
                                                </DivRadioGroupItem>
                                            );
                                        },
                                    )
                                ) : isRestrictedInner === false ? (
                                    Array.from(getAvailableInsulationTypes(InsulationZoneType.WallInside)).map(
                                        (type) => {
                                            return (
                                                <DivRadioGroupItem
                                                    key={type}
                                                    /* className="col-span-full grid grid-cols-subgrid items-center gap-2" */
                                                >
                                                    <RadioGroupItem
                                                        id={type}
                                                        value={type}
                                                        onClick={() =>
                                                            useVariableStoreBase.setState((state) => ({
                                                                building_ConstructionParts: {
                                                                    ...state.building_ConstructionParts,
                                                                    [ConstructionPart.OuterWall]: {
                                                                        ...state.building_ConstructionParts[
                                                                            ConstructionPart.OuterWall
                                                                        ],
                                                                        insulationType: type,
                                                                    },
                                                                },
                                                            }))
                                                        }
                                                    />
                                                    <Label htmlFor={type}>{type}</Label>
                                                </DivRadioGroupItem>
                                            );
                                        },
                                    )
                                ) : (
                                    <></>
                                )}
                            </RadioGroup>
                        </DivGroup3>
                    </DivGroup2>

                    <div className="grid grid-cols-[auto_1fr_30%] items-center gap-2">
                        <CornerDownRight className="mb-2 size-5" />
                        <Label htmlFor="lambdaOuterWall">Wärmeleitfähigkeit:</Label>
                        <DivSmall>
                            <InputWithUnit
                                type="number"
                                id="lambdaOuterWall"
                                disabled={
                                    lambda === undefined
                                } /* sollte wohl kein problem sein, weil bei NaN setzt er es auf default was einen wert ausgeben sollte, wenn man etwas ausgewählt hat */
                                unit={getMath("W/(m*K)").formula}
                                placeholder={lambda === undefined ? "0" : `${lambda}`}
                                value={lambda ?? ""}
                                onChange={(value) => {
                                    useVariableStoreBase.setState((state) => ({
                                        building_ConstructionParts: {
                                            ...state.building_ConstructionParts,
                                            [ConstructionPart.OuterWall]: {
                                                ...state.building_ConstructionParts[ConstructionPart.OuterWall],
                                                lambda: {
                                                    ...state.building_ConstructionParts[ConstructionPart.OuterWall]
                                                        .lambda,
                                                    chosen: isNaN(value.target.valueAsNumber)
                                                        ? DefaultCustom.Default
                                                        : DefaultCustom.Custom,
                                                    _customValue: isNaN(value.target.valueAsNumber)
                                                        ? null
                                                        : value.target.valueAsNumber,
                                                },
                                            },
                                        },
                                    }));
                                }}
                                unitTitle={getMath("W/(m*K)").title}
                            />
                        </DivSmall>
                    </div>
                </>
            )}
            {thickness !== undefined && (
                <>
                    <Separator />
                    <h3>
                        Die benötigte Dämmung sollte ca.{" "}
                        <span className="font-bold">
                            {`${thickness.toLocaleString(navigator.languages, OBJnachkomma)}`}
                        </span>{" "}
                        cm dick sein.
                    </h3>
                </>
            )}
        </DivGroup2>
    );
}
function Windows() {
    const sunProtection = useVariableStoreBase(
        (state) => state.building_ConstructionParts[ConstructionPart.Window].sunProtectionExisting,
    );

    const standard = useVariableStoreBase(
        (state) => state.building_ConstructionParts[ConstructionPart.Window].targetedStandard,
    );
    const thermalTransferCoefficient = useVariableStoreBase((state) =>
        state.building_ConstructionParts[ConstructionPart.Window].thermalTransmissionCoefficient[
            state.building_ConstructionParts[ConstructionPart.Window].thermalTransmissionCoefficient.chosen
        ](),
    );

    return (
        <div className="grid h-min gap-2 md:gap-4">
            <div className="grid gap-2 md:gap-4">
                <Heading3>Angestrebter Energiestandard</Heading3>
                <RadioGroup id="wantedStandard" value={standard ?? ""}>
                    {Object.values(InsulationStandard).map((type) => {
                        return (
                            <DivRadioGroupItem
                                key={type} /*  className="col-span-full grid grid-cols-subgrid items-center gap-2" */
                            >
                                <RadioGroupItem
                                    id={type}
                                    value={type}
                                    onClick={() =>
                                        useVariableStoreBase.setState((state) => ({
                                            building_ConstructionParts: {
                                                ...state.building_ConstructionParts,
                                                [ConstructionPart.Window]: {
                                                    ...state.building_ConstructionParts[ConstructionPart.Window],
                                                    targetedStandard: type,
                                                },
                                            },
                                        }))
                                    }
                                />
                                <Label htmlFor={type}>
                                    {type === InsulationStandard.BEG ? (
                                        "BEG (Bundesförderung für effiziente Gebäude)"
                                    ) : type === InsulationStandard.GEG ? (
                                        "GEG (Gebäudeenergiegesetz)"
                                    ) : (
                                        <></>
                                    )}
                                </Label>
                            </DivRadioGroupItem>
                        );
                    })}
                </RadioGroup>
                <div className="grid h-min items-center gap-2 sm:grid-cols-[auto_1fr] md:gap-4">
                    <div className="grid grid-cols-[auto_1fr_30%] items-center gap-2">
                        <CornerDownRight className="mb-2 size-5" />
                        <Label htmlFor="thermalTransmissionCoefficient">Wärmedurchgangskoeffizient:</Label>
                        <InputWithUnit
                            type="number"
                            id="consumption"
                            // disabled={standard !== null}
                            unit={getMath("W/((m^2)*K)").formula}
                            placeholder={
                                thermalTransferCoefficient === undefined ? "0" : `${thermalTransferCoefficient}`
                            }
                            value={thermalTransferCoefficient ?? ""}
                            onChange={(value) => {
                                useVariableStoreBase.setState((state) => ({
                                    building_ConstructionParts: {
                                        ...state.building_ConstructionParts,
                                        [ConstructionPart.Window]: {
                                            ...state.building_ConstructionParts[ConstructionPart.Window],
                                            thermalTransmissionCoefficient: {
                                                ...state.building_ConstructionParts[ConstructionPart.Window]
                                                    .thermalTransmissionCoefficient,
                                                chosen: isNaN(value.target.valueAsNumber)
                                                    ? DefaultCustom.Default
                                                    : DefaultCustom.Custom,
                                                _customValue: isNaN(value.target.valueAsNumber)
                                                    ? null
                                                    : value.target.valueAsNumber,
                                            },
                                        },
                                    },
                                }));
                            }}
                            unitTitle={getMath("W/((m^2)*K)").title}
                        />
                    </div>
                </div>
            </div>
            <DivCheckbox>
                <Checkbox
                    id={"sunProtection"}
                    checked={sunProtection === null ? false : sunProtection}
                    onCheckedChange={(value) => {
                        if (value === true || value === false) {
                            useVariableStoreBase.setState((state) => ({
                                building_ConstructionParts: {
                                    ...state.building_ConstructionParts,
                                    [ConstructionPart.Window]: {
                                        ...state.building_ConstructionParts[ConstructionPart.Window],
                                        sunProtectionExisting: value,
                                    },
                                },
                            }));
                        }
                    }}
                />
                <Label htmlFor="sunProtection">funktionsfähiger Sonnenschutz vorhanden</Label>
            </DivCheckbox>
            {!sunProtection ? (
                <Alert>
                    <TriangleAlert className="h-4 w-4" />
                    <AlertDescription>
                        Es wird empfohlen einen innen- und außenliegenden Sonnenschutz zu installieren.
                    </AlertDescription>
                </Alert>
            ) : (
                <></>
            )}
        </div>
    );
}
function BottomSide() {
    const OBJnachkomma = {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    };
    const basement = useVariableStoreBase(
        (state) => state.building_ConstructionParts[ConstructionPart.BottomSide].basement,
    );
    const hasBasement = basement !== null;
    const isHeated = basement === HeatedUnheated.Heated;

    const standard = useVariableStoreBase(
        (state) => state.building_ConstructionParts[ConstructionPart.BottomSide].targetedStandard,
    );
    const thermalTransferCoefficient = useVariableStoreBase((state) =>
        state.building_ConstructionParts[ConstructionPart.BottomSide].thermalTransmissionCoefficient[
            state.building_ConstructionParts[ConstructionPart.BottomSide].thermalTransmissionCoefficient.chosen
        ](),
    );

    const lambda = useVariableStoreBase((state) =>
        state.building_ConstructionParts[ConstructionPart.BottomSide].lambda[
            state.building_ConstructionParts[ConstructionPart.BottomSide].lambda.chosen
        ](),
    );
    const insulationType = useVariableStoreBase(
        (state) => state.building_ConstructionParts[ConstructionPart.BottomSide].insulationType,
    );
    const thickness = useVariableStoreBase((state) =>
        state.building_ConstructionParts[ConstructionPart.BottomSide].insulationThickness(),
    );
    return (
        <div className="mt-4 grid h-min gap-2 md:gap-4">
            <div className="grid gap-2 md:gap-4">
                <DivCheckbox>
                    <Checkbox
                        id={"basementHeated"}
                        checked={hasBasement}
                        onCheckedChange={(value) => {
                            if (value === true || value === false) {
                                useVariableStoreBase.setState((state) => ({
                                    building_ConstructionParts: {
                                        ...state.building_ConstructionParts,
                                        [ConstructionPart.BottomSide]: {
                                            ...state.building_ConstructionParts[ConstructionPart.BottomSide],
                                            basement: value ? undefined : null,
                                        },
                                    },
                                }));
                            }
                        }}
                    />
                    <Label htmlFor="basementHeated">Keller ist vorhanden</Label>
                </DivCheckbox>
                <RadioGroup id="basement" value={basement ?? ""} disabled={!hasBasement}>
                    {Object.values(HeatedUnheated).map((type) => (
                        <DivRadioGroupItem
                            key={type} /* className="col-span-full grid grid-cols-subgrid items-center gap-2" */
                        >
                            <RadioGroupItem
                                id={type}
                                value={type}
                                onClick={() =>
                                    useVariableStoreBase.setState((state) => ({
                                        building_ConstructionParts: {
                                            ...state.building_ConstructionParts,
                                            [ConstructionPart.BottomSide]: {
                                                ...state.building_ConstructionParts[ConstructionPart.BottomSide],
                                                basement: type,
                                            },
                                        },
                                    }))
                                }
                            />
                            <Label htmlFor={type}>
                                {type === HeatedUnheated.Heated ? (
                                    "beheizt"
                                ) : type === HeatedUnheated.Unheated ? (
                                    "unbeheizt"
                                ) : (
                                    <></>
                                )}
                            </Label>
                        </DivRadioGroupItem>
                    ))}
                </RadioGroup>

                {hasBasement && isHeated === false && basement !== undefined ? (
                    <>
                        <div className="grid gap-2 md:gap-4">
                            <Heading3>Angestrebter Energiestandard</Heading3>
                            <RadioGroup id="wantedStandard" value={standard ?? ""}>
                                {Object.values(InsulationStandard).map((type) => {
                                    return (
                                        <DivRadioGroupItem
                                            key={type}
                                            /* className="col-span-full grid grid-cols-subgrid items-center gap-2" */
                                        >
                                            <RadioGroupItem
                                                id={type}
                                                value={type}
                                                onClick={() =>
                                                    useVariableStoreBase.setState((state) => ({
                                                        building_ConstructionParts: {
                                                            ...state.building_ConstructionParts,
                                                            [ConstructionPart.BottomSide]: {
                                                                ...state.building_ConstructionParts[
                                                                    ConstructionPart.BottomSide
                                                                ],
                                                                targetedStandard: type,
                                                            },
                                                        },
                                                    }))
                                                }
                                            />
                                            <Label htmlFor={type}>
                                                {type === InsulationStandard.BEG ? (
                                                    "BEG (Bundesförderung für effiziente Gebäude)"
                                                ) : type === InsulationStandard.GEG ? (
                                                    "GEG (Gebäudeenergiegesetz)"
                                                ) : (
                                                    <></>
                                                )}
                                            </Label>
                                        </DivRadioGroupItem>
                                    );
                                })}
                            </RadioGroup>
                            <div className="grid h-min items-center gap-2 sm:grid-cols-[auto_1fr] md:gap-4">
                                <div className="grid grid-cols-[auto_1fr_30%] items-center gap-2">
                                    <CornerDownRight className="mb-2 size-5" />
                                    <Label htmlFor="thermalTransmissionCoefficient">Wärmedurchgangskoeffizient:</Label>
                                    <InputWithUnit
                                        type="number"
                                        id="consumption"
                                        // disabled={standard !== null}
                                        unit={getMath("W/((m^2)*K)").formula}
                                        placeholder={
                                            thermalTransferCoefficient === undefined
                                                ? "0"
                                                : `${thermalTransferCoefficient}`
                                        }
                                        value={thermalTransferCoefficient ?? ""}
                                        onChange={(value) => {
                                            useVariableStoreBase.setState((state) => ({
                                                building_ConstructionParts: {
                                                    ...state.building_ConstructionParts,
                                                    [ConstructionPart.BottomSide]: {
                                                        ...state.building_ConstructionParts[
                                                            ConstructionPart.BottomSide
                                                        ],
                                                        thermalTransmissionCoefficient: {
                                                            ...state.building_ConstructionParts[
                                                                ConstructionPart.BottomSide
                                                            ].thermalTransmissionCoefficient,
                                                            chosen: isNaN(value.target.valueAsNumber)
                                                                ? DefaultCustom.Default
                                                                : DefaultCustom.Custom,
                                                            _customValue: isNaN(value.target.valueAsNumber)
                                                                ? null
                                                                : value.target.valueAsNumber,
                                                        },
                                                    },
                                                },
                                            }));
                                        }}
                                        unitTitle={getMath("W/((m^2)*K)").title}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-2 md:gap-4">
                            <Heading3>Dämmmaterial</Heading3>
                            <RadioGroup id="wantedStandard" value={insulationType ?? ""}>
                                {Array.from(getAvailableInsulationTypes(InsulationZoneType.BasementCeiling)).map(
                                    (type) => {
                                        return (
                                            <DivRadioGroupItem
                                                key={type}
                                                /* className="col-span-full grid grid-cols-subgrid items-center gap-2" */
                                            >
                                                <RadioGroupItem
                                                    id={type}
                                                    value={type}
                                                    onClick={() =>
                                                        useVariableStoreBase.setState((state) => ({
                                                            building_ConstructionParts: {
                                                                ...state.building_ConstructionParts,
                                                                [ConstructionPart.BottomSide]: {
                                                                    ...state.building_ConstructionParts[
                                                                        ConstructionPart.BottomSide
                                                                    ],
                                                                    insulationType: type,
                                                                },
                                                            },
                                                        }))
                                                    }
                                                />
                                                <Label htmlFor={type}>{type}</Label>
                                            </DivRadioGroupItem>
                                        );
                                    },
                                )}
                            </RadioGroup>
                            <div className="grid h-min items-center gap-2 sm:grid-cols-[auto_1fr] md:gap-4">
                                <div className="grid grid-cols-[auto_1fr_30%] items-center gap-2">
                                    <CornerDownRight className="mb-2 size-5" />
                                    <Label htmlFor="lambdaOuterWall">Wärmeleitfähigkeit:</Label>
                                    <InputWithUnit
                                        type="number"
                                        id="lambdaOuterWall"
                                        disabled={
                                            lambda === undefined
                                        } /* sollte wohl kein problem sein, weil bei NaN setzt er es auf default was einen wert ausgeben sollte, wenn man etwas ausgewählt hat */
                                        unit={getMath("W/(m*K)").formula}
                                        placeholder={lambda === undefined ? "0" : `${lambda}`}
                                        value={lambda ?? ""}
                                        onChange={(value) => {
                                            useVariableStoreBase.setState((state) => ({
                                                building_ConstructionParts: {
                                                    ...state.building_ConstructionParts,
                                                    [ConstructionPart.BottomSide]: {
                                                        ...state.building_ConstructionParts[
                                                            ConstructionPart.BottomSide
                                                        ],
                                                        lambda: {
                                                            ...state.building_ConstructionParts[
                                                                ConstructionPart.BottomSide
                                                            ].lambda,
                                                            chosen: isNaN(value.target.valueAsNumber)
                                                                ? DefaultCustom.Default
                                                                : DefaultCustom.Custom,
                                                            _customValue: isNaN(value.target.valueAsNumber)
                                                                ? null
                                                                : value.target.valueAsNumber,
                                                        },
                                                    },
                                                },
                                            }));
                                        }}
                                        unitTitle={getMath("W/(m*K)").title}
                                    />
                                </div>
                            </div>
                        </div>

                        {thickness !== undefined && (
                            <>
                                <Separator />
                                <h3>
                                    Die benötigte Dämmung sollte ca.{" "}
                                    <span className="font-bold">
                                        {`${thickness.toLocaleString(navigator.languages, OBJnachkomma)}`}
                                    </span>{" "}
                                    cm dick sein.
                                </h3>
                            </>
                        )}
                    </>
                ) : (
                    <Alert>
                        <TriangleAlert className="h-4 w-4" />
                        <AlertDescription>
                            Baulicher Aufwand kann nicht eingeschätzt werden. Kontaktieren Sie einen Energieberater.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
}
