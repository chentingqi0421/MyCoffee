<template>
	<div class="home">
		<van-nav-bar :fixed="true" :style="{top:availTop}">
			<template #left>
				<div class="home-title">{{timeText}}<span v-if="isLogin">, {{userInfo.nickName}}</span> </div>
			</template>
			<template #right>
				<van-search @focus="goSearch" placeholder="请输入商品名称" shape="round" />
			</template>
		</van-nav-bar>

		<div class="banner-box">
			<van-swipe :autoplay="3000" :show-indicators="false">

				<van-swipe-item v-for="(item, index) in bannerData" :key="index" @click="viewProductInfo(item.pid)">
					<img class="auto-img" :src="item.bannerImg" alt="" />
					<!-- <div class="pro-info-banner one-text">{{item.name}}</div> -->
				</van-swipe-item>

			</van-swipe>
		</div>

		<div class="nav-grid">
			<van-grid :border="false" :column-num="3" icon-size="44" gutter="10px">
				<van-grid-item v-for="(item,index) in wealth" :key="index" :icon="item.img" :text="item.title"
					:to="item.to">
				</van-grid-item>
			</van-grid>
		</div>

		<div class="hot-product">
			<div class="hot-product-title">热门推荐</div>
			<div class="product-box clearfix">

				<div class="product-item fl" :class="[index % 2 == 0 ? 'p-left' : 'p-right']"
					v-for="(item, index) in hotProducts" :key="index">
					<div class="p-img" @click="viewProductInfo(item.pid)">
						<img class="auto-img" :src="item.smallImg" alt="">
					</div>
					<div class="pro-name one-text">{{item.name}}</div>
					<div class="clearfix">
						<!-- <div class="en-pro-name one-text fl">heitangbobo</div> -->
						<div class="pro-price fl">￥{{item.price}}</div>
					</div>
				</div>

			</div>
		</div>
		<Loading v-if="false"></Loading>
	</div>
</template>

<script>
	import '../../assets/less/home.less'
	import Loading from '../../components/loading/loading.vue'
	import {
		Search
	} from 'vant';

	export default {
		name: 'Home',
		components: {
			Loading
		},
		data() {
			return {
				availTop: 0,
				timeText: '',
				bannerData: [],
				hotProducts: [],
				isLogin: false,
				userInfo: {},
				wealth: [{
						title: "立即下单",
						img: require("../../assets/images/glass.png"),
						to: {
							name: 'Menu'
						}
					},
					{
						title: "优惠券",
						img: require("../../assets/images/coupon.png"),
						to: {
							name: 'Menu'
						}
					},
					// {
					// 	title: "送ta咖啡",
					// 	img: require("../../assets/images/gift.png"),
					// 	to: {
					// 		name: 'Menu'
					// 	}
					// }, 
					{
						title: "咖啡钱包",
						img: require("../../assets/images/wallet.png"),
						to: {
							name: 'Wallet'
						}
					},
				],
			};
		},

		created() {
			this.availTop = this.$store.state.availTop;
			this.getTime();
			this.getbannerData();
			this.getHotProducts();
			this.getUserInfo();
		},

		methods: {
			//获取时间段
			getTime() {
				let hours = new Date().getHours();
				if (hours >= 6 && hours < 12) {
					this.timeText = '早上好';
				} else if (hours >= 12 && hours < 18) {
					this.timeText = '下午好';
				} else if (hours >= 18 && hours < 24) {
					this.timeText = '晚上好';
				} else {
					this.timeText = '深夜好';
				}
			},

			// 进入搜索界面
			goSearch() {
				this.$router.push({
					name: "Search"
				});
			},

			//获取banner
			getbannerData() {
				this.$store.commit('upLoading', true);

				this.axios({
					method: 'GET',
					url: '/banner',
					//如果get请求，参数需要放在params, 如果是post请求,参数需要放在data
					params: {
						appkey: this.appkey
					}
				}).then(result => {
					this.$store.commit('upLoading', false);
					if (result.data.code == 300) {
						this.bannerData = result.data.result;
					}
				}).catch(err => {
					this.$store.commit('upLoading', false);
					console.log('err ==> ', err);
				})
			},

			//获取推荐商品数据
			getHotProducts() {
				this.$store.commit('upLoading', true);
				this.axios({
					method: 'GET',
					url: '/typeProducts',
					//如果get请求，参数需要放在params, 如果是post请求,参数需要放在data
					params: {
						appkey: this.appkey,
						key: 'isHot',
						value: 1
					}
				}).then(result => {
					this.$store.commit('upLoading', false);
					if (result.data.code == 500) {
						this.hotProducts = result.data.result;
					}
				}).catch(err => {
					this.$store.commit('upLoading', false);
					console.log('err ==> ', err);
				})
			},

			//查看商品详情
			viewProductInfo(pid) {
				this.$router.push({
					name: 'Detail',
					query: {
						pid
					}
				});
			},

			// this.$router.push({
			// 	path:'路由路径',
			// 	name:'路由名字',
			// 	query:{},
			// 	params:{}
			// })

			//获取用户信息
			getUserInfo() {
				//获取token字符串
				let tokenString = localStorage.getItem('CSTK');
				if (!tokenString) {
					return;
				}

				this.$store.commit('upLoading', true);

				this.axios({
					method: 'GET',
					url: '/findMy',
					params: {
						appkey: this.appkey,
						tokenString
					}
				}).then(result => {
					this.$store.commit('upLoading', false);

					if (result.data.code == 'A001') {

						if (result.data.result.length > 0) {
							this.isLogin = true;
							this.userInfo = result.data.result[0];

						}

					}

				}).catch(err => {
					this.$store.commit('upLoading', false);
				})
			}

		}
	}
</script>
