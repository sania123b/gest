export const B = (ref) => {

    let animations = [];

    // 👉 RIGHT HAND (main B sign hand)
    animations.push(["RightHandIndex1", "rotation", "z", Math.PI / 4.5, "+"]);
    animations.push(["RightHandIndex2", "rotation", "z", Math.PI / 4.5, "+"]);
    animations.push(["RightHandIndex3", "rotation", "z", Math.PI / 4.5, "+"]);

    animations.push(["RightHandMiddle1", "rotation", "z", Math.PI / 4.5, "+"]);
    animations.push(["RightHandMiddle2", "rotation", "z", Math.PI / 4.5, "+"]);
    animations.push(["RightHandMiddle3", "rotation", "z", Math.PI / 4.5, "+"]);

    animations.push(["RightHandRing1", "rotation", "z", Math.PI / 4.5, "+"]);
    animations.push(["RightHandRing2", "rotation", "z", Math.PI / 4.5, "+"]);
    animations.push(["RightHandRing3", "rotation", "z", Math.PI / 4.5, "+"]);

    animations.push(["RightHandPinky1", "rotation", "z", Math.PI / 4.5, "+"]);
    animations.push(["RightHandPinky2", "rotation", "z", Math.PI / 4.5, "+"]);
    animations.push(["RightHandPinky3", "rotation", "z", Math.PI / 4.5, "+"]);

    // 👉 RIGHT THUMB
    animations.push(["RightHandThumb1", "rotation", "x", Math.PI / 6, "+"]);
    animations.push(["RightHandThumb2", "rotation", "y", -Math.PI / 6, "-"]);

    // 👉 RIGHT HAND POSE
    animations.push(["RightHand", "rotation", "z", -Math.PI / 10, "-"]);
    animations.push(["RightHand", "rotation", "y", Math.PI / 4, "+"]);

    // 👉 RIGHT ARM
    animations.push(["RightForeArm", "rotation", "z", Math.PI / 9, "+"]);
    animations.push(["RightForeArm", "rotation", "x", Math.PI / 18, "+"]);
    animations.push(["RightArm", "rotation", "x", -Math.PI / 6.5, "-"]);

    // 👉 LEFT HAND (support pose - mirrored)
    animations.push(["LeftHandIndex1", "rotation", "z", -Math.PI / 4.5, "-"]);
    animations.push(["LeftHandIndex2", "rotation", "z", -Math.PI / 4.5, "-"]);
    animations.push(["LeftHandIndex3", "rotation", "z", -Math.PI / 4.5, "-"]);

    animations.push(["LeftHandMiddle1", "rotation", "z", -Math.PI / 4.5, "-"]);
    animations.push(["LeftHandMiddle2", "rotation", "z", -Math.PI / 4.5, "-"]);
    animations.push(["LeftHandMiddle3", "rotation", "z", -Math.PI / 4.5, "-"]);

    animations.push(["LeftHandRing1", "rotation", "z", -Math.PI / 4.5, "-"]);
    animations.push(["LeftHandRing2", "rotation", "z", -Math.PI / 4.5, "-"]);
    animations.push(["LeftHandRing3", "rotation", "z", -Math.PI / 4.5, "-"]);

    animations.push(["LeftHandPinky1", "rotation", "z", -Math.PI / 4.5, "-"]);
    animations.push(["LeftHandPinky2", "rotation", "z", -Math.PI / 4.5, "-"]);
    animations.push(["LeftHandPinky3", "rotation", "z", -Math.PI / 4.5, "-"]);

    // 👉 LEFT THUMB
    animations.push(["LeftHandThumb1", "rotation", "x", Math.PI / 6, "+"]);
    animations.push(["LeftHandThumb2", "rotation", "y", Math.PI / 6, "+"]);

    // 👉 LEFT HAND POSE
    animations.push(["LeftHand", "rotation", "z", Math.PI / 10, "+"]);
    animations.push(["LeftHand", "rotation", "y", -Math.PI / 4, "-"]);

    // 👉 LEFT ARM
    animations.push(["LeftForeArm", "rotation", "z", -Math.PI / 9, "-"]);
    animations.push(["LeftForeArm", "rotation", "x", Math.PI / 18, "+"]);
    animations.push(["LeftArm", "rotation", "x", -Math.PI / 6.5, "-"]);

    ref.animations.push(animations);

    // ================= RESET POSE =================
    animations = [];

    // RIGHT HAND RESET
    animations.push(["RightHandIndex1", "rotation", "z", 0, "-"]);
    animations.push(["RightHandIndex2", "rotation", "z", 0, "-"]);
    animations.push(["RightHandIndex3", "rotation", "z", 0, "-"]);

    animations.push(["RightHandMiddle1", "rotation", "z", 0, "-"]);
    animations.push(["RightHandMiddle2", "rotation", "z", 0, "-"]);
    animations.push(["RightHandMiddle3", "rotation", "z", 0, "-"]);

    animations.push(["RightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["RightHandRing2", "rotation", "z", 0, "-"]);
    animations.push(["RightHandRing3", "rotation", "z", 0, "-"]);

    animations.push(["RightHandPinky1", "rotation", "z", 0, "-"]);
    animations.push(["RightHandPinky2", "rotation", "z", 0, "-"]);
    animations.push(["RightHandPinky3", "rotation", "z", 0, "-"]);

    animations.push(["RightHandThumb1", "rotation", "x", 0, "-"]);
    animations.push(["RightHandThumb2", "rotation", "y", 0, "+"]);

    animations.push(["RightHand", "rotation", "z", 0, "+"]);
    animations.push(["RightHand", "rotation", "y", 0, "-"]);

    animations.push(["RightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["RightForeArm", "rotation", "x", 0, "-"]);
    animations.push(["RightArm", "rotation", "x", 0, "+"]);

    // LEFT HAND RESET
    animations.push(["LeftHandIndex1", "rotation", "z", 0, "+"]);
    animations.push(["LeftHandIndex2", "rotation", "z", 0, "+"]);
    animations.push(["LeftHandIndex3", "rotation", "z", 0, "+"]);

    animations.push(["LeftHandMiddle1", "rotation", "z", 0, "+"]);
    animations.push(["LeftHandMiddle2", "rotation", "z", 0, "+"]);
    animations.push(["LeftHandMiddle3", "rotation", "z", 0, "+"]);

    animations.push(["LeftHandRing1", "rotation", "z", 0, "+"]);
    animations.push(["LeftHandRing2", "rotation", "z", 0, "+"]);
    animations.push(["LeftHandRing3", "rotation", "z", 0, "+"]);

    animations.push(["LeftHandPinky1", "rotation", "z", 0, "+"]);
    animations.push(["LeftHandPinky2", "rotation", "z", 0, "+"]);
    animations.push(["LeftHandPinky3", "rotation", "z", 0, "+"]);

    animations.push(["LeftHandThumb1", "rotation", "x", 0, "-"]);
    animations.push(["LeftHandThumb2", "rotation", "y", 0, "-"]);

    animations.push(["LeftHand", "rotation", "z", 0, "-"]);
    animations.push(["LeftHand", "rotation", "y", 0, "+"]);

    animations.push(["LeftForeArm", "rotation", "z", 0, "+"]);
    animations.push(["LeftForeArm", "rotation", "x", 0, "-"]);
    animations.push(["LeftArm", "rotation", "x", 0, "+"]);

    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
};