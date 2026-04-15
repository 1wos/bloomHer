import fs from 'fs';
import { execSync } from 'child_process';

const AUDIO = '/tmp/bloomher-video/audio';
const SLIDES_DIR = '/tmp/bloomher-deck';
const OUT = '/tmp/bloomher-video';
const SEGMENTS = `${OUT}/segments`;
fs.mkdirSync(SEGMENTS, { recursive: true });

function getDuration(wav) {
  return parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${wav}"`).toString().trim());
}

// Narration slides (1-12)
const narratedSlides = [];
for (let i = 1; i <= 12; i++) {
  const n = String(i).padStart(2, '0');
  const wav = `${AUDIO}/narration_${n}.wav`;
  const png = `${SLIDES_DIR}/preview-${n}.png`;
  const dur = getDuration(wav);
  narratedSlides.push({ n, wav, png, dur, silent: false });
  console.log(`Slide ${n}: ${dur.toFixed(1)}s (narrated)`);
}

// Silent appendix slides (13, 14, 15) — 2s each
const silentSlides = [];
for (let i = 13; i <= 15; i++) {
  const n = String(i).padStart(2, '0');
  silentSlides.push({ n, png: `${SLIDES_DIR}/preview-${n}.png`, dur: 1.3, silent: true });
  console.log(`Slide ${n}: 2.0s (silent appendix)`);
}

const all = [...narratedSlides, ...silentSlides];
const total = all.reduce((sum, s) => sum + s.dur, 0);
console.log(`\nTotal: ${total.toFixed(1)}s (${(total / 60).toFixed(2)}min)\n`);

console.log('🎬 Building segments...');
for (const s of all) {
  const seg = `${SEGMENTS}/seg_${s.n}.mp4`;
  if (s.silent) {
    // Silent segment with image for 2 seconds + silent audio track
    execSync(
      `ffmpeg -y -loop 1 -i "${s.png}" -f lavfi -t ${s.dur} -i anullsrc=channel_layout=mono:sample_rate=24000 ` +
        `-c:v libx264 -tune stillimage -pix_fmt yuv420p -t ${s.dur} ` +
        `-vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0xFAF5FF,fps=30" ` +
        `-c:a aac -b:a 192k -shortest "${seg}"`,
      { stdio: 'pipe' }
    );
  } else {
    execSync(
      `ffmpeg -y -loop 1 -i "${s.png}" -i "${s.wav}" ` +
        `-c:v libx264 -tune stillimage -pix_fmt yuv420p ` +
        `-vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0xFAF5FF,fps=30" ` +
        `-c:a aac -b:a 192k -shortest "${seg}"`,
      { stdio: 'pipe' }
    );
  }
  console.log(`  ✓ segment ${s.n}${s.silent ? ' (silent)' : ''}`);
}

const listFile = `${SEGMENTS}/concat.txt`;
fs.writeFileSync(listFile, all.map((s) => `file 'seg_${s.n}.mp4'`).join('\n'));

console.log('\n🎞️  Concatenating...');
const finalPath = `${OUT}/BloomHer_Video.mp4`;
execSync(`ffmpeg -y -f concat -safe 0 -i "${listFile}" -c copy "${finalPath}"`, { stdio: 'pipe' });

const size = Math.round(fs.statSync(finalPath).size / (1024 * 1024));
const finalDur = getDuration(finalPath);
console.log(`\n✅ DONE: ${finalPath}`);
console.log(`   Size: ${size}MB · Duration: ${finalDur.toFixed(1)}s (${Math.floor(finalDur/60)}:${String(Math.floor(finalDur%60)).padStart(2,'0')})`);
