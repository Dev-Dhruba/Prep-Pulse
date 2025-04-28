// react-three-fiber.d.ts
declare module '@react-three/fiber' {
  import * as THREE from 'three';
  import * as React from 'react';

  export type ThreeEvent<T, E> = E & {
    object: T;
    eventObject: T;
    stopPropagation(): void;
  };

  export function useFrame(
    callback: (state: {
      clock: THREE.Clock;
      camera: THREE.Camera;
      scene: THREE.Scene;
      gl: THREE.WebGLRenderer;
      [key: string]: any;
    }, delta: number) => void, 
    renderPriority?: number
  ): void;

  export function Canvas(props: any): JSX.Element;
  
  // Add other exports as needed
}

declare module '@react-three/drei' {
  import * as THREE from 'three';
  
  export function useGLTF(path: string): {
    scene: THREE.Group;
    nodes: Record<string, THREE.Object3D>;
    materials: Record<string, THREE.Material>;
    animations: THREE.AnimationClip[];
    [key: string]: any;
  };
  
  export function useTexture(paths: string | string[]): any;
  export function useFBX(path: string): THREE.Group;
  export function useAnimations(
    animations: THREE.AnimationClip[], 
    ref?: React.MutableRefObject<THREE.Object3D | null>
  ): {
    ref: React.MutableRefObject<THREE.Object3D | null>;
    names: string[];
    clips: THREE.AnimationClip[];
    actions: Record<string, THREE.AnimationAction>;
  };
  
  export function Environment(props: any): JSX.Element;
  
  // Add other exports as needed
}