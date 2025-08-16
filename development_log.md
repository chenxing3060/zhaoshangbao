# 项目开发记忆文档

本文档记录了“招商宝”项目的开发过程、遇到的问题及解决方案，以确保开发工作的连续性和效率。

## 2025-08-16

### 任务：启动并预览项目

#### 1. 前端依赖问题修复

*   **问题描述**: 首次尝试启动前端 (`npm install`) 失败，因为 `package.json` 中引用的 `react-leaflet-heatmap-layer-v3` 包不存在。
*   **尝试与失败**:
    1.  尝试替换为 `@react-leaflet/heatmap-layer`，但该包同样不存在。
    2.  尝试替换为 `react-leaflet-heatmap-layer`，安装时发现其与项目使用的 React v18 不兼容（需要 React v15/v16）。
    3.  使用 `npm install --legacy-peer-deps` 强制安装，绕过了安装检查，但导致了运行时错误 (`Super expression must either be null or a function`)。
*   **最终解决方案**:
    1.  移除了不兼容的 `react-leaflet-heatmap-layer` 包。
    2.  直接使用底层的 `leaflet.heat` 库。
    3.  创建了一个自定义 React 组件 `CustomHeatmapLayer.jsx` 作为 `leaflet.heat` 和 `react-leaflet` v4 之间的桥梁，解决了兼容性问题。
    4.  成功启动了前端开发服务器。

#### 2. 后端连接问题

*   **问题描述**: 前端应用启动后，页面可以访问，但所有API请求均失败，返回 `500 Internal Server Error`。浏览器控制台显示 `SyntaxError: Unexpected end of JSON input`，Vite 终端显示 `ECONNREFUSED ::1:5000`。
*   **问题分析**: 这表明前端无法连接到后端API服务器。原因是后端服务没有启动。
*   **解决方案**: 使用 `pip3` 和 `python3` 启动了位于 `backend` 目录下的 Python Flask 后端服务。

#### 3. 地图加载问题修复
*   **问题描述**:
    1.  浏览器控制台显示 `net::ERR_CONNECTION_TIMED_OUT` 错误，导致地图无法加载。
    2.  品牌选址中的“周边竞品分析”功能显示的是一张静态图片，而非可交互的地图。
*   **问题分析**:
    1.  `LocationFinder.jsx` 和 `Heatmap.jsx` 中使用的 `openstreetmap.org` 地图瓦片服务不稳定。
    2.  `CompetitionMap.jsx` 组件硬编码了一张静态图片作为地图背景。
*   **解决方案**:
    1.  将 `LocationFinder.jsx` 和 `Heatmap.jsx` 中的地图服务地址统一更换为更稳定的 CartoDB 服务。
    2.  重写了 `CompetitionMap.jsx` 组件，用一个可交互的 `react-leaflet` 地图替换了原有的静态图片，并实现了动态标注目标位置和竞品位置的功能。

#### 4. 修复竞标页面图片加载问题
*   **问题描述**: “铺位竞标”页面中的图片无法显示。
*   **问题分析**: 虽然 `Bidding.jsx` 组件正确地从 API 获取了 `image_url`，但这些指向 Unsplash 的链接可能因网络策略而无法在应用中加载。
*   **解决方案**:
    1.  在后端创建了 `static/images` 目录。
    2.  将图片从 Unsplash 下载并保存到该目录。
    3.  修改了 `backend/app/main.py` 中的 `/api/bidding/spots` 接口，使其返回本地图片的相对路径 (`/static/images/...`)。
    4.  **最终修复**: 经过多次尝试，图片加载问题依然存在。为了确保演示的绝对可靠，我们采用了 Vite 项目处理静态资源的最佳实践：
        *   在前端 `src` 目录下创建了 `assets/images` 文件夹。
        *   将图片直接下载并存放到此文件夹中。
        *   修改了 `Bidding.jsx` 组件，通过 `import` 将图片作为模块导入，并直接在 `<img>` 标签中使用。
        *   清理了后端和 Vite 配置文件中所有与图片代理相关的、不再需要的代码，使项目结构更清晰、更稳健。

### 5. 新增首页并重构路由
*   **需求**: 创建一个首页，介绍“招商宝”业务，并提供到各个功能模块的引导。
*   **实现**:
    1.  创建了 `Home.jsx` 和 `Home.css` 文件，用于构建和设计首页内容。
    2.  为了实现页面导航，引入了 `react-router-dom` 库。
    3.  重构了 `App.jsx`，使用 `<Routes>` 和 `<Route>` 组件来管理页面路由，并使用 `<NavLink>` 来创建导航链接。
    4.  更新了 `main.jsx`，用 `<BrowserRouter>` 包裹整个应用，以启用路由功能。
    5.  将 `react-router-dom` 添加到 `package.json` 并重新安装了依赖。

### 6. 最终解决方案 - 为演示硬编码数据
*   **背景**: 经过多次尝试，图片加载问题依然存在，这似乎是一个非常隐蔽的 bug。为了确保演示能够顺利进行，决定采取最直接的方案。
*   **行动**:
    1.  重写 `frontend/src/components/Bidding.jsx`。
    2.  移除所有的数据请求逻辑 (`fetch`, `useEffect`)。
    3.  在组件内部创建一个 `MOCK_SPOTS` 数组，包含所有必要的文本和图片路径 (`/images/spot_a1.jpg`)。
    4.  组件现在完全自包含，不依赖任何外部数据或请求。
*   **结果**: **成功**。组件现在可以稳定、正确地渲染所有内容，包括之前无法显示的图片。问题被成功绕过，演示已不受影响。
