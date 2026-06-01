const statusColor = {
  normal: '#16a34a',
  atencao: '#ca8a04',
  critico: '#dc2626',
};

const map = L.map('map').setView([-23.5591, -46.7319], 17);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap',
}).addTo(map);

fetch('../data/sensors.json')
  .then((r) => r.json())
  .then((data) => {
    const latest = data.latest;

    const sensors = L.layerGroup().addTo(map);
    const riskZones = L.layerGroup().addTo(map);

    latest.forEach((sensor) => {
      const color = statusColor[sensor.status];
      const marker = L.circleMarker([sensor.lat, sensor.lng], {
        radius: sensor.status === 'critico' ? 13 : 10,
        color,
        fillColor: color,
        fillOpacity: 0.8,
        weight: 2,
      }).addTo(sensors);

      marker.bindPopup(`
        <strong>${sensor.room_name}</strong><br>
        Status: <b>${sensor.status}</b><br>
        Temperatura: ${sensor.temperature_c} °C<br>
        CO₂: ${sensor.co2_ppm} ppm<br>
        Ocupação: ${sensor.occupancy}<br>
        Energia: ${sensor.energy_kw} kW
      `);

      if (sensor.status !== 'normal') {
        L.circle([sensor.lat, sensor.lng], {
          radius: sensor.status === 'critico' ? 70 : 45,
          color,
          fillColor: color,
          fillOpacity: 0.12,
          weight: 1,
        }).addTo(riskZones);
      }
    });

    L.control.layers(null, {
      'Sensores': sensors,
      'Zonas de atenção': riskZones,
    }).addTo(map);

    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'legend');
      div.innerHTML = `
        <strong>Estado</strong><br>
        <span style="color:${statusColor.normal}">●</span> Normal<br>
        <span style="color:${statusColor.atencao}">●</span> Atenção<br>
        <span style="color:${statusColor.critico}">●</span> Crítico
      `;
      return div;
    };
    legend.addTo(map);
  });
