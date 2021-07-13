<template>
	<div class="like">
		<nav-bar title="我的收藏" pathName="My" />
		<bg-box>
			<div class="product-box clearfix" v-if="likeData.length > 0">
				<div class="product-item fl" :class="[index % 2 == 0 ? 'p-left' : 'p-right']"
					v-for="(item, index) in likeData" :key="index">
					<div class="p-img" @click="viewProductInfo(item.pid)">
						<img class="auto-img" :src="item.smallImg" alt />
					</div>
					<div class="pro-name one-text">{{item.name}}</div>
					<div class="clearfix">
						<div class="pro-price fl">￥{{item.price}}</div>
						<div class="pro-remove fr" @click="removeLike(item.pid, index)">
							<van-icon name="like" color="#7186C7" />
						</div>
					</div>
				</div>
			</div>
			<div v-else>
				<van-empty description="您还没有收藏商品哦">
					<template #image>
						<img src="@/assets/images/like_empty.png" alt="">
					</template>
					<van-button round color="#7186C7" class="bottom-button" @click="goMenu">去逛一逛</van-button>
				</van-empty>
			</div>
		</bg-box>
	</div>
</template>

<script>
	import "../assets/less/like.less";

	import {
		utils
	} from '../assets/js/utils'

	export default {
		data() {
			return {
				//我的收藏商品数据
				likeData: [],
			};
		},

		created() {
			this.getAllLikeData();
		},

		methods: {
			goMenu() {
				this.$router.push({
					name: 'Menu'
				});
			},
			//获取我的收藏商品数据
			getAllLikeData() {
				//获取token字符串
				let tokenString = localStorage.getItem("CSTK");
				if (!tokenString) {
					return this.$router.push({
						name: "Login"
					});
				}

				this.$store.commit('upLoading', true);

				this.axios({
						method: "GET",
						url: "/findAllLike",
						params: {
							appkey: this.appkey,
							tokenString,
						},
					})
					.then((result) => {
						this.$store.commit('upLoading', false);
						if (result.data.code == 200) {
							this.likeData = result.data.result;
						}
					})
					.catch((err) => {
						this.$store.commit('upLoading', false);
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

			//删除收藏商品数据
			removeLike(pid, index) {
				//pid: 商品id
				//index: 下标

				//获取token字符串
				let tokenString = localStorage.getItem('CSTK');
				if (!tokenString) {
					return this.$router.push({
						name: 'Login'
					});
				}

				let data = utils.queryString({
					appkey: this.appkey,
					tokenString,
					pid
				})

				this.$store.commit('upLoading', true);

				this.axios({
					method: 'POST',
					url: '/notlike',
					data
				}).then(result => {
					this.$store.commit('upLoading', false);

					if (result.data.code == 200) {
						return this.$router.push({
							name: 'Login'
						});
					}

					if (result.data.code == 200) {
						this.likeData.splice(index, 1);
						this.$toast('删除收藏商品成功');

					} else {
						this.$toast('删除收藏商品失败');
					}

				}).catch(err => {
					this.$store.commit('upLoading', false);

				})
			}
		}
	};
</script>

<style lang="less" scoped>
</style>
