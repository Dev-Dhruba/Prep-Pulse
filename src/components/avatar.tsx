'use client';

import React, { Suspense, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, useFBX, useAnimations } from '@react-three/drei';
import { MeshStandardMaterial, LineBasicMaterial, MeshPhysicalMaterial, Vector2, LinearSRGBColorSpace, SRGBColorSpace, Mesh, SkinnedMesh, LineSegments } from 'three';
import * as THREE from 'three';
import _ from 'lodash';
import blinkData from './blendDataBlink.json';

interface AvatarProps {
  avatar_url: string;
  speak?: boolean;
  setSpeak?: (value: boolean) => void;
  text?: string;
  setAudioSource?: (source: string | null) => void;
  playing?: boolean;
  isLargeScreen?: boolean;
  currentViseme?: number | null;
  visemeData?: { id: number; offset: number }[];
}

// Interface for blink data
interface BlinkFrame {
  time: number;
  blendshapes: {
    eyeBlinkLeft: number;
    eyeBlinkRight: number;
    mouthSmileLeft: number;
    mouthSmileRight: number;
  };
}

// Simplified viseme mapping for clearer lip sync
const visemeMap = {
  0: ["mouthClose"],           // silence/neutral
  1: ["mouthClose"],           // p, b, m
  2: ["mouthLowerDown"],       // f, v
  3: ["mouthPartial"],         // th
  4: ["tongueUp"],             // t, d
  5: ["jawOpen"],              // k, g
  6: ["mouthPucker"],          // ch, j, sh
  7: ["mouthNarrow"],          // s, z
  8: ["tongueUp"],             // n, l
  9: ["mouthRound"],           // r
  10: ["jawOpen", "mouthWide"],// a
  11: ["mouthSmile"],          // e
  12: ["mouthNarrow"],         // i
  13: ["mouthRound"],          // o
  14: ["mouthPucker"],         // u
};

// Direct mapping between viseme names and morph targets
const morphTargetNameMap = {
  "viseme_neutral": ["mouthClose", "mouthRelax", "viseme_neutral"],
  "viseme_PP": ["mouthClose", "mouthFunnel", "viseme_PP"],
  "viseme_FF": ["mouthLowerDown", "viseme_FF"],
  "viseme_TH": ["tongueOut", "mouthPartial", "viseme_TH"],
  "viseme_DD": ["tongueUp", "mouthPartial", "viseme_DD"],
  "viseme_kk": ["jawOpen", "tongueUp", "viseme_kk"],
  "viseme_CH": ["mouthPucker", "mouthFunnel", "viseme_CH"],
  "viseme_SS": ["mouthNarrow", "viseme_SS"],
  "viseme_nn": ["tongueUp", "mouthPartial", "viseme_nn"],
  "viseme_RR": ["mouthNarrow", "mouthPartial", "viseme_RR"],
  "viseme_aa": ["jawOpen", "mouthWide", "viseme_aa"],
  "viseme_E": ["mouthSmile", "mouthWide", "viseme_E"],
  "viseme_ih": ["mouthSmile", "mouthNarrow", "viseme_ih"],
  "viseme_oh": ["mouthRound", "jawOpen", "viseme_oh"],
  "viseme_ou": ["mouthPucker", "mouthRound", "viseme_ou"],
  "mouthClose": ["mouthClose", "viseme_neutral"],
  "mouthPucker": ["mouthPucker", "viseme_ou", "viseme_CH"],
  "mouthLowerDown": ["mouthLowerDown", "viseme_FF"],
  "mouthUpperUp": ["mouthUpperUp", "upperLipUp"],
  "jawForward": ["jawForward"],
  "tongueOut": ["tongueOut", "viseme_TH"],
  "tongueUp": ["tongueUp", "viseme_DD", "viseme_nn"],
  "jawOpen": ["jawOpen", "viseme_aa", "viseme_oh", "mouthOpen"],
  "mouthNarrow": ["mouthNarrow", "viseme_RR", "viseme_SS"],
  "mouthRound": ["mouthRound", "viseme_oh", "mouthFunnel"],
  "mouthSmile": ["mouthSmile", "viseme_E", "viseme_ih"],
  "mouthWide": ["mouthWide", "mouthStretch", "viseme_aa"],
  "mouthPartial": ["mouthPartial", "viseme_TH"]
};

function Avatar({ 
  avatar_url, 
  speak, 
  setSpeak, 
  text, 
  setAudioSource, 
  playing, 
  isLargeScreen,
  currentViseme,
  visemeData
}: AvatarProps) {
  let gltf = useGLTF(avatar_url);
  const [morphTargetDictionaryBody, setMorphTargetDictionaryBody] = useState<Record<string, number> | null>(null);
  const [morphTargetDictionaryLowerTeeth, setMorphTargetDictionaryLowerTeeth] = useState<Record<string, number> | null>(null);
  const [clips, setClips] = useState<THREE.AnimationClip[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const streamRef = useRef(null);
  const mixer = useMemo(() => new THREE.AnimationMixer(gltf.scene), []);
  
  // Blink related refs and states
  const blinkTimeRef = useRef(0);
  const blinkCycleRef = useRef(0);
  const cycleTimeRef = useRef(0);
  const [lastBlinkTime, setLastBlinkTime] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const blinkDataRef = useRef<BlinkFrame[]>(blinkData);
  
  // References to track mesh objects that need blendshapes applied
  const eyeBlinkLeftRef = useRef<SkinnedMesh | null>(null);
  const eyeBlinkRightRef = useRef<SkinnedMesh | null>(null);
  const mouthRef = useRef<SkinnedMesh | null>(null);
  
  // Keep track of all available morph targets/blend shapes
  const [allMorphTargets, setAllMorphTargets] = useState<{[key: string]: {mesh: SkinnedMesh, index: number}}>({}); 

  // Debug log azure viseme data
  useEffect(() => {
    if (visemeData && visemeData.length > 0) {
      console.log("Azure viseme data received:", visemeData.length, "visemes");
    }
  }, [visemeData]);

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
  
  // Add a state to track viewport width
  const [viewportWidth, setViewportWidth] = useState(0);
  
  // Update viewport width on component mount and window resize
  useEffect(() => {
    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth);
    };
    
    // Set initial width
    updateViewportWidth();
    
    // Add event listener for window resize
    window.addEventListener('resize', updateViewportWidth);
    
    // Clean up
    return () => window.removeEventListener('resize', updateViewportWidth);
  }, []);

  // Initialize 3D model and materials
  useEffect(() => {
    const morphTargetsFound: {[key: string]: {mesh: SkinnedMesh, index: number}} = {};

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
            
            // Store references to nodes with blendshapes for eyes
            if (node.morphTargetDictionary["eyeBlink_L"] !== undefined) {
              eyeBlinkLeftRef.current = node;
              // console.log("Found left eye blink node:", node.name);
            }
            if (node.morphTargetDictionary["eyeBlink_R"] !== undefined) {
              eyeBlinkRightRef.current = node;
              // console.log("Found right eye blink node:", node.name);
            }
            
            // Find all morph targets/blendshapes for facial expressions
            if (node.morphTargetDictionary && node.morphTargetInfluences) {
              mouthRef.current = node; // Store a reference to the main head/face mesh
              
              // Log all available blend shapes
              // console.log("Available blend shapes in", node.name, ":", Object.keys(node.morphTargetDictionary));
              
              // Store all morph targets for easy access later
              for (const [name, index] of Object.entries(node.morphTargetDictionary)) {
                morphTargetsFound[name] = { mesh: node, index };
              }
            }
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
          
          if (node instanceof SkinnedMesh && node.morphTargetDictionary) {
            for (const [name, index] of Object.entries(node.morphTargetDictionary)) {
              morphTargetsFound[name] = { mesh: node, index };
            }
          }
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
    
    setAllMorphTargets(morphTargetsFound);
    console.log("Available morph targets for facial expressions:", Object.keys(morphTargetsFound).filter(name => 
      name.toLowerCase().includes('mouth') || 
      name.toLowerCase().includes('jaw') || 
      name.toLowerCase().includes('viseme') ||
      name.toLowerCase().includes('lip') ||
      name.toLowerCase().includes('tongue')
    ));
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

  // Log available morph targets for debugging
  useEffect(() => {
    gltf.scene.traverse((node) => {
      if (node instanceof SkinnedMesh && node.morphTargetDictionary) {
        // console.log(`Node: ${node.name}, Morph Targets:`, node.morphTargetDictionary);
      }
    });
  }, [gltf.scene]);

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

  // Function to check if it's time to blink
  const shouldBlink = () => {
    // Random blink timing, more human-like
    const now = Date.now() / 1000; // Convert to seconds
    const timeSinceLastBlink = now - lastBlinkTime;
    
    // Humans blink every 2-10 seconds on average
    const nextBlinkTime = speak ? 2 : 1; // Blink less often when speaking
    
    return timeSinceLastBlink > nextBlinkTime;
  };
// Add this function to control morph target weights
const getVisemeWeight = (morphName: string, defaultWeight: number = 1.0) => {
  // Lower weights for specific morphs that affect lower lip
  if (morphName.toLowerCase().includes('jawopen') || 
      morphName.toLowerCase().includes('mouthlowerdown')) {
    return 0.5; // Reduce the influence to 50%
  }
  
  // For other mouth morphs, use moderate influence
  if (morphName.toLowerCase().includes('mouth') ||
      morphName.toLowerCase().includes('viseme')) {
    return 0.7; // 70% influence for general mouth shapes
  }
  
  return defaultWeight;
};
  // Apply viseme to the morph targets with improved natural movement
const applyViseme = useCallback((visemeId: number | null) => {
  if (visemeId === null || !mouthRef.current || !allMorphTargets) return;
  
  // Reset all mouth-related morph targets first
  Object.entries(allMorphTargets).forEach(([name, { mesh, index }]) => {
    if (name.toLowerCase().includes('mouth') || 
        name.toLowerCase().includes('jaw') || 
        name.toLowerCase().includes('tongue') ||
        name.toLowerCase().includes('viseme') ||
        name.toLowerCase().includes('lip')) {
      if (mesh.morphTargetInfluences) {
        // Gradual reset for smoother transitions
        mesh.morphTargetInfluences[index] *= 0.5; // Fade out previous viseme
      }
    }
  });
  
  // Get the viseme target names from the mapping
  const targetVisemes = visemeMap[visemeId as keyof typeof visemeMap];
  if (!targetVisemes) return;
  
  // Apply the new viseme with varying intensities and balance
  targetVisemes.forEach((targetName, idx) => {
    // Get model-specific morph target names
    const modelTargetNames = morphTargetNameMap[targetName as keyof typeof morphTargetNameMap] || [targetName];
    
    // Calculate influence based on position in the array (primary vs secondary targets)
    const baseInfluence = idx === 0 ? 0.9 : 0.6; // Reduced from 1.0 to 0.9 for more natural look
    
    modelTargetNames.forEach(morphName => {
      // Fine-tuned influence adjustment based on morphTarget type
      let influenceMultiplier = 1.0;
      
      // Careful balance between upper and lower lip
      if (morphName.toLowerCase().includes('upper') || 
          morphName.toLowerCase().includes('up')) {
        influenceMultiplier = 1.25; // 25% more influence for upper lip morphs
      }
      
      // Reduce influence for jaw and lower lip movements
      if (morphName.toLowerCase().includes('lower') || 
          morphName.toLowerCase().includes('mouthlowerdown')) {
        influenceMultiplier = 0.1; // Significantly reduce lower lip movement
      }
      
      if (morphName.toLowerCase().includes('jawopen')) {
        influenceMultiplier = 0.1; // Further minimize jaw opening influence
      }
      
      const morphTarget = Object.entries(allMorphTargets).find(([name]) => 
        name.toLowerCase() === morphName.toLowerCase() || name.toLowerCase().includes(morphName.toLowerCase())
      );
      
      if (morphTarget) {
        const [name, { mesh, index }] = morphTarget;
        if (mesh.morphTargetInfluences) {
          // Apply calculated influence with constraints for natural motion
          let finalInfluence = Math.min(baseInfluence * influenceMultiplier, 1.0);
          
          // Additional constraints for natural speech
          if (name.toLowerCase().includes('jawopen')) {
            // Maximum opening for the jaw - prevents unnaturally large movements
            finalInfluence = Math.min(finalInfluence, 0.45);
          }
          if (name.toLowerCase().includes('lower')) {
            // Maximum movement for lower lip - prevents rising too high
            finalInfluence = Math.min(finalInfluence, 0.5);
          }
          
          // Apply with smooth interpolation - blend with current value for smoother transitions
          const currentValue = mesh.morphTargetInfluences[index] || 0;
          mesh.morphTargetInfluences[index] = currentValue * 0.3 + finalInfluence * 0.7;
        }
      } else {
        // Pattern matching for similar morph targets
        Object.entries(allMorphTargets).forEach(([name, { mesh, index }]) => {
          if (name.toLowerCase().includes(morphName.toLowerCase())) {
            if (mesh.morphTargetInfluences) {
              // Custom influence based on the type of morph
              let finalInfluence = baseInfluence;
              
              // Balance upper and lower lip movements
              if (name.toLowerCase().includes('upper')) {
                finalInfluence *= 1.25; // Boost upper lip
              }
              
              if (name.toLowerCase().includes('lower') || name.toLowerCase().includes('jaw')) {
                finalInfluence *= 0.7; // Reduce lower movements
                finalInfluence = Math.min(finalInfluence, 0.5);
              }
              
              // Apply with interpolation
              const currentValue = mesh.morphTargetInfluences[index] || 0;
              mesh.morphTargetInfluences[index] = currentValue * 0.3 + Math.min(finalInfluence, 1.0) * 0.7;
            }
          }
        });
      }
    });
  });
  
  // Add subtle randomization for natural appearance
  Object.entries(allMorphTargets).forEach(([name, { mesh, index }]) => {
    if ((name.toLowerCase().includes('mouth') || name.toLowerCase().includes('lip')) && 
        !name.toLowerCase().includes('jawopen') && 
        mesh.morphTargetInfluences) {
      // Add tiny random variations (1-3%) to avoid robotic precision
      mesh.morphTargetInfluences[index] += (Math.random() - 0.5) * 0.03;
      
      // Ensure values stay within valid range
      mesh.morphTargetInfluences[index] = Math.max(0, Math.min(mesh.morphTargetInfluences[index], 1.0));
    }
  });
  
}, [allMorphTargets]);
  // Apply viseme to the morph targets with advanced natural movement
  const applyVisemeEnhanced = useCallback(
    (visemeId: number | null, transitionDuration: number = 0.1) => {      
      if (visemeId === null || !mouthRef.current || !allMorphTargets) return;
  
      // Get the viseme target names from the mapping for Azure speech service viseme ID
      const targetVisemes = visemeMap[visemeId as keyof typeof visemeMap];
      if (!targetVisemes) {
        console.log(`No viseme mapping found for Azure viseme ID: ${visemeId}`);
        return;
      }
  
      // Smoothly transition influences over time for more natural mouth movement
      const now = performance.now();
      const endTransitionTime = now + transitionDuration * 1000;
  
      const smoothTransition = () => {
        const currentTime = performance.now();
        const elapsedTime = Math.min(currentTime - now, transitionDuration * 1000);
        const t = elapsedTime / (transitionDuration * 1000);
  
        // Gradually fade out previous mouth positions for smoother transitions
        Object.entries(allMorphTargets).forEach(([name, { mesh, index }]) => {
          if (
            name.toLowerCase().includes("mouth") ||
            name.toLowerCase().includes("jaw") ||
            name.toLowerCase().includes("tongue") ||
            name.toLowerCase().includes("viseme") ||
            name.toLowerCase().includes("lip")
          ) {
            if (mesh.morphTargetInfluences) {
              mesh.morphTargetInfluences[index] *= (1 - t) * 0.5; // Gradual fade out
            }
          }
        });
  
        // Apply new viseme influences with natural weighting
        targetVisemes.forEach((targetName, idx) => {
          // Get model-specific morph target names from our mapping
          const modelTargetNames =
            morphTargetNameMap[targetName as keyof typeof morphTargetNameMap] ||
            [targetName];
          
          // Primary viseme has stronger influence than secondary
          const baseInfluence = idx === 0 ? 0.8 : 0.5;
  
          modelTargetNames.forEach(morphName => {
            // Custom influence adjustments based on morph type for natural look
            let influenceMultiplier = 1.0;
  
            if (morphName.toLowerCase().includes('upper')) {
              influenceMultiplier = 1.2; // Boost upper lip movement
            }
  
            if (morphName.toLowerCase().includes('lower') || 
                morphName.toLowerCase().includes('mouthlowerdown')) {
              influenceMultiplier = 0.2; // Reduce lower lip and jaw movement
            }
  
            if (morphName.toLowerCase().includes('jawopen')) {
              influenceMultiplier = 0.15; // Minimize jaw opening influence
            }
  
            // Find exact or partial match for morph target
            const morphTarget = Object.entries(allMorphTargets).find(([name]) =>
              name.toLowerCase() === morphName.toLowerCase() || 
              name.toLowerCase().includes(morphName.toLowerCase())
            );
  
            if (morphTarget) {
              const [name, { mesh, index }] = morphTarget;
              if (mesh.morphTargetInfluences) {
                // Calculate final influence with constraints for natural movement
                let finalInfluence = Math.min(baseInfluence * influenceMultiplier, 1.0);
                
                if (name.toLowerCase().includes('jawopen')) {
                  finalInfluence = Math.min(finalInfluence, 0.4);
                }
                if (name.toLowerCase().includes('lower')) {
                  finalInfluence = Math.min(finalInfluence, 0.3);
                }
                
                // Apply with smooth interpolation between current and target values
                const currentValue = mesh.morphTargetInfluences[index] || 0;
                const targetValue = finalInfluence * t + currentValue * (1 - t);
                mesh.morphTargetInfluences[index] = targetValue;
                
                // Add subtle randomization (1-2%) for natural appearance
                if (!name.toLowerCase().includes('jawopen')) {
                  mesh.morphTargetInfluences[index] += (Math.random() - 0.5) * 0.01;
                  mesh.morphTargetInfluences[index] = Math.max(0, Math.min(mesh.morphTargetInfluences[index], 1.0));
                }
              }
            }
          });
        });
  
        if (currentTime < endTransitionTime) {
          requestAnimationFrame(smoothTransition);
        }
      };
  
      smoothTransition();
    },
    [allMorphTargets]
  );

  // Update when current viseme changes
  useEffect(() => {
    if (speak) {
      applyVisemeEnhanced(currentViseme!);
    } else {
      // Reset all mouth morphs when not speaking
      Object.entries(allMorphTargets).forEach(([name, { mesh, index }]) => {
        if (name.toLowerCase().includes('mouth') || 
            name.toLowerCase().includes('jaw') || 
            name.toLowerCase().includes('tongue') ||
            name.toLowerCase().includes('viseme')) {
          if (mesh.morphTargetInfluences) {
            mesh.morphTargetInfluences[index] = 0;
          }
        }
      });
    }
  }, [speak, currentViseme, applyVisemeEnhanced, allMorphTargets]);

  // Update when current viseme changes with improved timing and synchronization
  useEffect(() => {
    if (!speak || currentViseme === null) {
      // Reset all mouth morphs when not speaking
      Object.entries(allMorphTargets).forEach(([name, { mesh, index }]) => {
        if (name.toLowerCase().includes('mouth') || 
            name.toLowerCase().includes('jaw') || 
            name.toLowerCase().includes('tongue') ||
            name.toLowerCase().includes('viseme')) {
          if (mesh.morphTargetInfluences) {
            mesh.morphTargetInfluences[index] = 0;
          }
        }
      });
      return;
    }
  
    // Apply the current viseme with a short transition for smoothness
    applyViseme(currentViseme ?? null);
  }, [speak, currentViseme, applyViseme, allMorphTargets]);
  
  // Debug viseme application
  useEffect(() => {
    if (currentViseme !== null && currentViseme !== undefined) {
      console.log(`Applying viseme ID: ${currentViseme}`);
    }
  }, [currentViseme]);

  // Handle blinking animation using the frame data
  useFrame((state, delta) => {
    mixer.update(delta);
  
    // Check if a blink should be triggered
    if (!isBlinking && shouldBlink()) {
      setIsBlinking(true);
      setLastBlinkTime(Date.now() / 1000); // Update last blink time
      blinkTimeRef.current = 0;
    }
  
    if (isBlinking) {
      // Increment blink time
      blinkTimeRef.current += delta;
      const blinkDuration = 0.3; // Total duration of blink animation
      let blinkAmount = 0;
  
      if (blinkTimeRef.current <= blinkDuration / 2) {
        // Eyes closing
        blinkAmount = blinkTimeRef.current / (blinkDuration / 2);
      } else {
        // Eyes opening
        blinkAmount = 1 - (blinkTimeRef.current - blinkDuration / 2) / (blinkDuration / 2);
      }
  
      // Apply blink amount to the morph targets
      Object.entries(allMorphTargets).forEach(([name, { mesh, index }]) => {
        if (name.includes('eyeBlink') || name.includes('EyeBlink')) {
          if (mesh.morphTargetInfluences) {
            mesh.morphTargetInfluences[index] = blinkAmount;
          }
        }
      });
  
      // End the blink cycle
      if (blinkTimeRef.current >= blinkDuration) {
        setIsBlinking(false);
        blinkTimeRef.current = 0;
  
        // Reset blink influences to 0
        Object.entries(allMorphTargets).forEach(([name, { mesh, index }]) => {
          if (name.includes('eyeBlink') || name.includes('EyeBlink')) {
            if (mesh.morphTargetInfluences) {
              mesh.morphTargetInfluences[index] = 0;
            }
          }
        });
      }
    }
  });

  // Calculate scale based on viewport width
  const avatarScale = useMemo(() => {
    // Default scale for small screens
    let scale = 1.5;
    
    // Larger scale for screens > 681px
    if (viewportWidth > 681) {
      scale = 2.2;
    }
    
    // Even larger for bigger screens
    if (viewportWidth > 1024) {
      scale = 2.5;
    }
    
    return scale;
  }, [viewportWidth]);

  // Return the scene as a primitive element with proper positioning
  return gltf.scene ? (
    <>
      <primitive 
        object={gltf.scene} 
        position={[0, -0.15, 0]}
        rotation={[0.1, 0.1, 0]}
        scale={1.0}
      />
    </>
  ) : null;
}

export default Avatar;