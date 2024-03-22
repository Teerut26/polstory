import { NextApiRequest, NextApiResponse } from "next";
import { createCanvas, loadImage, registerFont } from "canvas"
import { join } from "path";
import { ExifTool, exiftool } from "exiftool-vendored";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const baseX = 68;
    const baseY = 1728;
    const scale = 1.3
    const zoomFactor = 0.88;
    const baseFontSize = 30;
    const canvas_width = 1133 * scale
    const canvas_height = 2016 * scale
    const fontSize = baseFontSize * scale;
    const x = baseX * scale;
    const y = baseY * scale;

    const font_path = join(process.cwd(), '/src/assets/fonts/SFPRODISPLAYREGULAR.OTF');
    registerFont(font_path, { family: 'SF Pro' })

    const canvas = createCanvas(canvas_width, canvas_height)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const image_path = join(process.cwd(), '/src/assets/image1.jpg');
    const image = await loadImage(image_path)
    console.log('image height', image.height, 'image width', image.width);
    

    const exiftool = new ExifTool({ taskTimeoutMillis: 5000 })
    const exif = await exiftool.read(image_path)
    console.log(exif);

    const wrh = image.width / image.height
    let newWidth = canvas.width * zoomFactor
    let newHeight = newWidth / wrh
    if (newHeight > canvas.height) {
        newHeight = canvas.height;
        newWidth = newHeight * wrh;
    }

    const xOffset = newWidth < canvas.width ? ((canvas.width - newWidth) / 2) : 0;
    const yOffset = newHeight < canvas.height ? ((canvas.height - newHeight) / 2) : 0;

    ctx.drawImage(image, xOffset, yOffset, newWidth, newHeight)

    ctx.font = `${fontSize}px "SF Pro"`;
    ctx.fillStyle = "black";
    ctx.fillText(`${exif.Model} @${exif.FocalLengthIn35mmFormat} f/${exif.FNumber}`, x, y);
    // ctx.fillText(`polstory.vercel.app`, x, y + 50);

    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Content-Length', canvas.toBuffer().length)
    res.end(canvas.toBuffer())

}
