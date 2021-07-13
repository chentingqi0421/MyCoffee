import Vue from 'vue'

import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
import router from './router'

import store from './store'

import navBar from './components/nav-bar/nav-bar.vue'
Vue.component('nav-bar', navBar)

import bgBox from './components/bg-box/bg-box.vue'
Vue.component('bg-box', bgBox)

// 引入全部样式
import 'vant/lib/index.less';

//导入vant框架的组件
import {
	NavBar,
	Form,
	Field,
	Button,
	Popup,
	Tabbar,
	TabbarItem,
	Toast,
	Notify,
	Swipe,
	SwipeItem,
	Search,
	Skeleton,
	GoodsAction,
	GoodsActionIcon,
	GoodsActionButton,
	Stepper,
	SwipeCell,
	Cell,
	Checkbox,
	SubmitBar,
	Empty,
	Icon,
	AddressList,
	AddressEdit,
	Uploader,
	Tab,
	Tabs,
	Dialog,
	Grid,
	GridItem,
	NumberKeyboard,
	CouponCell,
	CouponList,
} from 'vant'

import 'lib-flexible/flexible'

//全局注册
Vue
	.use(NavBar)
	.use(Form)
	.use(Field)
	.use(Button)
	.use(Popup)
	.use(Tabbar)
	.use(TabbarItem)
	.use(Toast)
	.use(Notify)
	.use(Swipe)
	.use(SwipeItem)
	.use(Search)
	.use(Skeleton)
	.use(GoodsAction)
	.use(GoodsActionIcon)
	.use(GoodsActionButton)
	.use(Stepper)
	.use(SwipeCell)
	.use(Cell)
	.use(Checkbox)
	.use(SubmitBar)
	.use(Empty)
	.use(Icon)
	.use(AddressList)
	.use(AddressEdit)
	.use(Uploader)
	.use(Tab)
	.use(Tabs)
	.use(Dialog)
	.use(Grid)
	.use(GridItem)
	.use(NumberKeyboard)
	.use(CouponCell)
	.use(CouponList)

//注册axios, ajax方案，用于请求数据
Vue.use(VueAxios, axios)

//设置请求基础路径
axios.defaults.baseURL = 'http://www.linkk.asia:10002/mobile';

// axios.defaults.baseURL = 'http://127.0.0.1:10002/mobile';

axios.defaults.withCredentials = true;

//设置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

//关闭生产环境提示
Vue.config.productionTip = false

//添加一个Vue的原型属性
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='

//全局注册过滤器, 一般用于格式化数
Vue.filter('formatDate', (value, format) => {
	//value: 需要格式化的数据
	//format: 指定格式 yyyy-MM-dd hh:mm:ss

	// console.log('format ==> ', format);

	let date = new Date(value);

	//获取年份
	let year = date.getFullYear();
	// console.log('year ==> ', year);
	if (/(y+)/.test(format)) {
		//获取匹配组的内容
		let content = RegExp.$1;
		// console.log('content ==> ', content);
		format = format.replace(content, year.toString().slice(4 - content.length));

		// console.log('format ==> ', format);
	}

	let o = {
		M: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		m: date.getMinutes(),
		s: date.getSeconds()
	};

	for (let key in o) {
		//构造动态正则
		let reg = new RegExp(`(${key}+)`);
		// console.log('reg ==> ', reg);
		if (reg.test(format)) {
			//获取匹配组的内容
			let content = RegExp.$1;
			// console.log('content ==> ', content);
			let k = o[key] >= 10 ? o[key] : content.length == 2 ? '0' + o[key] : o[key];
			// console.log('k ==> ', k);
			format = format.replace(content, k);
			// console.log('format ==> ', format);
		}
	}

	return format;
})

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
