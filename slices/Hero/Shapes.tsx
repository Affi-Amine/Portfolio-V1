"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Float, Environment } from "@react-three/drei";
import { gsap } from "gsap";
import { useRef, useState, useEffect, Suspense } from "react";

type GeometryProps = {
    r: number;
    position: [number, number, number];
    geometry: THREE.BufferGeometry;
    materials: THREE.Material[];
    soundEffects: HTMLAudioElement[];
};

export default function Shapes() {
    return (
        <div className="row-span-1 row-start-1 -mt-9 aspect-square md:col-span-1 md:col-start-2 md:mt-0">
            <Canvas
                className="z-0"
                shadows
                gl={{ antialias: false }} //antialias is a tech to remove alias artifacts => more smooth scene
                dpr={[1, 1.5]} //device pixel ration, when we put an array in dpr we are enabling Dynamic DPR
                //f the device has a DPR of 1.2, the renderer will render the scene at a resolution 
                //of 1.2:1, which is between the minimum and maximum values.
                camera={{ position: [0, 0, 20], fov: 30, near: 1, far: 40 }}
            >
                <Suspense fallback={null} //waits for its children to load before rendering.
                >
                    <Geometries />
                    <ContactShadows
                        position={[0, -3.5, 0]}
                        opacity={0.65}
                        scale={40}
                        blur={1}
                        far={9}
                    />
                    <Environment preset="sunset" //Sets up lighting and environment effects using a predefined “studio” preset.
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}

function Geometries() {
    const geometries = [
        /*{
            position: [0, 0, 0],
            r: 0.3,
            geometry: new THREE.IcosahedronGeometry(3), //Gem
        },*/
        {
            position: [1, -0.75, 4],
            r: 0.4,
            geometry: new THREE.CapsuleGeometry(.5, 1.6, 2, 16), //Pill
        },
        {
            position: [-1.4, 2, -4],
            r: 0.6,
            geometry: new THREE.DodecahedronGeometry(1.5), // Soccer ball
        },
        {
            position: [-0.8, -0.75, 5],
            r: 0.5,
            geometry: new THREE.TorusGeometry(0.6, 0.25, 16, 32), // Donut
        },
        {
            position: [1.6, 1.6, -4],
            r: 0.7,
            geometry: new THREE.OctahedronGeometry(1.5), // Diamond
        },
    ];

    const materials = [new THREE.MeshNormalMaterial(),
    new THREE.MeshStandardMaterial({ color: 0x27ae60, metalness: .5, roughness: 0 }),
    new THREE.MeshStandardMaterial({ color: 0x9b59b6, roughness: .3, metalness: .5 }),
    new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: .2, metalness: .5 }),
    new THREE.MeshStandardMaterial({ color: 0xe67e22, roughness: .5, metalness: .5 }),
    new THREE.MeshStandardMaterial({ color: 0x1abc9c, roughness: .2, metalness: .5 })
    ];

    const soundEffects = [
        new Audio("/sounds/knock1.ogg"),
        new Audio("/sounds/knock2.ogg"),
        new Audio("/sounds/knock3.ogg"),
    ]

    return geometries.map(({ position, r, geometry }) => (
        <Geometry
            key={JSON.stringify(position)}
            r={r}
            soundEffects={soundEffects}
            position={position.map((p) => p * 2) as [number, number, number]}
            geometry={geometry}
            materials={materials}
        />
    ));
}

function Geometry({ r, position, geometry, materials, soundEffects }: GeometryProps) {
    const meshRef = useRef<THREE.Group>(null);
    const [visible, setVisible] = useState(false); //we made it false to make the animaation
    const startingMaterial = getRandomMaterial();

    function getRandomMaterial() {
        return gsap.utils.random(materials) as THREE.Material;
    }

    function handleClick(e: any) {
        const mesh = e.object as THREE.Mesh;

        gsap.utils.random(soundEffects).play();

        gsap.to(mesh.rotation, {
            x: `+=${gsap.utils.random(0, 2)}`,
            y: `+=${gsap.utils.random(0, 2)}`,
            z: `+=${gsap.utils.random(0, 2)}`,
            duration: 1.3,
            ease: "elastic.inOut(1, 0.3)",
            yoyo: true,
        });

        mesh.material = getRandomMaterial();
    }

    const handlePointerOver = () => {
        document.body.style.cursor = "pointer";
    };

    const handlePointerOut = () => {
        document.body.style.cursor = "default";
    };

    useEffect(() => {
        if (meshRef.current) {
            let ctx = gsap.context(() => {
                setVisible(true);
                gsap.from(meshRef.current!.scale, {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration: 1,
                    ease: "elastic.out(1, 0.3)",
                    delay: 0.3,
                });
            });
            return () => ctx.revert();
        }
    }, []);


    return (
        <group position={position} ref={meshRef}>
            <Float speed={5 * r} rotationIntensity={6 * r} floatIntensity={5 * r}>
                <mesh
                    geometry={geometry}
                    onClick={handleClick}
                    onPointerOver={handlePointerOver}
                    onPointerOut={handlePointerOut}
                    visible={visible}
                    material={startingMaterial}
                />
            </Float>
        </group>
    );
}