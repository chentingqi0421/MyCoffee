<template>
	<div class="order">
		<nav-bar title="我的订单" pathName="My" />
		<div class="order-bg"></div>
		<div class="tab-box">
			<van-tabs class="tabs-box" v-model="tabIndex" color="#7186C7" line-height="2px" title-active-color="#7186C7"
				@change="taggleOrderStatus">
				<van-tab :title="v.title" v-for="(v,i) in tagItemData" :key="i">
					<div v-if="orderDatas.length > 0">
						<div class="tab-item" v-for="(item, index) in orderDatas" :key="index">
							<div class="clearfix tab-item-box">
								<div class="fl no">{{item.orderId}}</div>
								<div class="fr">
									<div class="text" v-if="item.status == 1" @click="ConfirmReceive(item,index)">确认收货
									</div>
									<div class="text-box-tab" v-else>
										<div class="finished">已完成</div>
										<div class="remove" @click="removeOrder(item.orderId, index)">
											<van-icon name="delete" />
										</div>
									</div>
								</div>
							</div>

							<div class="order-box">
								<div>
									<div class="clearfix cell-box" v-for="(value, i) in item.products" :key="i">
										<div class="fl pro-img">
											<img class="auto-img" :src="value.smallImg" alt />
										</div>
										<div class="fl pro-info">
											<div class="text-box">
												<div class="clearfix">
													<div class="fl text-name">{{value.name}}</div>
													<div class="fl text-rule">{{value.rule}}</div>
												</div>
												<div class="text-enname">{{value.enname}}</div>
											</div>
											<div class="price-box">
												<div class="fl price">￥{{value.price}}</div>
												<div class="fr count">x{{value.count}}</div>
											</div>
										</div>
									</div>
								</div>
								<div class="pro-box">
									<div class="pro-boxing">
										<div class="date">{{item.date | formatDate('yyyy-MM-dd hh:mm:ss')}}</div>
										<div class="clearfix">
											<!-- <div class="fl pro-count">共计 {{item.count}} 件商品</div> -->
											<div class="fr pro-total">实付￥0</div>
											<div class="fr pro-total">优惠￥{{item.total}},</div>
											<div class="fr pro-total">总价￥{{item.total}},</div>
										</div>
									</div>
									<div class="left-box left"></div>
									<div class="left-box right"></div>
								</div>
							</div>
						</div>
					</div>
					<div v-else v-show="false">
						<van-empty description="您还没有订单哦">
							<template #image>
								<img src="@/assets/images/order_empty.png" alt="">
							</template>
							<van-button round color="#7186C7" class="bottom-button" @click="goMenu">去喝一杯</van-button>
						</van-empty>
					</div>
				</van-tab>
			</van-tabs>
		</div>
	</div>
</template>

<script>
	import "../assets/less/order.less";
	import {
		utils
	} from "../assets/js/utils.js";

	export default {
		data() {
			return {
				n: "2020-08-13T02:18:50.000Z",
				tabIndex: 0,
				tagItemData: [{
						title: "全部"
					},
					{
						title: "进行中"
					},
					{
						title: "已完成"
					},
				],
				orderDatas: [],
				show: false,
			};
		},

		created() {
			this.getOrderData(0);
		},

		methods: {
			goMenu() {
				this.$router.push({
					name: 'Menu'
				});
			},

			//获取订单数据  绑定change事件(当前激活的标签改变时触发)
			getOrderData(status) {
				//status: 订单状态
				//获取token字符串
				let tokenString = localStorage.getItem("CSTK");
				if (!tokenString) {
					this.show = true;
					return;
				}

				this.$store.commit('upLoading', true);

				this.axios({
						method: "GET",
						url: "/findOrder",
						params: {
							appkey: this.appkey,
							tokenString,
							status,
						},
					})
					.then((result) => {
						this.$store.commit('upLoading', false);
						this.orderDatas = [];
						if (result.data.code == 200) {
							let orderData = {};

							result.data.result.map((v) => {
								if (!orderData[v.oid]) {
									//如果不存在该订单数据，则初始化一个对象
									orderData[v.oid] = {
										orderId: v.oid,
										date: v.createdAt,
										count: v.count,
										total: v.count * v.price,
										products: [v],
										status: v.status,
									};
								} else {
									orderData[v.oid].count += v.count;
									orderData[v.oid].total += v.count * v.price;
									orderData[v.oid].products.push(v);
								}
							});

							for (let key in orderData) {
								this.orderDatas.push(orderData[key]);
							}

							this.orderDatas.sort((a, b) => {
								return new Date(b.date).getTime() - new Date(a.date).getTime();
							});
						}
						this.show = true;
					})
					.catch((err) => {
						this.$store.commit('upLoading', false);
						console.log("err ==> ", err);
					});
			},

			// 切换订单的状态
			taggleOrderStatus(name, title) {
				// name：标识符，title：标题
				this.getOrderData(name);
			},

			//确认收货
			ConfirmReceive(item, index) {
				//item.orderId: 订单号
				//item.status: 订单状态
				//index: 下标
				let tokenString = localStorage.getItem("CSTK");
				if (!tokenString) {
					return;
				}

				let data = utils.queryString({
					appkey: this.appkey,
					tokenString,
					oid: item.orderId
				});

				this.$store.commit('upLoading', true);

				this.axios({
						method: "POST",
						url: "/receive",
						data,
					})
					.then((result) => {
						this.$store.commit('upLoading', false);
						if (result.data.code == 200) {
							this.$toast(result.data.message);
							if (this.tabIndex == 1) {
								//进行中
								this.orderDatas.splice(index, 1);
							} else {
								// item.status = 2;
							}
							this.getOrderData(0);
						}

					})
					.catch((err) => {
						this.$store.commit('upLoading', false);
						console.log("err ==> ", err);
					});
			},
			//删除订单
			removeOrder(oid, index) {
				//获取token字符串
				let tokenString = localStorage.getItem('CSTK');
				if (!tokenString) {
					return;
				}

				//参数序列化
				let data = utils.queryString({
					appkey: this.appkey,
					tokenString,
					oid
				})

				this.$store.commit('upLoading', true);

				this.axios({
					method: 'POST',
					url: '/removeOrder',
					data
				}).then(result => {

					this.$store.commit('upLoading', false);

					if (result.data.code == 200) {
						this.$toast(result.data.message);
						this.orderDatas.splice(index, 1);
					}

				}).catch(err => {
					this.$store.commit('upLoading', false);

				})
			}

		},
	};
</script>
