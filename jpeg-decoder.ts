export function JPEGDecoder(file: Blob): Promise<ImageData> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const image = new Image();
 
  image.src = URL.createObjectURL(file);

  return new Promise((resolve) => {
    image.onload = () => {
      if (!ctx) {
        throw new Error("Not found");
      }
      canvas.width = image.width;
      canvas.height = image.height;
      ctx?.drawImage(image, 0, 0);

      resolve(ctx?.getImageData(0, 0, canvas.width, canvas.height));
    };
  });
}
