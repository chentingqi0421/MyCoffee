<template>
	<div class="cart">
		<van-nav-bar :fixed="true" @click-right="editProduct" :style="{top:availTop}">
			<template #title>
				<span style="color: #7186C7;font-weight: bold;">购物车</span>
			</template>
			<template #right v-if="cartData.length > 0">
				<span style="color: #7186C7;">{{isEdit ? '完成' : '编辑'}}</span>
			</template>
		</van-nav-bar>
		<div v-if="cartData.length > 0">
			<div class="cart-bg"></div>

			<div class="cart-content">
				<van-swipe-cell :disabled="isEdit" v-for="(item, index) in cartData" :key="index">
					<van-cell :border="false">
						<div class="clearfix cell-box">
							<div class="fl check">
								<van-checkbox v-model="item.isCheck" icon-size="24px" checked-color="#7186C7"
									@change="simpleSelect"></van-checkbox>
							</div>
							<div class="fl pro-img" @click="viewProductInfo(item.pid)">
								<img class="auto-img" :src="item.small_img" alt />
							</div>
							<div class="fl pro-info">
								<div class="text-box">
									<div class="clearfix">
										<div class="fl text-name">{{item.name}}</div>
										<div class="fl text-rule">{{item.rule}}</div>
									</div>
									<div class="text-enname">{{item.enname}}</div>
								</div>
								<div class="price-box">
									<div class="fl price">￥{{item.price}}</div>
									<div class="fr">
										<van-stepper v-model="item.count" theme="round" button-size="24" disable-input
											@change="modifyCount(item)" />
									</div>
								</div>
							</div>
						</div>
					</van-cell>

					<template #right>
						<van-button square color="#7186C7" text="删除" @click="removeOnecart(item.sid)" />
					</template>
				</van-swipe-cell>
			</div>

			<div class="submit-bar">
				<van-submit-bar v-show="!isEdit" :price="total" button-text="提交订单" button-color="#7186C7"
					@submit="commit">
					<van-checkbox @click="allSelect" v-model="allCheck" icon-size="24px" checked-color="#7186C7">全选
					</van-checkbox>
				</van-submit-bar>

				<van-submit-bar v-show="isEdit" button-text="删除选择" button-color="#7186C7" @submit="removeMorecart">
					<van-checkbox @click="allSelect" v-model="allCheck" icon-size="24px" checked-color="#7186C7">全选
					</van-checkbox>
				</van-submit-bar>
			</div>
		</div>
		<div v-else v-show="show">
			<van-empty description="您的购物车有点寂寞">
				<template #image>
					<img src="../../assets/images/cart_empty.png" alt="">
				</template>
				<van-button round color="#7186C7" class="bottom-button" @click="goMenu">去喝一杯</van-button>
			</van-empty>
		</div>
	</div>
</template>

<script>
	import "../../assets/less/cart.less";
	import {
		utils
	} from "../../assets/js/utils";
	export default {
		data() {
			return {
				// 是否为编辑状态
				isEdit: false,
				// 是否全选
				allCheck: false,
				// 购物车数据
				cartData: [],
				// 总额金额
				total: 0,
				availTop: 0,
				image: '../../assets/images/empty_cart.png',
				show: false,
			};
		},
		created() {
			this.availTop = this.$store.state.availTop;
			//查询购物车数据
			this.findCart();
		},

		methods: {
			back() {
				this.$router.go(-1);
			},
			//回到菜单
			goMenu() {
				this.$router.push({
					name: "Menu"
				});
			},

			//查看商品详情
			viewProductInfo(pid) {
				this.$router.push({
					name: "Detail",
					query: {
						pid
					}
				});
			},

			//提交订单
			commit() {
				//查找需要购买的商品, sid
				let sids = [];
				this.cartData.map((v) => {
					if (v.isCheck) {
						sids.push(v.sid);
					}
				});

				// 如果商品的sid都没传过去则没有购买的商品
				if (sids.length == 0) {
					this.$toast("请选择购买的商品");
					return;
				}

				// 将数组的值用“-”连接起来
				sids = sids.join("-");

				this.$router.push({
					name: "Pay",
					query: {
						sids
					}
				});

			},

			//编辑商品
			editProduct() {
				this.isEdit = !this.isEdit;
			},

			//查询购物车数据
			findCart() {
				//获取token字符串
				let tokenString = localStorage.getItem("CSTK");
				if (!tokenString) {
					this.show = true;
					return;
				}

				this.axios({
						method: "GET",
						url: "/findAllShopcart",
						params: {
							appkey: this.appkey,
							tokenString,
						},
					})
					.then((result) => {
						if (result.data.code == 200) {
							result.data.result.map((v) => {
								v.isCheck = false;
							});
							this.cartData = result.data.result;
						} else {
							this.$toast(result.data.message);
						}
						this.show = true;
					})
					.catch((err) => {
						console.log("err ==> ", err);
					});
			},

			//全选
			allSelect() {
				this.cartData.map((v) => {
					v.isCheck = this.allCheck;
				});

				this.sum();
			},

			//单选
			simpleSelect() {
				this.sum();

				for (let i = 0; i < this.cartData.length; i++) {
					if (!this.cartData[i].isCheck) {
						this.allCheck = false;
						return;
					}
				}

				this.allCheck = true;
			},

			//修改商品数量
			modifyCount(item) {
				//获取token字符串
				let tokenString = localStorage.getItem("CSTK");
				if (!tokenString) {
					return;
				}

				//参数序列化
				let data = utils.queryString({
					appkey: this.appkey,
					tokenString,
					sid: item.sid,
					count: item.count,
				});

				this.$store.commit('upLoading', true);

				this.axios({
						method: "POST",
						url: "/modifyShopcartCount",
						data,
					})
					.then((result) => {
						this.$store.commit('upLoading', false);
						this.sum();
						if (result.data.code != 200) {
							this.$toast(result.data.message);
						}
					})
					.catch((err) => {
						this.$store.commit('upLoading', false);
						console.log("err ==> ", err);
					});
			},

			//删除购物车数据
			removecart(sids) {
				//sids: sid的集合，类型：array

				//获取token字符串
				let tokenString = localStorage.getItem("CSTK");
				if (!tokenString) {
					return;
				}

				//参数序列化
				let data = utils.queryString({
					appkey: this.appkey,
					tokenString,
					sids: sids,
				});

				this.$store.commit('upLoading', true);

				return this.axios({
					method: "POST",
					url: "/deleteShopcart",
					data,
				});
			},

			//单个删除购物车
			removeOnecart(sid, index) {
				this.removecart([sid])
					.then((result) => {
						this.$store.commit('upLoading', false);
						if (result.data.code == 200) {
							this.cartData.splice(index, 1);
						}
						this.$toast(result.data.message);
						this.sum();
					})
					.catch((err) => {
						this.$store.commit('upLoading', false);
						console.log("err ==> ", err);
					});
			},

			//删除多个购物车
			removeMorecart() {
				//查找选择购物车
				let sids = [];
				this.cartData.map((v) => {
					if (v.isCheck) {
						sids.push(v.sid);
					}
				});

				this.removecart(sids)
					.then((result) => {
						this.$store.commit('upLoading', false);
						if (result.data.code == 200) {
							for (let i = this.cartData.length - 1; i >= 0; i--) {
								if (this.cartData[i].isCheck) {
									this.cartData.splice(i, 1);
								}
							}

							this.sum();
						}

						this.$toast(result.data.message);
					})
					.catch((err) => {
						this.$store.commit('upLoading', false);
						console.log("err ==> ", err);
					});
			},

			//计算总金额
			sum() {
				this.total = 0;
				this.cartData.map((v) => {
					if (v.isCheck) {
						this.total += v.count * v.price;
					}
				});

				this.total *= 100;
			},
		},
	};
</script>
