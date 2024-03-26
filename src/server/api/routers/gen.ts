import { z } from "zod";
import JPEG from "jpeg-js";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { join } from "path";
import { createCanvas, loadImage, registerFont } from "canvas";
import { ExifTool } from "exiftool-vendored";
import Jimp from "jimp";
import { promises } from "fs";

export const genRouter = createTRPCRouter({
  genImage: publicProcedure
    .input(
      z.object({
        imagefile: z.string(),
        scale: z.number().min(0.3).max(3).optional().default(0.8),
        rotate: z.number().min(-360).max(360).optional().default(0),
      }),
    )
    .mutation(async ({ input }) => {
      const scale = input.scale ?? 0.8;
      const zoomFactor = 0.88;
      const baseFontSize = 35;
      const baseGap = 60 * scale;
      const canvas_width = 1133 * scale;
      const canvas_height = 2016 * scale;
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

      // base64 to image
      const imageBuffer = Buffer.from(
        input.imagefile.replace(/^data:image\/\w+;base64,/, ""),
        "base64",
      );

      const filename = `temp-${new Date().getTime()}.jpg`;

      await promises.writeFile(
        join(process.cwd(), "/src/assets/" + filename),
        imageBuffer,
      );

      const exiftool = new ExifTool({ taskTimeoutMillis: 5000 });
      const exif = await exiftool.read(
        join(process.cwd(), "/src/assets/" + filename),
      );

      console.log(
        "Process: %s - %s MB ",
        new Date(),
        process.memoryUsage().rss / 1048576,
      );
      if (input.rotate !== 0) {
        Jimp.decoders["image/jpeg"] = (data) =>
          JPEG.decode(data, { maxMemoryUsageInMB: 1024 });
        const jimp = await Jimp.read(
          join(process.cwd(), "/src/assets/" + filename),
        );
        jimp.rotate(input.rotate, true);
        await jimp.writeAsync(join(process.cwd(), "/src/assets/" + filename));
      }

      const image = await loadImage(
        join(process.cwd(), "/src/assets/" + filename),
      );

      const wrh = image.width / image.height;
      let newWidth = canvas.width * zoomFactor;
      let newHeight = newWidth / wrh;
      if (newHeight > canvas.height) {
        newHeight = canvas.height;
        newWidth = newHeight * wrh;
      }

      const xOffset =
        newWidth < canvas.width ? (canvas.width - newWidth) / 2 : 0;
      const yOffset =
        newHeight < canvas.height ? (canvas.height - newHeight) / 2 : 0;

      ctx.drawImage(image, xOffset, yOffset, newWidth, newHeight);

      ctx.font = `${fontSize}px "SF Pro"`;
      ctx.fillStyle = "black";

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
      await promises.unlink(join(process.cwd(), "/src/assets/" + filename));
      return {
        image: canvas.toDataURL(),
        size: {
          wieght: canvas.width,
          height: canvas.height,
        },
      };
    }),
  genImagePost: publicProcedure
    .input(
      z.object({
        imagefile: z.string(),
        scale: z.number().min(0.3).max(3).optional().default(0.8),
        rotate: z.number().min(-360).max(360).optional().default(0),
      }),
    )
    .mutation(async ({ input }) => {
      const scale = input.scale ?? 0.8;
      const zoomFactor = 0.88;
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

      // base64 to image
      const imageBuffer = Buffer.from(
        input.imagefile.replace(/^data:image\/\w+;base64,/, ""),
        "base64",
      );

      const filename = `temp-${new Date().getTime()}.jpg`;

      await promises.writeFile(
        join(process.cwd(), "/src/assets/" + filename),
        imageBuffer,
      );

      const exiftool = new ExifTool({ taskTimeoutMillis: 5000 });
      const exif = await exiftool.read(
        join(process.cwd(), "/src/assets/" + filename),
      );

      console.log(
        "Process: %s - %s MB ",
        new Date(),
        process.memoryUsage().rss / 1048576,
      );
      if (input.rotate !== 0) {
        Jimp.decoders["image/jpeg"] = (data) =>
          JPEG.decode(data, { maxMemoryUsageInMB: 1024 });
        const jimp = await Jimp.read(
          join(process.cwd(), "/src/assets/" + filename),
        );
        jimp.rotate(input.rotate, true);
        await jimp.writeAsync(join(process.cwd(), "/src/assets/" + filename));
      }

      const image = await loadImage(
        join(process.cwd(), "/src/assets/" + filename),
      );

      const maxHeight = 1400 * scale;
      const wrh = image.width / image.height;
      let newWidth = canvas.width * zoomFactor;
      let newHeight = newWidth / wrh;
      //   if (newHeight > canvas.height) {
      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * wrh;
      }

      const xOffset =
        newWidth < canvas.width ? (canvas.width - newWidth) / 2 : 0;
      const yOffset = 0;

      ctx.drawImage(image, xOffset, yOffset, newWidth, newHeight);

      ctx.font = `${fontSize}px "SF Pro"`;
      ctx.fillStyle = "black";

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
      await promises.unlink(join(process.cwd(), "/src/assets/" + filename));
      return {
        image: canvas.toDataURL(),
        size: {
          wieght: canvas.width,
          height: canvas.height,
        },
      };
    }),
});
