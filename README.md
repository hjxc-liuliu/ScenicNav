# 山水智游（ScenicNav）

这是一个面向 HarmonyOS 的智慧景区游客端应用：ArkTS/ArkUI 提供游客体验，仓颉提供 REST API。项目覆盖账号登录、票务、电子凭证、导览、项目预约、餐宿、商城积分、智能咨询和反馈等核心业务流程。

## 目录

- `app/`：可直接在 DevEco Studio 中打开的 Stage ArkTS 工程。
- `scenicnav-server/`：仓颉 HTTP 服务及库存、预约领域逻辑和单元测试。
- `docs/openapi.yaml`：端后接口契约；金额统一使用分。
- `infra/`：MySQL、Redis 与库存原子扣减脚本。
- `loadtest/`：k6 压测脚本。

## 素材来源

- 登录页西湖实景图：Wikimedia Commons，`The Leifeng Pagoda, boats, and the West Lake.jpg`，作者 CatOnMars，许可 CC BY-SA 4.0。
- 首页轮播图：
  - `The Leifeng Pagoda, boats, and the West Lake.jpg`，Wikimedia Commons，作者 CatOnMars，许可 CC BY-SA 4.0。
  - `Broken Bridge (Hangzhou) 20250505.jpg`，Wikimedia Commons，作者 Suicasmo，许可 CC0 1.0。
  - `Su Causeway, West Lake.jpg`，Wikimedia Commons，作者钉钉，许可 CC BY-SA 4.0。

## 客户端运行

1. 安装当前稳定版 DevEco Studio，并下载与工程匹配的 HarmonyOS SDK（工程目标为 API 12）。
2. 使用 DevEco Studio 打开 `app` 目录，等待依赖同步。
3. 选择 HarmonyOS 模拟器或真机，运行 `entry` 模块。
4. 本地开发阶段可使用内置测试账号 `tourist` 与密码 `123456` 登录；接入正式认证服务后，请使用真实账号体系。

客户端的数据访问集中在 `ScenicRepository`。当前 App 启动后会从 `app/entry/src/main/ets/config/ApiConfig.ets` 配置的后端地址同步票务、景点、路线、预约项目、商户、商城商品和演示账号角色；如果后端不可用，会回退到本地演示数据，保证页面仍可浏览。后续接入正式景区服务时，可继续在仓储层接入真实支付、地图、短信、推送和闸机核验接口，并遵循 `docs/openapi.yaml`。

### 智能咨询配置

游客端“小湖助手”会调用 DeepSeek Chat Completions API。请在以下文件中填入 API Key：

```text
app/entry/src/main/ets/config/AiConfig.ets
```

把第一行替换为你的真实 Key：

```ts
export const AI_API_KEY: string = '你的 API Key';
```

同一文件中也可以修改 `AI_BASE_URL` 和 `AI_MODEL`。当前默认地址为 `https://api.deepseek.com/chat/completions`，默认模型为 `deepseek-v4-flash`。如果 API Key 未填写或调用失败，应用会使用本地景区知识作为兜底回复，保证游客仍能获得基础帮助。

注意：正式上线时建议改为由后端服务代为调用大模型，避免 Key 随安装包暴露。

## 服务端运行

1. 安装仓颉 1.0.5 工具链和与其兼容的 stdx 动态库。
2. 先启动 MySQL。可以复制 `infra/.env.example` 为 `infra/.env`，再按需修改密码；默认后端连接 `127.0.0.1:3306/scenicnav`，用户 `scenicnav`，密码 `scenicnav`。
3. 执行 `docker compose --env-file infra/.env -f infra/docker-compose.yml up -d mysql`，容器会自动执行 `scenicnav-server/sql` 下的建表和初始化数据。
4. 在 `scenicnav-server` 中执行 `cjpm update`，随后执行 `cjpm run`。
5. 访问 `http://127.0.0.1:8080/health` 验证服务和 MySQL 连接；接口前缀为 `/api/v1`。
6. 执行 `cjpm test` 运行库存、预约与金额计算测试。

仓颉服务提供 REST API、MySQL 查询、库存与预约领域逻辑。当前票务列表、景点、路线、预约项目、商户和商城商品接口会从 MySQL 读取；创建订单、退款、预约提交、积分和反馈接口仍是演示响应。正式部署时，可在仓储适配层继续接入事务写入，并按需调用 `infra/redis_reserve.lua` 完成 Redis 原子扣减。

## 基础设施与压测

运行容器前，请在终端为数据库密码设置安全的环境变量，再执行：

```powershell
docker compose -f infra/docker-compose.yml up -d
```

安装 k6 后可做小规模验证：

```powershell
k6 run loadtest/scenicnav.js
```

使用 `BASE_URL`、`VUS` 和 `DURATION` 环境变量连接部署环境并调整压力；1 万并发压测必须在具备相应网络、CPU、数据库和 Redis 容量的独立环境执行。

## 已知边界

- 本机尚未安装 DevEco Studio、HarmonyOS SDK 与仓颉工具链，因此本次未在本机生成 HAP 或运行仓颉编译。
- 地图、定位、支付、闸机/人脸、短信与推送需要接入景区正式供应商接口和硬件环境。
- 后端需要在目标部署环境中配置 MySQL、Redis、认证服务和第三方接口凭据后，再进行正式联调验收。

