# 山水智游（ScenicNav）

这是一个面向 HarmonyOS 的智慧景区游客端 MVP：ArkTS/ArkUI 提供游客体验，仓颉提供 REST API。项目已实现演示账号登录、票务、电子凭证、导览、项目预约、餐宿、商城积分和反馈等完整前端模拟闭环。

## 目录

- `app/`：可直接在 DevEco Studio 中打开的 Stage ArkTS 工程。
- `scenicnav-server/`：仓颉 HTTP 服务及库存、预约领域逻辑和单元测试。
- `docs/openapi.yaml`：端后接口契约；金额统一使用分。
- `infra/`：MySQL、Redis 与库存原子扣减脚本。
- `loadtest/`：k6 压测脚本。

## 客户端运行

1. 安装当前稳定版 DevEco Studio，并下载与工程匹配的 HarmonyOS SDK（工程目标为 API 12）。
2. 使用 DevEco Studio 打开 `app` 目录，等待依赖同步。
3. 选择 HarmonyOS 模拟器或真机，运行 `entry` 模块。
4. 使用演示账号 `tourist` 与密码 `123456` 登录。

客户端默认使用 `ScenicRepository` 的本地模拟数据，因而无需外部地图、支付、人脸、短信或服务端密钥即可演示。切换真实服务时，只需替换仓储层并遵循 `docs/openapi.yaml`。

## 服务端运行

1. 安装仓颉 1.0.5 工具链和与其兼容的 stdx 动态库。
2. 在 `scenicnav-server` 中执行 `cjpm update`，随后执行 `cjpm run`。
3. 访问 `http://127.0.0.1:8080/health` 验证服务；接口前缀为 `/api/v1`。
4. 执行 `cjpm test` 运行库存、预约与金额计算测试。

仓颉服务当前提供与客户端相同的演示 API 数据，同时将库存与预约的不变式落在可单测领域对象中。生产接入时，在仓储适配层调用 `infra/redis_reserve.lua` 完成 Redis 原子扣减，再于同一业务事务内持久化到 MySQL；`scenicnav-server/sql` 已提供完整表结构、唯一幂等键与种子数据。

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
- 真实地图、定位、支付、闸机/人脸、短信与推送均以可替换模拟接口表达，未使用任何第三方密钥或硬件。
- 后端演示路由目前返回种子数据；接入 MySQL/Redis 的仓储适配器是下一步生产化工作，不应在没有真实凭据和部署环境时伪造验证结果。

