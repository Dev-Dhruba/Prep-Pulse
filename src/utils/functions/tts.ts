import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import blendShapeNames from './blendshapeNames';
import _ from 'lodash';

// Define interfaces for better type safety
interface BlendShape {
  [key: string]: number;
}

interface VisemeDataPoint {
  time: number;
  blendshapes: BlendShape;
}

interface TTSResult {
  audioUrl?: string; // Optional since we don't need the audio
  audioBlob?: Blob;  // Optional since we don't need the audio
  visemeData: VisemeDataPoint[];
}

let SSML = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US">
<voice name="en-US-JennyNeural">
  <mstts:viseme type="FacialExpression"/>
  __TEXT__
</voice>
</speak>`;

const key = process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY;
const region = process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION;
        
/**
 * Function to generate viseme data from text for facial animations
 * @param {string} text - text to convert to viseme data
 * @param {AbortController} [abortController] - Optional abort controller to cancel synthesis
 * @returns {Promise<TTSResult>} - Returns a promise with viseme blend data
 */
const textToSpeech = async (text: string, abortController?: AbortController): Promise<TTSResult> => {
    let synthesizer: sdk.SpeechSynthesizer | null = null;
    
    return new Promise<TTSResult>((resolve, reject) => {
        try {
            // Check if Azure credentials are available
            if (!key || !region) {
                throw new Error("Azure Speech credentials are not configured");
            }

            // Make sure text is sanitized and properly formatted for SSML
            const sanitizedText = text.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');

            let ssml = SSML.replace("__TEXT__", sanitizedText);

            const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
            speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;
            
            // We still need to define an audio output for the SDK to work,
            // but we'll use a pull stream since we don't need to process the audio
            const pullStream = sdk.AudioOutputStream.createPullStream();
            const audioConfig = sdk.AudioConfig.fromStreamOutput(pullStream);

            const blendData: VisemeDataPoint[] = [];
            let timeStep = 1/60;
            let timeStamp = 0;

            synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

            // Setup abort capability if AbortController is provided
            if (abortController) {
                abortController.signal.addEventListener('abort', () => {
                    if (synthesizer) {
                        console.log("TTS synthesis cancelled by user");
                        synthesizer.close();
                        reject(new Error('Speech synthesis cancelled'));
                    }
                });
            }

            // Subscribes to viseme received event
            synthesizer.visemeReceived = function (s, e) {
                try {
                    // Validate that animation data is not empty or malformed
                    if (!e.animation || typeof e.animation !== 'string' || e.animation.trim() === '') {
                        console.warn("Received empty or invalid animation data");
                        return;
                    }
                    
                    // `Animation` is a JSON string for blend shapes
                    let animation;
                    try {
                        animation = JSON.parse(e.animation);
                    } catch (jsonError) {
                        console.error("Failed to parse animation JSON:", jsonError, "Raw data:", e.animation);
                        return;
                    }
                    
                    // Verify that the BlendShapes property exists and is an array
                    if (!animation.BlendShapes || !Array.isArray(animation.BlendShapes)) {
                        console.warn("Animation data missing BlendShapes or BlendShapes is not an array");
                        return;
                    }

                    _.each(animation.BlendShapes, (blendArray: number[]) => {
                        const blend: BlendShape = {};
                        _.each(blendShapeNames, (shapeName: string, i: number) => {
                            blend[shapeName] = blendArray[i];
                        });
                
                        blendData.push({
                            time: timeStamp,
                            blendshapes: blend
                        });
                        timeStamp += timeStep;
                    });
                } catch (error) {
                    console.error("Error in viseme processing:", error);
                }
            };

            // Start the text-to-speech synthesis
            synthesizer.speakSsmlAsync(
                ssml,
                result => {
                    if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                        // We only care about the viseme data, not the audio
                        // Clean up resources
                        if (synthesizer) {
                            synthesizer.close();
                            synthesizer = null;
                        }
                        
                        // Return the viseme data
                        resolve({
                            visemeData: blendData
                        });
                    } else {
                        // SDK has changed, use a more compatible error handling approach
                        let errorMessage = `Speech synthesis canceled`;
                        try {
                            // Try to get more details about the error if available
                            const errorDetails = result.errorDetails;
                            if (errorDetails) {
                                errorMessage += `: ${errorDetails}`;
                            }
                        } catch (e) {
                            // If error details can't be accessed, just use the basic message
                        }
                        
                        console.error(errorMessage);
                        
                        if (synthesizer) {
                            synthesizer.close();
                            synthesizer = null;
                        }
                        
                        reject(new Error(errorMessage));
                    }
                },
                err => {
                    console.error(`Error during speech synthesis: ${err}`);
                    
                    if (synthesizer) {
                        synthesizer.close();
                        synthesizer = null;
                    }
                    
                    reject(err);
                }
            );
        } catch (error) {
            console.error("Error in textToSpeech:", error);
            
            if (synthesizer) {
                synthesizer.close();
            }
            
            reject(error);
        }
    });
};

/**
 * Simplified version that gets viseme data with callbacks
 * @param {string} text - text to generate viseme data from
 * @param {Function} onVisemeDataUpdate - Callback when viseme data is ready
 * @param {AbortController} [abortController] - Optional abort controller to cancel synthesis
 * @returns {Promise<void>} - Promise that resolves when synthesis is complete
 */
export const getVisemeData = async (
    text: string,
    onVisemeDataUpdate: (visemeData: VisemeDataPoint[]) => void,
    abortController?: AbortController
): Promise<void> => {
    try {
        // Simply call the main function and pass the viseme data to the callback
        const result = await textToSpeech(text, abortController);
        onVisemeDataUpdate(result.visemeData);
    } catch (error) {
        console.error("Error getting viseme data:", error);
        throw error;
    }
};

export default textToSpeech;