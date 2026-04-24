/**
 * Subtle client-side feedback: short tone + light haptic.
 * Silently no-ops if the browser blocks audio or the device has no haptic.
 */

let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (audioCtx) return audioCtx;
  const AC =
    (window as unknown as { AudioContext?: typeof AudioContext })
      .AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  try {
    audioCtx = new AC();
    return audioCtx;
  } catch {
    return null;
  }
}

export function playClickTick(): void {
  const ctx = getAudioCtx();
  if (ctx) {
    try {
      // Soft warm "breath": low sine with slow attack and long gentle decay.
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 340;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.014, ctx.currentTime + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.32);
    } catch {
      // ignore
    }
  }

  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(6);
    }
  } catch {
    // ignore
  }
}
