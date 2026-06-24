<div align="center">
  <img src="icon.ico" width="80" alt="Logo" />
  <h1>💧 吨吨吨 — 喝水小助手</h1>
  <p>
    <b>Drink Water Helper</b> · 每天八杯水，吨吨吨就完事了
  </p>
  <p>
    <img src="https://img.shields.io/badge/Electron-22.x-47848F?logo=electron&logoColor=white" alt="Electron" />
    <img src="https://img.shields.io/badge/平台-Win7%20|%20Win10%20|%20Win11-0078D6" alt="Platform" />
    <img src="https://img.shields.io/badge/版本-v1.0.0-ff69b4" alt="Version" />
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
  </p>
</div>

---

## 📖 简介

**吨吨吨** 是一款 Windows 桌面喝水提醒工具，基于 Electron 构建。它不只是简单的喝水计时器——你还可以收集 Lottie 动画皮肤、抽盲盒、打卡统计，让喝水变成一件有趣的事。

> 💡 **设计理念**：把喝水工具做成有收集要素的桌面小伙伴，每次打开都有期待感。

---

## ✨ 功能一览

### 🥤 喝水打卡
- 预设水杯 + 自定义水杯，一键打卡
- 实时进度条 & 今日完成目标
- 每日推荐饮水量（根据性别/身高/体重自动计算）
- 每次打卡有弹跳动画反馈 🎉

### 📊 数据统计
- 今日圆环完成度
- 本周柱状图（达标/未达标一目了然）
- 饮水分布（按水杯统计）
- 连续达标天数 🔥

### 🎨 皮肤系统
- **88 款 Lottie 动画皮肤**，四大稀有度：普通 🟤 · 稀有 🔵 · 史诗 🟣 · 传说 🟡
- 装备皮肤后水杯区域展示 Lottie 动画
- 点击播放 / 循环模式 / 喝水触发动画

### 🎁 盲盒抽奖
- 免费单抽（每日刷新）| 积分单抽（50分）| 十连抽（500分）
- 完整概率机制 + 保底规则
- 重复皮肤自动转化为积分
- 抽卡记录（最近 20 条）

### 🏪 积分商店 & 🏆 里程碑
- 喝水赚积分（每 100ml = 1 分）
- 商店直接购买心仪皮肤
- 累计天数领奖励，100 天必出传说

### 🌙 主题切换
- 亮色 / 暗色模式一键切换
- 玻璃质感 UI，圆角设计

### 🔔 提醒系统
- 自定义间隔（15~180 分钟）
- 免打扰时段设置
- 系统通知集成

### 💾 数据管理
- 本地 localStorage 持久化
- 导出/导入 JSON 数据备份
- 一键清除所有数据

### 📦 便携设计
- 支持安装版（NSIS）和便携版（绿色免安装）
- 数据目录自动回退（程序目录 → AppData）
- 单实例锁，防止重复启动

---

## 📥 下载

### 🖥 正式版

| 版本 | 下载 |
|------|------|
| 💿 安装包 | [吨吨吨_安装包_1.0.0.exe](https://github.com/Gemingyue007/dudu/releases) |
| 📦 便携版 | [吨吨吨_便携版_1.0.0.exe](https://github.com/Gemingyue007/dudu/releases) |

> ⚠️ 便携版系统托盘显示为 `electron.app.吨吨吨`，安装版则显示为 `吨吨吨`

### 🔧 从源码构建

```bash
# 克隆
git clone https://github.com/Gemingyue007/dudu.git
cd dudu

# 安装依赖
npm install

# 运行
npm start

# 打包
npm run build
```

> 打包产物在 `dist/` 目录下

---

## 🏗 技术栈

| 技术 | 说明 |
|------|------|
| **界面** | HTML + CSS + JavaScript |
| **桌面框架** | Electron 22.x |
| **动画引擎** | Lottie-web |
| **数据存储** | localStorage（JSON） |
| **构建工具** | electron-builder |
| **目标平台** | Windows 7/10/11 x64 |

### 项目结构

```
喝水小助手/
├── index.html          # 主界面（全部UI + 逻辑）
├── main.js             # Electron 主进程
├── preload.js          # 预加载脚本
├── package.json        # 依赖配置
├── icon.ico            # 应用图标
├── make_icon.py        # 图标生成脚本
│
├── lib/                # 前端库
│   └── lottie.min.js
│
├── 喝水小助手_assets/    # 皮肤动画资源
│   └── skins/
│       ├── skins-index.js    # 皮肤索引
│       ├── 普通/
│       ├── 稀有/
│       ├── 史诗/
│       └── 传说/
│
├── dist/               # 构建产物
└── data/               # 运行时数据
```

---

## 🖼 截图

> （待补充 — PR 欢迎贡献截图）

---

## ❓ 常见问题

<details>
<summary>为什么通知显示 "electron.app.吨吨吨"？</summary>
便携版运行时 Windows 会显示 Electron 前缀，安装安装版即可解决。
</details>

<details>
<summary>怎么备份数据？</summary>
设置 → 数据管理 → 💾 导出数据，保存 .json 文件。重装后 📥 导入即可恢复。
</details>

<details>
<summary>皮肤动画不动？</summary>
首次装备需加载动画数据（一秒左右）。点击动画区域触发播放，或点击 🔁 开启循环。
</details>

<details>
<summary>可以在浏览器运行吗？</summary>
直接双击 <code>index.html</code> 即可在浏览器运行（通知功能受限，推荐 Electron 版）。
</details>

---

## 📝 更新日志

### v1.0.0 (2026-06-21)
- 🎉 首发版本
- 完整喝水打卡 + 数据统计
- 88 款 Lottie 皮肤 + 盲盒抽奖系统
- 暗色/亮色主题
- 喝水提醒
- NSIS 安装包 + 便携版双格式

---

## 👤 作者

- **虾仁猪心** — [834373418@qq.com](mailto:834373418@qq.com)

## ⭐ 支持

如果这个项目对你有帮助，欢迎 give a star ⭐

---

<div align="center">
  <sub>每天八杯水 · 吨吨吨 ✨</sub>
</div>
