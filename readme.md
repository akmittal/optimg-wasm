# Optimg-node

Convert images inside browser using webassembly

Supported image formats
1. JPEG
2. AVIF
3. PNG
4. WEBP
5. JXL

## Install

`npm i optimg-wasm`

## API

### convert/resize image
``` ts
import { ImageType, Optimg } from "optimg-wasm/build";
const optimg = new Optimg();


const format = ImageType.JPEG;
const height = 200; // use undefined for same as existing image
const width = 200; // use undefined for same as existing image
const quality = 75; // value from 1-100

const result = await optimg.processImage(
    file, // Blob or File
    format,
    height,
    width,
    quality
    ); // Returns Blob
console.log(result)
```

### Decode Image File

``` ts
import { ImageType, Optimg } from "optimg-wasm/build";
const optimg = new Optimg();


const imageData = await optimg.decodeImage(
    file // Blob or File
    ); // Returns ImageData
console.log(imageData)
```
