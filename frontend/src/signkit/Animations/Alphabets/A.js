export const A = (ref) => {

    let animations = [];

    // 👉 LEFT HAND FINGERS (closed fist with slight variations)
    animations.push(["LeftHandIndex1", "rotation", "y", -Math.PI / 9, "-"]);
    animations.push(["LeftHandMiddle1", "rotation", "y", -Math.PI / 18, "-"]);
    animations.push(["LeftHandRing1", "rotation", "y", Math.PI / 18, "+"]);
    animations.push(["LeftHandPinky1", "rotation", "y", Math.PI / 9, "+"]);

    // 👉 LEFT HAND POSITION (A gesture base pose)
    animations.push(["LeftHand", "rotation", "x", Math.PI / 2, "+"]);
    animations.push(["LeftHand", "rotation", "z", Math.PI / 6, "+"]);
    animations.push(["LeftHand", "rotation", "y", Math.PI / 9, "+"]);

    // 👉 LEFT ARM POSITION
    animations.push(["LeftForeArm", "rotation", "x", Math.PI / 10, "+"]);
    animations.push(["LeftForeArm", "rotation", "z", -Math.PI / 18, "-"]);
    animations.push(["LeftArm", "rotation", "x", -Math.PI / 11, "-"]);

    // 👉 RIGHT HAND (kept relaxed / neutral support pose)
    animations.push(["RightHandMiddle1", "rotation", "z", Math.PI / 2, "+"]);
    animations.push(["RightHandMiddle2", "rotation", "z", Math.PI / 2, "+"]);
    animations.push(["RightHandMiddle3", "rotation", "z", Math.PI / 2, "+"]);

    animations.push(["RightHandRing1", "rotation", "z", Math.PI / 2, "+"]);
    animations.push(["RightHandRing2", "rotation", "z", Math.PI / 2, "+"]);
    animations.push(["RightHandRing3", "rotation", "z", Math.PI / 2, "+"]);

    animations.push(["RightHandPinky1", "rotation", "z", Math.PI / 2, "+"]);
    animations.push(["RightHandPinky2", "rotation", "z", Math.PI / 2, "+"]);
    animations.push(["RightHandPinky3", "rotation", "z", Math.PI / 2, "+"]);

    animations.push(["RightHandThumb2", "rotation", "y", -Math.PI / 2.5, "-"]);
    animations.push(["RightHandThumb3", "rotation", "y", -Math.PI / 2.5, "-"]);

    animations.push(["RightHand", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["RightHand", "rotation", "z", Math.PI / 12, "+"]);

    animations.push(["RightForeArm", "rotation", "z", Math.PI / 4, "+"]);
    animations.push(["RightForeArm", "rotation", "x", -Math.PI / 36, "-"]);
    animations.push(["RightArm", "rotation", "x", -Math.PI / 9, "-"]);

    // 👉 PUSH INTO SYSTEM
    ref.animations.push(animations);

    // 👉 RESET POSE
    animations = [];

    animations.push(["LeftHandIndex1", "rotation", "y", 0, "+"]);
    animations.push(["LeftHandMiddle1", "rotation", "y", 0, "+"]);
    animations.push(["LeftHandRing1", "rotation", "y", 0, "-"]);
    animations.push(["LeftHandPinky1", "rotation", "y", 0, "-"]);

    animations.push(["LeftHand", "rotation", "x", 0, "-"]);
    animations.push(["LeftHand", "rotation", "y", 0, "-"]);
    animations.push(["LeftHand", "rotation", "z", 0, "-"]);

    animations.push(["LeftForeArm", "rotation", "x", 0, "-"]);
    animations.push(["LeftForeArm", "rotation", "z", 0, "+"]);
    animations.push(["LeftArm", "rotation", "x", 0, "+"]);

    animations.push(["RightHand", "rotation", "x", 0, "+"]);
    animations.push(["RightHand", "rotation", "z", 0, "-"]);

    animations.push(["RightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["RightForeArm", "rotation", "x", 0, "+"]);

    animations.push(["RightArm", "rotation", "x", 0, "+"]);
    animations.push(["RightArm", "rotation", "y", 0, "+"]);

    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
};