const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'infra', 'valhalla', 'custom_files');
const output = path.join(root, 'app', 'entry', 'src', 'main', 'resources', 'base', 'media', 'map_west_lake_real.svg');
const files = ['west_lake_nw.osm', 'west_lake_ne.osm', 'west_lake_sw.osm', 'west_lake_se.osm'];
const nodes = new Map();
const ways = new Map();

for (const file of files) {
  const xml = fs.readFileSync(path.join(sourceDir, file), 'utf8');
  for (const match of xml.matchAll(/<node\b([^>]*?)\/>/g)) {
    const attrs = match[1];
    const id = attr(attrs, 'id');
    nodes.set(id, { lon: Number(attr(attrs, 'lon')), lat: Number(attr(attrs, 'lat')) });
  }
  for (const match of xml.matchAll(/<node\b([^>]*?)>([\s\S]*?)<\/node>/g)) {
    const attrs = match[1];
    const id = attr(attrs, 'id');
    nodes.set(id, { lon: Number(attr(attrs, 'lon')), lat: Number(attr(attrs, 'lat')) });
  }
  for (const match of xml.matchAll(/<way\b([^>]*?)>([\s\S]*?)<\/way>/g)) {
    const id = attr(match[1], 'id');
    const body = match[2];
    const refs = [...body.matchAll(/<nd ref="([^"]+)"\s*\/>/g)].map(item => item[1]);
    const tags = {};
    for (const tag of body.matchAll(/<tag k="([^"]+)" v="([^"]*)"\s*\/>/g)) {
      tags[tag[1]] = decode(tag[2]);
    }
    ways.set(id, { refs, tags });
  }
}

function attr(text, name) {
  const match = text.match(new RegExp(`${name}="([^"]+)"`));
  return match ? match[1] : '';
}

function decode(text) {
  return text.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
}

const bounds = { minLon: 120.12, maxLon: 120.17, minLat: 30.22, maxLat: 30.27 };
const width = 900;
const height = 520;
function point(node) {
  const x = (node.lon - bounds.minLon) / (bounds.maxLon - bounds.minLon) * width;
  const y = (bounds.maxLat - node.lat) / (bounds.maxLat - bounds.minLat) * height;
  return `${x.toFixed(1)},${y.toFixed(1)}`;
}

const water = [];
const parks = [];
const majorRoads = [];
const minorRoads = [];
const footways = [];
for (const way of ways.values()) {
  const points = way.refs.map(ref => nodes.get(ref)).filter(Boolean);
  if (points.length < 2) continue;
  const list = points.map(point).join(' ');
  const closed = way.refs[0] === way.refs[way.refs.length - 1];
  if (closed && (way.tags.natural === 'water' || way.tags.water || way.tags.waterway === 'riverbank')) {
    water.push(`<polygon points="${list}"/>`);
  } else if (closed && (way.tags.leisure === 'park' || way.tags.landuse === 'grass' || way.tags.natural === 'wood')) {
    parks.push(`<polygon points="${list}"/>`);
  } else if (way.tags.highway) {
    if (['primary', 'secondary', 'tertiary', 'trunk'].includes(way.tags.highway)) {
      majorRoads.push(`<polyline points="${list}"/>`);
    } else if (['footway', 'path', 'pedestrian', 'steps'].includes(way.tags.highway)) {
      footways.push(`<polyline points="${list}"/>`);
    } else {
      minorRoads.push(`<polyline points="${list}"/>`);
    }
  }
}

const labels = [
  ['断桥残雪', 120.148563, 30.258516], ['孤山', 120.142281, 30.253917],
  ['曲院风荷', 120.131648, 30.252976], ['苏堤春晓', 120.137916, 30.239867],
  ['花港观鱼', 120.139426, 30.231321], ['雷峰塔', 120.148597, 30.233913]
].map(([name, lon, lat]) => {
  const [x, y] = point({ lon, lat }).split(',');
  return `<circle cx="${x}" cy="${y}" r="4"/><text x="${Number(x) + 7}" y="${Number(y) - 7}">${name}</text>`;
}).join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="520" viewBox="0 0 900 520">
<rect width="900" height="520" fill="#f4f1e8"/>
<g fill="#cfe8c7" stroke="none">${parks.join('')}</g>
<g fill="#8fc9df" stroke="#75b8d2" stroke-width="1">${water.join('')}</g>
<g fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${majorRoads.join('')}</g>
<g fill="none" stroke="#d9d1c2" stroke-width="2.2" stroke-linecap="round">${minorRoads.join('')}</g>
<g fill="none" stroke="#d2b883" stroke-width="1.4" stroke-dasharray="4 2" stroke-linecap="round">${footways.join('')}</g>
<g fill="#176b43" font-family="sans-serif" font-size="11" font-weight="600" paint-order="stroke" stroke="#fff" stroke-width="3">${labels}</g>
<text x="18" y="500" font-family="sans-serif" font-size="10" fill="#68756d">© OpenStreetMap contributors · 西湖真实道路与步道数据</text>
</svg>`;
fs.writeFileSync(output, svg, 'utf8');
console.log(`Generated ${output}: ${nodes.size} nodes, ${ways.size} ways`);
