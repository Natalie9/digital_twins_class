const statusColor = {
  normal: '#16a34a',
  atencao: '#ca8a04',
  critico: '#dc2626',
};

const statusLabel = {
  normal: 'Normal',
  atencao: 'Atenção',
  critico: 'Crítico',
};

const svg = d3.select('#decisionFlow');
const details = d3.select('#details');
const width = 1100;
const height = 680;
svg.attr('viewBox', [0, 0, width, height]);

const stages = [
  { key: 'room', title: 'Ambiente físico', subtitle: 'salas / ativos', x: 120 },
  { key: 'sensor', title: 'Sensores', subtitle: 'CO₂, temp., energia', x: 330 },
  { key: 'gateway', title: 'Gateway IoT', subtitle: 'coleta e transmite', x: 520 },
  { key: 'model', title: 'Modelo', subtitle: 'regras / predição', x: 700 },
  { key: 'alert', title: 'Alerta', subtitle: 'risco e prioridade', x: 870 },
  { key: 'operator', title: 'Operador', subtitle: 'decisão e ação', x: 1030 },
];

fetch('../data/sensors.json?v=3', { cache: 'no-store' })
  .then((r) => r.json())
  .then((data) => {
    const latest = data.latest;
    let selected = latest.find((d) => d.status === 'critico') || latest[0];

    drawStageHeaders();
    drawSharedComponents();
    drawRows(latest, selected);
    updateDetails(selected);
    animateDots(selected);

    function drawStageHeaders() {
      const header = svg.append('g').attr('transform', 'translate(0, 34)');
      const stage = header.selectAll('g')
        .data(stages)
        .join('g')
        .attr('transform', (d) => `translate(${d.x},0)`);

      stage.append('text')
        .attr('class', 'stage-title')
        .text((d) => d.title);

      stage.append('text')
        .attr('class', 'stage-subtitle')
        .attr('y', 18)
        .text((d) => d.subtitle);
    }

    function drawSharedComponents() {
      const components = [
        { key: 'gateway', x: 520, y: 330, w: 116, h: 62, color: '#64748b', title: 'Gateway', subtitle: 'MQTT/API' },
        { key: 'model', x: 700, y: 330, w: 126, h: 62, color: '#f97316', title: 'Modelo', subtitle: 'detecta risco' },
        { key: 'operator', x: 1030, y: 330, r: 42, color: '#111827', title: 'Operador', subtitle: 'decide' },
      ];

      const group = svg.append('g').attr('class', 'components');
      const rects = group.selectAll('g.rect-component')
        .data(components.filter((d) => !d.r))
        .join('g')
        .attr('class', 'component rect-component')
        .attr('transform', (d) => `translate(${d.x - d.w / 2},${d.y - d.h / 2})`);

      rects.append('rect')
        .attr('width', (d) => d.w)
        .attr('height', (d) => d.h)
        .attr('rx', 16)
        .attr('fill', (d) => d.color);

      rects.append('text')
        .attr('class', 'component-title')
        .attr('x', (d) => d.w / 2)
        .attr('y', 27)
        .text((d) => d.title);

      rects.append('text')
        .attr('class', 'component-subtitle')
        .attr('x', (d) => d.w / 2)
        .attr('y', 45)
        .text((d) => d.subtitle);

      const circles = group.selectAll('g.circle-component')
        .data(components.filter((d) => d.r))
        .join('g')
        .attr('class', 'component circle-component')
        .attr('transform', (d) => `translate(${d.x},${d.y})`);

      circles.append('circle')
        .attr('r', (d) => d.r)
        .attr('fill', (d) => d.color);

      circles.append('text')
        .attr('class', 'component-title')
        .attr('y', -4)
        .text((d) => d.title);

      circles.append('text')
        .attr('class', 'component-subtitle')
        .attr('y', 15)
        .text((d) => d.subtitle);
    }

    function drawRows(rows, selectedRoom) {
      const y = d3.scalePoint()
        .domain(rows.map((d) => d.room_id))
        .range([120, 560])
        .padding(0.4);

      const flows = svg.append('g').attr('class', 'flows');
      const row = svg.append('g').attr('class', 'rows');

      rows.forEach((room) => {
        const roomY = y(room.room_id);
        const color = statusColor[room.status];
        const isActive = room.room_id === selectedRoom.room_id;

        const points = [
          [210, roomY],
          [285, roomY],
          [365, roomY],
          [455, 330],
          [590, 330],
          [637, 330],
          [763, 330],
          [808, roomY],
          [918, roomY],
          [972, 330],
        ];

        const line = d3.line()
          .curve(d3.curveBasis)
          .x((d) => d[0])
          .y((d) => d[1]);

        flows.append('path')
          .datum({ room, points })
          .attr('class', `flow-line ${isActive ? 'active' : ''}`)
          .attr('data-room', room.room_id)
          .attr('stroke', color)
          .attr('d', line(points));

        const card = row.append('g')
          .datum(room)
          .attr('class', `room-card ${isActive ? 'active' : ''}`)
          .attr('transform', `translate(28,${roomY - 34})`)
          .on('click', (_, d) => selectRoom(d));

        card.append('rect')
          .attr('width', 165)
          .attr('height', 68)
          .attr('rx', 14)
          .attr('fill', statusFill(room.status));

        card.append('text')
          .attr('class', 'room-label')
          .attr('x', 14)
          .attr('y', 23)
          .text(room.room_name);

        card.append('text')
          .attr('class', 'room-metric')
          .attr('x', 14)
          .attr('y', 43)
          .text(`CO₂ ${room.co2_ppm} ppm · ${statusLabel[room.status]}`);

        card.append('circle')
          .attr('cx', 145)
          .attr('cy', 20)
          .attr('r', 8)
          .attr('fill', color);

        drawSensor(room, roomY, isActive);
        drawAlert(room, roomY, isActive);
      });
    }

    function drawSensor(room, y, isActive) {
      const g = svg.append('g')
        .datum(room)
        .attr('class', `sensor ${isActive ? 'active' : ''}`)
        .attr('transform', `translate(330,${y})`)
        .on('click', (_, d) => selectRoom(d));

      g.append('circle')
        .attr('r', isActive ? 30 : 24)
        .attr('fill', '#0ea5e9')
        .attr('opacity', isActive ? 1 : 0.55);

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', -3)
        .attr('font-size', 11)
        .attr('font-weight', 800)
        .attr('fill', 'white')
        .text('sensor');

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 13)
        .attr('font-size', 10)
        .attr('fill', 'white')
        .text(`${room.temperature_c}°C`);
    }

    function drawAlert(room, y, isActive) {
      const color = statusColor[room.status];
      const label = room.status === 'normal' ? 'sem alerta' : room.status;
      const g = svg.append('g')
        .datum(room)
        .attr('class', `alert-node ${isActive ? 'active' : ''}`)
        .attr('transform', `translate(870,${y})`)
        .on('click', (_, d) => selectRoom(d));

      g.append('rect')
        .attr('x', -54)
        .attr('y', -20)
        .attr('width', 108)
        .attr('height', 40)
        .attr('rx', 999)
        .attr('fill', color)
        .attr('opacity', isActive ? 1 : 0.62);

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 5)
        .attr('font-size', 11)
        .attr('font-weight', 800)
        .attr('fill', 'white')
        .text(label.toUpperCase());
    }

    function selectRoom(room) {
      selected = room;
      svg.selectAll('.room-card').classed('active', (d) => d && d.room_id === room.room_id);
      svg.selectAll('.flow-line').classed('active', (d) => d.room.room_id === room.room_id);
      svg.selectAll('.sensor circle').transition().duration(180)
        .attr('r', (d) => d.room_id === room.room_id ? 30 : 24)
        .attr('opacity', (d) => d.room_id === room.room_id ? 1 : 0.55);
      svg.selectAll('.alert-node rect').transition().duration(180)
        .attr('opacity', (d) => d.room_id === room.room_id ? 1 : 0.62);
      updateDetails(room);
      animateDots(room);
    }

    function updateDetails(room) {
      const action = room.status === 'critico'
        ? 'Ação imediata: aumentar ventilação e verificar HVAC.'
        : room.status === 'atencao'
          ? 'Ação sugerida: acompanhar tendência e ajustar ventilação.'
          : 'Sistema dentro da faixa operacional.';

      details.html(`
        <h2>${room.room_name}</h2>
        <span class="badge ${room.status}">${statusLabel[room.status]}</span>
        <div class="metric"><span>Temperatura</span><strong>${room.temperature_c} °C</strong></div>
        <div class="metric"><span>CO₂</span><strong>${room.co2_ppm} ppm</strong></div>
        <div class="metric"><span>Ocupação</span><strong>${room.occupancy}</strong></div>
        <div class="metric"><span>Energia</span><strong>${room.energy_kw} kW</strong></div>
        <p><strong>Decisão apoiada:</strong><br>${action}</p>
      `);
    }

    function animateDots(room) {
      svg.selectAll('.flow-dot').remove();
      const activePath = svg.select(`.flow-line[data-room="${room.room_id}"]`).node();
      if (!activePath) return;

      const color = statusColor[room.status];
      for (let i = 0; i < 3; i++) {
        const dot = svg.append('circle')
          .attr('class', 'flow-dot')
          .attr('r', 6)
          .attr('fill', color);

        repeat(dot, activePath, i * 700);
      }
    }

    function repeat(dot, path, delay) {
      const length = path.getTotalLength();
      dot.interrupt()
        .attr('opacity', 0)
        .transition()
        .delay(delay)
        .duration(180)
        .attr('opacity', 1)
        .transition()
        .duration(2600)
        .ease(d3.easeLinear)
        .attrTween('transform', () => (t) => {
          const p = path.getPointAtLength(t * length);
          return `translate(${p.x},${p.y})`;
        })
        .transition()
        .duration(180)
        .attr('opacity', 0)
        .on('end', () => repeat(dot, path, delay));
    }
  });

function statusFill(status) {
  if (status === 'critico') return '#fee2e2';
  if (status === 'atencao') return '#fef3c7';
  return '#dcfce7';
}
