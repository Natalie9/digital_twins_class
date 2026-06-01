let rooms;
let particles = [];
let sensorData;
let currentMode = 'people';
let selectedRoomId = 'HVAC-A';

const LOGICAL_WIDTH = 880;
const LOGICAL_HEIGHT = 560;

const statusLabel = {
  normal: 'Normal',
  atencao: 'Atenção',
  critico: 'Crítico',
};

const layout = {
  'LAB-01': { name: 'Lab IA', x: 40, y: 50, w: 250, h: 180 },
  'LAB-02': { name: 'Robótica', x: 310, y: 50, w: 250, h: 180 },
  'SALA-12': { name: 'Sala 12', x: 580, y: 50, w: 250, h: 180 },
  'HVAC-A': { name: 'HVAC', x: 40, y: 270, w: 250, h: 180 },
  'AUD-01': { name: 'Auditório', x: 310, y: 270, w: 520, h: 180 },
};

const fallbackRooms = [
  { id: 'LAB-01', name: 'Lab IA', x: 40, y: 50, w: 250, h: 180, temp: 24.6, co2: 830, occ: 10, energy: 5.7 },
  { id: 'LAB-02', name: 'Robótica', x: 310, y: 50, w: 250, h: 180, temp: 25.6, co2: 956, occ: 18, energy: 7.2 },
  { id: 'SALA-12', name: 'Sala 12', x: 580, y: 50, w: 250, h: 180, temp: 25.2, co2: 1027, occ: 23, energy: 8.1 },
  { id: 'HVAC-A', name: 'HVAC', x: 40, y: 270, w: 250, h: 180, temp: 28.4, co2: 640, occ: 4, energy: 10.9 },
  { id: 'AUD-01', name: 'Auditório', x: 310, y: 270, w: 520, h: 180, temp: 26.6, co2: 1133, occ: 42, energy: 12.8 },
];

function preload() {
  sensorData = loadJSON('../data/sensors.json?v=4', undefined, () => {
    sensorData = null;
  });
}

function setup() {
  const size = getCanvasSize();
  const canvas = createCanvas(size.width, size.height);
  canvas.parent('canvas-holder');
  setupControls();
  resetSimulation();
}

function windowResized() {
  const size = getCanvasSize();
  resizeCanvas(size.width, size.height);
}

function getCanvasSize() {
  const holder = document.querySelector('#canvas-holder');
  const available = holder ? holder.clientWidth : LOGICAL_WIDTH;
  const width = Math.max(320, available);
  return {
    width,
    height: Math.round(width * LOGICAL_HEIGHT / LOGICAL_WIDTH),
  };
}

function canvasScale() {
  return width / LOGICAL_WIDTH;
}

function setupControls() {
  document.querySelectorAll('.mode-btn').forEach((button) => {
    button.addEventListener('click', () => {
      currentMode = button.dataset.mode;
      document.querySelectorAll('.mode-btn').forEach((b) => b.classList.remove('active'));
      button.classList.add('active');
    });
  });

  document.querySelector('#resetSimulation').addEventListener('click', resetSimulation);
}

function buildRoomsFromData() {
  if (!sensorData || !Array.isArray(sensorData.latest)) {
    return JSON.parse(JSON.stringify(fallbackRooms));
  }

  return sensorData.latest
    .filter((sensor) => layout[sensor.room_id])
    .map((sensor) => ({
      id: sensor.room_id,
      name: layout[sensor.room_id].name,
      x: layout[sensor.room_id].x,
      y: layout[sensor.room_id].y,
      w: layout[sensor.room_id].w,
      h: layout[sensor.room_id].h,
      temp: sensor.temperature_c,
      co2: sensor.co2_ppm,
      occ: sensor.occupancy,
      energy: sensor.energy_kw,
    }));
}

function resetSimulation() {
  rooms = buildRoomsFromData();
  particles = [];
  for (const room of rooms) {
    for (let i = 0; i < room.occ; i++) {
      particles.push(new Person(room));
    }
  }
  if (!rooms.some((room) => room.id === selectedRoomId)) selectedRoomId = rooms[0].id;
  updateSelectedPanel(getSelectedRoom());
}

function draw() {
  background('#f8fafc');
  push();
  scale(canvasScale());
  drawLegend();

  for (const room of rooms) {
    room.co2 += map(room.occ, 0, 50, -0.02, 0.06);
    room.temp += room.id === 'HVAC-A' ? 0.001 : map(room.occ, 0, 50, -0.001, 0.002);
    room.co2 = constrain(room.co2, 500, 1600);
    room.temp = constrain(room.temp, 20, 32);
    drawRoom(room);
  }

  for (const p of particles) {
    p.move();
    p.draw();
  }

  fill('#172033');
  noStroke();
  textSize(14);
  text('Clique em uma sala para aplicar o modo selecionado.', 40, 520);
  text('Exemplo: HVAC crítico por temperatura alta, mesmo com CO₂ baixo.', 40, 542);
  pop();
}

function roomStatus(room) {
  if (room.co2 > 1200 || room.temp > 27.5) return 'critico';
  if (room.co2 > 850 || room.temp > 25.5) return 'atencao';
  return 'normal';
}

function metricStatus(value, attention, critical) {
  if (value > critical) return 'critico';
  if (value > attention) return 'atencao';
  return 'normal';
}

function statusColor(status) {
  if (status === 'critico') return '#dc2626';
  if (status === 'atencao') return '#ca8a04';
  return '#16a34a';
}

function statusFill(status) {
  if (status === 'critico') return color(254, 226, 226);
  if (status === 'atencao') return color(254, 243, 199);
  return color(220, 252, 231);
}

function drawRoom(room) {
  const status = roomStatus(room);
  const selected = room.id === selectedRoomId;

  fill(statusFill(status));
  stroke(selected ? '#2563eb' : '#334155');
  strokeWeight(selected ? 4 : 2);
  rect(room.x, room.y, room.w, room.h, 14);

  noStroke();
  fill('#0f172a');
  textSize(18);
  text(room.name, room.x + 16, room.y + 30);

  drawMetricBar(room.x + 16, room.y + 55, room.w - 32, '🌡️', room.temp, 25.5, 27.5, 20, 32, '°C');
  drawMetricBar(room.x + 16, room.y + 91, room.w - 32, '🌫️', room.co2, 850, 1200, 500, 1600, 'ppm');

  fill('#475569');
  textSize(13);
  text(`ocupação: ${room.occ}`, room.x + 16, room.y + 134);

  const color = statusColor(status);
  fill(color);
  rect(room.x + room.w - 98, room.y + 18, 78, 26, 999);
  fill('white');
  textSize(12);
  text(status, room.x + room.w - 84, room.y + 36);
}

function drawMetricBar(x, y, w, icon, value, attention, critical, minValue, maxValue, unit) {
  const status = metricStatus(value, attention, critical);
  const pct = constrain((value - minValue) / (maxValue - minValue), 0, 1);
  const barX = x + 42;
  const barW = w - 42;

  fill('#0f172a');
  noStroke();
  textSize(12);
  text(`${icon} ${Math.round(value)} ${unit}`, x, y);

  fill('#e5e7eb');
  rect(barX, y + 8, barW, 9, 999);
  fill(statusColor(status));
  rect(barX, y + 8, barW * pct, 9, 999);

  fill(statusColor(status));
  textSize(10);
  text(status, barX, y + 30);
}

function drawLegend() {
  noStroke();
  fill('#dcfce7'); rect(40, 15, 18, 18, 4);
  fill('#0f172a'); textSize(12); text('normal', 64, 29);
  fill('#fef3c7'); rect(130, 15, 18, 18, 4);
  fill('#0f172a'); text('atenção', 154, 29);
  fill('#fee2e2'); rect(230, 15, 18, 18, 4);
  fill('#0f172a'); text('crítico', 254, 29);

  fill('#475569');
  text('Modo atual:', 650, 29);
  fill('#2563eb');
  text(modeLabel(currentMode), 730, 29);
}

function modeLabel(mode) {
  if (mode === 'ventilate') return 'Ventilar';
  if (mode === 'heat') return 'Falha térmica';
  return '+ Pessoas';
}

function mousePressed() {
  const mX = mouseX / canvasScale();
  const mY = mouseY / canvasScale();

  for (const room of rooms) {
    if (mX > room.x && mX < room.x + room.w && mY > room.y && mY < room.y + room.h) {
      selectedRoomId = room.id;
      applyMode(room);
      updateSelectedPanel(room);
      return;
    }
  }
}

function applyMode(room) {
  if (currentMode === 'people') {
    room.occ += 3;
    room.co2 += 85;
    room.temp += 0.25;
    room.energy += 0.25;
    for (let i = 0; i < 3; i++) particles.push(new Person(room));
  }

  if (currentMode === 'ventilate') {
    room.co2 -= 160;
    room.temp -= 0.35;
    room.energy += 0.15;
  }

  if (currentMode === 'heat') {
    room.temp += 1.2;
    room.energy += 0.6;
  }

  room.co2 = constrain(room.co2, 500, 1600);
  room.temp = constrain(room.temp, 20, 32);
  room.occ = max(0, room.occ);
}

function getSelectedRoom() {
  return rooms.find((room) => room.id === selectedRoomId) || rooms[0];
}

function updateSelectedPanel(room) {
  if (!room) return;
  const status = roomStatus(room);
  const tempStatus = metricStatus(room.temp, 25.5, 27.5);
  const co2Status = metricStatus(room.co2, 850, 1200);
  const diagnostic = getDiagnostic(room, tempStatus, co2Status);

  document.querySelector('#selectedRoom').innerHTML = `
    <h2>${room.name}</h2>
    <span class="badge ${status}">${statusLabel[status]}</span>
    <div class="metric-grid">
      <div class="metric"><span>Temperatura</span><strong>${room.temp.toFixed(1)} °C</strong></div>
      <div class="metric"><span>CO₂</span><strong>${Math.round(room.co2)} ppm</strong></div>
      <div class="metric"><span>Ocupação</span><strong>${room.occ}</strong></div>
      <div class="metric"><span>Energia</span><strong>${room.energy.toFixed(1)} kW</strong></div>
    </div>
    <div class="action-box"><strong>Diagnóstico:</strong><br>${diagnostic}</div>
  `;
}

function getDiagnostic(room, tempStatus, co2Status) {
  if (tempStatus === 'critico' && co2Status === 'normal') {
    return 'Temperatura crítica com CO₂ normal: provável falha térmica ou problema no HVAC.';
  }
  if (co2Status === 'critico') {
    return 'CO₂ crítico: aumentar ventilação e avaliar redução de ocupação.';
  }
  if (tempStatus === 'critico') {
    return 'Temperatura crítica: verificar climatização, filtros, compressor ou setpoint.';
  }
  if (co2Status === 'atencao' || tempStatus === 'atencao') {
    return 'Ambiente em atenção: acompanhar tendência e ajustar ventilação/climatização.';
  }
  return 'Ambiente dentro da faixa operacional.';
}

function keyPressed() {
  if (key === 'r' || key === 'R') resetSimulation();
}

class Person {
  constructor(room) {
    this.room = room;
    this.x = random(room.x + 20, room.x + room.w - 20);
    this.y = random(room.y + 50, room.y + room.h - 20);
    this.vx = random(-0.7, 0.7);
    this.vy = random(-0.7, 0.7);
  }
  move() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < this.room.x + 12 || this.x > this.room.x + this.room.w - 12) this.vx *= -1;
    if (this.y < this.room.y + 45 || this.y > this.room.y + this.room.h - 12) this.vy *= -1;
  }
  draw() {
    noStroke();
    fill('#2563ebcc');
    circle(this.x, this.y, 7);
  }
}
