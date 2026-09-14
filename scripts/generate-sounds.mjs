#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'assets', 'sounds');
const SAMPLE_RATE = 44100;

mkdirSync(OUT_DIR, { recursive: true });

function writeWav(path, samples) {
  const numSamples = samples.length;
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < numSamples; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  writeFileSync(path, buffer);
}

function addEnvelope(samples, attack, release) {
  const n = samples.length;
  const aSamples = Math.floor(attack * SAMPLE_RATE);
  const rSamples = Math.floor(release * SAMPLE_RATE);
  for (let i = 0; i < n; i++) {
    let gain = 1;
    if (i < aSamples) gain = i / aSamples;
    if (i > n - rSamples) gain = Math.max(0, (n - i) / rSamples);
    samples[i] *= gain;
  }
}

function noiseBurst(duration, decay, lowpass = 0.12) {
  const n = Math.floor(duration * SAMPLE_RATE);
  const out = new Float32Array(n);
  let lp = 0;
  for (let i = 0; i < n; i++) {
    const white = Math.random() * 2 - 1;
    lp = lp * (1 - lowpass) + white * lowpass;
    out[i] = lp;
  }
  for (let i = 0; i < n; i++) {
    out[i] *= Math.pow(1 - i / n, decay);
  }
  return out;
}

function sineSweep(startFreq, endFreq, duration, wave = 'sine', harmonics = 1) {
  const n = Math.floor(duration * SAMPLE_RATE);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / n;
    const freq = startFreq + (endFreq - startFreq) * progress;
    const phase = 2 * Math.PI * freq * t;
    let v = 0;
    for (let h = 1; h <= harmonics; h++) {
      if (wave === 'square') v += Math.sign(Math.sin(phase * h)) / h;
      else if (wave === 'saw') v += Math.sin(phase * h) / h;
      else v += Math.sin(phase * h) / h;
    }
    out[i] = v / harmonics;
  }
  return out;
}

function silence(duration) {
  return new Float32Array(Math.floor(duration * SAMPLE_RATE));
}

function mix(...channels) {
  const len = Math.max(...channels.map((c) => c.length));
  const out = new Float32Array(len);
  for (const c of channels) {
    for (let i = 0; i < c.length; i++) out[i] += c[i];
  }
  return out;
}

// --- laser: bright descending sweep with click ---
(function laser() {
  const sweep = sineSweep(1800, 300, 0.16, 'saw', 2);
  addEnvelope(sweep, 0.001, 0.12);
  const out = mix(sweep);
  writeWav(join(OUT_DIR, 'laser.wav'), out);
})();

// --- enemyLaser: darker, lower, faster ---
(function enemyLaser() {
  const sweep = sineSweep(700, 200, 0.14, 'square', 1);
  addEnvelope(sweep, 0.004, 0.08);
  writeWav(join(OUT_DIR, 'enemyLaser.wav'), sweep);
})();

// --- explosion: noise burst + low sine boom ---
(function explosion() {
  const noise = noiseBurst(0.5, 3.0, 0.1);
  const boom = sineSweep(180, 40, 0.4, 'sine', 1);
  for (let i = 0; i < boom.length; i++) boom[i] *= Math.pow(1 - i / boom.length, 1.5);
  addEnvelope(boom, 0.005, 0.2);
  const out = mix(noise, boom.map((v) => v * 0.9));
  writeWav(join(OUT_DIR, 'explosion.wav'), out);
})();

// --- bigExplosion: longer, louder ---
(function bigExplosion() {
  const noise = noiseBurst(0.9, 2.5, 0.08);
  const boom = sineSweep(120, 25, 0.75, 'sine', 1);
  for (let i = 0; i < boom.length; i++) boom[i] *= Math.pow(1 - i / boom.length, 1.2);
  addEnvelope(boom, 0.005, 0.3);
  const crackle = noiseBurst(0.3, 1.5, 0.2);
  writeWav(join(OUT_DIR, 'bigExplosion.wav'), mix(noise, boom.map((v) => v * 1.1), crackle));
})();

// --- hit: short tick ---
(function hit() {
  const tick = noiseBurst(0.05, 2.0, 0.35);
  const blip = sineSweep(600, 150, 0.06, 'square', 1);
  addEnvelope(blip, 0.002, 0.04);
  writeWav(join(OUT_DIR, 'hit.wav'), mix(tick, blip));
})();

// --- powerup: rising arpeggio ---
(function powerup() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  let out = new Float32Array(Math.floor(0.5 * SAMPLE_RATE));
  for (let k = 0; k < notes.length; k++) {
    const noteDur = 0.09;
    const note = sineSweep(notes[k], notes[k], noteDur, 'sine', 1);
    addEnvelope(note, 0.002, 0.06);
    const offset = Math.floor(((k * noteDur + 0.02) * SAMPLE_RATE));
    for (let i = 0; i < note.length && offset + i < out.length; i++) {
      out[offset + i] += note[i] * 0.8;
    }
  }
  writeWav(join(OUT_DIR, 'powerup.wav'), out);
})();

// --- gameOver: descending dirge ---
(function gameOver() {
  const notes = [392, 329.63, 261.63, 196];
  let out = new Float32Array(Math.floor(1.2 * SAMPLE_RATE));
  for (let k = 0; k < notes.length; k++) {
    const noteDur = 0.28;
    const note = sineSweep(notes[k], notes[k], noteDur, 'sine', 1);
    for (let i = 0; i < note.length; i++) note[i] *= Math.pow(1 - i / note.length, 1);
    const offset = Math.floor(k * noteDur * SAMPLE_RATE);
    for (let i = 0; i < note.length && offset + i < out.length; i++) {
      out[offset + i] += note[i] * 0.7;
    }
  }
  writeWav(join(OUT_DIR, 'gameOver.wav'), out);
})();

// --- wave: two-note fanfare ---
(function waveStart() {
  const notes = [659.25, 880];
  let out = new Float32Array(Math.floor(0.5 * SAMPLE_RATE));
  for (let k = 0; k < notes.length; k++) {
    const noteDur = 0.18;
    const note = sineSweep(notes[k], notes[k], noteDur, 'sine', 2);
    addEnvelope(note, 0.005, 0.1);
    const offset = Math.floor(k * 0.2 * SAMPLE_RATE);
    for (let i = 0; i < note.length && offset + i < out.length; i++) {
      out[offset + i] += note[i] * 0.6;
    }
  }
  writeWav(join(OUT_DIR, 'waveStart.wav'), out);
})();

// --- bossWave: ominous ---
(function bossWave() {
  const notes = [146.83, 146.83, 116.54, 92.5];
  let out = new Float32Array(Math.floor(1.3 * SAMPLE_RATE));
  for (let k = 0; k < notes.length; k++) {
    const noteDur = 0.3;
    const note = sineSweep(notes[k], notes[k], noteDur, 'saw', 2);
    for (let i = 0; i < note.length; i++) note[i] *= Math.pow(1 - i / note.length, 0.8);
    const offset = Math.floor(k * 0.3 * SAMPLE_RATE);
    for (let i = 0; i < note.length && offset + i < out.length; i++) {
      out[offset + i] += note[i] * 0.5;
    }
  }
  writeWav(join(OUT_DIR, 'bossWave.wav'), out);
})();

// --- shield: shimmering rising ---
(function shield() {
  const sweep = sineSweep(400, 1400, 0.3, 'sine', 2);
  addEnvelope(sweep, 0.01, 0.15);
  writeWav(join(OUT_DIR, 'shield.wav'), sweep);
})();

// --- playerHit: harsh buzz ---
(function playerHit() {
  const buzz = sineSweep(220, 90, 0.25, 'square', 2);
  addEnvelope(buzz, 0.002, 0.15);
  const noise = noiseBurst(0.12, 1.5, 0.2);
  writeWav(join(OUT_DIR, 'playerHit.wav'), mix(buzz, noise));
})();

// --- select: UI click ---
(function select() {
  const click = sineSweep(880, 740, 0.08, 'sine', 1);
  addEnvelope(click, 0.001, 0.06);
  writeWav(join(OUT_DIR, 'select.wav'), click);
})();

// --- powerUpCollect: sparkle ---
(function powerUpCollect() {
  const notes = [659.25, 880, 1318.5];
  let out = new Float32Array(Math.floor(0.45 * SAMPLE_RATE));
  for (let k = 0; k < notes.length; k++) {
    const noteDur = 0.12;
    const note = sineSweep(notes[k], notes[k], noteDur, 'sine', 1);
    addEnvelope(note, 0.002, 0.08);
    const offset = Math.floor(k * 0.13 * SAMPLE_RATE);
    for (let i = 0; i < note.length && offset + i < out.length; i++) {
      out[offset + i] += note[i] * 0.7;
    }
  }
  writeWav(join(OUT_DIR, 'powerUpCollect.wav'), out);
})();

const { readdirSync } = await import('node:fs');
console.log(
  `Generated ${readdirSync(OUT_DIR).filter((f) => f.endsWith('.wav')).length} sounds in ${OUT_DIR}`
);