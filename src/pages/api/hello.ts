import { NextApiRequest, NextApiResponse } from "next";
import { createCanvas, loadImage, registerFont } from "canvas";
import { join } from "path";
import { ExifTool, exiftool } from "exiftool-vendored";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const scale = 1;
  const zoomFactor = 0.8;
  const baseFontSize = 35;
  const baseGap = 60 * scale;
  const canvas_width = 1296 * scale;
  const canvas_height = 1620 * scale;
  const fontSize = baseFontSize * scale;

  const font_path = join(
    process.cwd(),
    "/src/assets/fonts/SFPRODISPLAYREGULAR.OTF",
  );
  registerFont(font_path, { family: "SF Pro" });

  const canvas = createCanvas(canvas_width, canvas_height);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const image_path = join(process.cwd(), "/src/assets/test4.jpg");
  const image = await loadImage(image_path);
  console.log("image height", image.height, "image width", image.width);

  const exiftool = new ExifTool({ taskTimeoutMillis: 5000 });
  const exif = await exiftool.read(image_path);
  //   console.log(exif);

  const maxHeight = 1400 * scale;
  const wrh = image.width / image.height;
  let newWidth = canvas.width * zoomFactor;
  let newHeight = newWidth / wrh;
  //   if (newHeight > canvas.height) {
  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = newHeight * wrh;
  }

  const xOffset = newWidth < canvas.width ? (canvas.width - newWidth) / 2 : 0;
  //   const yOffset = newHeight < canvas.height ? (canvas.height - newHeight) / 2 : 0;
  const yOffset = 0;

  ctx.drawImage(image, xOffset, yOffset, newWidth, newHeight);

  ctx.font = `${fontSize}px "SF Pro"`;
  ctx.fillStyle = "black";

//   const text = 'Your Text Here';
//   const margin = 10;
//   const x = newWidth - ctx.measureText(text).width - margin;
//   const y = newHeight - margin;
//   ctx.font = `${fontSize}px "SF Pro"`;
//   ctx.fillText(text, x, y);

  ctx.fillText(
    `Shot on ${exif.Model} @${exif.FocalLengthIn35mmFormat ?? exif.FocalLength} f/${exif.FNumber}`,
    xOffset + 6 * scale,
    yOffset + newHeight + baseGap,
  );
  if (exif.DateTimeOriginal) {
    ctx.font = `${fontSize * 0.8}px "SF Pro"`;
    ctx.fillText(
      `${new Date(exif.DateTimeOriginal?.toString() ?? "").toLocaleString(
        "en-EN",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      )}`,
      xOffset + 6 * scale,
      yOffset + newHeight + baseGap + 45 * scale,
    );
  }

  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader("Content-Length", canvas.toBuffer().length);
  res.end(canvas.toBuffer());
}
