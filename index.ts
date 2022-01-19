import webpDecoder from "./codecs/webp/dec/webp_dec.js";
import webpEncoder from "./codecs/webp/enc/webp_enc.js";
import jpegEncoder from "./codecs/mozjpeg/enc/mozjpeg_enc.js";
import avifEncoder from "./codecs/avif/enc/avif_enc.js";
import avifDecoder from "./codecs/avif/dec/avif_dec.js";
import jxlEncoder from "./codecs/jxl/enc/jxl_enc.js";
import jxlDecoder from "./codecs/jxl/dec/jxl_dec.js";
import {
  default as initPNG,
  encode as encodePNG,
  decode as decodePNG,
} from "./codecs/png/pkg/squoosh_png.js";
import {
  DEFAULT_AVIF_CONFIG,
  DEFAULT_JPEG_OPTIONS,
  DEFAULT_JXL_CONFIG,
  DEFAULT_WEBP_CONFIG,
} from "./const.js";
import { JPEGDecoder } from "./jpeg-decoder.js";

export enum ImageType {
  JPEG,
  PNG,
  WEBP,
  AVIF,
  JXL,
}
export class Optimg {
  private static toArrayBuffer = (blob: Blob): Promise<ArrayBuffer> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(<ArrayBuffer>reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });

  async decodeImage(file: Blob) {
    const arrayBuffer = await Optimg.toArrayBuffer(file);
    switch (file.type) {
      case "image/jpeg":
       return await JPEGDecoder(file);
      case "image/jxl":
        const jxldecoder = await jxlDecoder();
        return jxldecoder.decode(arrayBuffer);
      case "image/webp":
        const decoder = await webpDecoder();
        return decoder.decode(arrayBuffer);
      case "image/png":
        await initPNG();
        return decodePNG(new Uint8Array(arrayBuffer));
      case "image/avif":
        const avifDec = await avifDecoder();
        return avifDec.decode(arrayBuffer);
      case "image/jxl":
        const jxlDec = await jxlDecoder();
        return jxlDec.decode(arrayBuffer);
      default:
        throw new Error("Unsupported file format");
    }
  }
  async processImage(
    file: Blob,
    targetFormat: ImageType,
    width: number,
    height: number,
    quality: number
  ): Promise<Blob> {
    const decodedImage = await this.decodeImage(file);
    switch (targetFormat) {
      case ImageType.JPEG:
        console.log({decodedImage})
        const jpegencoder = await jpegEncoder();
        const jpegResult = jpegencoder.encode(
          decodedImage.data,
          width || decodedImage.width,
          height || decodedImage.height,
          {...DEFAULT_JPEG_OPTIONS, quality}
        );
        return new Blob([jpegResult], { type: "image/jpeg" });

      case ImageType.PNG:
        await initPNG();
        const encodedPNG = await encodePNG(
          decodedImage.data,
          width || decodedImage.width,
          height || decodedImage.height
        );
        return new Blob([encodedPNG], { type: "image/png" });

      case ImageType.WEBP:
        const encoder = await webpEncoder();
        const result = encoder.encode(
          decodedImage.data,
          width || decodedImage.width,
          height || decodedImage.height,
          {...DEFAULT_WEBP_CONFIG, quality}
        );
        return new Blob([result], { type: "image/webp" });

      case ImageType.AVIF:
        const avifencoder = await avifEncoder();
        const avifresult = avifencoder.encode(
          decodedImage.data,
          width || decodedImage.width,
          height || decodedImage.height,
          DEFAULT_AVIF_CONFIG
        );
        return new Blob([avifresult], { type: "image/avif" });
      case ImageType.JXL:
        const jxlencoder = await jxlEncoder();
        const jxlresult = jxlencoder.encode(
          decodedImage.data,
          width || decodedImage.width,
          height || decodedImage.height,
          {...DEFAULT_JXL_CONFIG, quality}
        );
        return new Blob([jxlresult], { type: "image/jxl" });

      default:
        throw new Error("Unexpected target format");
    }
  }
}
