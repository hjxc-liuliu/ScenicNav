const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'infra', 'valhalla', 'custom_files');
const files = ['west_lake_nw.osm', 'west_lake_ne.osm', 'west_lake_sw.osm', 'west_lake_se.osm'];
const nodes = new Map();
const edges = new Map();

function attr(text, name) {
  const match = text.match(new RegExp(`${name}="([^"]+)"`));
  return match ? match[1] : '';
}

function distance(a, b) {
  const scale = Math.cos((a.lat + b.lat) * Math.PI / 360);
  const dx = (a.lon - b.lon) * 111320 * scale;
  const dy = (a.lat - b.lat) * 110540;
  return Math.sqrt(dx * dx + dy * dy);
}

function connect(a, b) {
  if (!edges.has(a)) edges.set(a, []);
  edges.get(a).push({ id: b, cost: distance(nodes.get(a), nodes.get(b)) });
}

for (const file of files) {
  const xml = fs.readFileSync(path.join(sourceDir, file), 'utf8');
  for (const match of xml.matchAll(/<node\b([^>]*?)(?:\/>|>[\s\S]*?<\/node>)/g)) {
    const id = attr(match[1], 'id');
    nodes.set(id, { lon: Number(attr(match[1], 'lon')), lat: Number(attr(match[1], 'lat')) });
  }
  for (const match of xml.matchAll(/<way\b([^>]*?)>([\s\S]*?)<\/way>/g)) {
    const body = match[2];
    const highwayMatch = body.match(/<tag k="highway" v="([^"]+)"\s*\/>/);
    if (!highwayMatch || ['motorway', 'motorway_link'].includes(highwayMatch[1])) continue;
    const refs = [...body.matchAll(/<nd ref="([^"]+)"\s*\/>/g)].map(item => item[1]);
    for (let i = 1; i < refs.length; i++) {
      if (nodes.has(refs[i - 1]) && nodes.has(refs[i])) {
        connect(refs[i - 1], refs[i]);
        connect(refs[i], refs[i - 1]);
      }
    }
  }
}

function nearest(lon, lat) {
  let best = '';
  let bestDistance = Infinity;
  for (const [id, node] of nodes) {
    if (!edges.has(id)) continue;
    const current = distance(node, { lon, lat });
    if (current < bestDistance) {
      bestDistance = current;
      best = id;
    }
  }
  return best;
}

function route(start, end) {
  const distances = new Map([[start, 0]]);
  const previous = new Map();
  const queue = [{ id: start, cost: 0 }];
  while (queue.length) {
    queue.sort((a, b) => a.cost - b.cost);
    const current = queue.shift();
    if (current.cost !== distances.get(current.id)) continue;
    if (current.id === end) break;
    for (const edge of edges.get(current.id) || []) {
      const next = current.cost + edge.cost;
      if (next < (distances.get(edge.id) ?? Infinity)) {
        distances.set(edge.id, next);
        previous.set(edge.id, current.id);
        queue.push({ id: edge.id, cost: next });
      }
    }
  }
  const ids = [];
  let cursor = end;
  while (cursor) {
    ids.push(cursor);
    if (cursor === start) break;
    cursor = previous.get(cursor);
  }
  ids.reverse();
  return ids.map(id => nodes.get(id));
}

const stops = [
  { name: '断桥入口', lon: 120.148563, lat: 30.258516 },
  { name: '孤山', lon: 120.142281, lat: 30.253917 },
  { name: '曲院风荷', lon: 120.131648, lat: 30.252976 }
];
let all = [];
for (let i = 1; i < stops.length; i++) {
  const segment = route(nearest(stops[i - 1].lon, stops[i - 1].lat), nearest(stops[i].lon, stops[i].lat));
  if (i > 1) segment.shift();
  all = all.concat(segment);
}
const sampled = all.filter((_, index) => index === 0 || index === all.length - 1 || index % 4 === 0);
sampled.unshift({ lon: stops[0].lon, lat: stops[0].lat });
sampled.push({ lon: stops[stops.length - 1].lon, lat: stops[stops.length - 1].lat });
const output = path.join(root, 'app', 'entry', 'src', 'main', 'ets', 'data', 'TeacherDemoRoute.ets');
const rows = sampled.map(point => `  { name: '', longitude: ${point.lon.toFixed(7)}, latitude: ${point.lat.toFixed(7)} }`).join(',\n');
fs.writeFileSync(output, `import { GeoPoint } from '../common/Models';\n\nexport const TEACHER_DEMO_ROUTE: GeoPoint[] = [\n${rows}\n];\n`, 'utf8');
console.log(`Generated ${sampled.length} route points from ${all.length} OSM walking nodes.`);
