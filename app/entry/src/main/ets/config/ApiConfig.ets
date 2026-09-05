export const API_BASE_URLS: string[] = [
  'http://127.0.0.1:8080/api/v1',
  'http://localhost:8080/api/v1',
  'http://172.20.10.9:8080/api/v1'
];

// Valhalla 在开发机的 Docker 中运行。真机调试时请把最后一项改成开发机局域网 IP。
export const VALHALLA_BASE_URLS: string[] = [
  'http://127.0.0.1:8002',
  'http://localhost:8002',
  'http://172.20.10.9:8002'
];
