const Phaser = window.Phaser;

const PLAY_WIDTH = 960;
const PLAY_HEIGHT = 600;
const WIDTH = 1280;
const HEIGHT = 720;
const RENDER_SCALE = 1;
const CANVAS_WIDTH = WIDTH;
const CANVAS_HEIGHT = HEIGHT;
const TEXT_RESOLUTION = RENDER_SCALE;
const CCTV_SHUTDOWN_MS = 5000;
const GUARD_CATCH_FAIL_MS = 1000;
const GUARD_SIGHT_FAIL_MS = 2000;
const GUARD_NOTICE_RANGE = 145;
const GUARD_NOTICE_WIDTH = 0.82;
const GUARD_CONFIRMED_RANGE = 82;
const GUARD_CONFIRMED_WIDTH = 0.42;
const GUARD_BODY_WIDTH = 18;
const GUARD_BODY_HEIGHT = 22;
const MAX_SIM_DELTA_MS = 33;
const CAMERA_SWEEP_SPEED = 44;
const CAMERA_SWEEP_RANGE = 40;
const GUARD_NAV_PADDING = 12;
const GUARD_WAYPOINT_REACH = 16;
const GUARD_STUCK_RECOVER_MS = 900;
const GUARD_TURN_RATE = 0.014;
const NAV_GRID_SIZE = 24;
const NAV_REPATH_MS = 220;

const palette = {
  bg: 0x10151f,
  floor: 0x182232,
  floorDark: 0x121a27,
  floorLine: 0x243146,
  wall: 0x344255,
  wallTop: 0x52637a,
  wallEdge: 0x7b8da8,
  shadow: 0x070b12,
  player: 0x53d1ff,
  guard: 0xf26d6d,
  hostage: 0xffd166,
  evidence: 0xa7f3d0,
  computer: 0x78dcca,
  exit: 0xb8f36f,
  cctv: 0xffb454,
  ui: 0xe8eef8,
  muted: 0x9fb0c7,
  danger: 0xff4f68
};

const levels = [
  {
    name: "Warehouse Infiltration",
    player: { x: 76, y: 500 },
    hostage: { x: 820, y: 106 },
    exit: { x: 870, y: 500 },
    computers: [{ x: 238, y: 108 }],
    evidence: [
      { x: 430, y: 492 },
      { x: 670, y: 302 }
    ],
    guards: [
      { x: 290, y: 228, route: [{ x: 290, y: 228 }, { x: 390, y: 228 }, { x: 390, y: 205 }, { x: 545, y: 205 }, { x: 545, y: 228 }], speed: 58 },
      { x: 680, y: 430, route: [{ x: 680, y: 430 }, { x: 835, y: 430 }, { x: 835, y: 500 }, { x: 710, y: 500 }, { x: 710, y: 430 }], speed: 64 }
    ],
    cameras: [
      { x: 475, y: 56, angle: 90, disabled: false },
      { x: 782, y: 350, angle: 225, disabled: false }
    ],
    walls: [
      [0, 0, 960, 42],
      [0, 558, 960, 42],
      [0, 0, 42, 600],
      [918, 0, 42, 600],
      [155, 142, 290, 36],
      [565, 142, 190, 36],
      [155, 360, 268, 36],
      [540, 360, 255, 36],
      [420, 250, 36, 146],
      [620, 178, 36, 118]
    ],
    props: [
      { type: "desk", x: 250, y: 112 },
      { type: "desk", x: 655, y: 306 }
    ]
  },
  {
    name: "Control Room Escape",
    player: { x: 76, y: 108 },
    hostage: { x: 790, y: 480 },
    exit: { x: 78, y: 500 },
    computers: [{ x: 514, y: 108 }, { x: 758, y: 245 }],
    evidence: [
      { x: 256, y: 462 },
      { x: 714, y: 110 },
      { x: 520, y: 306 }
    ],
    guards: [
      { x: 280, y: 245, route: [{ x: 190, y: 245 }, { x: 370, y: 245 }, { x: 370, y: 315 }, { x: 190, y: 315 }], speed: 70 },
      { x: 852, y: 240, route: [{ x: 852, y: 240 }, { x: 852, y: 505 }, { x: 884, y: 505 }, { x: 884, y: 240 }], speed: 67 },
      { x: 600, y: 495, route: [{ x: 535, y: 495 }, { x: 745, y: 495 }, { x: 745, y: 430 }, { x: 535, y: 430 }], speed: 74 }
    ],
    cameras: [
      { x: 245, y: 56, angle: 55, disabled: false },
      { x: 772, y: 287, angle: 210, disabled: false },
      { x: 856, y: 56, angle: 115, disabled: false }
    ],
    walls: [
      [0, 0, 960, 42],
      [0, 558, 960, 42],
      [0, 0, 42, 600],
      [918, 0, 42, 600],
      [150, 170, 170, 36],
      [470, 170, 300, 36],
      [150, 360, 210, 36],
      [510, 360, 270, 36],
      [420, 42, 36, 180],
      [420, 345, 36, 213],
      [780, 170, 36, 226]
    ],
    props: [
      { type: "desk", x: 508, y: 112 },
      { type: "desk", x: 758, y: 246 }
    ]
  },
  {
    name: "Data Center Rescue",
    player: { x: 80, y: 512 },
    hostage: { x: 835, y: 92 },
    exit: { x: 868, y: 510 },
    computers: [{ x: 210, y: 108 }, { x: 705, y: 324 }],
    evidence: [
      { x: 340, y: 504 },
      { x: 520, y: 126 },
      { x: 818, y: 420 }
    ],
    guards: [
      { x: 260, y: 260, route: [{ x: 158, y: 260 }, { x: 362, y: 260 }, { x: 362, y: 318 }, { x: 158, y: 318 }], speed: 72 },
      { x: 585, y: 220, route: [{ x: 520, y: 220 }, { x: 655, y: 220 }, { x: 655, y: 282 }, { x: 520, y: 282 }], speed: 76 },
      { x: 770, y: 478, route: [{ x: 584, y: 478 }, { x: 838, y: 478 }, { x: 838, y: 415 }, { x: 584, y: 415 }], speed: 68 }
    ],
    cameras: [
      { x: 560, y: 58, angle: 90, disabled: false },
      { x: 900, y: 326, angle: 180, disabled: false },
      { x: 410, y: 548, angle: 225, disabled: false }
    ],
    walls: [
      [0, 0, 960, 42],
      [0, 558, 960, 42],
      [0, 0, 42, 600],
      [918, 0, 42, 600],
      [142, 156, 245, 36],
      [502, 156, 275, 36],
      [142, 360, 220, 36],
      [488, 360, 320, 36],
      [412, 42, 36, 170],
      [412, 318, 36, 240],
      [682, 210, 36, 128]
    ],
    props: [
      { type: "desk", x: 210, y: 112 },
      { type: "desk", x: 704, y: 326 }
    ]
  },
  {
    name: "Rooftop Extraction",
    player: { x: 78, y: 88 },
    hostage: { x: 845, y: 500 },
    exit: { x: 80, y: 510 },
    computers: [{ x: 812, y: 105 }],
    evidence: [
      { x: 258, y: 118 },
      { x: 428, y: 476 },
      { x: 706, y: 294 },
      { x: 848, y: 188 }
    ],
    guards: [
      { x: 300, y: 252, route: [{ x: 190, y: 252 }, { x: 365, y: 252 }, { x: 365, y: 300 }, { x: 190, y: 300 }], speed: 78 },
      { x: 650, y: 135, route: [{ x: 560, y: 135 }, { x: 790, y: 135 }, { x: 790, y: 210 }, { x: 560, y: 210 }], speed: 78 },
      { x: 650, y: 462, route: [{ x: 560, y: 462 }, { x: 790, y: 462 }, { x: 790, y: 515 }, { x: 560, y: 515 }], speed: 82 },
      { x: 250, y: 475, route: [{ x: 180, y: 475 }, { x: 370, y: 475 }, { x: 370, y: 425 }, { x: 180, y: 425 }], speed: 72 }
    ],
    cameras: [
      { x: 440, y: 44, angle: 135, disabled: false },
      { x: 912, y: 220, angle: 180, disabled: false },
      { x: 650, y: 362, angle: 270, disabled: false },
      { x: 910, y: 520, angle: 215, disabled: false }
    ],
    walls: [
      [0, 0, 960, 42],
      [0, 558, 960, 42],
      [0, 0, 42, 600],
      [918, 0, 42, 600],
      [140, 158, 300, 36],
      [532, 242, 286, 36],
      [142, 340, 250, 36],
      [515, 370, 305, 36],
      [468, 42, 36, 170],
      [468, 276, 36, 282],
      [820, 242, 36, 164]
    ],
    props: [
      { type: "desk", x: 812, y: 108 }
    ]
  },
  {
    name: "Final Boss Lockdown",
    player: { x: 78, y: 500 },
    hostage: { x: 850, y: 88 },
    exit: { x: 875, y: 500 },
    computers: [{ x: 230, y: 108 }, { x: 704, y: 500 }],
    evidence: [
      { x: 246, y: 246 },
      { x: 520, y: 112 },
      { x: 552, y: 496 },
      { x: 742, y: 230 },
      { x: 805, y: 405 }
    ],
    guards: [
      { x: 260, y: 226, route: [{ x: 172, y: 226 }, { x: 378, y: 226 }, { x: 378, y: 272 }, { x: 172, y: 272 }], speed: 84 },
      { x: 300, y: 442, route: [{ x: 170, y: 442 }, { x: 382, y: 442 }, { x: 382, y: 500 }, { x: 170, y: 500 }], speed: 86 },
      { x: 548, y: 216, route: [{ x: 488, y: 216 }, { x: 610, y: 216 }, { x: 610, y: 276 }, { x: 488, y: 276 }], speed: 90 },
      { x: 744, y: 238, route: [{ x: 704, y: 238 }, { x: 842, y: 238 }, { x: 842, y: 320 }, { x: 704, y: 320 }], speed: 90 },
      { x: 735, y: 482, route: [{ x: 704, y: 482 }, { x: 810, y: 482 }, { x: 810, y: 530 }, { x: 704, y: 530 }], speed: 96 },
      { x: 520, y: 458, route: [{ x: 486, y: 458 }, { x: 610, y: 458 }, { x: 610, y: 520 }, { x: 486, y: 520 }], speed: 92 }
    ],
    cameras: [
      { x: 230, y: 44, angle: 90, disabled: false },
      { x: 454, y: 226, angle: 180, disabled: false },
      { x: 610, y: 44, angle: 120, disabled: false },
      { x: 820, y: 210, angle: 190, disabled: false },
      { x: 704, y: 520, angle: 270, disabled: false },
      { x: 910, y: 500, angle: 200, disabled: false }
    ],
    walls: [
      [0, 0, 960, 42],
      [0, 558, 960, 42],
      [0, 0, 42, 600],
      [918, 0, 42, 600],
      [140, 135, 260, 34],
      [520, 135, 280, 34],
      [140, 300, 260, 34],
      [520, 300, 300, 34],
      [420, 42, 36, 200],
      [420, 310, 36, 248],
      [640, 169, 36, 140],
      [640, 385, 36, 173],
      [826, 458, 92, 34],
      [826, 524, 92, 34],
      [826, 458, 34, 100]
    ],
    props: [
      { type: "desk", x: 230, y: 108 },
      { type: "desk", x: 704, y: 500 },
      { type: "pipe", x: 520, y: 214 }
    ]
  }
];

const saveKey = "hostage-rescue-progress";

function loadProgress() {
  const stored = Number(localStorage.getItem(saveKey));
  return Number.isFinite(stored) ? Math.max(0, stored) : 0;
}

function saveProgress(levelIndex) {
  localStorage.setItem(saveKey, String(Math.max(loadProgress(), levelIndex)));
}

function defaultSettings() {
  return {
    showVision: true,
    chaseEnabled: true,
    showHelp: true,
    sound: true,
    volume: 70
  };
}

function loadSettings() {
  try {
    return { ...defaultSettings(), ...JSON.parse(localStorage.getItem("hostage-rescue-settings") || "{}") };
  } catch {
    return defaultSettings();
  }
}

function saveSettings(settings) {
  localStorage.setItem("hostage-rescue-settings", JSON.stringify(settings));
}

class GameAudio {
  constructor() {
    this.context = null;
    this.master = null;
    this.musicGain = null;
    this.musicNodes = [];
    this.musicInterval = null;
    this.musicStep = 0;
    this.chaseGain = null;
    this.chaseNodes = [];
    this.chaseInterval = null;
    this.enabled = true;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopBacksound();
      this.stopChaseSiren();
    }
  }

  setVolume(volume) {
    this.resume();
    if (!this.master) return;
    this.master.gain.value = 1.25 * (Phaser.Math.Clamp(volume, 0, 100) / 100);
  }

  init() {
    if (this.context) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.context = new AudioContext();
    this.master = this.context.createGain();
    this.master.gain.value = 1.25 * (loadSettings().volume / 100);
    this.master.connect(this.context.destination);
  }

  resume() {
    this.init();
    if (this.context?.state === "suspended") this.context.resume();
  }

  tone(freq, duration = 0.14, type = "sine", gain = 0.18, start = 0) {
    this.resume();
    if (!this.context || !this.master) return;
    const now = this.context.currentTime + start;
    const osc = this.context.createOscillator();
    const amp = this.context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    amp.gain.setValueAtTime(0.0001, now);
    amp.gain.exponentialRampToValueAtTime(gain, now + 0.012);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(amp);
    amp.connect(this.master);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  noise(duration = 0.18, gain = 0.18, start = 0) {
    this.resume();
    if (!this.context || !this.master) return;
    const now = this.context.currentTime + start;
    const buffer = this.context.createBuffer(1, Math.max(1, this.context.sampleRate * duration), this.context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    const source = this.context.createBufferSource();
    const amp = this.context.createGain();
    source.buffer = buffer;
    amp.gain.setValueAtTime(gain, now);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    source.connect(amp);
    amp.connect(this.master);
    source.start(now);
    source.stop(now + duration);
  }

  sweep(startFreq, endFreq, duration = 0.3, type = "sine", gain = 0.24, start = 0) {
    this.resume();
    if (!this.context || !this.master) return;
    const now = this.context.currentTime + start;
    const osc = this.context.createOscillator();
    const amp = this.context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.linearRampToValueAtTime(endFreq, now + duration);
    amp.gain.setValueAtTime(0.0001, now);
    amp.gain.exponentialRampToValueAtTime(gain, now + 0.015);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(amp);
    amp.connect(this.master);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  play(name) {
    if (!this.enabled) return;
    if (name === "spawn") {
      this.tone(220, 0.12, "triangle", 0.22);
      this.tone(330, 0.12, "triangle", 0.22, 0.08);
      this.tone(440, 0.16, "triangle", 0.22, 0.16);
    } else if (name === "chase") {
      this.sweep(520, 880, 0.32, "sawtooth", 0.34);
      this.sweep(880, 520, 0.32, "sawtooth", 0.34, 0.32);
      this.tone(120, 0.64, "square", 0.12);
    } else if (name === "caught") {
      this.noise(0.24, 0.32);
      this.tone(80, 0.42, "sawtooth", 0.32);
    } else if (name === "hack") {
      this.noise(0.18, 0.3);
      this.tone(1200, 0.035, "square", 0.24, 0.02);
      this.tone(260, 0.05, "sawtooth", 0.28, 0.07);
      this.tone(980, 0.04, "square", 0.26, 0.13);
      this.noise(0.12, 0.24, 0.18);
    } else if (name === "scan") {
      this.tone(760, 0.16, "sine", 0.28);
      this.tone(520, 0.18, "sine", 0.26, 0.12);
    } else if (name === "evidence") {
      this.tone(680, 0.08, "triangle", 0.24);
      this.tone(920, 0.11, "triangle", 0.24, 0.08);
    } else if (name === "hostage") {
      this.tone(360, 0.12, "triangle", 0.24);
      this.tone(540, 0.16, "triangle", 0.24, 0.12);
    } else if (name === "exit") {
      this.tone(420, 0.1, "triangle", 0.26);
      this.tone(640, 0.14, "triangle", 0.26, 0.1);
    } else if (name === "complete") {
      this.tone(523, 0.12, "triangle", 0.26);
      this.tone(659, 0.12, "triangle", 0.26, 0.12);
      this.tone(784, 0.24, "triangle", 0.28, 0.24);
    }
  }

  startBacksound() {
    if (!this.enabled) return;
    this.resume();
    if (!this.context || !this.master || this.musicGain) return;
    this.musicGain = this.context.createGain();
    this.musicGain.gain.value = 0.1;
    this.musicGain.connect(this.master);

    [55, 82.5].forEach((freq) => {
      const osc = this.context.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(this.musicGain);
      osc.start();
      this.musicNodes.push(osc);
    });
    const notes = [220, 247, 196, 165, 196, 247, 294, 247];
    this.musicStep = 0;
    this.musicInterval = window.setInterval(() => {
      if (!this.enabled || !this.musicGain) return;
      const note = notes[this.musicStep % notes.length];
      this.tone(note, 0.24, "triangle", 0.08);
      this.tone(note / 2, 0.26, "sine", 0.05, 0.03);
      this.musicStep += 1;
    }, 420);
  }

  stopBacksound() {
    if (!this.musicGain) return;
    const now = this.context.currentTime;
    if (this.musicInterval) {
      window.clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
    this.musicGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
    this.musicNodes.forEach((node) => node.stop(now + 0.3));
    this.musicNodes = [];
    this.musicGain = null;
  }

  startChaseSiren() {
    if (!this.enabled || this.chaseGain) return;
    this.resume();
    if (!this.context || !this.master) return;
    this.chaseGain = this.context.createGain();
    this.chaseGain.gain.value = 0.12;
    this.chaseGain.connect(this.master);
    const siren = this.context.createOscillator();
    const lowPulse = this.context.createOscillator();
    siren.type = "sawtooth";
    lowPulse.type = "square";
    siren.frequency.value = 520;
    lowPulse.frequency.value = 120;
    siren.connect(this.chaseGain);
    lowPulse.connect(this.chaseGain);
    siren.start();
    lowPulse.start();
    this.chaseNodes.push(siren, lowPulse);

    let high = false;
    this.chaseInterval = window.setInterval(() => {
      if (!this.context || !this.chaseGain) return;
      const now = this.context.currentTime;
      high = !high;
      siren.frequency.cancelScheduledValues(now);
      siren.frequency.setValueAtTime(high ? 520 : 880, now);
      siren.frequency.linearRampToValueAtTime(high ? 880 : 520, now + 0.45);
    }, 450);
  }

  stopChaseSiren() {
    if (!this.chaseGain) return;
    const now = this.context.currentTime;
    if (this.chaseInterval) {
      window.clearInterval(this.chaseInterval);
      this.chaseInterval = null;
    }
    this.chaseGain.gain.setValueAtTime(this.chaseGain.gain.value, now);
    this.chaseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    this.chaseNodes.forEach((node) => node.stop(now + 0.25));
    this.chaseNodes = [];
    this.chaseGain = null;
  }
}

const gameAudio = new GameAudio();

function setupCamera(scene) {
  scene.cameras.main.setZoom(RENDER_SCALE);
  scene.cameras.main.setScroll(0, 0);
}

function uiX(x) {
  return x + Math.round((WIDTH - PLAY_WIDTH) / 2);
}

function uiY(y) {
  return y + Math.round((HEIGHT - PLAY_HEIGHT) / 2);
}

function button(scene, x, y, label, onClick, width = 238) {
  const panel = scene.add.rectangle(x, y, width, 44, 0x1e2a3c, 0.96);
  panel.setStrokeStyle(2, 0x7dd3fc);
  const text = scene.add.text(x, y, label, {
    fontFamily: "Arial",
    fontSize: "18px",
    color: "#e8eef8",
    resolution: TEXT_RESOLUTION
  }).setOrigin(0.5);

  panel.setInteractive({ useHandCursor: true });
  panel.on("pointerover", () => {
    panel.setFillStyle(0x2b3c55, 1);
    text.setColor("#ffffff");
  });
  panel.on("pointerout", () => {
    panel.setFillStyle(0x1e2a3c, 0.96);
    text.setColor("#e8eef8");
  });
  panel.on("pointerdown", () => {
    gameAudio.resume();
    onClick();
  });

  return { panel, text };
}

class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.createTextures();
  }

  create() {
    this.scene.start("Menu");
  }

  createTextures() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    g.fillStyle(0x121a27);
    g.fillRect(0, 0, 48, 48);
    g.lineStyle(1, 0x26354c, 0.7);
    g.strokeRect(0, 0, 48, 48);
    g.lineStyle(1, 0x1b2638, 0.7);
    g.lineBetween(0, 24, 48, 24);
    g.lineBetween(24, 0, 24, 48);
    g.fillStyle(0x253249, 0.3);
    g.fillRect(6, 6, 8, 2);
    g.fillRect(31, 33, 10, 2);
    g.generateTexture("floorTile", 48, 48);
    g.clear();

    g.fillStyle(palette.player);
    g.fillRoundedRect(9, 5, 14, 18, 3);
    g.fillStyle(0x1c6f88);
    g.fillRect(8, 20, 6, 9);
    g.fillRect(18, 20, 6, 9);
    g.fillStyle(0x182232);
    g.fillRect(10, 2, 12, 6);
    g.fillStyle(0xffffff);
    g.fillRect(12, 9, 3, 3);
    g.fillRect(18, 9, 3, 3);
    g.fillStyle(0x9be7ff);
    g.fillRect(5, 12, 4, 9);
    g.fillRect(23, 12, 4, 9);
    g.generateTexture("player", 32, 32);
    g.clear();

    g.fillStyle(palette.guard);
    g.fillRoundedRect(8, 5, 16, 20, 3);
    g.fillStyle(0x4b151b);
    g.fillRect(8, 6, 16, 5);
    g.fillStyle(0x111827);
    g.fillRect(11, 9, 10, 3);
    g.fillStyle(0xff9c9c);
    g.fillRect(5, 13, 4, 9);
    g.fillRect(23, 13, 4, 9);
    g.fillStyle(0x8d3038);
    g.fillRect(10, 24, 5, 6);
    g.fillRect(18, 24, 5, 6);
    g.generateTexture("guard", 32, 32);
    g.clear();

    g.fillStyle(0x7dd3fc);
    g.fillCircle(16, 16, 14);
    g.fillStyle(0x0f172a);
    g.fillCircle(16, 16, 11);
    g.fillStyle(palette.hostage);
    g.fillRoundedRect(10, 7, 12, 17, 3);
    g.fillStyle(0x5f370e);
    g.fillRect(9, 5, 14, 5);
    g.fillStyle(0xffe5a1);
    g.fillRect(12, 12, 3, 3);
    g.fillRect(18, 12, 3, 3);
    g.fillStyle(0xff4f68);
    g.fillRect(8, 16, 4, 2);
    g.fillRect(20, 16, 4, 2);
    g.fillStyle(0xa45a22);
    g.fillRect(11, 24, 4, 5);
    g.fillRect(18, 24, 4, 5);
    g.generateTexture("hostage", 32, 32);
    g.clear();

    g.fillStyle(palette.evidence);
    g.fillRect(5, 8, 22, 16);
    g.fillStyle(0x0b5648);
    g.fillRect(8, 12, 16, 2);
    g.fillRect(8, 17, 11, 2);
    g.generateTexture("evidence", 32, 32);
    g.clear();

    g.fillStyle(palette.computer);
    g.fillRect(4, 5, 24, 16);
    g.fillStyle(0x0b2530);
    g.fillRect(7, 8, 18, 10);
    g.fillStyle(0x7dd3fc);
    g.fillRect(11, 12, 10, 2);
    g.fillStyle(0x385569);
    g.fillRect(10, 23, 12, 3);
    g.generateTexture("computer", 32, 32);
    g.clear();

    g.fillStyle(palette.exit);
    g.fillRect(8, 2, 16, 28);
    g.fillStyle(0x1f3616);
    g.fillRect(18, 14, 3, 3);
    g.generateTexture("exit", 32, 32);
    g.clear();

    g.fillStyle(palette.cctv);
    g.fillRoundedRect(4, 10, 22, 9, 2);
    g.fillStyle(0x44210a);
    g.fillRect(20, 13, 8, 3);
    g.fillStyle(0xfff0a3);
    g.fillRect(7, 12, 5, 3);
    g.generateTexture("camera", 32, 32);
    g.clear();

    g.fillStyle(palette.wall);
    g.fillRect(0, 0, 32, 32);
    g.fillStyle(palette.wallTop);
    g.fillRect(0, 0, 32, 6);
    g.generateTexture("wall", 32, 32);
    g.clear();

    g.fillStyle(0x8a5a36);
    g.fillRect(2, 5, 28, 23);
    g.fillStyle(0xb67a44);
    g.fillRect(4, 3, 24, 7);
    g.lineStyle(2, 0x4b2f1d);
    g.strokeRect(2, 5, 28, 23);
    g.lineBetween(4, 16, 28, 16);
    g.lineBetween(16, 5, 16, 28);
    g.generateTexture("crate", 32, 32);
    g.clear();

    g.fillStyle(0x1f2937);
    g.fillRoundedRect(2, 8, 44, 19, 3);
    g.fillStyle(0x4f6078);
    g.fillRect(5, 10, 38, 4);
    g.fillStyle(0x0f172a);
    g.fillRect(7, 17, 12, 6);
    g.fillRect(25, 17, 12, 6);
    g.generateTexture("desk", 48, 36);
    g.clear();

    g.fillStyle(0x53657f);
    g.fillRoundedRect(3, 12, 58, 8, 4);
    g.fillStyle(0x9fb0c7);
    g.fillRect(10, 13, 10, 2);
    g.fillRect(39, 17, 11, 2);
    g.generateTexture("pipe", 64, 32);
    g.clear();
  }
}

class MenuScene extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  create() {
    setupCamera(this);
    this.drawBackground();
    this.add.text(WIDTH / 2, uiY(90), "HOSTAGE & RESCUE", {
      fontFamily: "Arial",
      fontSize: "48px",
      color: "#e8eef8",
      fontStyle: "bold",
      resolution: TEXT_RESOLUTION
    }).setOrigin(0.5);
    this.add.text(WIDTH / 2, uiY(136), "Stealth rescue prototype", {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#9fb0c7",
      resolution: TEXT_RESOLUTION
    }).setOrigin(0.5);

    button(this, WIDTH / 2, uiY(248), "Play", () => this.scene.start("Briefing", { level: 0 }));
    button(this, WIDTH / 2, uiY(312), "Level Select", () => this.scene.start("LevelSelect"));
    button(this, WIDTH / 2, uiY(376), "Settings", () => this.scene.start("Settings"));

    this.add.text(WIDTH / 2, uiY(540), "WASD / Arrow keys to move   |   E to interact", {
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#a7f3d0",
      resolution: TEXT_RESOLUTION
    }).setOrigin(0.5);
  }

  drawBackground() {
    this.cameras.main.setBackgroundColor(palette.bg);
    for (let x = 0; x < WIDTH; x += 48) {
      this.add.rectangle(x, HEIGHT / 2, 2, HEIGHT, 0x192436, 0.55);
    }
    for (let y = 0; y < HEIGHT; y += 48) {
      this.add.rectangle(WIDTH / 2, y, WIDTH, 2, 0x192436, 0.55);
    }
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, 620, 430, 0x151d2b, 0.84).setStrokeStyle(2, 0x304156);
  }
}

class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super("LevelSelect");
  }

  create() {
    setupCamera(this);
    this.cameras.main.setBackgroundColor(palette.bg);
    this.add.text(uiX(70), uiY(60), "Level Select", {
      fontFamily: "Arial",
      fontSize: "36px",
      color: "#e8eef8",
      fontStyle: "bold",
      resolution: TEXT_RESOLUTION
    });
    const unlocked = loadProgress();
    levels.forEach((level, index) => {
      const locked = index > unlocked;
      const y = uiY(160 + index * 82);
      const label = locked ? `Locked - ${level.name}` : `Level ${index + 1}: ${level.name}`;
      const b = button(this, WIDTH / 2, y, label, () => {
        if (!locked) this.scene.start("Briefing", { level: index });
      }, 520);
      if (locked) {
        b.panel.setStrokeStyle(2, 0x65758b);
        b.text.setColor("#9fb0c7");
      }
    });
    button(this, uiX(150), uiY(520), "Back", () => this.scene.start("Menu"), 150);
  }
}

class BriefingScene extends Phaser.Scene {
  constructor() {
    super("Briefing");
  }

  init(data) {
    this.levelIndex = data.level ?? 0;
  }

  create() {
    setupCamera(this);
    const level = levels[this.levelIndex];
    this.cameras.main.setBackgroundColor(0x111827);
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, 760, 430, 0x172033, 0.98).setStrokeStyle(2, 0x7dd3fc);
    this.add.text(uiX(140), uiY(112), "Mission Briefing", {
      fontFamily: "Arial",
      fontSize: "34px",
      color: "#e8eef8",
      fontStyle: "bold",
      resolution: TEXT_RESOLUTION
    });
    this.add.text(uiX(140), uiY(170), level.name, {
      fontFamily: "Arial",
      fontSize: "20px",
      color: "#a7f3d0",
      resolution: TEXT_RESOLUTION
    });
    this.add.text(uiX(140), uiY(220),
      "Infiltrate the facility, avoid guard and CCTV vision, collect evidence,\nhack the security computer, rescue the hostage, then escape through the exit.",
      {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#dbeafe",
        lineSpacing: 8,
        resolution: TEXT_RESOLUTION
      }
    );
    this.add.text(uiX(140), uiY(330), "Objectives: Evidence + Hack CCTV + Rescue Hostage + Exit", {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#ffd166",
      resolution: TEXT_RESOLUTION
    });
    button(this, WIDTH / 2, uiY(440), "Start Mission", () => this.scene.start("Game", { level: this.levelIndex }), 250);
    button(this, uiX(150), uiY(520), "Back", () => this.scene.start("Menu"), 150);
  }
}

class SettingsScene extends Phaser.Scene {
  constructor() {
    super("Settings");
  }

  create() {
    this.settings = loadSettings();
    setupCamera(this);
    this.cameras.main.setBackgroundColor(0x111827);
    this.add.text(uiX(70), uiY(60), "Settings", {
      fontFamily: "Arial",
      fontSize: "34px",
      color: "#e8eef8",
      fontStyle: "bold",
      resolution: TEXT_RESOLUTION
    });

    this.add.text(uiX(90), uiY(122), "Adjust how the prototype plays during testing.", {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#dbeafe",
      resolution: TEXT_RESOLUTION
    });

    this.optionButton(uiX(90), uiY(190), "Vision cones", "showVision", ["On", "Off"]);
    this.optionButton(uiX(90), uiY(260), "Guard chase", "chaseEnabled", ["On", "Off"]);
    this.optionButton(uiX(90), uiY(330), "Help hints", "showHelp", ["On", "Off"]);
    this.optionButton(uiX(90), uiY(400), "Sound", "sound", ["On", "Off"]);
    this.volumeRow(uiX(90), uiY(470));

    button(this, uiX(150), uiY(520), "Back", () => this.scene.start("Menu"), 150);
  }

  optionButton(x, y, label, key, labels) {
    this.add.text(x, y - 12, label, {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#e8eef8",
      resolution: TEXT_RESOLUTION
    });
    const valueLabel = () => {
      const value = this.settings[key];
      return value ? labels[0] : labels[1];
    };
    const b = button(this, x + 360, y, valueLabel(), () => {
      this.settings[key] = !this.settings[key];
      saveSettings(this.settings);
      if (key === "sound") gameAudio.setEnabled(this.settings.sound);
      b.text.setText(valueLabel());
    }, 190);
  }

  volumeRow(x, y) {
    this.add.text(x, y - 12, "Volume", {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#e8eef8",
      resolution: TEXT_RESOLUTION
    });
    const value = this.add.text(x + 360, y, `${this.settings.volume}%`, {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#e8eef8",
      resolution: TEXT_RESOLUTION
    }).setOrigin(0.5);
    button(this, x + 265, y, "-", () => this.changeVolume(-10, value), 54);
    button(this, x + 455, y, "+", () => this.changeVolume(10, value), 54);
  }

  changeVolume(amount, valueText) {
    this.settings.volume = Phaser.Math.Clamp(this.settings.volume + amount, 0, 100);
    if (this.settings.volume > 0) this.settings.sound = true;
    saveSettings(this.settings);
    gameAudio.setEnabled(this.settings.sound);
    gameAudio.setVolume(this.settings.volume);
    valueText.setText(`${this.settings.volume}%`);
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  init(data) {
    this.levelIndex = data.level ?? 0;
    this.level = Phaser.Utils.Objects.DeepCopy(levels[this.levelIndex]);
    this.settings = loadSettings();
    this.playOffsetX = Math.round((WIDTH - PLAY_WIDTH) / 2);
    this.playOffsetY = Math.round((HEIGHT - PLAY_HEIGHT) / 2);
    this.objectives = {
      evidence: 0,
      hacked: false,
      rescued: false
    };
    this.alert = 0;
    this.catchTimer = 0;
    this.guardSightTimer = 0;
    this.cctvShutdownUntil = 0;
    this.chaseReason = "";
    this.startTime = 0;
    this.detectedCount = 0;
    this.currentInteraction = null;
    this.promptMessage = null;
    this.missionEnded = false;
    this.optionsOpen = false;
  }

  create() {
    setupCamera(this);
    gameAudio.setEnabled(this.settings.sound);
    gameAudio.startBacksound();
    gameAudio.play("spawn");
    this.cameras.main.setBackgroundColor(palette.floor);
    this.physics.world.setBounds(0, 0, WIDTH, HEIGHT);
    this.drawFloor();
    this.createWalls();
    this.navigationGrid = this.buildNavigationGrid();
    this.createProps();
    this.createObjects();
    this.createPlayer();
    this.createGuards();
    this.createHud();
    this.visionGraphics = this.add.graphics().setDepth(1);
    this.keys = this.input.keyboard.addKeys("W,A,S,D,E,UP,DOWN,LEFT,RIGHT");
    this.startTime = this.time.now;
  }

  update(time, delta) {
    const frameDelta = Math.min(delta, MAX_SIM_DELTA_MS);
    if (this.optionsOpen) {
      this.player?.setVelocity(0, 0);
      this.guards?.children.iterate((guard) => guard.setVelocity(0, 0));
      this.updateHud();
      return;
    }
    this.updatePlayer(frameDelta);
    this.updateGuards(frameDelta);
    this.updateVision(frameDelta);
    this.updateCapture(frameDelta);
    this.updateComputerLabels();
    this.updatePrompt();
    this.updateHud();
  }

  drawFloor() {
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x0c111b, 1).setDepth(-12);
    this.add.tileSprite(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, "floorTile").setDepth(-10);
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x07111f, 0.24).setDepth(-9);
    this.add.rectangle(WIDTH / 2, HEIGHT - 22, WIDTH, 44, 0x0c111b, 0.28).setDepth(-8);
  }

  createWalls() {
    this.walls = this.physics.add.staticGroup();
    this.level.walls.forEach(([x, y, w, h]) => {
      x += this.playOffsetX;
      y += this.playOffsetY;
      this.add.rectangle(x + w / 2 + 5, y + h / 2 + 7, w, h, palette.shadow, 0.42).setDepth(2);
      const wall = this.add.rectangle(x + w / 2, y + h / 2, w, h, palette.wall).setDepth(4);
      wall.setStrokeStyle(2, palette.wallEdge);
      const capHeight = Math.min(10, Math.max(5, h * 0.32));
      this.add.rectangle(x + w / 2, y + capHeight / 2, w - 4, capHeight, palette.wallTop, 0.85).setDepth(5);
      if (w > 80) {
        for (let px = x + 40; px < x + w - 10; px += 64) {
          this.add.rectangle(px, y + h / 2, 2, h - 8, 0x253247, 0.45).setDepth(5);
        }
      }
      this.physics.add.existing(wall, true);
      this.walls.add(wall);
    });
  }

  buildNavigationGrid() {
    const left = this.playOffsetX + 42;
    const right = this.playOffsetX + PLAY_WIDTH - 42;
    const top = this.playOffsetY + 42;
    const bottom = this.playOffsetY + PLAY_HEIGHT - 42;
    const minX = left + NAV_GRID_SIZE / 2;
    const minY = top + NAV_GRID_SIZE / 2;
    const maxX = right - NAV_GRID_SIZE / 2;
    const maxY = bottom - NAV_GRID_SIZE / 2;
    const cols = Math.floor((maxX - minX) / NAV_GRID_SIZE) + 1;
    const rows = Math.floor((maxY - minY) / NAV_GRID_SIZE) + 1;
    const walkable = Array.from({ length: rows }, () => Array(cols).fill(false));

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const x = minX + col * NAV_GRID_SIZE;
        const y = minY + row * NAV_GRID_SIZE;
        walkable[row][col] = !this.isStaticGuardBoxBlocked(x, y, 2);
      }
    }

    return { cols, rows, minX, minY, walkable };
  }

  getNavigationCellCenter(col, row) {
    return {
      x: this.navigationGrid.minX + col * NAV_GRID_SIZE,
      y: this.navigationGrid.minY + row * NAV_GRID_SIZE
    };
  }

  findNearestNavigationCell(x, y, maxRadius = 6) {
    const grid = this.navigationGrid;
    const baseCol = Phaser.Math.Clamp(Math.round((x - grid.minX) / NAV_GRID_SIZE), 0, grid.cols - 1);
    const baseRow = Phaser.Math.Clamp(Math.round((y - grid.minY) / NAV_GRID_SIZE), 0, grid.rows - 1);
    let best = null;

    for (let radius = 0; radius <= maxRadius; radius += 1) {
      for (let row = Math.max(0, baseRow - radius); row <= Math.min(grid.rows - 1, baseRow + radius); row += 1) {
        for (let col = Math.max(0, baseCol - radius); col <= Math.min(grid.cols - 1, baseCol + radius); col += 1) {
          if (!grid.walkable[row][col]) continue;
          const center = this.getNavigationCellCenter(col, row);
          const score = Phaser.Math.Distance.Between(x, y, center.x, center.y);
          if (!best || score < best.score) {
            best = { col, row, score };
          }
        }
      }
      if (best) return best;
    }

    return null;
  }

  findNavigationPath(startX, startY, targetX, targetY) {
    const start = this.findNearestNavigationCell(startX, startY);
    const target = this.findNearestNavigationCell(targetX, targetY);
    if (!start || !target) return [];

    const grid = this.navigationGrid;
    const total = grid.cols * grid.rows;
    const startIndex = start.row * grid.cols + start.col;
    const targetIndex = target.row * grid.cols + target.col;
    if (startIndex === targetIndex) return [this.getNavigationCellCenter(target.col, target.row)];

    const open = new Set([startIndex]);
    const cameFrom = new Int32Array(total).fill(-1);
    const gScore = new Float64Array(total).fill(Number.POSITIVE_INFINITY);
    const fScore = new Float64Array(total).fill(Number.POSITIVE_INFINITY);
    gScore[startIndex] = 0;
    fScore[startIndex] = Math.abs(start.col - target.col) + Math.abs(start.row - target.row);
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ];

    while (open.size > 0) {
      let current = -1;
      let bestScore = Number.POSITIVE_INFINITY;
      open.forEach((index) => {
        if (fScore[index] < bestScore) {
          bestScore = fScore[index];
          current = index;
        }
      });

      if (current === targetIndex) break;
      open.delete(current);

      const row = Math.floor(current / grid.cols);
      const col = current % grid.cols;
      for (const [dCol, dRow] of directions) {
        const nextCol = col + dCol;
        const nextRow = row + dRow;
        if (
          nextCol < 0 || nextCol >= grid.cols ||
          nextRow < 0 || nextRow >= grid.rows ||
          !grid.walkable[nextRow][nextCol]
        ) {
          continue;
        }

        const neighbor = nextRow * grid.cols + nextCol;
        const tentative = gScore[current] + 1;
        if (tentative >= gScore[neighbor]) continue;
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentative;
        fScore[neighbor] = tentative + Math.abs(nextCol - target.col) + Math.abs(nextRow - target.row);
        open.add(neighbor);
      }
    }

    if (cameFrom[targetIndex] === -1) return [];

    const path = [];
    let current = targetIndex;
    while (current !== startIndex && current !== -1) {
      const row = Math.floor(current / grid.cols);
      const col = current % grid.cols;
      path.unshift(this.getNavigationCellCenter(col, row));
      current = cameFrom[current];
    }
    return path;
  }

  getGuardWaypoint(guard, targetX, targetY, padding = GUARD_NAV_PADDING) {
    if (!this.isStaticGuardBoxBlocked(targetX, targetY, 1) && !this.pathBlocked(guard.x, guard.y, targetX, targetY, padding)) {
      guard.setData("navPath", []);
      guard.setData("navPathIndex", 0);
      guard.setData("navTargetKey", "");
      return { x: targetX, y: targetY };
    }

    const targetCell = this.findNearestNavigationCell(targetX, targetY);
    if (!targetCell) return { x: targetX, y: targetY };

    const targetKey = `${targetCell.col}:${targetCell.row}`;
    const shouldRepath =
      !Array.isArray(guard.getData("navPath")) ||
      guard.getData("navPath").length === 0 ||
      guard.getData("navTargetKey") !== targetKey ||
      this.time.now >= (guard.getData("nextRepathAt") || 0);

    if (shouldRepath) {
      const navPath = this.findNavigationPath(guard.x, guard.y, targetX, targetY);
      guard.setData("navPath", navPath);
      guard.setData("navPathIndex", 0);
      guard.setData("navTargetKey", targetKey);
      guard.setData("nextRepathAt", this.time.now + NAV_REPATH_MS);
    }

    const navPath = guard.getData("navPath") || [];
    let navPathIndex = guard.getData("navPathIndex") || 0;
    while (
      navPathIndex < navPath.length &&
      Phaser.Math.Distance.Between(guard.x, guard.y, navPath[navPathIndex].x, navPath[navPathIndex].y) < 10
    ) {
      navPathIndex += 1;
    }
    guard.setData("navPathIndex", navPathIndex);

    const waypoint = navPath[navPathIndex];
    return waypoint || { x: targetX, y: targetY };
  }

  getSafeGuardPoint(x, y) {
    if (!this.isStaticGuardBoxBlocked(x, y, 2)) return { x, y };
    const cell = this.findNearestNavigationCell(x, y, 8);
    if (!cell) return { x, y };
    return this.getNavigationCellCenter(cell.col, cell.row);
  }

  normalizeGuardRoute(data) {
    const route = data.route.map((point) => {
      const world = { x: point.x + this.playOffsetX, y: point.y + this.playOffsetY };
      return this.getSafeGuardPoint(world.x, world.y);
    });
    return route.length ? route : [this.getSafeGuardPoint(data.x + this.playOffsetX, data.y + this.playOffsetY)];
  }

  createProps() {
    (this.level.props || []).forEach((prop) => {
      const sprite = this.add.image(prop.x + this.playOffsetX, prop.y + this.playOffsetY, prop.type);
      sprite.setDepth(6);
      if (prop.type === "pipe") sprite.setAlpha(0.85);
    });
  }

  createObjects() {
    this.exit = this.physics.add.staticSprite(this.level.exit.x + this.playOffsetX, this.level.exit.y + this.playOffsetY, "exit");
    this.exit.setScale(1.3).setDepth(8).refreshBody();
    this.exitLabel = this.add.text(this.exit.x, this.exit.y - 31, "Exit", {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#b8f36f",
      stroke: "#07111f",
      strokeThickness: 3,
      backgroundColor: "rgba(12,17,27,0.74)",
      padding: { x: 5, y: 2 },
      resolution: TEXT_RESOLUTION
    }).setOrigin(0.5).setDepth(25);
    this.hostage = this.physics.add.staticSprite(this.level.hostage.x + this.playOffsetX, this.level.hostage.y + this.playOffsetY, "hostage");
    this.hostage.setScale(1.2).setDepth(10).refreshBody();
    this.hostageLabel = this.add.text(this.hostage.x, this.hostage.y - 31, "Hostage", {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#ffd166",
      stroke: "#07111f",
      strokeThickness: 3,
      backgroundColor: "rgba(12,17,27,0.74)",
      padding: { x: 5, y: 2 },
      resolution: TEXT_RESOLUTION
    }).setOrigin(0.5).setDepth(25);
    this.computers = this.physics.add.staticGroup();
    this.level.computers.forEach((item) => {
      const computer = this.computers.create(item.x + this.playOffsetX, item.y + this.playOffsetY, "computer").setScale(1.25).setDepth(10).refreshBody();
      const label = this.add.text(computer.x, computer.y - 30, "CCTV", {
        fontFamily: "Arial",
        fontSize: "13px",
        color: "#78dcca",
        stroke: "#07111f",
        strokeThickness: 3,
        backgroundColor: "rgba(12,17,27,0.74)",
        padding: { x: 5, y: 2 },
        resolution: TEXT_RESOLUTION
      }).setOrigin(0.5).setDepth(25);
      computer.setData("label", label);
      computer.setData("interactionPoint", {
        x: (item.interactX ?? item.x) + this.playOffsetX,
        y: (item.interactY ?? item.y) + this.playOffsetY
      });
    });
    this.evidence = this.physics.add.staticGroup();
    this.level.evidence.forEach((item) => {
      const evidence = this.evidence.create(item.x + this.playOffsetX, item.y + this.playOffsetY, "evidence").setScale(1.15).setDepth(10).refreshBody();
      const label = this.add.text(evidence.x, evidence.y - 28, "Evidence", {
        fontFamily: "Arial",
        fontSize: "13px",
        color: "#a7f3d0",
        stroke: "#07111f",
        strokeThickness: 3,
        backgroundColor: "rgba(12,17,27,0.74)",
        padding: { x: 5, y: 2 },
        resolution: TEXT_RESOLUTION
      }).setOrigin(0.5).setDepth(25);
      evidence.setData("label", label);
    });
    this.securityCameras = this.level.cameras.map((cam) => {
      const sprite = this.add.sprite(cam.x + this.playOffsetX, cam.y + this.playOffsetY, "camera").setAngle(cam.angle).setDepth(12);
      return {
        ...cam,
        x: cam.x + this.playOffsetX,
        y: cam.y + this.playOffsetY,
        sprite,
        baseAngle: cam.angle,
        sweep: cam.angle,
        sweepDirection: 1,
        sweepSpeed: CAMERA_SWEEP_SPEED,
        sweepRange: CAMERA_SWEEP_RANGE
      };
    });
  }

  createPlayer() {
    this.player = this.physics.add.sprite(this.level.player.x + this.playOffsetX, this.level.player.y + this.playOffsetY, "player");
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(20);
    this.player.setSize(20, 24);
    this.physics.add.collider(this.player, this.walls);
    this.playerName = this.add.text(this.player.x, this.player.y - 30, "Player", {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#e8eef8",
      stroke: "#07111f",
      strokeThickness: 3,
      backgroundColor: "rgba(12,17,27,0.74)",
      padding: { x: 5, y: 2 },
      resolution: TEXT_RESOLUTION
    }).setOrigin(0.5).setDepth(25);
  }

  createGuards() {
    this.guards = this.physics.add.group();
    this.level.guards.forEach((data) => {
      const route = this.normalizeGuardRoute(data);
      const spawn = this.getSafeGuardPoint(data.x + this.playOffsetX, data.y + this.playOffsetY);
      const sprite = this.guards.create(spawn.x, spawn.y, "guard");
      sprite.setCollideWorldBounds(true);
      sprite.setData("route", route);
      sprite.setData("target", 1);
      sprite.setData("speed", data.speed);
      sprite.setData("facing", 0);
      sprite.setData("lastX", spawn.x);
      sprite.setData("lastY", spawn.y);
      sprite.setData("stuckTime", 0);
      sprite.setData("chaseTimer", 0);
      sprite.setData("lastSeenX", spawn.x);
      sprite.setData("lastSeenY", spawn.y);
      sprite.setData("returnCooldown", 0);
      sprite.setData("mode", "patrol");
      sprite.setData("navPath", []);
      sprite.setData("navPathIndex", 0);
      sprite.setData("navTargetKey", "");
      sprite.setData("nextRepathAt", 0);
      sprite.setDepth(20);
      sprite.setSize(GUARD_BODY_WIDTH, GUARD_BODY_HEIGHT);
      const chaseMark = this.add.text(sprite.x, sprite.y - 34, "!", {
        fontFamily: "Arial",
        fontSize: "28px",
        color: "#ff4f68",
        fontStyle: "bold",
        stroke: "#07111f",
        strokeThickness: 4,
        resolution: TEXT_RESOLUTION
      }).setOrigin(0.5).setDepth(31).setVisible(false);
      sprite.setData("chaseMark", chaseMark);
    });
    this.physics.add.collider(this.guards, this.walls);
  }

  createHud() {
    this.hudBg = this.add.rectangle(WIDTH / 2, 20, WIDTH, 40, 0x0c111b, 0.92).setScrollFactor(0).setDepth(50);
    this.hud = this.add.text(14, 8, "", {
      fontFamily: "Arial",
      fontSize: "15px",
      color: "#e8eef8",
      stroke: "#07111f",
      strokeThickness: 2,
      resolution: TEXT_RESOLUTION
    }).setScrollFactor(0).setDepth(51);
    this.tipText = this.add.text(WIDTH - 14, 8, "Move: WASD/Arrows | E: Interact", {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#a7f3d0",
      stroke: "#07111f",
      strokeThickness: 2,
      resolution: TEXT_RESOLUTION
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(51);
    this.alertText = this.add.text(WIDTH - 14, 92, "", {
      fontFamily: "Arial",
      fontSize: "15px",
      color: "#ffb4c0",
      align: "right",
      backgroundColor: "rgba(43,20,32,0.84)",
      padding: { x: 8, y: 7 },
      wordWrap: { width: 230 },
      resolution: TEXT_RESOLUTION
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(51);
    this.prompt = this.add.text(WIDTH / 2, HEIGHT - 28, "", {
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#a7f3d0",
      stroke: "#07111f",
      strokeThickness: 2,
      backgroundColor: "#10151f",
      padding: { x: 10, y: 6 },
      resolution: TEXT_RESOLUTION
    }).setOrigin(0.5).setScrollFactor(0).setDepth(51);
    this.noticeText = this.add.text(WIDTH / 2, HEIGHT / 2, "", {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#ffd166",
      align: "center",
      stroke: "#07111f",
      strokeThickness: 3,
      backgroundColor: "rgba(16,21,31,0.94)",
      padding: { x: 14, y: 10 },
      wordWrap: { width: 500 },
      resolution: TEXT_RESOLUTION
    }).setOrigin(0.5).setScrollFactor(0).setDepth(52).setVisible(false);
    this.optionsButton = button(this, WIDTH - 78, 62, "Options", () => this.openOptionsPanel(), 112);
    this.optionsButton.panel.setDepth(53);
    this.optionsButton.text.setDepth(54);
  }

  openOptionsPanel() {
    if (this.optionsOpen) return;
    this.optionsOpen = true;
    this.currentInteraction = null;
    this.prompt.setText("");
    this.optionsPanel = this.add.container(0, 0).setDepth(80);
    this.optionsPanel.add(this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x030712, 0.45));
    this.optionsPanel.add(this.add.rectangle(WIDTH / 2, HEIGHT / 2, 620, 430, 0x10151f, 0.97).setStrokeStyle(2, 0x7dd3fc));
    this.optionsPanel.add(this.add.text(WIDTH / 2, uiY(120), "Options", {
      fontFamily: "Arial",
      fontSize: "32px",
      color: "#e8eef8",
      fontStyle: "bold",
      resolution: TEXT_RESOLUTION
    }).setOrigin(0.5));

    this.optionRows = {};
    this.createOptionRow("Vision cones", "showVision", uiY(185));
    this.createOptionRow("Guard chase", "chaseEnabled", uiY(245));
    this.createOptionRow("Help hints", "showHelp", uiY(305));
    this.createOptionRow("Sound", "sound", uiY(365));
    this.createVolumeRow(uiY(425));

    const close = button(this, WIDTH / 2, uiY(490), "Close", () => this.closeOptionsPanel(), 170);
    close.panel.setDepth(81);
    close.text.setDepth(82);
    this.optionsPanel.add([close.panel, close.text]);
  }

  createOptionRow(label, key, y) {
    const labelText = this.add.text(WIDTH / 2 - 210, y - 13, label, {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#e8eef8",
      resolution: TEXT_RESOLUTION
    });
    const valueText = () => (this.settings[key] ? "On" : "Off");
    const toggle = button(this, WIDTH / 2 + 190, y, valueText(), () => {
      this.settings[key] = !this.settings[key];
      saveSettings(this.settings);
      if (key === "sound") {
        gameAudio.setEnabled(this.settings.sound);
        gameAudio.setVolume(this.settings.volume);
        if (this.settings.sound && !this.missionEnded) gameAudio.startBacksound();
      }
      if (key === "showVision" && !this.settings.showVision) this.visionGraphics?.clear();
      toggle.text.setText(valueText());
      this.updateHud();
    }, 120);
    toggle.panel.setDepth(81);
    toggle.text.setDepth(82);
    this.optionsPanel.add([labelText, toggle.panel, toggle.text]);
    this.optionRows[key] = toggle;
  }

  createVolumeRow(y) {
    const labelText = this.add.text(WIDTH / 2 - 210, y - 13, "Volume", {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#e8eef8",
      resolution: TEXT_RESOLUTION
    });
    const valueText = this.add.text(WIDTH / 2 + 190, y, `${this.settings.volume}%`, {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#e8eef8",
      resolution: TEXT_RESOLUTION
    }).setOrigin(0.5);
    const lower = button(this, WIDTH / 2 + 108, y, "-", () => this.changeInGameVolume(-10, valueText), 50);
    const higher = button(this, WIDTH / 2 + 272, y, "+", () => this.changeInGameVolume(10, valueText), 50);
    [valueText, lower.panel, lower.text, higher.panel, higher.text].forEach((item) => item.setDepth(82));
    this.optionsPanel.add([labelText, valueText, lower.panel, lower.text, higher.panel, higher.text]);
  }

  changeInGameVolume(amount, valueText) {
    this.settings.volume = Phaser.Math.Clamp(this.settings.volume + amount, 0, 100);
    if (this.settings.volume > 0) this.settings.sound = true;
    saveSettings(this.settings);
    gameAudio.setEnabled(this.settings.sound);
    gameAudio.setVolume(this.settings.volume);
    if (this.settings.sound && !this.missionEnded) gameAudio.startBacksound();
    valueText.setText(`${this.settings.volume}%`);
    this.optionRows.sound?.text.setText(this.settings.sound ? "On" : "Off");
  }

  closeOptionsPanel() {
    this.optionsOpen = false;
    this.optionsPanel?.destroy();
    this.optionsPanel = null;
  }

  updatePlayer(delta) {
    const speed = 152;
    const x = (this.keys.A.isDown || this.keys.LEFT.isDown ? -1 : 0) + (this.keys.D.isDown || this.keys.RIGHT.isDown ? 1 : 0);
    const y = (this.keys.W.isDown || this.keys.UP.isDown ? -1 : 0) + (this.keys.S.isDown || this.keys.DOWN.isDown ? 1 : 0);
    const vector = new Phaser.Math.Vector2(x, y).normalize().scale(speed);
    this.player.setVelocity(vector.x || 0, vector.y || 0);
    this.player.x = Phaser.Math.Clamp(this.player.x, this.playOffsetX + 42, this.playOffsetX + PLAY_WIDTH - 42);
    this.player.y = Phaser.Math.Clamp(this.player.y, this.playOffsetY + 42, this.playOffsetY + PLAY_HEIGHT - 42);
    this.playerName.setPosition(this.player.x, this.player.y - 31);

    const near = this.findNearbyInteraction();
    this.currentInteraction = near;
    if (near && Phaser.Input.Keyboard.JustDown(this.keys.E)) {
      near.action();
    }

    if (this.hostageLabel && this.hostage.active) {
      this.hostageLabel.setPosition(this.hostage.x, this.hostage.y - 31);
    }
  }

  updatePrompt() {
    if (this.promptMessage && this.time.now < this.promptMessage.until) {
      this.noticeText.setText(this.promptMessage.text);
      this.noticeText.setColor(this.promptMessage.color);
      this.noticeText.setVisible(true);
      this.prompt.setColor("#a7f3d0");
      this.prompt.setText(this.currentInteraction ? `Press E - ${this.currentInteraction.label}` : "");
      return;
    }

    this.promptMessage = null;
    this.noticeText.setVisible(false);
    this.noticeText.setText("");
    this.prompt.setColor("#a7f3d0");
    this.prompt.setText(this.currentInteraction ? `Press E - ${this.currentInteraction.label}` : "");
  }

  showPromptMessage(text, color = "#ffd166", duration = 1800) {
    this.promptMessage = {
      text,
      color,
      until: this.time.now + duration
    };
    this.updatePrompt();
  }

  updateComputerLabels() {
    const cctvRemaining = Math.max(0, this.cctvShutdownUntil - this.time.now);
    this.computers.children.iterate((computer) => {
      const label = computer.getData("label");
      if (!label) return;
      label.setPosition(computer.x, computer.y - 30);
      if (cctvRemaining > 0) {
        label.setText(`CCTV OFF ${(cctvRemaining / 1000).toFixed(1)}s`);
        label.setColor("#ffd166");
        return;
      }
      label.setText("CCTV");
      label.setColor(this.objectives.hacked ? "#a7f3d0" : "#78dcca");
    });
    if (this.exitLabel) {
      this.exitLabel.setPosition(this.exit.x, this.exit.y - 31);
      this.exitLabel.setColor(this.getIncompleteObjectives().length === 0 ? "#b8f36f" : "#ffd166");
    }
  }

  getIncompleteObjectives() {
    const remaining = [];
    if (this.objectives.evidence < this.level.evidence.length) {
      remaining.push(`Evidence ${this.objectives.evidence}/${this.level.evidence.length}`);
    }
    if (!this.objectives.hacked) {
      remaining.push("Hack CCTV");
    }
    if (!this.objectives.rescued) {
      remaining.push("Rescue Hostage");
    }
    return remaining;
  }

  findNearbyInteraction() {
    const near = (obj, distance = 46) => Phaser.Math.Distance.Between(this.player.x, this.player.y, obj.x, obj.y) <= distance;

    let found = null;
    this.computers.children.iterate((computer) => {
      const interactionPoint = computer.getData("interactionPoint") || computer;
      if (!found && computer.active && near(interactionPoint)) {
        const cctvRemaining = Math.max(0, this.cctvShutdownUntil - this.time.now);
        found = {
          label: cctvRemaining > 0 ? `CCTV OFF ${(cctvRemaining / 1000).toFixed(1)}s` : "Hack CCTV - 5s",
          action: () => {
            gameAudio.play("hack");
            this.objectives.hacked = true;
            this.cctvShutdownUntil = this.time.now + CCTV_SHUTDOWN_MS;
            this.updateCctvShutdown();
            this.updateComputerLabels();
            computer.setTint(0xa7f3d0);
          }
        };
      }
    });
    this.evidence.children.iterate((item) => {
      if (!found && item.active && near(item)) {
        found = {
          label: "Collect Evidence",
          action: () => {
            gameAudio.play("evidence");
            item.getData("label")?.destroy();
            item.disableBody(true, true);
            this.objectives.evidence += 1;
          }
        };
      }
    });
    if (!found && this.hostage.active && !this.objectives.rescued && near(this.hostage)) {
      found = {
        label: "Rescue Hostage",
        action: () => {
          gameAudio.play("hostage");
          this.objectives.rescued = true;
          this.hostageLabel?.destroy();
          this.hostageLabel = null;
          this.hostage.disableBody(true, true);
        }
      };
    }
    if (!found && near(this.exit, 54)) {
      const incomplete = this.getIncompleteObjectives();
      found = {
        label: incomplete.length === 0 ? "Exit Mission" : "Exit Mission - Check Objectives",
        action: () => this.tryFinish()
      };
    }
    return found;
  }

  updateGuards(delta) {
    this.guards.children.iterate((guard) => {
      const chaseTimer = Math.max(0, guard.getData("chaseTimer") - delta);
      const returnCooldown = Math.max(0, guard.getData("returnCooldown") - delta);
      guard.setData("chaseTimer", chaseTimer);
      guard.setData("returnCooldown", returnCooldown);
      const chaseMark = guard.getData("chaseMark");
      chaseMark?.setPosition(guard.x, guard.y - 34);
      chaseMark?.setVisible(chaseTimer > 0);

      if (chaseTimer > 0) {
        const targetX = guard.getData("lastSeenX");
        const targetY = guard.getData("lastSeenY");
        const distanceToTarget = Phaser.Math.Distance.Between(guard.x, guard.y, targetX, targetY);
        if (distanceToTarget < 18) {
          guard.setData("chaseTimer", 0);
          chaseMark?.setVisible(false);
          guard.setData("returnCooldown", 350);
          guard.setVelocity(0, 0);
          return;
        }
        const canReachPlayer = !this.pathBlocked(guard.x, guard.y, this.player.x, this.player.y, GUARD_NAV_PADDING);
        const canReachLastSeen = !this.pathBlocked(guard.x, guard.y, targetX, targetY, GUARD_NAV_PADDING);
        if (!canReachPlayer && !canReachLastSeen) {
          guard.setData("chaseTimer", Math.min(chaseTimer, 650));
        }
        const chaseSpeed = guard.getData("speed") + 28;
        const chaseWaypoint = this.getGuardWaypoint(guard, targetX, targetY, GUARD_NAV_PADDING);
        guard.setData("mode", "chase");
        if (!this.moveGuardToward(guard, chaseWaypoint.x, chaseWaypoint.y, chaseSpeed, delta)) {
          guard.setData("chaseTimer", Math.min(chaseTimer, 450));
          guard.setData("returnCooldown", 180);
        }
        return;
      }

      if (returnCooldown > 0) {
        guard.setVelocity(0, 0);
        return;
      }
      this.moveGuardToRoute(guard, delta);
      this.updateGuardStuck(guard, delta);
    });
  }

  tryGuardStep(guard, angle, speed, stepTime) {
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    if (this.guardBoxBlocked(guard, guard.x + vx * stepTime, guard.y + vy * stepTime, 2)) {
      return false;
    }
    guard.setVelocity(vx, vy);
    guard.setData("facing", angle);
    guard.setAngle(Phaser.Math.RadToDeg(angle) + 90);
    return true;
  }

  moveGuardToward(guard, x, y, speed, delta) {
    const targetAngle = Phaser.Math.Angle.Between(guard.x, guard.y, x, y);
    const currentAngle = guard.getData("facing");
    const turnLimit = GUARD_TURN_RATE * delta;
    const smoothAngle = Phaser.Math.Angle.RotateTo(currentAngle, targetAngle, turnLimit);
    const stepTime = Math.min(delta, 50) / 1000;

    if (this.tryGuardStep(guard, smoothAngle, speed, stepTime)) return true;
    if (this.tryGuardStep(guard, targetAngle, speed, stepTime)) return true;

    const fallbackAngles = [
      targetAngle + Math.PI / 4,
      targetAngle - Math.PI / 4,
      targetAngle + Math.PI / 2,
      targetAngle - Math.PI / 2
    ];
    for (const angle of fallbackAngles) {
      if (this.tryGuardStep(guard, angle, speed, stepTime)) return true;
    }

    guard.setVelocity(0, 0);
    return false;
  }

  isStaticGuardBoxBlocked(x, y, padding = 0) {
    const bodyWidth = GUARD_BODY_WIDTH + padding * 2;
    const bodyHeight = GUARD_BODY_HEIGHT + padding * 2;
    const box = new Phaser.Geom.Rectangle(x - bodyWidth / 2, y - bodyHeight / 2, bodyWidth, bodyHeight);

    if (
      box.left < this.playOffsetX + 42 ||
      box.right > this.playOffsetX + PLAY_WIDTH - 42 ||
      box.top < this.playOffsetY + 42 ||
      box.bottom > this.playOffsetY + PLAY_HEIGHT - 42
    ) {
      return true;
    }

    let blocked = false;
    this.level.walls.forEach(([wallX, wallY, wallW, wallH]) => {
      if (blocked) return;
      const wall = new Phaser.Geom.Rectangle(wallX + this.playOffsetX, wallY + this.playOffsetY, wallW, wallH);
      blocked = Phaser.Geom.Intersects.RectangleToRectangle(box, wall);
    });
    return blocked;
  }

  guardBoxBlocked(guard, x, y, padding = 0) {
    return this.isStaticGuardBoxBlocked(x, y, padding);
  }

  moveGuardToRoute(guard, delta) {
    guard.setData("mode", "patrol");
    const route = guard.getData("route");
    let targetIndex = guard.getData("target");
    let target = route[targetIndex];
    let distance = Phaser.Math.Distance.Between(guard.x, guard.y, target.x, target.y);
    if (distance < GUARD_WAYPOINT_REACH) {
      guard.setPosition(target.x, target.y);
      guard.body.reset(target.x, target.y);
      guard.setData("navPath", []);
      guard.setData("navPathIndex", 0);
      guard.setData("navTargetKey", "");
      targetIndex = (targetIndex + 1) % route.length;
      guard.setData("target", targetIndex);
    }

    target = route[targetIndex];
    const speed = guard.getData("speed");
    const patrolWaypoint = this.getGuardWaypoint(guard, target.x, target.y, GUARD_NAV_PADDING);
    if (!this.moveGuardToward(guard, patrolWaypoint.x, patrolWaypoint.y, speed, delta)) {
      guard.setVelocity(0, 0);
      guard.setData("target", (targetIndex + 1) % route.length);
      guard.setData("returnCooldown", 140);
    }
  }

  updateGuardStuck(guard, delta) {
    const moved = Phaser.Math.Distance.Between(guard.x, guard.y, guard.getData("lastX"), guard.getData("lastY"));
    guard.setData("lastX", guard.x);
    guard.setData("lastY", guard.y);
    guard.setData("stuckTime", moved < 0.2 ? guard.getData("stuckTime") + delta : 0);
    if (guard.getData("stuckTime") > GUARD_STUCK_RECOVER_MS) {
      const route = guard.getData("route");
      let targetIndex = guard.getData("target");
      let foundRoutePoint = false;
      for (let i = 0; i < route.length; i += 1) {
        targetIndex = (targetIndex + 1) % route.length;
        const candidate = route[targetIndex];
        if (!this.guardBoxBlocked(guard, candidate.x, candidate.y, 1)) {
          foundRoutePoint = true;
          break;
        }
      }
      if (this.guardBoxBlocked(guard, guard.x, guard.y, 0)) {
        const fallback = route.find((point) => !this.guardBoxBlocked(guard, point.x, point.y, 1)) || route[targetIndex];
        guard.setPosition(fallback.x, fallback.y);
        guard.body.reset(fallback.x, fallback.y);
        foundRoutePoint = true;
      }
      if (foundRoutePoint) guard.setData("target", targetIndex);
      guard.setData("navPath", []);
      guard.setData("navPathIndex", 0);
      guard.setData("navTargetKey", "");
      guard.setData("nextRepathAt", 0);
      guard.setVelocity(0, 0);
      guard.setData("returnCooldown", 220);
      guard.setData("stuckTime", 0);
    }
  }

  updateVision(delta) {
    let detected = false;
    let cctvDetected = false;
    let guardDetected = false;
    let guardConfirmedSight = false;
    const wasChasing = this.isChasing();

    this.updateCctvShutdown();

    this.guards.children.iterate((guard) => {
      const facing = guard.getData("facing");
      if (this.inCone(guard.x, guard.y, facing, GUARD_NOTICE_RANGE, GUARD_NOTICE_WIDTH)) {
        detected = true;
        guardDetected = true;
        guard.setData("lastSeenX", this.player.x);
        guard.setData("lastSeenY", this.player.y);
        if (this.settings.chaseEnabled) {
          guard.setData("chaseTimer", Math.max(guard.getData("chaseTimer"), 4300));
        }
      }
      if (this.inCone(guard.x, guard.y, facing, GUARD_CONFIRMED_RANGE, GUARD_CONFIRMED_WIDTH)) {
        guardConfirmedSight = true;
      }
    });

    this.securityCameras.forEach((cam) => {
      if (cam.disabled) return;
      const minSweep = cam.baseAngle - cam.sweepRange;
      const maxSweep = cam.baseAngle + cam.sweepRange;
      cam.sweep += cam.sweepDirection * cam.sweepSpeed * (delta / 1000);
      if (cam.sweep >= maxSweep) {
        cam.sweep = maxSweep;
        cam.sweepDirection = -1;
      } else if (cam.sweep <= minSweep) {
        cam.sweep = minSweep;
        cam.sweepDirection = 1;
      }
      cam.sprite.setAngle(cam.sweep);
      if (this.inCone(cam.x, cam.y, Phaser.Math.DegToRad(cam.sweep), 180, 0.55)) {
        detected = true;
        cctvDetected = true;
      }
    });

    if (cctvDetected && this.settings.chaseEnabled) {
      if (!wasChasing) {
        gameAudio.play("scan");
      }
      this.triggerAllGuards(5600);
      this.chaseReason = "CCTV SCAN";
    } else if (guardDetected && this.settings.chaseEnabled) {
      this.chaseReason = "GUARD SPOTTED YOU";
    }

    if (this.isChasing()) {
      gameAudio.startChaseSiren();
    } else {
      gameAudio.stopChaseSiren();
    }

    if (detected && !wasChasing) {
      this.detectedCount += 1;
    }

    if (detected) {
      this.alert += delta;
      this.cameras.main.setBackgroundColor(0x2b1420);
    } else {
      this.alert = Math.max(0, this.alert - delta * 1.8);
      this.cameras.main.setBackgroundColor(this.isChasing() ? 0x211827 : palette.floor);
      if (!this.isChasing()) this.chaseReason = "";
    }

    if (guardConfirmedSight) {
      this.guardSightTimer += delta;
      if (this.guardSightTimer >= GUARD_SIGHT_FAIL_MS) this.failMission();
    } else {
      this.guardSightTimer = Math.max(0, this.guardSightTimer - delta * 2.4);
    }

    this.drawVision();
  }

  triggerAllGuards(duration) {
    this.guards.children.iterate((guard) => {
      guard.setData("chaseTimer", Math.max(guard.getData("chaseTimer"), duration));
      guard.setData("lastSeenX", this.player.x);
      guard.setData("lastSeenY", this.player.y);
    });
  }

  updateCctvShutdown() {
    const isShutdown = this.time.now < this.cctvShutdownUntil;
    this.securityCameras.forEach((cam) => {
      cam.disabled = isShutdown;
      cam.sprite.setTint(isShutdown ? 0x65758b : 0xffffff);
    });
  }

  isChasing() {
    let chasing = false;
    this.guards.children.iterate((guard) => {
      if (guard.getData("chaseTimer") > 0) chasing = true;
    });
    return chasing;
  }

  updateCapture(delta) {
    let closeGuard = false;
    this.guards.children.iterate((guard) => {
      const distance = Phaser.Math.Distance.Between(guard.x, guard.y, this.player.x, this.player.y);
      if (distance < 34) closeGuard = true;
    });

    if (closeGuard) {
      this.catchTimer += delta;
      this.cameras.main.setBackgroundColor(0x3a1420);
      if (this.catchTimer >= GUARD_CATCH_FAIL_MS) this.failMission();
      return;
    }

    this.catchTimer = Math.max(0, this.catchTimer - delta * 2);
  }

  inCone(x, y, angle, range, width) {
    const dist = Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y);
    if (dist > range) return false;
    const angleToPlayer = Phaser.Math.Angle.Between(x, y, this.player.x, this.player.y);
    const diff = Math.abs(Phaser.Math.Angle.Wrap(angleToPlayer - angle));
    return diff < width && !this.lineBlocked(x, y, this.player.x, this.player.y);
  }

  lineBlocked(x1, y1, x2, y2) {
    const line = new Phaser.Geom.Line(x1, y1, x2, y2);
    let blocked = false;
    this.level.walls.forEach(([x, y, w, h]) => {
      if (blocked) return;
      const rect = new Phaser.Geom.Rectangle(x + this.playOffsetX, y + this.playOffsetY, w, h);
      blocked = Phaser.Geom.Intersects.LineToRectangle(line, rect);
    });
    return blocked;
  }

  pathBlocked(x1, y1, x2, y2, padding = 0) {
    const line = new Phaser.Geom.Line(x1, y1, x2, y2);
    let blocked = false;
    this.level.walls.forEach(([x, y, w, h]) => {
      if (blocked) return;
      const rect = new Phaser.Geom.Rectangle(
        x + this.playOffsetX - padding,
        y + this.playOffsetY - padding,
        w + padding * 2,
        h + padding * 2
      );
      blocked = Phaser.Geom.Intersects.LineToRectangle(line, rect);
    });
    return blocked;
  }

  drawVision() {
    this.visionGraphics.clear();
    if (!this.settings.showVision) return;
    this.guards.children.iterate((guard) => {
      this.drawCone(guard.x, guard.y, guard.getData("facing"), GUARD_NOTICE_RANGE, 0xf26d6d, 0.09, GUARD_NOTICE_WIDTH);
      this.drawCone(guard.x, guard.y, guard.getData("facing"), GUARD_CONFIRMED_RANGE, 0xff4f68, 0.17, GUARD_CONFIRMED_WIDTH);
    });
    this.securityCameras.forEach((cam) => {
      if (!cam.disabled) this.drawCone(cam.x, cam.y, Phaser.Math.DegToRad(cam.sweep), 180, 0xffb454, 0.12);
    });
  }

  drawCone(x, y, angle, range, color, alpha, width = 0.55) {
    const points = [
      new Phaser.Math.Vector2(x, y),
      new Phaser.Math.Vector2(x + Math.cos(angle - width) * range, y + Math.sin(angle - width) * range),
      new Phaser.Math.Vector2(x + Math.cos(angle + width) * range, y + Math.sin(angle + width) * range)
    ];
    this.visionGraphics.fillStyle(color, alpha);
    this.visionGraphics.fillTriangle(points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y);
  }

  updateHud() {
    const elapsed = Math.floor((this.time.now - this.startTime) / 1000);
    const evidenceTotal = this.level.evidence.length;
    const chaseActive = this.isChasing();
    const caughtRemaining = Math.max(0, GUARD_CATCH_FAIL_MS / 1000 - this.catchTimer / 1000).toFixed(1);
    const cctvRemaining = Math.max(0, this.cctvShutdownUntil - this.time.now);
    const cctvStatus = cctvRemaining > 0 ? `OFF ${(cctvRemaining / 1000).toFixed(1)}s` : "ON";
    const sightRemaining = Math.max(0, 2 - this.guardSightTimer / 1000).toFixed(1);
    this.hud.setText(`L${this.levelIndex + 1}: ${this.level.name} | Evidence ${this.objectives.evidence}/${evidenceTotal} | CCTV ${cctvStatus} | Hostage ${this.objectives.rescued ? "OK" : "WAITING"} | ${elapsed}s`);
    this.tipText.setVisible(this.settings.showHelp);
    if (this.catchTimer > 0) {
      this.alertText.setText(`CAUGHT\nEscape in ${caughtRemaining}s`);
      return;
    }
    if (this.guardSightTimer > 0) {
      this.alertText.setText(`GUARD HAS EYES ON YOU\nBreak sight in ${sightRemaining}s`);
      return;
    }
    if (chaseActive) {
      this.alertText.setText(`${this.chaseReason || "ALERT"}\nGuards are chasing you`);
      return;
    }
    this.alertText.setText("");
  }

  tryFinish() {
    const incomplete = this.getIncompleteObjectives();
    if (incomplete.length > 0) {
      this.showPromptMessage(`Exit locked: ${incomplete.join(", ")}`, "#ffd166", 2400);
      return;
    }
    if (this.missionEnded) return;
    this.missionEnded = true;
    gameAudio.play("exit");
    gameAudio.stopChaseSiren();
    gameAudio.stopBacksound();
    saveProgress(this.levelIndex + 1);
    const elapsed = Math.floor((this.time.now - this.startTime) / 1000);
    this.scene.start("Result", {
      status: "complete",
      level: this.levelIndex,
      time: elapsed,
      detections: this.detectedCount
    });
  }

  flashPrompt(message) {
    this.showPromptMessage(message, "#ffd166", 800);
  }

  failMission() {
    if (this.missionEnded) return;
    this.missionEnded = true;
    gameAudio.play("caught");
    gameAudio.stopChaseSiren();
    gameAudio.stopBacksound();
    this.scene.start("Result", {
      status: "failed",
      level: this.levelIndex,
      time: Math.floor((this.time.now - this.startTime) / 1000),
      detections: this.detectedCount
    });
  }
}

class ResultScene extends Phaser.Scene {
  constructor() {
    super("Result");
  }

  init(data) {
    this.data = data;
  }

  create() {
    setupCamera(this);
    const complete = this.data.status === "complete";
    gameAudio.stopChaseSiren();
    gameAudio.stopBacksound();
    if (complete) gameAudio.play("complete");
    this.cameras.main.setBackgroundColor(complete ? 0x11251f : 0x2b1420);
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, 660, 370, 0x10151f, 0.96).setStrokeStyle(2, complete ? palette.exit : palette.danger);
    this.add.text(WIDTH / 2, uiY(145), complete ? "LEVEL COMPLETE" : "MISSION FAILED", {
      fontFamily: "Arial",
      fontSize: "42px",
      color: complete ? "#b8f36f" : "#ffb4c0",
      fontStyle: "bold",
      resolution: TEXT_RESOLUTION
    }).setOrigin(0.5);
    this.add.text(WIDTH / 2, uiY(225), `Time: ${this.data.time}s\nDetections: ${this.data.detections}`, {
      fontFamily: "Arial",
      fontSize: "22px",
      color: "#e8eef8",
      align: "center",
      lineSpacing: 12,
      resolution: TEXT_RESOLUTION
    }).setOrigin(0.5);
    if (complete && this.data.level + 1 < levels.length) {
      button(this, WIDTH / 2, uiY(335), "Next Level", () => this.scene.start("Briefing", { level: this.data.level + 1 }), 250);
    }
    button(this, WIDTH / 2, uiY(395), complete ? "Replay Level" : "Retry", () => this.scene.start("Briefing", { level: this.data.level }), 250);
    button(this, WIDTH / 2, uiY(455), "Main Menu", () => this.scene.start("Menu"), 250);
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#10151f",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT
  },
  render: {
    antialias: true,
    antialiasGL: true,
    pixelArt: false,
    roundPixels: false,
    powerPreference: "high-performance"
  },
  fps: {
    target: 60,
    smoothStep: true
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  scene: [
    BootScene,
    MenuScene,
    LevelSelectScene,
    BriefingScene,
    SettingsScene,
    GameScene,
    ResultScene
  ]
};

new Phaser.Game(config);
