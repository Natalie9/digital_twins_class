const colors = {
  normal: '#16a34a',
  atencao: '#ca8a04',
  critico: '#dc2626',
};

fetch('../data/sensors.json?v=3', { cache: 'no-store' })
  .then((r) => r.json())
  .then((data) => {
    const readings = data.readings;
    const latest = data.latest;
    const times = [...new Set(readings.map((d) => d.time))];
    const rooms = [...new Set(readings.map((d) => d.room_name))];

    new Chart(document.getElementById('co2Line'), {
      type: 'line',
      data: {
        labels: times,
        datasets: rooms.map((room, i) => ({
          label: room,
          data: times.map((t) => readings.find((d) => d.time === t && d.room_name === room).co2_ppm),
          borderWidth: 2,
          tension: 0.25,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: { y: { title: { display: true, text: 'ppm' } } },
      },
    });

    new Chart(document.getElementById('energyBar'), {
      type: 'bar',
      data: {
        labels: latest.map((d) => d.room_name),
        datasets: [{
          label: 'Energia atual (kW)',
          data: latest.map((d) => d.energy_kw),
          backgroundColor: latest.map((d) => colors[d.status]),
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
      },
    });

    const counts = ['normal', 'atencao', 'critico'].map(
      (s) => latest.filter((d) => d.status === s).length
    );
    new Chart(document.getElementById('statusDonut'), {
      type: 'doughnut',
      data: {
        labels: ['Normal', 'Atenção', 'Crítico'],
        datasets: [{
          data: counts,
          backgroundColor: [colors.normal, colors.atencao, colors.critico],
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
      },
    });
  });
