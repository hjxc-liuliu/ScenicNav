USE scenicnav;

INSERT INTO users (id, account, password_hash, nickname, points)
VALUES ('u-001', 'tourist', 'REPLACE_WITH_BCRYPT_HASH_AT_DEPLOYMENT', '旅行者', 320);

INSERT INTO ticket_products (id, name, ticket_type, price_fen, description) VALUES
('adult', '成人全日票', 'ADULT', 12800, '含核心景点与观光接驳'),
('student', '学生优惠票', 'STUDENT', 7800, '入园时出示有效学生证'),
('family', '亲子家庭套票', 'FAMILY', 29800, '两大一小，含儿童互动体验');

INSERT INTO projects (id, name, description, fast_pass_price_fen) VALUES
('rafting', '峡谷漂流', '夏季峡谷漂流项目', 3000),
('show', '山水云歌实景演出', '山水光影演出', 2000),
('ropeway', '高山索道', '高山观景索道', 2500);

INSERT INTO merchants (id, merchant_type, name, rating, price_text, description) VALUES
('hotel', 'HOTEL', '云栖山居酒店', 4.8, '￥468 起 / 晚', '步行 5 分钟至景区入口，含双早'),
('homestay', 'HOTEL', '溪畔慢屋民宿', 4.7, '￥288 起 / 晚', '山景露台与亲子房型'),
('restaurant', 'RESTAURANT', '山野食集', 4.9, '￥68 起 / 人', '本地时令食材，支持到店核销');

INSERT INTO mall_products (id, name, price_fen, points_reward, stock, description) VALUES
('tea', '云雾红茶礼盒', 9900, 99, 100, '景区联名，支持邮寄到家'),
('bookmark', '飞瀑金属书签', 2900, 29, 200, '文创限定款'),
('bag', '山水帆布包', 5900, 59, 120, '环保材质，轻便耐用');

