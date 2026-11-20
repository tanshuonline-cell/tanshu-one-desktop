# Third-party AI model notices

## Google MediaPipe Tasks Vision
- Package: `@mediapipe/tasks-vision`
- License: Apache License 2.0
- Project: https://github.com/google-ai-edge/mediapipe

## MediaPipe Selfie Multiclass Segmentation model
- Model: `selfie_multiclass_256x256.tflite`
- Source: https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite
- License: Apache License 2.0
- Model card: https://storage.googleapis.com/mediapipe-assets/Model%20Card%20Multiclass%20Segmentation.pdf

## MediaPipe Hair Segmentation model
- Model: `hair_segmenter.tflite`
- Source: https://storage.googleapis.com/mediapipe-models/image_segmenter/hair_segmenter/float32/1/hair_segmenter.tflite
- License: Apache License 2.0
- Model card: https://storage.googleapis.com/mediapipe-assets/Model%20Card%20-%20Hair%20Segmentation.pdf

The models are downloaded from Google's public model hosting on first use and inference is performed locally in the app. User photographs are not uploaded to Google by this background-removal implementation. Internet access is needed for the first model download.
