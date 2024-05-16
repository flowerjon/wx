import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import Routers from "./routers";
import { ConfigProvider, theme } from "antd";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<ConfigProvider
		theme={{
			// 1. 单独使用暗色算法
			algorithm: theme.defaultAlgorithm,

			// 2. 组合使用暗色算法与紧凑算法
			// algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
		}}>
		<HashRouter>
			<Routers />
		</HashRouter>
	</ConfigProvider>
);
