<template>
	<div class="home">
		<div class="invitation">
			<img ref="invitation" src="../../assets/images/invitation.png" alt="">
		</div>

		<div :style="{top:wrapTop+'px',height:wrapHeight + 'px'}" class="home-wrap" @touchstart="start"
			@touchmove="move">

			<div class="tips">
				<div class="home-title">{{timeText}}<span v-if="isLogin">, {{userInfo.nickName}}</span> </div>
				<div style="text-align: right;">咖啡会让你脑洞大开哦</div>
			</div>

			<div class="banner" @touchmove.stop="">
				<van-swipe :autoplay="3000" indicator-color="white" @change="swipeChange">
					<van-swipe-item v-for="(item,index) in banner" :key="index" @click="goDetail(item.to)">
						<img :src="item.img" />
					</van-swipe-item>

					<template #indicator>
						<div class="custom-indicator">
							<div class="indicator-item" :class="{active:item.isActive}" v-for="(item,index) in banner"
								:key="index"></div>
						</div>
					</template>
				</van-swipe>
			</div>

			<van-grid :border="false" :column-num="4" icon-size="44">
				<van-grid-item v-for="(item,index) in wealth" :key="index" :icon="item.img" :text="item.title"
					:to="item.to">
				</van-grid-item>
			</van-grid>

			<!-- <div class="toggle-take"></div> -->
			<!-- <div class="wealth-info">
				<div class="wealth-boxs" v-for="(item,index) in wealth" :key="index">
					<div class="box">
						<img :src="item.img" alt />
					</div>
					<div class="box" @click="btn(item.img)">{{item.title}}</div>
				</div>
			</div> -->

			<h3 style="margin: 20px 0 10px 15px;">精品推荐</h3>

			<div class="recommend">
				<van-tabs color="#7186C7" line-height="0" animated duration="0.5">
					<van-tab v-for="(item,index) in recommend" :key="index">
						<template #title>
							<span>{{item.title}}</span>
						</template>
						<div class="container" @click="goDetail(item.to)">
							<img :src="item.img" alt />
						</div>
					</van-tab>
				</van-tabs>
			</div>

		</div>
	</div>
</template>

<script>
	// import '../../assets/js/script.js';
	export default {
		data() {
			return {
				fixedHeight: 80,
				wrapTop: 80,
				wrapHeight: 0,
				startY: 0,
				swipeIndex: 0,
				banner: [],
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
							name: 'Receive'
						}
					},
					{
						title: "送ta咖啡",
						img: require("../../assets/images/gift.png"),
						to: {
							name: 'Menu'
						}
					}, {
						title: "咖啡钱包",
						img: require("../../assets/images/wallet.png"),
						to: {
							name: 'Wallet'
						}
					},
				],
				recommend: [{
						title: "周一",
						img: '',
					},
					{
						title: "周二",
						img: '',
					},
					{
						title: "周三",
						img: '',
					},
					{
						title: "周四",
						img: '',
					},
					{
						title: "周五",
						img: '',
					},
					{
						title: "周六",
						img: '',
					},
					{
						title: "周日",
						img: '',
					},
				],
				navigator: {
					scre: 0,
					innr: 0,
					navi: 0,
					bool: true,
				},
				isLogin: false,
				userInfo: [],
				timeText: '',
			};
		},
		// beforeRouteEnter(to, from, next) {
		// 	next(vm => {
		// 		if (this.$store.state.invitationHeight != 0) {
		// 			this.fixedHeight = this.$store.state.invitationHeight;
		// 			this.wrapHeight = this.$store.state.invitationHeight;
		// 		}
		// 		console.log(this.$store.state.invitationHeight);
		// 	})
		// },
		beforeMount() {
			this.$nextTick(() => {
				// this.wrapTop = this.$refs.invitation.height - 8;
				this.fixedHeight = this.$refs.invitation.height - 8;
				this.wrapHeight = window.innerHeight - 130;
				// this.$store.commit('upInvitationHeight', this.$refs.invitation.height - 8);
				// console.log('mount', this.fixedHeight);
			})
		},
		created() {
			// this.wrapHeight = window.innerHeight - 80 - 50;
			// this.$nextTick(() => {
			// 	this.wrapTop = this.$refs.invitation.height - 8;
			// 	this.fixedHeight = this.wrapTop;
			// })
			this.getTime();
			this.getBanner();
			// this.getHotProducts();
			this.getUserInfo();
			this.getRecommend();
		},
		methods: {
			goDetail(to) {
				this.$router.push(to);
			},
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

					if (result.data.code == 200) {
						if (result.data.result.length > 0) {
							this.isLogin = true;
							this.userInfo = result.data.result[0];
						}
					}

				}).catch(err => {
					this.$store.commit('upLoading', false);
				})
			},
			getBanner() {
				this.axios
					.get("/banner", {
						params: {
							appkey: this.appkey,
						},
					})
					.then((result) => {
						if (result.data.code == 200) {
							result.data.result.map(v => {
								this.banner.push({
									img: v.bannerImg,
									isActive: false,
									to: {
										name: 'Detail',
										query: {
											pid: v.pid
										}
									}
								})
							});
							this.banner[0].isActive = true;
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			getRecommend() {
				this.axios
					.get("/recommend", {
						params: {
							appkey: this.appkey,
						},
					})
					.then((result) => {
						if (result.data.code == 200) {
							result.data.result.map((v, i) => {
								this.recommend[i].img = v.imgUrl;
								this.recommend[i].to = {
									name: 'Detail',
									query: {
										pid: v.pid
									}
								};
							})
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			getHotProducts() {
				this.axios
					.get("/typeProducts", {
						params: {
							appkey: this.appkey,
							key: "isHot",
							value: 1,
						},
					})
					.then((result) => {
						if (result.data.code == 200) {
							result.data.result.map((v, i) => {
								this.recommend[i].img = v.largeImg;
							})
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			swipeChange(index) {
				this.swipeIndex = index;
				this.banner.map((v) => {
					v.isActive = false;
				});
				this.banner[index].isActive = true;
			},
			start(e) {
				this.startY = e.targetTouches[0].pageY;
			},
			move(e) {
				let curY = e.targetTouches[0].pageY;
				if (curY - this.startY > 0) {
					this.wrapTop = this.fixedHeight;
					console.log('this.fixedHeight', this.fixedHeight);
				} else {
					this.wrapTop = 80;
				}
			},
			btn(i) {
				// console.log(i);
			},
		},
	};
</script>

<style lang="less" scoped>
	.home {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: calc(100% - 50px);
		overflow: hidden;

		.van-grid-item__content {
			background-color: @gray-1;
		}

		.invitation {
			img {
				width: 100%;
				display: block;
				min-height: 160px;
			}
		}

		.custom-indicator {
			position: absolute;
			right: 5px;
			bottom: 20px;
			padding: 2px 5px;
			font-size: 12px;
			display: flex;

			.indicator-item {
				width: 10px;
				height: 10px;
				margin: 0 5px;
				// background: transparent;
				background: #d1d1d1;
				border-radius: 50%;

				// border: 1px solid #D1D1D1;
				&.active {
					width: 20px;
					border-radius: 5px;
				}
			}
		}

		.home-wrap {
			position: absolute;
			top: 50px;
			width: 100%;
			min-height: 537px;
			border-radius: 16px;
			background-color: #FFFFFF;
			z-index: 999;
			transition: all 0.8s;
			// overflow-y: auto;

			// /deep/ .van-tabs__line {
			// 	width: 0;
			// 	height: 0;
			// 	border-width: 10px 10px;
			// 	border-style: solid;
			// 	border-color: transparent transparent red;
			// }

			.tips {
				display: flex;
				justify-content: space-between;
				padding: 15px;
				font-weight: bold;
				font-size: 16px;

				.location {
					height: 100px;
					line-height: 100px;
					margin: 0 10px;

					span {
						font-size: 12px;
						font-weight: bold;
					}
				}

				.hello {
					margin: auto 10px;
					font-size: 16px;
					font-weight: bold;

					p:nth-of-type(1) {
						text-align: right;
					}
				}
			}

			.banner {
				padding: 10px;
				// position: relative;

				.van-swipe {
					border-radius: 10px;

					// position: absolute;
					// width: 100%;

					// margin: 10px 15px;
					.van-swipe-item {
						// margin: 10px 15px;
						background-color: @gray-1;

						img {
							width: 100%;
							display: block;
						}
					}
				}
			}

			.toggle-take {
				width: 300px;
				height: 100px;
				margin: 0 auto;
				// background: url(../../assets/images/icon_take.png) no-repeat;
				background-position: 0 0;
				background-size: 100% 100%;
			}

			.wealth-info {
				margin: 10px auto;
				width: 300px;
				display: flex;
				justify-content: space-around;

				.wealth-boxs {
					flex: 1;

					.box {
						// width: 80px;
						height: 30px;
						line-height: 30px;
						text-align: center;
						display: flex;
						justify-content: center;
						align-items: center;
						margin: 20px 0;

						img {
							width: 60px;
							height: 55px;
						}
					}
				}
			}

			.recommend {
				margin: 0 20px 0 20px;

				.van-tab--active {
					span {
						display: block;
						width: 40px;
						height: 40px;
						line-height: 40px;
						text-align: center;
						color: white;
						border-radius: 50%;
						background-color: #7186C7;
					}
				}

				.container {
					img {
						margin-top: 10px;
						width: 100%;
						// height: 140px;
					}
				}
			}
		}
	}
</style>
