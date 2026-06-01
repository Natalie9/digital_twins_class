// Lógica conceitual para painel AR de um Gêmeo Digital.
// Em produção, estes dados viriam de API, MQTT, WebSocket ou backend do Digital Twin.

const fakeTwinState = {
  assetId: 'HVAC-A',
  status: 'ATENCAO',
  temperature: 27.2,
  vibration: 6.8,
  co2: 1180,
  action: 'Verificar filtros e ventilação',
};

function statusColor(status) {
  if (status === 'CRITICO') return '#dc2626';
  if (status === 'ATENCAO') return '#ca8a04';
  return '#16a34a';
}

window.addEventListener('DOMContentLoaded', () => {
  const text = document.querySelector('#panel-text');
  const bg = document.querySelector('#panel-bg');
  const asset = document.querySelector('#asset');

  const s = fakeTwinState;
  text.setAttribute('value',
    `Ativo: ${s.assetId}\n` +
    `Status: ${s.status}\n` +
    `Temp: ${s.temperature} C\n` +
    `Vibracao: ${s.vibration} mm/s\n` +
    `CO2: ${s.co2} ppm\n` +
    `Acao: ${s.action}`
  );
  bg.setAttribute('color', '#111827');
  asset.setAttribute('color', statusColor(s.status));
});
