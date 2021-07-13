<template>
	<div class="my">
		<div class="my-bg" v-show="isShow">
			<div class="cell-group" :style="{backgroundImage: `url(${userInfo.userBg})`}" v-if="isLogin">
				<div class="my-bg-info">
					<div class="bg-change clearfix">
						<p>
							<van-uploader class="uploader-box" :after-read="upload">更换背景</van-uploader>
						</p>
					</div>
					<div class="my-bg-content">
						<div class="head-img clearfix fl">
							<img :src="userInfo.userImg" alt />
						</div>
						<div class="my-info fl clearfix">
							<div class="nickname">{{userInfo.nickName}}</div>
							<div class="desc">{{userInfo.desc == '' ? '这个家伙很懒，什么都没留下' : userInfo.desc}}</div>
						</div>
					</div>
				</div>
			</div>
			<div class="cell-group empty" :style="{backgroundImage: `url(${userInfo.userBg})`}" v-else>
				<div class="not-login">
					<span @click="goLogin">立即登录</span>
				</div>
			</div>
		</div>

		<div class="my-content">
			<div class="cell-group">
				<van-cell size="large" :title="item.title" @click="goOperation(item.to)" is-link
					v-for="(item, index) in lists" :key="index">
					<template #icon>
						<span class="icon flex iconfont" :class="item.icon"></span>
					</template>
				</van-cell>
			</div>
		</div>

	</div>
</template>

<script>
	import "../../assets/less/my.less";
	import {
		utils
	} from "../../assets/js/utils";
	export default {
		data() {
			return {
				lists: [{
						title: "个人资料",
						to: {
							name: "Account"
						},
						icon: 'icon-profile'
					},
					{
						title: "我的订单",
						to: {
							name: "Order"
						},
						icon: 'icon-order'
					},
					{
						title: "我的收藏",
						to: {
							name: "Like"
						},
						icon: 'icon-shoucang'
					},
					{
						title: "收货地址",
						to: {
							name: "Address"
						},
						icon: 'icon-location'
					},
					{
						title: "安全中心",
						to: {
							name: "Secure"
						},
						icon: 'icon-secure'
					},
				],
				isLogin: false,
				isShow: false,
				userInfo: {
					nickName: '',
					userImg: '',
					userBg: '',
					desc: ''
				},
				maxSize: 1 * 1024 * 1024,
			};
		},
		created() {
			this.getUserInfo();
		},

		methods: {
			goLogin() {
				this.$router.push({
					name: "Login"
				});
			},
			goOperation(to) {
				if (this.isLogin) {
					this.$router.push(to);
				} else {
					this.$toast('请先登录');
				}
			},
			//查询用户信息
			getUserInfo() {
				//获取token字符串
				let tokenString = localStorage.getItem("CSTK");
				if (!tokenString) {
					this.isShow = true;
					return;
				}

				this.isLogin = true;

				this.isShow = true;

				this.$store.commit('upLoading', true);

				this.axios({
						method: "GET",
						url: "/findMy",
						params: {
							appkey: this.appkey,
							tokenString,
						},
					})
					.then((result) => {
						this.$store.commit('upLoading', false);
						if (result.data.code == 200) {
							this.userInfo = result.data.result[0];
						}
					})
					.catch((err) => {
						this.$store.commit('upLoading', false);
						console.log("err ==> ", err);
					});
			},

			//上传背景
			upload(file) {
				//获取token字符串
				let tokenString = localStorage.getItem("CSTK");
				if (!tokenString) {
					return;
				}

				//获取文件类型
				let type = file.file.type.split("/")[1];
				let imgTypes = ["png", "gif", "jpg", "jpeg"];
				if (imgTypes.indexOf(type) === -1) {
					this.$notify({
						message: "图片类型只支持" + imgTypes.join(","),
						color: "#fff",
						background: "#333999",
					});
					return;
				}

				//大小
				if (this.maxSize < file.file.size) {
					this.$notify({
						message: "上传文件大小不能超过" + this.maxSize / 1024 + "KB",
						color: "#fff",
						background: "#333999",
					});
					return;
				}

				//获取base64
				let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/, "");

				//参数序列化
				// let data = utils.queryString({
				//   appkey: this.appkey,
				//   tokenString,
				//   imgType: type,
				//   serverBase64Img: base64,
				// });

				let param = new URLSearchParams();
				param.append('appkey', this.appkey);
				param.append('tokenString', tokenString);
				param.append('imgType', type);
				param.append('serverBase64Img', base64);

				this.$store.commit('upLoading', true);

				this.axios({
						method: "POST",
						url: "/updateUserBg",
						data: param,
					})
					.then((result) => {
						this.$store.commit('upLoading', false);
						if (result.data.code == 200) {
							location.reload();
						}
					})
					.catch((err) => {
						this.$store.commit('upLoading', false);
					});
			},
		},
	};
</script>
