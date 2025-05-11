import * as faceapi from 'face-api.js';

export async function loadModels() {
  const MODEL_URL = '/models';
  
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);
    console.log('Face detection models loaded successfully');
  } catch (error) {
    console.error('Error loading face detection models:', error);
  }
}