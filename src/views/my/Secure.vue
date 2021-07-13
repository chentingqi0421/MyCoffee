<template>
	<div class="secure">
		<nav-bar title="安全中心" pathName="My" />
		<div class="secure-bg"></div>
		<div class="secure-box">
			<div>
				<van-cell title="修改密码" isLink @click="openPasswordPopup" />
				<van-cell title="注销账号" isLink @click="destroyAccount" />
				<van-cell title="忘记密码" isLink :to="{name:'Forget'}" />
				<van-cell title="退出登录" isLink @click="logout" />
			</div>
		</div>
		<van-popup class="popup-box" closeable v-model="isOpen" position="bottom">
			<div class="popup-item">
				<div class="password-text">修改密码</div>
				<van-form>
					<van-field v-for="(item, index) in passwords" :key="index"
						:type="item.isPassword ? 'password' : 'text'" :label="item.title" placeholder="6-16位密码且以字母开头"
						v-model="item.password" :right-icon="item.isPassword ? 'closed-eye' : 'eye-o'"
						@click-right-icon="viewPassword(item,index)" />
					<div class="login-btn">
						<van-button round block color="#7186C7" native-type="submit" @click="confirmPassword">确认修改
						</van-button>
					</div>
				</van-form>
			</div>
		</van-popup>
	</div>
</template>

<script>
	import "@/assets/less/secure.less";

	import {
		utils
	} from "@/assets/js/utils";

	import {
		validForm
	} from "@/assets/js/validForm";

	export default {
		data() {
			return {
				isOpen: false,
				passwords: {
					old: {
						password: "",
						isPassword: true,
						title: "旧密码",
					},
					new: {
						password: "",
						isPassword: true,
						title: "新密码",
					},
				},
				forgot: {
					name: 'Forgot'
				}
			};
		},
		methods: {
			//查看密码
			viewPassword(item, index) {
				// -键是--{{index}}为old或者换new--值是--{{item}}
				item.isPassword = !item.isPassword;
			},

			logout() {
				this.$dialog
					.confirm({
						title: "退出登录",
						message: "是否确认退出登录！",
						confirmButtonColor: "#7186C7",
					})
					.then(() => {
						//获取token字符串
						let tokenString = localStorage.getItem("CSTK");
						if (!tokenString) {
							this.$router({
								name: "Login"
							});
						}

						//参数序列化
						let data = utils.queryString({
							appkey: this.appkey,
							tokenString,
						});

						this.$store.commit('upLoading', true);

						this.axios({
								method: "POST",
								url: "/logout",
								data,
							})
							.then((result) => {
								this.$store.commit('upLoading', false);
								localStorage.removeItem("CSTK");
								this.$router.push({
									name: 'Login'
								});
							})
							.catch((err) => {
								this.$store.commit('upLoading', false);
								console.log("err ==> ", err);
							});
					})
					.catch(() => {});
			},

			//修改密码
			openPasswordPopup() {
				this.isOpen = true;
			},

			//确认修改密码
			confirmPassword() {
				//获取token字符串
				let tokenString = localStorage.getItem("CSTK");
				if (!tokenString) {
					return this.$router.push({
						name: "Login"
					});
				}

				let o = {
					oldPassword: {
						value: this.passwords.old.password,
						reg: /^[A-Za-z]\w{5,15}$/,
						errorMsg: "旧密码支持字母数字_组合",
					},
					password: {
						value: this.passwords.new.password,
						reg: /^[A-Za-z]\w{5,15}$/,
						errorMsg: "新密码支持字母数字_组合",
					},
				};

				//验证表单
				if (!validForm.valid(o)) {
					//验证不通过
					return;
				}

				//发起修改密码请求
				//验证通过
				this.$store.commit('upLoading', true);

				//参数序列化
				let data = utils.queryString({
					appkey: this.appkey,
					tokenString,
					oldPassword: this.passwords.old.password,
					password: this.passwords.new.password,
				});

				this.axios({
						method: "POST",
						url: "/updatePassword",
						data,
					})
					.then((result) => {
						this.$store.commit('upLoading', false);
						if (result.data.code == 200) {
							localStorage.removeItem("CSTK");
							this.$router.push({
								name: "Login"
							});
						} else {
							this.$notify({
								type: "warning",
								message: result.data.message,
							});
						}
					})
					.catch((err) => {
						this.$store.commit('upLoading', false);
					});
			},

			//注销账号
			destroyAccount() {
				this.$dialog
					.confirm({
						title: "注销账号",
						message: "是否确认注销号，一旦确认无法恢复！",
						confirmButtonColor: "#7186C7",
					})
					.then(() => {
						//获取token字符串
						let tokenString = localStorage.getItem("CSTK");
						if (!tokenString) {
							return this.$router.push({
								name: "Login"
							});
						}

						this.$store.commit('upLoading', true);

						//参数序列化
						let data = utils.queryString({
							appkey: this.appkey,
							tokenString,
						});

						this.axios({
								method: "POST",
								url: "/destroyAccount",
								data,
							})
							.then((result) => {
								this.$store.commit('upLoading', false);
								this.$toast(result.data.message);
								if (result.data.code == 200) {
									localStorage.removeItem("CSTK");
									setTimeout(() => {
										this.$router.push({
											name: "Login"
										});
									}, 600);
								}
							})
							.catch((err) => {
								this.$store.commit('upLoading', false);
							});
					})
					.catch(() => {});
			},
		},
	};
</script>

<style lang="less" scoped>
</style>
