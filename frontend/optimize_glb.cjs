const { NodeIO } = require('@gltf-transform/core');

async function run() {
    console.log("Loading TPose.glb...");
    const io = new NodeIO();
    const basePath = 'c:\\Users\\Admin\\Desktop\\sign\\vasavi-innovasia-hackathon\\frontend\\src\\signkit\\Models\\TPose\\';
    const doc = await io.read(basePath + 'TPose.glb');
    
    // Use dynamic import for Jimp to support the new ES module structure
    const { Jimp } = await import('jimp');

    console.log("Loaded! Processing textures...");
    for (const tex of doc.getRoot().listTextures()) {
        const imageBuffer = tex.getImage();
        if (imageBuffer && imageBuffer.length > 500 * 1024) { 
            console.log("Resizing a large texture of size " + (imageBuffer.length / 1024 / 1024).toFixed(2) + " MB...");
            try {
                const img = await Jimp.read(imageBuffer);
                if (img.bitmap.width > 1024 || img.bitmap.height > 1024) {
                    img.scaleToFit(1024, 1024); 
                }
                const newBuffer = await img.getBuffer('image/jpeg');
                tex.setImage(newBuffer);
                tex.setMimeType('image/jpeg');
                console.log("Converted! New size: " + (newBuffer.length / 1024 / 1024).toFixed(2) + " MB");
            } catch (err) {
                console.error("Error processing an image, skipping", err.message);
            }
        }
    }
    
    console.log("Saving optimized file to TPose2.glb...");
    await io.write(basePath + 'TPose2.glb', doc);
    console.log("Done! Created TPose2.glb");
}

run().catch(console.error);
