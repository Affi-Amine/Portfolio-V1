import React, { useRef, useState, Suspense } from 'react'
import { Environment, useGLTF, Float, ContactShadows, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'

const handlePointerOver = () => {
    document.body.style.cursor = "pointer";
};

const handlePointerOut = () => {
    document.body.style.cursor = "default";
};

function Model({ open, ...props }) {
    const group = useRef()
    const { nodes, materials } = useGLTF('/mac-draco.glb')
    
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, open ? Math.cos(t / 10) / 10 + 0.25 : 0, 0.1)
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, open ? Math.sin(t / 10) / 4 : 0, 0.1)
        group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, open ? Math.sin(t / 10) / 10 : 0, 0.1)
        group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, open ? (-2 + Math.sin(t)) / 3 : -4.3, 0.1)
    })

    return (
        <group ref={group} {...props} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
            <animated.group rotation-x={props.hinge} position={open? [0, -0.04 +1, 0.41]: [0, -0.04 +5, 0.41]}>
                <group position={[0, 2.96, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
                    <mesh material={materials.aluminium} geometry={nodes['Cube008'].geometry} />
                    <mesh material={materials['matte.001']} geometry={nodes['Cube008_1'].geometry} />
                    <mesh material={materials['screen.001']} geometry={nodes['Cube008_2'].geometry} />
                </group>
            </animated.group>
            <mesh material={materials.keys} geometry={nodes.keyboard.geometry} position={open? [1.79, 0+1, 3.45]: [1.79, 0+5, 3.45]} />
            <group position={open? [0, -0.1+1, 3.39]: [0, -0.1+5, 3.39]}>
                <mesh material={materials.aluminium} geometry={nodes['Cube002'].geometry} />
                <mesh material={materials.trackpad} geometry={nodes['Cube002_1'].geometry} />
            </group>
            <mesh material={materials.touchbar} geometry={nodes.touchbar.geometry} position={open? [0, -0.03+1, 1.2]: [0, -0.03+5, 1.2]} />
        </group>
    )
}

export default function Model3D() {
    const [open, setOpen] = useState(true)
    const props = useSpring({ open: Number(open) })

    return (
        <Canvas 
            style={{ height: '100%', width: '100%' }}
            camera={{ position: [0, 7, -25], fov: 35, near: 1, far: 40 }}
        >
            <Suspense fallback={null}>
                <Float speed={1} rotationIntensity={1} floatIntensity={2}>
                    <group rotation={[0, Math.PI, 0]} onClick={(e) => (e.stopPropagation(), setOpen(!open))}>
                        <Model open={open} hinge={props.open.to([0, 1], [1.575, -0.425])} />
                    </group>
                </Float>
            </Suspense>
            <ContactShadows
                position={[0, -3.5, 0]}
                opacity={0.65}
                scale={40}
                blur={1}
                far={9}
            />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <Environment preset='sunset' />
        </Canvas>
    )
}