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

const statusPriority = {
  critico: 3,
  atencao: 2,
  normal: 1,
};

const maintenanceBase = {
  name: 'Base de manutenção',
  lat: -23.55995,
  lng: -46.73305,
};

const map = L.map('map', {
  zoomControl: true,
  scrollWheelZoom: true,
}).setView([-23.5591, -46.7319], 17);

const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap',
}).addTo(map);

const light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  maxZoom: 20,
  attribution: '&copy; OpenStreetMap &copy; CARTO',
});

loadSensorData()
  .then((data) => {
    const latest = [...data.latest].sort((a, b) => {
      const priority = statusPriority[b.status] - statusPriority[a.status];
      if (priority !== 0) return priority;
      return b.co2_ppm - a.co2_ppm;
    });

    let activeFilter = 'todos';
    let selected = latest[0];
    const markersById = new Map();

    const campusLayer = L.layerGroup().addTo(map);
    const sensorsLayer = L.layerGroup().addTo(map);
    const labelsLayer = L.layerGroup().addTo(map);
    const riskZonesLayer = L.layerGroup().addTo(map);
    const routeLayer = L.layerGroup().addTo(map);

    drawCampusArea(campusLayer, latest);
    drawMaintenanceBase(routeLayer);
    drawMarkers();
    updateKpis(latest);
    renderList();
    selectSensor(selected, false);

    L.control.layers(
      {
        'OpenStreetMap': osm,
        'Claro': light,
      },
      {
        'Área do campus': campusLayer,
        'Sensores': sensorsLayer,
        'Rótulos': labelsLayer,
        'Zonas de risco': riskZonesLayer,
        'Rota de inspeção': routeLayer,
      },
      { collapsed: false }
    ).addTo(map);

    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'legend');
      div.innerHTML = `
        <strong>Estado dos sensores</strong><br>
        <span style="color:${statusColor.normal}">●</span> Normal<br>
        <span style="color:${statusColor.atencao}">●</span> Atenção<br>
        <span style="color:${statusColor.critico}">●</span> Crítico<br>
        <hr style="border:0;border-top:1px solid #e5e7eb">
        <span style="color:#2563eb">━</span> rota sugerida
      `;
      return div;
    };
    legend.addTo(map);

    document.querySelectorAll('.filter-btn').forEach((button) => {
      button.addEventListener('click', () => {
        activeFilter = button.dataset.filter;
        document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
        button.classList.add('active');
        drawMarkers();
        renderList();
      });
    });

    function drawCampusArea(layer, sensors) {
      const coords = sensors.map((s) => [s.lat, s.lng]);
      const latValues = sensors.map((s) => s.lat);
      const lngValues = sensors.map((s) => s.lng);
      const bounds = [
        [Math.min(...latValues) - 0.00028, Math.min(...lngValues) - 0.00034],
        [Math.min(...latValues) - 0.00025, Math.max(...lngValues) + 0.00034],
        [Math.max(...latValues) + 0.00028, Math.max(...lngValues) + 0.00032],
        [Math.max(...latValues) + 0.00025, Math.min(...lngValues) - 0.00034],
      ];

      L.polygon(bounds, {
        color: '#2563eb',
        fillColor: '#2563eb',
        fillOpacity: 0.06,
        weight: 2,
        dashArray: '7 7',
      }).bindPopup('<strong>Área monitorada</strong><br>Campus/laboratório do Gêmeo Digital').addTo(layer);

      map.fitBounds(L.latLngBounds(coords), { padding: [40, 40] });
    }

    function drawMaintenanceBase(layer) {
      const icon = L.divIcon({
        className: 'map-label',
        html: '<span style="background:#111827">🛠 Base</span>',
        iconSize: [76, 24],
        iconAnchor: [38, 12],
      });

      L.marker([maintenanceBase.lat, maintenanceBase.lng], { icon })
        .bindPopup(`<strong>${maintenanceBase.name}</strong><br>Ponto inicial da equipe técnica.`)
        .addTo(layer);
    }

    function drawMarkers() {
      sensorsLayer.clearLayers();
      labelsLayer.clearLayers();
      riskZonesLayer.clearLayers();
      markersById.clear();

      visibleSensors().forEach((sensor) => {
        const color = statusColor[sensor.status];
        const marker = L.circleMarker([sensor.lat, sensor.lng], {
          radius: sensor.status === 'critico' ? 15 : sensor.status === 'atencao' ? 12 : 10,
          color: '#ffffff',
          fillColor: color,
          fillOpacity: 0.9,
          weight: 3,
        }).addTo(sensorsLayer);

        marker.bindPopup(popupHtml(sensor));
        marker.on('click', () => selectSensor(sensor, true));
        markersById.set(sensor.room_id, marker);

        const label = L.marker([sensor.lat, sensor.lng], {
          icon: L.divIcon({
            className: 'map-label',
            html: `<span style="background:${color}">${sensor.room_id}</span>`,
            iconSize: [80, 24],
            iconAnchor: [-8, 28],
          }),
          interactive: false,
        }).addTo(labelsLayer);

        if (sensor.status !== 'normal') {
          L.circle([sensor.lat, sensor.lng], {
            radius: sensor.status === 'critico' ? 80 : 52,
            color,
            fillColor: color,
            fillOpacity: sensor.status === 'critico' ? 0.16 : 0.11,
            weight: 1.5,
          }).addTo(riskZonesLayer);
        }
      });
    }

    function selectSensor(sensor, fly = true) {
      selected = sensor;
      updateSelectedPanel(sensor);
      updateRoute(sensor);
      highlightList(sensor);

      const marker = markersById.get(sensor.room_id);
      if (marker) {
        marker.openPopup();
      }
      if (fly) {
        map.flyTo([sensor.lat, sensor.lng], 18, { duration: 0.7 });
      }
    }

    function updateRoute(sensor) {
      routeLayer.clearLayers();
      drawMaintenanceBase(routeLayer);

      const route = [
        [maintenanceBase.lat, maintenanceBase.lng],
        [(maintenanceBase.lat + sensor.lat) / 2 - 0.0001, (maintenanceBase.lng + sensor.lng) / 2],
        [sensor.lat, sensor.lng],
      ];

      L.polyline(route, {
        color: '#2563eb',
        weight: 5,
        opacity: 0.82,
        dashArray: sensor.status === 'normal' ? '4 8' : null,
      }).bindPopup(`Rota sugerida até ${sensor.room_name}`).addTo(routeLayer);
    }

    function updateSelectedPanel(sensor) {
      const action = sensor.status === 'critico'
        ? 'Enviar equipe agora e aumentar ventilação.'
        : sensor.status === 'atencao'
          ? 'Monitorar e verificar HVAC se a tendência continuar.'
          : 'Manter monitoramento de rotina.';

      document.querySelector('#selectedSensor').innerHTML = `
        <h2>${sensor.room_name}</h2>
        <span class="badge ${sensor.status}">${statusLabel[sensor.status]}</span>
        <div class="metric"><span>Temperatura</span><strong>${sensor.temperature_c} °C</strong></div>
        <div class="metric"><span>CO₂</span><strong>${sensor.co2_ppm} ppm</strong></div>
        <div class="metric"><span>Ocupação</span><strong>${sensor.occupancy}</strong></div>
        <div class="metric"><span>Energia</span><strong>${sensor.energy_kw} kW</strong></div>
        <p><strong>Ação espacial:</strong><br>${action}</p>
      `;
    }

    function renderList() {
      const list = document.querySelector('#sensorList');
      list.innerHTML = '';

      visibleSensors().forEach((sensor) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = `sensor-item ${selected && selected.room_id === sensor.room_id ? 'active' : ''}`;
        item.dataset.roomId = sensor.room_id;
        item.innerHTML = `
          <strong><span style="color:${statusColor[sensor.status]}">●</span> ${sensor.room_name}</strong>
          <small>${statusLabel[sensor.status]} · CO₂ ${sensor.co2_ppm} ppm · ${sensor.temperature_c} °C</small>
        `;
        item.addEventListener('click', () => selectSensor(sensor, true));
        list.appendChild(item);
      });

      if (!list.children.length) {
        list.innerHTML = '<p>Nenhum sensor neste filtro.</p>';
      }
    }

    function highlightList(sensor) {
      document.querySelectorAll('.sensor-item').forEach((item) => {
        item.classList.toggle('active', item.dataset.roomId === sensor.room_id);
      });
    }

    function updateKpis(sensors) {
      const critical = sensors.filter((s) => s.status === 'critico').length;
      const co2 = sensors.reduce((sum, s) => sum + s.co2_ppm, 0) / sensors.length;
      const energy = sensors.reduce((sum, s) => sum + s.energy_kw, 0);

      document.querySelector('#kpiSensors').textContent = sensors.length;
      document.querySelector('#kpiCritical').textContent = critical;
      document.querySelector('#kpiCo2').textContent = `${Math.round(co2)}`;
      document.querySelector('#kpiEnergy').textContent = `${energy.toFixed(1)}`;
    }

    function visibleSensors() {
      if (activeFilter === 'todos') return latest;
      return latest.filter((sensor) => sensor.status === activeFilter);
    }

    function popupHtml(sensor) {
      return `
        <strong>${sensor.room_name}</strong><br>
        Status: <b style="color:${statusColor[sensor.status]}">${statusLabel[sensor.status]}</b><br>
        Temperatura: ${sensor.temperature_c} °C<br>
        CO₂: ${sensor.co2_ppm} ppm<br>
        Ocupação: ${sensor.occupancy}<br>
        Energia: ${sensor.energy_kw} kW<br>
        <small>Clique no painel lateral para priorizar inspeção.</small>
      `;
    }
  })
  .catch((error) => {
    console.error('Erro ao inicializar o mapa Leaflet:', error);
    document.querySelector('#selectedSensor').innerHTML = `
      <h2>Erro ao carregar mapa</h2>
      <p>Abra esta demo via servidor HTTP/HTTPS, não diretamente como arquivo local.</p>
      <p><code>http://localhost:8080/leaflet/</code></p>
    `;
  });

async function loadSensorData() {
  const urls = ['../data/sensors.json', '/data/sensors.json'];

  for (const url of urls) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`${url}: ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data.latest) && data.latest.length) return data;
    } catch (error) {
      console.warn(`Não foi possível carregar ${url}`, error);
    }
  }

  console.warn('Usando dados embutidos de fallback para a demo Leaflet.');
  return {
    latest: [
      { room_id: 'LAB-01', room_name: 'Laboratório IA', temperature_c: 24.6, co2_ppm: 830, occupancy: 10, energy_kw: 5.7, status: 'normal', lat: -23.55955, lng: -46.73192 },
      { room_id: 'LAB-02', room_name: 'Laboratório Robótica', temperature_c: 25.9, co2_ppm: 960, occupancy: 18, energy_kw: 7.2, status: 'atencao', lat: -23.55910, lng: -46.73125 },
      { room_id: 'SALA-12', room_name: 'Sala de Aula 12', temperature_c: 26.2, co2_ppm: 1120, occupancy: 23, energy_kw: 8.1, status: 'atencao', lat: -23.55880, lng: -46.73230 },
      { room_id: 'HVAC-A', room_name: 'Casa de Máquinas A', temperature_c: 28.4, co2_ppm: 640, occupancy: 4, energy_kw: 10.9, status: 'critico', lat: -23.55985, lng: -46.73265 },
      { room_id: 'AUD-01', room_name: 'Auditório', temperature_c: 27.1, co2_ppm: 1320, occupancy: 42, energy_kw: 12.8, status: 'critico', lat: -23.55835, lng: -46.73170 },
    ],
  };
}
