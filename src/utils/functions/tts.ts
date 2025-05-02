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
 * @param {function} callback - callback to receive viseme data
 * @param {AbortController} abortController - controller to cancel the request
 * @returns {Promise<TTSResult>} - promise that resolves with viseme data
 */
export async function getVisemeData(
  text: string,
  callback: (visemeData: VisemeDataPoint[]) => void,
  abortController?: AbortController
): Promise<TTSResult> {
  if (!text) {
    throw new Error("No text provided");
  }

  // Create a copy of the text to process
  const processText = text.trim();
  
  return new Promise((resolve, reject) => {
    try {
      // Check if aborted before starting
      if (abortController?.signal.aborted) {
        reject(new Error('Speech synthesis cancelled'));
        return;
      }
      
      // Define the SSML template with the text
      const ssml = SSML.replace('__TEXT__', processText);
      
      // Configure the speech synthesis
      const speechConfig = sdk.SpeechConfig.fromSubscription(key!, region!);
      speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio24Khz160KBitRateMonoMp3;
      
      // Create a special audio config that doesn't output sound
      // Using "PullAudioOutputStream" and not consuming it effectively mutes the audio
      const audioOutputStream = sdk.AudioOutputStream.createPullStream();
      const audioConfig = sdk.AudioConfig.fromStreamOutput(audioOutputStream);
      
      // Create the synthesizer with audio configuration that won't play sound
      let synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
      
      // Store the viseme data
      const blendData: VisemeDataPoint[] = [];
      let timeStamp = 0;
      const timeStep = 1 / 60; // 60fps
      
      // Set up the viseme event handler with optimized processing
      synthesizer.visemeReceived = (s, e) => {
        try {
          // Process viseme data in chunks for better performance
          if (e.animation) {
            const animation = JSON.parse(e.animation);
            const blendShapesChunks = _.chunk(animation.BlendShapes, 60); // Process 1 second at a time
            
            blendShapesChunks.forEach(blendShapesChunk => {
              blendShapesChunk.forEach((blendArray: any) => {
                const blend: { [key: string]: number } = {};
                
                // Only process the blend shapes we need
                // Focus on mouth and eye movements for efficiency
                blendShapeNames.forEach((shapeName, i) => {
                  if (
                    shapeName.includes('mouth') || 
                    shapeName.includes('jaw') || 
                    shapeName.includes('eyeBlink') ||
                    shapeName === 'jawOpen'
                  ) {
                    blend[shapeName] = blendArray[i];
                  }
                });
                
                // Add smile as a default expression
                if (!blend.mouthSmileLeft) blend.mouthSmileLeft = 0.3;
                if (!blend.mouthSmileRight) blend.mouthSmileRight = 0.3;
                
                blendData.push({
                  time: timeStamp,
                  blendshapes: blend
                });
                
                timeStamp += timeStep;
              });
              
              // Send the processed batch via callback for immediate use
              // This helps start animation before entire processing is complete
              if (callback && blendData.length > 0) {
                callback([...blendData]);
              }
            });
          }
        } catch (error) {
          console.error("Error in viseme processing:", error);
        }
      };
      
      // Add abort handler
      if (abortController) {
        abortController.signal.addEventListener('abort', () => {
          if (synthesizer) {
            synthesizer.close();
            synthesizer = null;
            reject(new Error('Speech synthesis cancelled'));
          }
        });
      }

      // Start the text-to-speech synthesis with prioritized viseme data processing
      synthesizer.speakSsmlAsync(
        ssml,
        result => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
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
            // Handle error
            let errorMessage = `Speech synthesis canceled`;
            try {
              const errorDetails = result.errorDetails || 'Unknown error';
              errorMessage = `Speech synthesis error: ${errorDetails}`;
            } catch (e) {
              errorMessage = `Speech synthesis error: ${e.message || 'Unknown error'}`;
            }
            
            if (synthesizer) {
              synthesizer.close();
              synthesizer = null;
            }
            
            reject(new Error(errorMessage));
          }
        },
        error => {
          // Handle error
          if (synthesizer) {
            synthesizer.close();
            synthesizer = null;
          }
          
          reject(new Error(`Speech synthesis error: ${error.message || 'Unknown error'}`));
        }
      );
    } catch (error) {
      reject(new Error(`Speech synthesis error: ${error.message || 'Unknown error'}`));
    }
  });
}