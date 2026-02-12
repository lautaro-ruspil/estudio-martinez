import sharp from "sharp";

await sharp("src/assets/roberto-martinez.webp")
    .resize(256, 256, { fit: "cover" })
    .webp({ quality: 80, effort: 6 })
    .toFile("src/assets/roberto-martinez-optimized.webp");
