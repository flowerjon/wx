import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import Routers from "./routers";
import { ConfigProvider, theme, App } from "antd";
import { Title } from "./cfg.json";

document.title = Title;
if (localStorage.getItem("ver") !== "1") {
	window.localStorage.removeItem("wx"); 
	window.localStorage.setItem("ver", 1);
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<ConfigProvider
		theme={{ 
			algorithm: theme.defaultAlgorithm,
		}}>
		<App>
			<HashRouter>
				<Routers />
			</HashRouter>
		</App>
	</ConfigProvider>
);
