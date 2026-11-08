export const C = (ref) => {

    let animations = [];

    // 👉 RIGHT HAND FINGERS (curved "C" shape)
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

    // 👉 THUMB (open curve for "C" shape)
    animations.push(["RightHandThumb1", "rotation", "x", Math.PI / 3, "+"]);
    animations.push(["RightHandThumb1", "rotation", "y", Math.PI / 3, "+"]);
    animations.push(["RightHandThumb2", "rotation", "y", -Math.PI / 6, "-"]);
    animations.push(["RightHandThumb3", "rotation", "y", -Math.PI / 7, "-"]);

    // 👉 RIGHT HAND POSE (curved palm)
    animations.push(["RightHand", "rotation", "z", -Math.PI / 10, "-"]);
    animations.push(["RightHand", "rotation", "y", Math.PI / 4, "+"]);

    // 👉 RIGHT ARM POSITION
    animations.push(["RightForeArm", "rotation", "z", Math.PI / 9, "+"]);
    animations.push(["RightForeArm", "rotation", "x", Math.PI / 18, "+"]);
    animations.push(["RightArm", "rotation", "x", -Math.PI / 6.5, "-"]);

    ref.animations.push(animations);

    // ================= RESET =================
    animations = [];

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
    animations.push(["RightHandThumb1", "rotation", "y", 0, "-"]);
    animations.push(["RightHandThumb2", "rotation", "y", 0, "+"]);
    animations.push(["RightHandThumb3", "rotation", "y", 0, "+"]);

    animations.push(["RightHand", "rotation", "z", 0, "+"]);
    animations.push(["RightHand", "rotation", "y", 0, "-"]);

    animations.push(["RightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["RightForeArm", "rotation", "x", 0, "-"]);
    animations.push(["RightArm", "rotation", "x", 0, "+"]);

    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
};