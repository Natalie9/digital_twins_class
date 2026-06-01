let rooms;
let particles = [];
let sensorData;

const layout = {
  'LAB-01': { name: 'Lab IA', x: 40, y: 50, w: 250, h: 180 },
  'LAB-02': { name: 'Robótica', x: 310, y: 50, w: 250, h: 180 },
  'SALA-12': { name: 'Sala 12', x: 580, y: 50, w: 250, h: 180 },
  'HVAC-A': { name: 'HVAC', x: 40, y: 270, w: 250, h: 180 },
  'AUD-01': { name: 'Auditório', x: 310, y: 270, w: 520, h: 180 },
};

const fallbackRooms = [
  { id: 'LAB-01', name: 'Lab IA', x: 40, y: 50, w: 250, h: 180, temp: 24.6, co2: 830, occ: 10 },
  { id: 'LAB-02', name: 'Robótica', x: 310, y: 50, w: 250, h: 180, temp: 25.6, co2: 956, occ: 18 },
  { id: 'SALA-12', name: 'Sala 12', x: 580, y: 50, w: 250, h: 180, temp: 25.2, co2: 1027, occ: 23 },
  { id: 'HVAC-A', name: 'HVAC', x: 40, y: 270, w: 250, h: 180, temp: 28.4, co2: 640, occ: 4 },
  { id: 'AUD-01', name: 'Auditório', x: 310, y: 270, w: 520, h: 180, temp: 26.6, co2: 1133, occ: 42 },
];

function preload() {
  sensorData = loadJSON('../data/sensors.json?v=3', undefined, () => {
    sensorData = null;
  });
}

function setup() {
  const canvas = createCanvas(880, 540);
  canvas.parent('canvas-holder');
  resetSimulation();
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
}

function draw() {
  background('#f8fafc');
  drawLegend();

  for (const room of rooms) {
    room.co2 += map(room.occ, 0, 50, -0.02, 0.08);
    room.temp += room.id === 'HVAC-A' ? 0.002 : map(room.occ, 0, 50, -0.001, 0.003);
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
  text('Visualização 2D: estado + comportamento simulado', 40, 505);
  text('Caso especial: HVAC crítico por temperatura alta, mesmo com CO₂ baixo.', 40, 526);
}

function roomStatus(room) {
  if (room.co2 > 1200 || room.temp > 27.5) return 'critico';
  if (room.co2 > 850 || room.temp > 25.5) return 'atencao';
  return 'normal';
}

function drawRoom(room) {
  const status = roomStatus(room);
  const c = status === 'critico' ? color(254, 226, 226) : status === 'atencao' ? color(254, 243, 199) : color(220, 252, 231);
  fill(c);
  stroke('#334155');
  strokeWeight(2);
  rect(room.x, room.y, room.w, room.h, 14);

  noStroke();
  fill('#0f172a');
  textSize(18);
  text(room.name, room.x + 16, room.y + 30);
  textSize(14);
  text(`CO₂: ${Math.round(room.co2)} ppm`, room.x + 16, room.y + 58);
  text(`temp.: ${room.temp.toFixed(1)} °C`, room.x + 16, room.y + 80);
  text(`ocupação: ${room.occ}`, room.x + 16, room.y + 102);

  fill(status === 'critico' ? '#dc2626' : status === 'atencao' ? '#ca8a04' : '#16a34a');
  rect(room.x + room.w - 98, room.y + 18, 78, 26, 999);
  fill('white');
  textSize(12);
  text(status, room.x + room.w - 84, room.y + 36);
}

function drawLegend() {
  noStroke();
  fill('#dcfce7'); rect(40, 15, 18, 18, 4);
  fill('#0f172a'); textSize(12); text('normal', 64, 29);
  fill('#fef3c7'); rect(130, 15, 18, 18, 4);
  fill('#0f172a'); text('atenção', 154, 29);
  fill('#fee2e2'); rect(230, 15, 18, 18, 4);
  fill('#0f172a'); text('crítico', 254, 29);
}

function mousePressed() {
  for (const room of rooms) {
    if (mouseX > room.x && mouseX < room.x + room.w && mouseY > room.y && mouseY < room.y + room.h) {
      room.occ += 3;
      room.co2 += 80;
      room.temp += 0.25;
      for (let i = 0; i < 3; i++) particles.push(new Person(room));
    }
  }
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
