import fs from 'fs';
import { execSync } from 'child_process';

const ENV = fs.readFileSync('/tmp/azure-speech-info.txt', 'utf-8');
const KEY = ENV.match(/KEY=([^\n]+)/)[1];
const REGION = 'japaneast';
const ENDPOINT = `https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;
const AUDIO_DIR = '/tmp/bloomher-video/audio';
fs.mkdirSync(AUDIO_DIR, { recursive: true });

// SHORTER narration — only key messages (not reading slide text fully)
const SLIDES = [
  { n: '01', style: 'gentle', text:
    `A woman just did something remarkable today.<break time="300ms"/>She won't tell anyone — because she doesn't see it.<break time="400ms"/>Women recognize growth in others — <emphasis level="moderate">rarely in themselves.</emphasis><break time="300ms"/>Meet <emphasis level="strong">BloomHer.</emphasis>` },
  { n: '02', style: 'gentle', text:
    `Research shows women apply to jobs only when they meet <emphasis level="strong">one hundred percent</emphasis> of requirements — while men apply at sixty.<break time="400ms"/>Daily life is full of skill moments. But we dismiss them — <prosody pitch="+3%">"just my job."</prosody> <prosody pitch="+3%">"Just being nice."</prosody> <prosody pitch="+3%">"Just being a mom."</prosody><break time="400ms"/>The gap isn't skills. It's <emphasis level="strong">recognition.</emphasis>` },
  { n: '03', style: 'cheerful', text:
    `This isn't another chatbot wrapper. Three engineered prompts. Five research-backed techniques. <emphasis level="strong">Prompt quality drives outcomes.</emphasis>` },
    { n: '04', style: 'cheerful', text:
    `Every daily input flows through three engineered prompts across five screens — from a thirty-second journal, to a named skill, to a weekly story, to an interview-ready narrative.` },
  { n: '05', style: 'cheerful', text:
    `Prompt One — Daily Growth Discovery. A thirty-second journal becomes three named skills, using COSTAR-A and Chain-of-Thought.` },
  { n: '06', style: 'cheerful', text:
    `Prompt Two — a Multi-Agent Debate. Growth Coach and Pattern Analyst argue inside the model, then synthesize.` },
  { n: '07', style: 'cheerful', text:
    `Prompt Three — STAR with L. Classic STAR, plus L for Learned — activating metacognition.` },
  { n: '08', style: 'cheerful', text:
    `Six iterations. V one — skills too abstract. V one point two — no reflection. V two — no framework.<break time="300ms"/>V three point zero — production-ready, stable across twenty test cases.` },
  { n: '09', style: 'cheerful', text:
    `Every technique cites a specific paper — COSTAR-A, Multi-Agent Debate, Metacognitive Prompting, Chain-of-Thought, Few-Shot Learning. Plus my <emphasis level="strong">original</emphasis> STAR with L extension.` },
  { n: '10', style: 'gentle', text:
    `Demo one. A user writes: <prosody pitch="+3%">"I helped my classmate understand a difficult concept and saw her confidence grow."</prosody><break time="400ms"/>BloomHer surfaces three named skills — Empathetic Explainer, Confidence Cultivator, Adaptive Problem-Solver — and asks: <prosody pitch="+3%">"Did you realize kindness uses the same skills as mentoring?"</prosody>` },
  { n: '11', style: 'gentle', text:
    `Demo two — STAR with L auto-structuring. A vague sentence about a team project becomes a full interview-ready story — with five structured parts, five named skills, and a one-line summary she can paste into her resume tomorrow.` },
  { n: '12', style: 'gentle', text:
    `Three production prompts. A working web app.<break time="300ms"/>One mission — helping women <emphasis level="strong">finally see themselves.</emphasis><break time="600ms"/>Every woman has a garden blooming. <emphasis level="strong">BloomHer</emphasis> is the lens.` },
];

function buildSsml(s) {
  return `<speak version="1.0" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US"><voice name="en-US-AriaNeural"><mstts:express-as style="${s.style}"><prosody rate="-3%" pitch="+2%">${s.text}</prosody></mstts:express-as></voice></speak>`;
}

console.log('🌷 Generating tightened narration WAVs...\n');
for (const s of SLIDES) {
  const ssmlFile = `/tmp/bloomher-video/ssml_${s.n}.xml`;
  fs.writeFileSync(ssmlFile, buildSsml(s));
  const out = `${AUDIO_DIR}/narration_${s.n}.wav`;
  execSync(`curl -s -X POST "${ENDPOINT}" -H "Ocp-Apim-Subscription-Key: ${KEY}" -H "Content-Type: application/ssml+xml" -H "X-Microsoft-OutputFormat: riff-24khz-16bit-mono-pcm" -H "User-Agent: bh" --data-binary @${ssmlFile} -o "${out}"`, { stdio: 'pipe' });
  console.log(`✓ slide ${s.n}`);
}
console.log('\n✅ Done');
