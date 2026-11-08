const fs = require('fs');

const fileBuffer = fs.readFileSync('c:\\Users\\Admin\\Desktop\\sign\\vasavi-innovasia-hackathon\\frontend\\src\\signkit\\Models\\TPose\\TPose.glb');

// GLB Header
const magic = fileBuffer.readUInt32LE(0);
const version = fileBuffer.readUInt32LE(4);
const length = fileBuffer.readUInt32LE(8);

console.log('Magic:', magic.toString(16));
console.log('Version:', version);
console.log('Length:', length / 1024 / 1024, 'MB');

// Chunk 0 (JSON)
const chunk0Length = fileBuffer.readUInt32LE(12);
const chunk0Type = fileBuffer.readUInt32LE(16);
const jsonString = fileBuffer.toString('utf8', 20, 20 + chunk0Length);
const json = JSON.parse(jsonString);

console.log('--- JSON Stats ---');
console.log('Meshes:', json.meshes?.length);
console.log('Materials:', json.materials?.length);
console.log('Textures:', json.textures?.length);
console.log('Images:', json.images?.length);
console.log('Animations:', json.animations?.length);

if (json.images) {
    json.images.forEach((img, i) => {
        const bv = json.bufferViews[img.bufferView];
        console.log(`Image ${i}: ${img.mimeType || 'unknown'} - ${(bv.byteLength / 1024 / 1024).toFixed(2)} MB`);
    });
}
