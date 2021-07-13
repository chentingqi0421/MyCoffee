<template>
	<div class="index">
		<div>
			<!-- 二级路由 -->
			<!-- include="Home,Menu" Home组件和Menu组件被缓存 -->
			<keep-alive include="Home,Menu">
				<router-view></router-view>
			</keep-alive>
		</div>

		<van-tabbar v-model="tabbarIndex" active-color="#7186C7" :route="true">
			<van-tabbar-item v-for="(item, index) in tabbarData" :key="index" :to="item.url">
				<span>{{item.title}}</span>
				<template #icon="props">
					<img class="tab-img" :src="props.active ? item.icon.active : item.icon.inactive" />
				</template>
			</van-tabbar-item>
		</van-tabbar>
		
	</div>
</template>

<script>
	export default {
		data() {
			return {
				tabbarIndex: 0,
				isLogin: false,
				tabbarData: [{
						title: "首页",
						icon: {
							active: require("../assets/images/home_active.png"),
							inactive: require("../assets/images/home.png"),
						},
						url: {
							name: "Home",
						},
					},
					{
						title: "菜单",
						icon: {
							active: require("../assets/images/menu_active.png"),
							inactive: require("../assets/images/menu.png"),
						},
						url: {
							name: "Menu",
						},
					},
					{
						title: "购物车",
						icon: {
							active: require("../assets/images/cart_active.png"),
							inactive: require("../assets/images/cart.png"),
						},
						url: {
							name: "Cart",
						},
					},
					{
						title: "我的",
						icon: {
							active: require("../assets/images/my_active.png"),
							inactive: require("../assets/images/my.png"),
						},
						url: {
							name: "My",
						},
					},
				],
			};
		},
		created() {},
		methods: {}
	};
</script>

<style lang="less" scoped>
	.index {
		position: absolute;
		width: 100%;
		top: 0;
		bottom: 0;
		overflow-y: auto;
		padding-bottom: 50px;

		.tab-img {
			width: 24px;
			height: 24px;
		}

		.van-tabbar {
			// box-shadow: 0 -8px 12px #ebedf0;
		}

	}
</style>
