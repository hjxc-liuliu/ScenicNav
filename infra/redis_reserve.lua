-- KEYS[1]: stock key, KEYS[2]: idempotency key
-- ARGV[1]: quantity, ARGV[2]: idempotency TTL (seconds)
-- 返回：{1, remaining} 成功；{2, remaining} 重复请求；{0, available} 库存不足
if redis.call('EXISTS', KEYS[2]) == 1 then
  return {2, tonumber(redis.call('GET', KEYS[1]) or '0')}
end

local available = tonumber(redis.call('GET', KEYS[1]) or '0')
local quantity = tonumber(ARGV[1])
if quantity <= 0 or available < quantity then
  return {0, available}
end

local remaining = redis.call('DECRBY', KEYS[1], quantity)
redis.call('SET', KEYS[2], '1', 'EX', ARGV[2])
return {1, remaining}

