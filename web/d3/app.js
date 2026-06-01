const typeColor = {
  sistema: '#2563eb',
  sala: '#16a34a',
  sensor: '#0ea5e9',
  ativo: '#7c3aed',
  infra: '#64748b',
  modelo: '#f97316',
  alerta: '#dc2626',
  usuario: '#111827',
};

const svg = d3.select('#graph');
const tooltip = d3.select('#tooltip');
const width = 1050;
const height = 680;
svg.attr('viewBox', [0, 0, width, height]);

fetch('../data/sensors.json')
  .then((r) => r.json())
  .then((data) => {
    const graph = data.graph;

    const simulation = d3.forceSimulation(graph.nodes)
      .force('link', d3.forceLink(graph.links).id((d) => d.id).distance(105))
      .force('charge', d3.forceManyBody().strength(-420))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(45));

    const link = svg.append('g')
      .selectAll('line')
      .data(graph.links)
      .join('line')
      .attr('class', 'link')
      .attr('stroke-width', 1.8);

    const edgeLabel = svg.append('g')
      .selectAll('text')
      .data(graph.links)
      .join('text')
      .text((d) => d.label)
      .attr('font-size', 10)
      .attr('fill', '#64748b');

    const node = svg.append('g')
      .selectAll('g')
      .data(graph.nodes)
      .join('g')
      .attr('class', 'node')
      .call(drag(simulation));

    node.append('circle')
      .attr('r', (d) => d.type === 'sistema' ? 24 : d.type === 'alerta' ? 20 : 16)
      .attr('fill', (d) => typeColor[d.type] || '#999')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2.5);

    node.append('text')
      .text((d) => d.label)
      .attr('x', 21)
      .attr('y', 5);

    node.on('mousemove', (event, d) => {
      tooltip
        .style('opacity', 1)
        .style('left', `${event.clientX + 12}px`)
        .style('top', `${event.clientY + 12}px`)
        .html(`<strong>${d.label}</strong><br>tipo: ${d.type}`);
    }).on('mouseleave', () => tooltip.style('opacity', 0));

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      edgeLabel
        .attr('x', (d) => (d.source.x + d.target.x) / 2)
        .attr('y', (d) => (d.source.y + d.target.y) / 2);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });
  });

function drag(simulation) {
  return d3.drag()
    .on('start', (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    })
    .on('drag', (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    })
    .on('end', (event, d) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    });
}
