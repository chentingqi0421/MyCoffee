<template>
	<div class="menu">
		<div class="header" :style="{top:availTop}">
			<div class="menu-search">
				<van-search @focus="goSearch" placeholder="请输入商品名称" shape="round" />
			</div>
			<div class="menu-box">
				<div class="menu-list" :style="{width: width + 'rem'}">
					<div :ref="'menu' + index" class="menu-list-item" v-for="(item, index) in typeData" :key="index"
						@click="toggleType(item)">
						<div class="menu-content">
							<div class="img-box">
								<img class="auto-img" :src="item.isActive ? item.activeIcon : item.icon" alt />
							</div>
							<div class="text" :class="{active: item.isActive}">{{item.typeDesc}}</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="menu-product">
			<div class="product-list" :class="{'not-first': index > 0}" v-for="(item, index) in products" :key="index"
				@click="viewProductInfo(item.pid)">
				<div class="pro-box">
					<div class="pro-img">
						<img class="auto-img" :src="item.smallImg" alt />
					</div>
					<div class="pro-info">
						<div class="pro-text fl">
							<div class="ch-name">{{item.name}}</div>
							<div class="en-name">{{item.enname}}</div>
						</div>
						<div class="pro-price fr">￥{{item.price}}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import "../../assets/less/menu.less";
	export default {
		//组件名称
		name: "Menu",

		data() {
			return {
				availTop: 0,
				width: 0,
				typeData: [],
				products: [],
			};
		},

		created() {
			this.availTop = this.$store.state.availTop;
			//获取商品类型数据
			this.getTypeData();
		},

		methods: {
			changeTabs(index) {
				if (this.typeData[index].isActive) {
					return;
				}

				this.isLoading = true;

				for (let i = 0; i < this.typeData.length; i++) {
					if (this.typeData[i].isActive) {
						this.typeData[i].isActive = false;
						break;
					}
				}

				this.typeData[index].isActive = true;
				this.getProductsByType(this.typeData[index]);
			},
			// 进入搜索界面
			goSearch() {
				this.$router.push({
					name: "Search"
				});
			},

			//获取商品类型数据
			getTypeData() {
				this.$store.commit('upLoading', true);

				this.axios({
						method: "GET",
						url: "/type",
						//如果get请求，参数需要放在params, 如果是post请求,参数需要放在data
						params: {
							appkey: this.appkey,
						},
					})
					.then((result) => {
						this.$loading = false;
						this.$store.commit('upLoading', false);
						if (result.data.code == 200) {
							let iconData = [{
									type: "latte",
									icon: require("../../assets/images/latte.png"),
									activeIcon: require("../../assets/images/latte_active.png"),
								},
								{
									type: "coffee",
									icon: require("../../assets/images/coffee.png"),
									activeIcon: require("../../assets/images/coffee_active.png"),
								},
								{
									type: "rena_ice",
									icon: require("../../assets/images/rena_ice.png"),
									activeIcon: require("../../assets/images/rena_ice_active.png"),
								},
							];

							result.data.result.map((v) => {
								for (let i = 0; i < iconData.length; i++) {
									if (v.type == iconData[i].type) {
										v.icon = iconData[i].icon;
										v.activeIcon = iconData[i].activeIcon;
										v.isActive = false;
										break;
									}
								}
							});

							result.data.result.unshift({
								type: "isHot",
								typeDesc: "推荐",
								icon: require("../../assets/images/drink.png"),
								activeIcon: require("../../assets/images/drink_active.png"),
								isActive: true,
							});

							this.typeData = result.data.result;

							//根据商品类型获取商品数据
							this.getProductsByType(this.typeData[0]);

							// this.$nextTick(() => {
							// 	let width = this.$refs.menu0[0].clientWidth;
							// 	this.width = (this.typeData.length * width) / 37.5;
							// });
						}
					})
					.catch((err) => {
						this.$store.commit('upLoading', false);
						console.log("err ==> ", err);
					});
			},

			//切换商品类型
			toggleType(item) {
				if (item.isActive) {
					return;
				}

				this.isLoading = true;

				for (let i = 0; i < this.typeData.length; i++) {
					if (this.typeData[i].isActive) {
						this.typeData[i].isActive = false;
						break;
					}
				}

				item.isActive = true;
				console.log(item);

				//根据商品类型获取商品数据
				this.getProductsByType(item);
			},

			//根据商品类型获取商品数据
			getProductsByType(item) {
				this.products = [];

				//如果存在缓存数据,则在缓存获取商品数据,不发起请求

				let params = {
					key: "type",
					value: item.type,
					appkey: this.appkey,
				};

				if (item.type == "isHot") {
					params.key = "isHot";
					params.value = 1;
				}

				this.$store.commit('upLoading', true);

				this.axios({
						method: "GET",
						url: "/typeProducts",
						//如果get请求，参数需要放在params, 如果是post请求,参数需要放在data
						params,
					})
					.then((result) => {
						this.$store.commit('upLoading', false);
						console.log('result-->',result.data.result)
						if (result.data.code == 200) {
							this.isLoading = false;
							this.products = result.data.result;
						}
					})
					.catch((err) => {
						this.$store.commit('upLoading', false);
						console.log("err ==> ", err);
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
		},
	};
</script>
