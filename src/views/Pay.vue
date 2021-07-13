<template>
	<div class="pay">
		<nav-bar title="提交订单" />
		<div class="address-box">
			<div class="address">
				<div class="clearfix" @click="openAddressBox">
					<div class="fl address-title">选择收货地址</div>
					<div class="fl arrow-box">
						<van-icon name="arrow" class="arrow-icon" />
					</div>
				</div>
				<!-- 地址的数据 -->
				<div class="address-content">
					<div class="clearfix">
						<div class="fl name">{{currentAddress.name}}</div>
						<div class="fl phone">{{currentAddress.tel}}</div>
					</div>
					<div class="address-info">{{currentAddress.address}}</div>
				</div>
			</div>
		</div>

		<div class="order-info">
			<div class="order-box">
				<div class="order-title">订单信息</div>
				<div>

					<div class="clearfix cell-box" v-for="(item,index) in payData" :key="index">
						<div class="fl pro-img">
							<img class="auto-img" :src="item.small_img" alt="">
						</div>
						<div class="fl pro-info">
							<div class="text-box">
								<div class="clearfix">
									<div class="fl text-name">{{item.name}}</div>
								</div>
								<div class="text-enname">{{item.enname}}</div>
							</div>
							<div class="rule-box">
								<div class="text-rule">{{item.rule}}</div>
							</div>
							<div class="price-box">
								<div class="fl price">￥{{item.price}}</div>
								<div class="fr count">x{{item.count}}</div>
							</div>
						</div>
					</div>

				</div>
				<div class="pro-box">
					<div class="clearfix pro-boxing">
						<div class="fl pro-count">共计 {{product.count}} 件商品</div>
						<div class="fr pro-total">合计 ￥{{product.total}}</div>
					</div>
					<div class="left-box left"></div>
					<div class="left-box right"></div>
				</div>

			</div>
		</div>

		<div class="pay-btn">
			<van-button round block color="#7186C7" @click="pay">立即结算</van-button>
		</div>

		<van-popup v-model="isOpen" position="bottom" closeable>
			<div class="address-title-box">选择收货地址</div>
			<van-address-list v-model="chosenAddressId" :list="list" default-tag-text="默认" @select="selectAddress"
				@add="newAddress" />
		</van-popup>
	</div>
</template>

<script>
	import '../assets/less/pay.less'
	import {
		utils
	} from '../assets/js/utils'
	export default {
		data() {
			return {
				// 是否显示底部弹出层
				isOpen: false,
				// 和地址数据的id相同就勾选哪个
				chosenAddressId: '',
				//地址列表数据 (底部弹出层的数据)
				list: [],
				//选择地址数据
				currentAddress: {
					name: '',
					tel: '',
					address: ''
				},
				//购物车数据
				payData: [],

				product: {
					count: 0,
					total: 0
				},

				sids: [],

				balance: 0,
			}
		},

		created() {
			this.getBalance();
			//查询地址接口 (设置默认地址)
			this.getReceiveAddress();

			//判断是购物车结算还是立即结算
			if (this.$route.query.sids != undefined) {

				// 提交订单页面接收购物车传来的sid,以-来切割为数组
				this.sids = this.$route.query.sids.split('-');

				//根据传来的sids查询购物车数据
				this.getCartDataBySids();
			} else {
				this.getProductByPid(this.$route.query.pid);
			}
			
		},

		methods: {
			// 是否显示底部弹出层
			openAddressBox() {
				this.isOpen = true;
			},

			//选择地址
			selectAddress(item, index) {
				this.isOpen = false;
				for (let key in this.currentAddress) {
					this.currentAddress[key] = item[key];
				}
			},

			//新增地址
			newAddress() {
				this.$router.push({
					name: 'NewAddress'
				});
			},

			//查询地址接口
			getReceiveAddress() {
				//获取token字符串
				let tokenString = localStorage.getItem('CSTK');
				if (!tokenString) {
					return;
				}

				this.$store.commit('upLoading', true);

				this.axios({
					method: 'GET',
					url: '/findAddress',
					params: {
						appkey: this.appkey,
						tokenString
					}
				}).then(result => {
					this.$store.commit('upLoading', false);
					if (result.data.code == 200) {

						result.data.result.map(v => {
							let address = v.province + v.city + v.county + v.addressDetail;
							this.list.push({
								id: v.aid,
								name: v.name,
								tel: v.tel,
								address,
								isDefault: Boolean(v.isDefault)
							})

							if (Boolean(v.isDefault)) {
								// 和地址数据的id相同就勾选哪个
								this.chosenAddressId = v.aid;
								this.currentAddress.name = v.name;
								this.currentAddress.tel = v.tel;
								this.currentAddress.address = address;
							}

						})
					}

				}).catch(err => {
					this.$store.commit('upLoading', false);
					console.log('err ==> ', err);
				})

			},

			//根据商品pid获取商品数据
			getProductByPid(pid) {
				this.$store.commit('upLoading', true);
				this.axios({
						method: "GET",
						url: "/productDetail",
						//如果get请求，参数需要放在params, 如果是post请求,参数需要放在data
						params: {
							appkey: this.appkey,
							pid,
						},
					})
					.then((result) => {
						this.$store.commit('upLoading', false);
						if (result.data.code == 200) {
							//处理商品描述数据
							this.payData = result.data.result;
							this.payData[0].rule = this.$route.query.rule;
							this.payData[0].count = this.$route.query.count;
							this.product.count = this.$route.query.count;
							this.product.total += this.$route.query.count * this.payData[0].price;
						}
					})
					.catch((err) => {
						this.$store.commit('upLoading', false);
						console.log("err ==> ", err);
					});
			},

			//根据sids查询购物车数据
			getCartDataBySids() {
				//获取token字符串
				let tokenString = localStorage.getItem('CSTK');
				if (!tokenString) {
					return;
				}

				this.$store.commit('upLoading', true);

				this.axios({
					method: 'GET',
					url: '/commitShopcart',
					params: {
						appkey: this.appkey,
						tokenString,
						sids: this.sids
					}
				}).then(result => {
					console.log(result.data)
					this.$store.commit('upLoading', false);
					if (result.data.code == 200) {
						result.data.result.map(v => {
							this.product.count += v.count;
							this.product.total += v.count * v.price;
						})
						this.payData = result.data.result;
					}
				}).catch(err => {
					this.$store.commit('upLoading', false);
					console.log('err ==> ', err);
				})
			},

			//立即结算
			pay() {
				//判断是否选择地址
				if (this.chosenAddressId == '') {
					this.$toast('请选择收货地址');
					return;
				}
				
				if(this.balance < this.product.total){
					this.$dialog.confirm({
					  message: '余额不足，是否前去充值',
					})
					  .then(() => {
					    // on confirm
						this.$router.push({
							name:'Wallet'
						});
					  })
					  .catch(() => {
					    // on cancel
					  });
					return
				}

				//获取token字符串
				let tokenString = localStorage.getItem('CSTK');
				if (!tokenString) {
					return;
				}

				//参数序列化
				let data = utils.queryString({
					appkey: this.appkey,
					tokenString,
					sids: this.sids,
					phone: this.currentAddress.tel,
					address: this.currentAddress.address,
					receiver: this.currentAddress.name,
					pid: this.payData[0].pid,
					count: this.payData[0].count,
					rule: this.payData[0].rule,
					aid: this.chosenAddressId,
					total:this.product.total
				})

				this.$store.commit('upLoading', true);

				this.axios({
					method: 'POST',
					url: '/pay',
					data
				}).then(result => {
					this.$store.commit('upLoading', false);
					this.$toast(result.data.message);
					if (result.data.code == 200) {
						this.$router.push({
							name: 'Order'
						});
					}

				}).catch(err => {
					this.$store.commit('upLoading', false);
					console.log('err ==> ', err);
				})
			},
			getBalance() {
				this.$store.commit('upLoading', true);
				let tokenString = localStorage.getItem("CSTK");
				let params = new URLSearchParams();
				params.append('tokenString', tokenString);
				this.axios({
						method: "POST",
						url: "/findBalance",
						data: params,
					})
					.then((result) => {
						this.balance = result.data.result[0].balance;
						this.$store.commit('upLoading', false);
					})
					.catch((err) => {
						this.$store.commit('upLoading', false);
					});
			},
		}
	}
</script>
