import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:8080';
const VUS = Number(__ENV.VUS || 20);
const DURATION = __ENV.DURATION || '30s';

export const options = {
  scenarios: {
    visitor_read_write_mix: {
      executor: 'constant-vus',
      vus: VUS,
      duration: DURATION
    }
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<800']
  }
};

function expectSuccess(response, name) {
  check(response, {
    [`${name} returned 200`]: (value) => value.status === 200,
    [`${name} has API envelope`]: (value) => value.json('code') === 0
  });
}

export default function () {
  group('景区浏览', () => {
    expectSuccess(http.get(`${BASE_URL}/api/v1/tickets`), 'tickets');
    expectSuccess(http.get(`${BASE_URL}/api/v1/guide/spots`), 'guide spots');
    expectSuccess(http.get(`${BASE_URL}/api/v1/reservations/projects`), 'project slots');
  });

  group('幂等预约', () => {
    const headers = {
      'Content-Type': 'application/json',
      'Idempotency-Key': `k6-${__VU}-${__ITER}`
    };
    expectSuccess(http.post(`${BASE_URL}/api/v1/orders/tickets`, JSON.stringify({
      ticketSlotId: 'slot-demo', quantity: 1
    }), { headers }), 'ticket order');
  });
  sleep(1);
}

