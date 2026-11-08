export const defaultPose = (ref) => {

  // ✅ ensure animations exists
  if (!ref.animations) ref.animations = [];

  let animations = [];

  // Tilt head slightly down (more natural for viewer on PC)
  animations.push(["mixamorigNeck", "rotation", "x", Math.PI / 14, "+"]);

  // ── Arms: bring down from T-pose so hands sit at chest level ──
  // Z-rotation lowers the arms (after SHIM flips X/Z, these move correctly)
  animations.push(["mixamorigLeftArm",  "rotation", "z", -Math.PI / 3, "-"]);
  animations.push(["mixamorigRightArm", "rotation", "z",  Math.PI / 3, "+"]);

  // X-rotation pulls arms slightly forward (in front of body)
  animations.push(["mixamorigLeftArm",  "rotation", "x", -Math.PI / 10, "-"]);
  animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 10, "-"]);

  // ── Forearms: Y-rotation supinates (rotates palm to face forward) ──
  // Y axis is NOT SHIM-flipped, so these values go through as written.
  // Negative Y on left / Positive Y on right → palms face the camera.
  animations.push(["mixamorigLeftForeArm",  "rotation", "y", -Math.PI / 1.5, "-"]);
  animations.push(["mixamorigRightForeArm", "rotation", "y",  Math.PI / 1.5, "+"]);

  // ── Wrist: tip palm slightly toward camera (forward along Z) ──
  animations.push(["mixamorigLeftHand",  "rotation", "x",  Math.PI / 6, "+"]);
  animations.push(["mixamorigRightHand", "rotation", "x",  Math.PI / 6, "+"]);

  // ✅ push initial pose
  ref.animations.push(animations);

  // ✅ start animation safely
  if (!ref.pending) {
    ref.pending = true;
    requestAnimationFrame(ref.animate);
  }
};