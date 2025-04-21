'use client';

import React, { Suspense, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture,  Environment, useFBX, useAnimations } from '@react-three/drei';
import { MeshStandardMaterial, LineBasicMaterial, MeshPhysicalMaterial, Vector2, LinearSRGBColorSpace, SRGBColorSpace, Mesh, SkinnedMesh, LineSegments } from 'three';
import * as THREE from 'three';
import _ from 'lodash';

interface AvatarProps {
  avatar_url: string;
  speak?: boolean;
  setSpeak?: (value: boolean) => void;
  text?: string;
  setAudioSource?: (source: string | null) => void;
  playing?: boolean;
}

function Avatar({ avatar_url, speak, setSpeak, text, setAudioSource, playing }: AvatarProps) {
  let gltf = useGLTF(avatar_url);
  const [morphTargetDictionaryBody, setMorphTargetDictionaryBody] = useState<Record<string, number> | null>(null);
  const [morphTargetDictionaryLowerTeeth, setMorphTargetDictionaryLowerTeeth] = useState<Record<string, number> | null>(null);
  const [clips, setClips] = useState<THREE.AnimationClip[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const streamRef = useRef(null);
  const mixer = useMemo(() => new THREE.AnimationMixer(gltf.scene), []);
  
  // Move hooks to component level
  const idleFbx = useFBX('/idle.fbx');
  const { clips: idleClips } = useAnimations(idleFbx.animations);

  const [ 
    bodyTexture, 
    eyesTexture, 
    teethTexture, 
    bodySpecularTexture, 
    bodyRoughnessTexture, 
    bodyNormalTexture,
    teethNormalTexture,
    hairTexture,
    tshirtDiffuseTexture,
    tshirtNormalTexture,
    tshirtRoughnessTexture,
    hairAlphaTexture,
    hairNormalTexture,
    hairRoughnessTexture,
  ] = useTexture([
    "/images/body.webp",
    "/images/eyes.webp",
    "/images/teeth_diffuse.webp",
    "/images/body_specular.webp",
    "/images/body_roughness.webp",
    "/images/body_normal.webp",
    "/images/teeth_normal.webp",
    "/images/h_color.webp",
    "/images/tshirt_diffuse.webp",
    "/images/tshirt_normal.webp",
    "/images/tshirt_roughness.webp",
    "/images/h_alpha.webp",
    "/images/h_normal.webp",
    "/images/h_roughness.webp",
  ]);

  _.each([
    bodyTexture, 
    eyesTexture, 
    teethTexture, 
    teethNormalTexture, 
    bodySpecularTexture, 
    bodyRoughnessTexture, 
    bodyNormalTexture, 
    tshirtDiffuseTexture, 
    tshirtNormalTexture, 
    tshirtRoughnessTexture,
    hairAlphaTexture,
    hairNormalTexture,
    hairRoughnessTexture
  ], (t: THREE.Texture) => {
    t.colorSpace = SRGBColorSpace;
    t.flipY = false;
  });

  bodyNormalTexture.colorSpace = LinearSRGBColorSpace;
  tshirtNormalTexture.colorSpace = LinearSRGBColorSpace;
  teethNormalTexture.colorSpace = LinearSRGBColorSpace;
  hairNormalTexture.colorSpace = LinearSRGBColorSpace;
  
  useEffect(() => {
    gltf.scene.traverse((node) => {
      if (node instanceof Mesh || node instanceof SkinnedMesh || node instanceof LineSegments) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.frustumCulled = false;

        if (node.name.includes("Body")) {
          node.castShadow = true;
          node.receiveShadow = true;

          node.material = new MeshPhysicalMaterial();
          node.material.map = bodyTexture;
          node.material.roughness = 1.7;
          node.material.roughnessMap = bodyRoughnessTexture;
          node.material.normalMap = bodyNormalTexture;
          node.material.normalScale = new Vector2(0.6, 0.6);
          node.material.envMapIntensity = 0.8;

          if (node instanceof SkinnedMesh && node.morphTargetDictionary) {
            setMorphTargetDictionaryBody(node.morphTargetDictionary);
          }
        }

        if (node.name.includes("Eyes")) {
          node.material = new MeshStandardMaterial();
          node.material.map = eyesTexture;
          node.material.roughness = 0.1;
          node.material.envMapIntensity = 0.5;
        }

        if (node.name.includes("Brows")) {
          node.material = new LineBasicMaterial({color: 0x000000});
          node.material.linewidth = 1;
          node.material.opacity = 0.5;
          node.material.transparent = true;
          node.visible = false;
        }

        if (node.name.includes("Teeth")) {
          node.receiveShadow = true;
          node.castShadow = true;
          node.material = new MeshStandardMaterial();
          node.material.roughness = 0.1;
          node.material.map = teethTexture;
          node.material.normalMap = teethNormalTexture;
          node.material.envMapIntensity = 0.7;
        }

        if (node.name.includes("Hair")) {
          node.material = new MeshStandardMaterial();
          node.material.map = hairTexture;
          node.material.alphaMap = hairAlphaTexture;
          node.material.normalMap = hairNormalTexture;
          node.material.roughnessMap = hairRoughnessTexture;
          
          node.material.transparent = true;
          node.material.depthWrite = false;
          node.material.side = 2;
          node.material.color.setHex(0x000000);
          
          node.material.envMapIntensity = 0.3;
        }

        if (node.name.includes("TSHIRT")) {
          node.material = new MeshStandardMaterial();
          node.material.map = tshirtDiffuseTexture;
          node.material.roughnessMap = tshirtRoughnessTexture;
          node.material.normalMap = tshirtNormalTexture;
          node.material.color.setHex(0xffffff);
          node.material.envMapIntensity = 0.5;
        }

        if (node.name.includes("TeethLower") && node instanceof SkinnedMesh && node.morphTargetDictionary) {
          setMorphTargetDictionaryLowerTeeth(node.morphTargetDictionary);
        }
      }
    });
  }, [gltf.scene]);

  // Handle playing animation clips
  useEffect(() => {
    if (!clips.length) return;
    
    clips.forEach(clip => {
      if (clip) {
        let clipAction = mixer.clipAction(clip);
        clipAction.setLoop(THREE.LoopOnce, 1);
        clipAction.play();
      }
    });
  }, [clips, mixer]);

  // Handle idle animation
  useEffect(() => {
    if (!idleClips?.[0] || !mixer) return;

    const tracks = idleClips[0].tracks
      .filter(track => 
        track.name.includes("Head") || 
        track.name.includes("Neck") || 
        track.name.includes("Spine2")
      )
      .map(track => {
        let newName = track.name;
        if (track.name.includes("Head")) newName = "head.quaternion";
        if (track.name.includes("Neck")) newName = "neck.quaternion";
        if (track.name.includes("Spine")) newName = "Spine2.quaternion";
        
        const newTrack = track.clone();
        newTrack.name = newName;
        return newTrack;
      });

    const idleAnimation = new THREE.AnimationClip('idle', -1, tracks);
    const idleAction = mixer.clipAction(idleAnimation);
    idleAction.play();
  }, [mixer, idleClips]);

  useEffect(() => {
    if (playing === false || !clips.length) return;
    
    clips.forEach(clip => {
      if (clip) {
        let clipAction = mixer.clipAction(clip);
        clipAction.setLoop(THREE.LoopOnce, 1);
        clipAction.play();
      }
    });
  }, [playing, clips, mixer]);

  useFrame((state, delta) => {
    mixer.update(delta);
  });

  // Return the scene as a primitive element with proper positioning
  return gltf.scene ? (
    <>
      <primitive 
        object={gltf.scene} 
        position={[0, -0.7, 0]} // Lowered position to bring face to camera level
        rotation={[0.1, 0, 0]} // Slight forward tilt to face the camera better
        scale={1.0} // Adjusted scale for proper framing
      />
    </>
  ) : null;
}

export default Avatar;