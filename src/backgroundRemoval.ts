import { FilesetResolver, ImageSegmenter } from "@mediapipe/tasks-vision";

const VISION_WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm";
const PERSON_MODEL = "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/1/selfie_multiclass_256x256.tflite";
const HAIR_MODEL = "https://storage.googleapis.com/mediapipe-models/image_segmenter/hair_segmenter/float32/1/hair_segmenter.tflite";

type Mask = { width:number; height:number; getAsFloat32Array:()=>Float32Array };
type SegmentResult = { confidenceMasks?:Mask[] };
type Segmenter = { segment:(image:HTMLImageElement,callback:(result:SegmentResult)=>void)=>void; close:()=>void };
let segmentersPromise:Promise<{person:Segmenter;hair:Segmenter}>|null=null;

async function loadSegmenters(){
  if(!segmentersPromise)segmentersPromise=(async()=>{
    const vision=await FilesetResolver.forVisionTasks(VISION_WASM);
    const options={runningMode:"IMAGE" as const,outputCategoryMask:false,outputConfidenceMasks:true};
    const person=await ImageSegmenter.createFromOptions(vision,{...options,baseOptions:{modelAssetPath:PERSON_MODEL,delegate:"GPU"}});
    try{
      const hair=await ImageSegmenter.createFromOptions(vision,{...options,baseOptions:{modelAssetPath:HAIR_MODEL,delegate:"GPU"}});
      return {person:person as unknown as Segmenter,hair:hair as unknown as Segmenter};
    }catch(error){person.close();throw error;}
  })().catch(error=>{segmentersPromise=null;throw error;});
  return segmentersPromise;
}
function runSegmenter(segmenter:Segmenter,image:HTMLImageElement){return new Promise<SegmentResult>((resolve,reject)=>{try{segmenter.segment(image,resolve);}catch(error){reject(error);}});}
function loadImage(src:string){return new Promise<HTMLImageElement>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error("Could not open this image."));image.src=src;});}
function clamp(v:number){return Math.max(0,Math.min(1,v));}

export async function removePortraitBackground(src:string,onProgress?:(message:string)=>void){
  onProgress?.("Loading AI hair and portrait models…");
  const [models,image]=await Promise.all([loadSegmenters(),loadImage(src)]);
  onProgress?.("Detecting person and fine hair edges…");
  const [personResult,hairResult]=await Promise.all([runSegmenter(models.person,image),runSegmenter(models.hair,image)]);
  const personMasks=personResult.confidenceMasks;
  const hairMask=hairResult.confidenceMasks?.[1]??hairResult.confidenceMasks?.[0];
  if(!personMasks?.length||!hairMask)throw new Error("AI model did not return a usable hair mask.");
  const personW=personMasks[0].width,personH=personMasks[0].height,hairW=hairMask.width,hairH=hairMask.height;
  const maskW=Math.max(personW,hairW),maskH=Math.max(personH,hairH);
  const personCanvas=document.createElement("canvas");personCanvas.width=personW;personCanvas.height=personH;
  const personCtx=personCanvas.getContext("2d");if(!personCtx)throw new Error("Canvas is unavailable.");
  const personPixels=personCtx.createImageData(personW,personH),personData=personPixels.data;
  const classData=personMasks.slice(1).map(mask=>mask.getAsFloat32Array());
  const bgData=personMasks[0].getAsFloat32Array();
  for(let i=0,p=0;i<personW*personH;i++,p+=4){
    let foreground=0;for(const channel of classData)foreground+=channel[i]??0;
    const confidence=clamp(Math.max(foreground,1-(bgData[i]??1)));
    const alpha=clamp((confidence-0.12)/0.72);
    personData[p]=personData[p+1]=personData[p+2]=255;personData[p+3]=Math.round(alpha*255);
  }
  personCtx.putImageData(personPixels,0,0);
  const maskCanvas=document.createElement("canvas");maskCanvas.width=maskW;maskCanvas.height=maskH;
  const maskCtx=maskCanvas.getContext("2d");if(!maskCtx)throw new Error("Canvas is unavailable.");
  maskCtx.imageSmoothingEnabled=true;maskCtx.drawImage(personCanvas,0,0,maskW,maskH);
  const hairData=hairMask.getAsFloat32Array();
  const combined=maskCtx.getImageData(0,0,maskW,maskH);
  for(let y=0;y<maskH;y++)for(let x=0;x<maskW;x++){
    const i=y*maskW+x,p=i*4,hx=Math.min(hairW-1,Math.floor(x*hairW/maskW)),hy=Math.min(hairH-1,Math.floor(y*hairH/maskH)),hair=clamp(hairData[hy*hairW+hx]??0);
    const person=combined.data[p+3]/255;
    const hairAlpha=clamp((hair-0.025)/0.82);
    combined.data[p+3]=Math.round(Math.max(person,hairAlpha*0.98)*255);
  }
  maskCtx.putImageData(combined,0,0);
  onProgress?.("Refining transparent edges…");
  const output=document.createElement("canvas");output.width=image.naturalWidth;output.height=image.naturalHeight;
  const outCtx=output.getContext("2d");if(!outCtx)throw new Error("Canvas is unavailable.");
  outCtx.drawImage(image,0,0);
  const fullMask=document.createElement("canvas");fullMask.width=output.width;fullMask.height=output.height;
  const fullCtx=fullMask.getContext("2d");if(!fullCtx)throw new Error("Canvas is unavailable.");
  fullCtx.imageSmoothingEnabled=true;fullCtx.imageSmoothingQuality="high";fullCtx.drawImage(maskCanvas,0,0,output.width,output.height);
  outCtx.globalCompositeOperation="destination-in";outCtx.drawImage(fullMask,0,0);outCtx.globalCompositeOperation="source-over";
  return output.toDataURL("image/png");
}

export async function removeSignaturePaper(src:string){
  const image=await loadImage(src),canvas=document.createElement("canvas");canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
  const ctx=canvas.getContext("2d");if(!ctx)throw new Error("Canvas is unavailable.");
  ctx.drawImage(image,0,0);const frame=ctx.getImageData(0,0,canvas.width,canvas.height),d=frame.data;
  for(let i=0;i<d.length;i+=4){const darkness=255-Math.min(d[i],d[i+1],d[i+2]);const alpha=clamp((darkness-10)/105);d[i+3]=Math.round(d[i+3]*alpha);}
  ctx.putImageData(frame,0,0);return canvas.toDataURL("image/png");
}
