# ScenicNav 改动交接说明（2026-09-03）

> 供另一个 Codex 会话接手本项目时快速定位改动与对应 bug。所有改动**均已写入工作区但未提交**，只涉及一个文件：
> `app/entry/src/main/ets/pages/Index.ets`
>
> 其余文件（服务端、SQL、Redis、其他 ets 文件）本次一律未改。

## 0. 接手前必看

- 先执行 `git diff -- app/entry/src/main/ets/pages/Index.ets` 查看全部改动，确认不要被后续任务回退。
- 本机没有 DevEco/仓颉工具链，以下改动**只经过静态检查，未编译验证**；接手的 Codex 应保留"可编译"作为第一约束。
- 两处改动的共同技术根因（也是本项目最容易踩的坑）：
  1. ArkUI `ForEach` 对"key 不变但内容变化"的节点不一定重绘；
  2. `@Builder` **按值传参**时，传入的状态变量变化不会刷新 Builder 内部 UI。
- ArkTS 严格模式禁止行内对象类型字面量（`arkts-no-obj-literals-as-types`），禁止无类型对象字面量（`arkts-no-untyped-obj-literals`）。需要对象类型时必须先声明 `interface`。

---

## 1. 客服"小湖助手"：输入中 + 打字机 + 转人工

### 1.1 需求背景

- 原实现提问后立刻整段弹出兜底文字，观感假。
- 第一版打字机把内容写进 `serviceMessages` 数组里同一条消息并原地更新，结果 ArkUI `ForEach` 不复用刷新，只显示前几个字（用户看到回答停在"现在…"）。
- 需要"正在输入"状态 + 逐字打字机 + "转人工客服"按钮，且不接 API Key、不改本地兜底文案。

### 1.2 已新增的状态（struct Index 内）

```ts
@State private assistantTyping: boolean = false;      // 显示"正在输入…"气泡
@State private assistantDraft: string = '';            // 打字机草稿气泡内容（重要：不走 ForEach）
@State private humanServiceRequested: boolean = false; // 是否已转人工
@State private lastServiceQuestion: string = '';       // 最近一次游客提问，用于转人工留言
```

### 1.3 UI 改动（`customerServicePage`）

- 头部状态胶囊：`已转人工` > `回复中` > `在线` 三态。
- 聊天列表尾部新增两个气泡：
  - `assistantTyping == true` 时显示"正在输入…"；
  - `assistantDraft.length > 0` 时显示逐字输出的内容气泡（**直接绑定 @State 文本，不要塞进 ForEach 的消息数组**）。
- 输入行发送按钮左侧新增"转人工 / 已转人工"按钮，点击调 `requestHumanService()`。

### 1.4 逻辑改动

`sendServiceMessage(content: string)` 改为 `async`，流程：

1. 追加游客消息、记录 `lastServiceQuestion`、`aiAnswering = true`、`assistantTyping = true`；
2. `await this.delay(this.thinkDelayMillis())`（800–1500ms 随机"思考"）；
3. 答案来源不变：优先 `callLargeModel(question)`，异常/无 Key 时走 `serviceReply(question)`（**该函数内容未改**）；
4. 关闭输入气泡，`await this.typewriteAnswer(answer)` 逐字显示；
5. `aiAnswering = false`，根据是否走兜底设置提示语。

新增/替换的方法：

```ts
private thinkDelayMillis(): number          // 800 + random(0..700)
private async typewriteAnswer(answer: string): Promise<void>
private requestHumanService(): void
private delay(millis: number): Promise<void>
```

关键点：**`typewriteAnswer` 不要向 `serviceMessages` 追加一条再原地改内容**；改为用 `assistantDraft` @State 逐字更新，全部打完后再把完整消息一次性 `serviceMessages = [...this.serviceMessages, agentMessage]` 并清空 `assistantDraft`。这修复了"只显示前几个字"。

`requestHumanService` 语义：

- 已转人工则仅提示，不重复提交；
- `aiAnswering` 期间点击则提示稍后再转（避免打断打字）；
- 成功后追加一条 `sender: '系统'` 的消息；
- 写入 `latestFeedback = '游客人工客服请求：' + topic`、`feedbackHandled = false`（管理端"待处理反馈"会自动变 1，无需改管理端代码）；
- 写历史 `addHistory('客服', '转人工客服', topic)`；
- `humanServiceRequested = true`，按钮变灰。

### 1.5 明确不改

- `serviceReply` 及其全部兜底文案；
- `callLargeModel` / DeepSeek 请求 / `AiConfig.ets`；
- 管理端页面逻辑。

---

## 2. 行程规划器：生成后不刷新，需切页才更新

### 2.1 现象

- 登录后第一次点"生成我的错峰行程"正常；
- 之后改时长/兴趣标签再生成，卡片内容不更新，切到首页再切回导览页才刷新。

### 2.2 根因

1. 时长按钮用 `ForEach(ITINERARY_DURATIONS...)`，key 恒为 `'120'/'240'/'360'`；高亮随 `itineraryDurationMinutes` 变化，但 key 不变时 ArkUI 不复用刷新该节点。
2. 方案卡片通过 `this.itineraryPlanCard(this.activeItinerary)` **按值**传给 `@Builder`；按值传参时状态变化不会刷新 Builder 内部 UI。第一次生成有效是因为 `activeItinerary` 从 `undefined` 变为对象，`if` 分支首次创建整棵子树；之后只是替换对象，不重建。

### 2.3 已做改动

**a. 时长按钮去 ForEach**（`itineraryPlanner` 内）

三个固定 `Text('2 小时'/'4 小时'/'6 小时')` 显式声明，选中样式分别绑定：

```ts
this.itineraryDurationMinutes === 120
this.itineraryDurationMinutes === 240
this.itineraryDurationMinutes === 360
```

不要再改回 `ForEach(ITINERARY_DURATIONS...)`。文件顶部的 `ITINERARY_DURATIONS` 常量目前无引用，可保留或删除。

**b. 方案卡片按引用传参**

文件顶部新增 interface：

```ts
interface ItineraryPlanCardParameter {
  plan: ItineraryPlan;
}
```

调用处（`itineraryPlanner` 内 `if (this.activeItinerary !== undefined)` 中）：

```ts
this.itineraryPlanCard({ plan: this.activeItinerary })
```

Builder 签名与内部取值：

```ts
@Builder
itineraryPlanCard($$: ItineraryPlanCardParameter) {
  // 所有 plan.xxx 换成 $$.plan.xxx
}
```

模板字符串写法示例（**注意不要多写 `$`**）：

```ts
Text(`舒适度 ${$$.plan.comfortScore}`)
Text(`预计 ${$$.plan.durationMinutes} 分钟 · 已避拥节省约 ${$$.plan.savedWaitMinutes} 分钟`)
```

### 2.4 编译注意（已踩坑）

ArkTS 禁止写成 `itineraryPlanCard($$: { plan: ItineraryPlan })`，会报：

```text
Object literals cannot be used as type declarations (arkts-no-obj-literals-as-types)
Object literal must correspond to some explicitly declared class or interface (arkts-no-untyped-obj-literals)
```

必须声明 `interface ItineraryPlanCardParameter` 后再作为参数类型。

### 2.5 明确不改

- `generateItinerary` / `replanItinerary` 等行程算法；
- 地图、导航、经典主题路线部分。

---

## 3. 验证清单（交给另一个 Codex 后建议复测）

客服页：

1. 提问 → 出现"正在输入…"约 1 秒 → 逐字输出 → 结束时聊天记录里是**完整**兜底句子（不会停在"现在…"）。
2. 点击"转人工" → 出现"系统"消息、按钮变"已转人工"、重复点击只提示等待。
3. 切管理员账号 → "服务"页出现"游客人工客服请求：…"，概览页"待处理反馈"变为 1；点"标记为已处理"后归零。
4. 未填 API Key 时不允许任何 DeepSeek 网络调用，且不修改兜底文案。

行程页：

1. 连续点 2/4/6 小时，高亮即时变化。
2. 只选"亲子"生成 → 卡片标题/景点随之变化；只选"文化"再生成 → 再次变化；**全程不切页**。
3. 若兴趣标签高亮仍滞后（理论不应发生），备用方案是给选择区/卡片加动态 `.key(...)` 强制重建（此前讨论过的方案 B）。

---

## 4. 本次会话累计改动文件的最终状态

- `app/entry/src/main/ets/pages/Index.ets`：唯一被修改文件（客服交互 + 行程规划器刷新）。
- 其余代码保持原状。
- 所有改动未提交；提交前建议在 DevEco 完成一次成功编译与上述验证。
