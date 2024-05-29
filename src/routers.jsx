import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import App from "./App";
import { useCallback, useEffect } from "react";
import { Get, Post } from "./http";
import { Title, Desc } from "./cfg.json";
import wx from "weixin-js-sdk";
import { Spin } from "antd";

const Routers = () => {
	const location = useLocation();
	const navigate = useNavigate();
	useEffect(() => {
		if (!getUserWxInfo() && location.pathname !== "/login") {
			sessionStorage.setItem("pathname", location.pathname);
			navigate("/login", { replace: true });
		}
	}, [navigate]);
	useEffect(() => {
		Post(`getgzhtoken`, { url: window.location.href }).then((res) => {
			wx.config({
				...res.Data,
				jsApiList: ["checkJsApi", "getLocation", "scanQRCode", "onMenuShareAppMessage"],
			});
			wx.ready(() => {
				wx.onMenuShareAppMessage({
					title: Title,
					desc: Desc,
					link: location.href,
					imgUrl: "https://files.pkucy.com/logo.png",
				});
			});
		});
	}, []);
	return useRoutes([
		{
			path: "/",
			element: <App />,
		},
		{
			path: "/login",
			element: <Login />,
		},
	]);
};
export const setUserWxInfo = (data) => {
	localStorage.setItem("wx", JSON.stringify(data));
};
export const getUserWxInfo = () => {
	try {
		return JSON.parse(localStorage.getItem("wx"));
	} catch (error) {
		navigate("/login", { replace: true });
		return false;
	}
};
const reloadWx = () => {
	const reloadUrl = encodeURIComponent("https://xqnck.pkucy.com/oauth?redirect=" + encodeURIComponent(window.location.origin + window.location.pathname + window.location.search));
	//判断是微信内打开的还是pc端打开的
	const weixinUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6c42e233208a9c52&redirect_uri=${reloadUrl}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
	const pcUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=wxd9afecaeaccc7a0d&redirect_uri=${reloadUrl}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`;
	console.log(window.navigator.userAgent.toLowerCase());
	if (window.navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1) {
		window.location.href = weixinUrl;
	} else {
		window.location.href = pcUrl;
	}
	window.localStorage.setItem("url", reloadUrl);
};
const Login = () => {
	const from = sessionStorage.getItem("pathname") || "/";
	const navigate = useNavigate();
    let pc = window.navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1 ? "" : 1;

	const handleLogin = useCallback(() => {
		const code = new URLSearchParams(window.location.search).get("code");

		if (code && !getUserWxInfo()) {
			const url = localStorage.getItem("url");
			if (url) {
				Get("gettoken/" + code, { pc })
					.then((res) => {
						if (res.Code === 0) {
							setUserWxInfo(res.Data);
							navigate(from, { replace: true });
						}
					})
					.catch(() => {
						reloadWx();
					});
				window.localStorage.removeItem("url");
				return;
			}
			reloadWx();
		} else {
			reloadWx();
		}
	}, [navigate]);
	useEffect(() => {
		handleLogin();
	}, [handleLogin]);
	return <Spin tip="加载中..." />;
};
export default Routers;
