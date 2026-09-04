USE scenicnav;

INSERT INTO users (id, account, password_hash, nickname, points)
VALUES
('u-001', 'tourist', 'demo-password-123456', '旅行者', 320),
('u-002', 'admin', 'demo-password-123456', '景区管理员', 0);

INSERT INTO roles (id, code, name, description) VALUES
('role-tourist', 'TOURIST', '游客', '游客端用户，可浏览景区、购票、预约、提交反馈'),
('role-admin', 'ADMIN', '管理员', '运营管理用户，可查看运营数据、管理票务预约和处理反馈');

INSERT INTO user_roles (user_id, role_id) VALUES
('u-001', 'role-tourist'),
('u-002', 'role-admin');

INSERT INTO ticket_products (id, name, ticket_type, price_fen, description) VALUES
  ('adult', '成人全日票', 'ADULT', 12800, '含核心景点与观光接驳'),
  ('student', '学生优惠票', 'STUDENT', 7800, '入园时出示有效学生证'),
  ('family', '亲子家庭套票', 'FAMILY', 29800, '两大一小，含儿童互动体验');

INSERT INTO ticket_slots (id, ticket_product_id, visit_date, start_time, end_time, total_stock, sold_stock) VALUES
  ('ticket-slot-adult-0900', 'adult', '2026-09-03', '09:00:00', '10:00:00', 256, 0),
  ('ticket-slot-student-1510', 'student', '2026-09-03', '15:10:00', '16:10:00', 88, 0),
  ('ticket-slot-family-1900', 'family', '2026-09-03', '19:00:00', '21:10:00', 32, 0);

INSERT INTO ticket_slots (id, ticket_product_id, visit_date, start_time, end_time, total_stock, sold_stock) VALUES
('slot-adult-am', 'adult', '2026-09-03', '08:30:00', '12:00:00', 180, 42),
('slot-adult-pm', 'adult', '2026-09-03', '12:00:00', '17:30:00', 160, 28),
('slot-student-am', 'student', '2026-09-03', '08:30:00', '12:00:00', 90, 18),
('slot-family-am', 'family', '2026-09-03', '08:30:00', '12:00:00', 60, 16);

INSERT INTO scenic_spots (id, name, subtitle, longitude, latitude, audio_url, crowd_percent) VALUES
('broken_bridge', '断桥残雪', '白堤东端的经典湖景点位', 120.1485630, 30.2585160, '/audio/broken_bridge.mp3', 86),
('solitary_hill', '孤山', '西湖中最大的天然岛屿', 120.1422810, 30.2539170, '/audio/solitary_hill.mp3', 58),
('quyuan', '曲院风荷', '北山西侧的荷风景观', 120.1316480, 30.2529760, '/audio/quyuan.mp3', 35),
('sudi', '苏堤春晓', '贯穿湖面的长堤慢行线', 120.1379160, 30.2398670, '/audio/sudi.mp3', 61),
('flower_harbor', '花港观鱼', '南端园林与亲子游览区', 120.1394260, 30.2313210, '/audio/flower_harbor.mp3', 42),
('leifeng_pagoda', '雷峰塔', '夕照山上的南岸地标', 120.1485970, 30.2339130, '/audio/leifeng_pagoda.mp3', 74);

INSERT INTO guide_routes (id, title, duration_minutes, distance_meters, tags, spot_ids) VALUES
('family', '亲子自然线', 150, 3600, JSON_ARRAY('亲子', '平缓'), JSON_ARRAY('quyuan', 'sudi', 'flower_harbor')),
('culture', '湖畔人文线', 180, 4100, JSON_ARRAY('人文', '讲解'), JSON_ARRAY('broken_bridge', 'solitary_hill', 'leifeng_pagoda')),
('leisure', '南山慢游线', 108, 2800, JSON_ARRAY('休闲', '避拥'), JSON_ARRAY('sudi', 'flower_harbor', 'leifeng_pagoda'));

INSERT INTO projects (id, name, description, fast_pass_price_fen) VALUES
('rafting', '峡谷漂流', '夏季峡谷漂流项目', 3000),
('show', '山水云歌实景演出', '山水光影演出', 2000),
('ropeway', '高山索道', '高山观景索道', 2500),
('tower_tour', '雷峰塔深度讲解团', '雷峰塔文化讲解集合项目', 2000);

INSERT INTO project_slots (id, project_id, start_at, end_at, capacity, reserved_count, fast_pass_capacity, fast_pass_reserved_count) VALUES
  ('project-slot-rafting-1030', 'rafting', '2026-09-03 10:30:00', '2026-09-03 11:30:00', 60, 42, 12, 4),
  ('project-slot-show-1400', 'show', '2026-09-03 14:00:00', '2026-09-03 15:30:00', 120, 74, 24, 4),
  ('project-slot-ropeway-1540', 'ropeway', '2026-09-03 15:40:00', '2026-09-03 16:50:00', 35, 21, 8, 2),
  ('ps-tower-1540', 'tower_tour', '2026-09-03 15:40:00', '2026-09-03 16:50:00', 35, 21, 8, 2);

INSERT INTO merchants (id, merchant_type, name, rating, price_text, description) VALUES
('hotel', 'HOTEL', '云栖山居酒店', 4.8, '￥468 起 / 晚', '步行 5 分钟至景区入口，含双早'),
('homestay', 'HOTEL', '溪畔慢屋民宿', 4.7, '￥288 起 / 晚', '山景露台与亲子房型'),
  ('restaurant', 'RESTAURANT', '山野食集', 4.9, '￥68 起 / 人', '本地时令食材，支持到店核销');

INSERT INTO merchant_booking_slots (id, merchant_id, start_at, end_at, capacity, reserved_count) VALUES
  ('merchant-slot-hotel-0903', 'hotel', '2026-09-03 14:00:00', '2026-09-04 12:00:00', 20, 2),
  ('merchant-slot-homestay-0903', 'homestay', '2026-09-03 14:00:00', '2026-09-04 12:00:00', 12, 1),
  ('merchant-slot-restaurant-1200', 'restaurant', '2026-09-03 12:00:00', '2026-09-03 13:00:00', 40, 6);

INSERT INTO mall_products (id, name, price_fen, points_reward, stock, description) VALUES
('tea', '云雾红茶礼盒', 9900, 99, 100, '景区联名，支持邮寄到家'),
('bookmark', '飞瀑金属书签', 2900, 29, 200, '文创限定款'),
('bag', '山水帆布包', 5900, 59, 120, '环保材质，轻便耐用');

