<template>
	<div class="login flex">
		<nav-bar title="登 录" pathName="Home" />
		<div class="content">
			<div class="logo flex">
				<img src="../../assets/images/logo.png" alt="">
			</div>
			<wInput v-model="userInfo.phone" type="number" placeholder="手机号" :maxlength="11" class="margin"></wInput>
			<wInput v-model="userInfo.password" type="password" placeholder="密码" :maxlength="16" class="margin">
			</wInput>
			<div>
				<wButton value="登 录" @click="login"></wButton>
			</div>
			<div class="flex margin" style="font-size: 14px;">
				<span @click="goForget">找回密码</span>
				<span style="font-weight: bolder;margin: 0 10px;">|</span>
				<span @click="goRegister">注册账号</span>
			</div>
		</div>
	</div>
</template>

<script>
	import wInput from '../../components/watch-login/input.vue';
	import wButton from '../../components/watch-login/button.vue';

	import {
		validForm
	} from '../../assets/js/validForm'

	import {
		utils
	} from '../../assets/js/utils'

	export default {
		components: {
			wInput,
			wButton
		},
		data() {
			return {
				userInfo: {
					phone: '',
					password: '',
				}
			}
		},
		methods: {
			goHome() {
				this.$router.push({
					name: 'Home'
				});
			},
			goRegister() {
				this.$router.push({
					name: 'Register'
				})
				// let param = new URLSearchParams();
				// param.append('appkey', this.appkey);
				// param.append('tokenString', tokenString);
				// param.append('imgType', type);
				// param.append('serverBase64Img', base64);

			},
			goForget() {
				this.$router.push({
					name: 'Forget'
				})
			},
			//登录
			login() {
				let userInfo = this.userInfo;
				let o = {
					phone: {
						value: userInfo.phone,
						reg: /^1[3-9]\d{9}$/,
						errorMsg: '手机号格式不正确'
					},
					password: {
						value: userInfo.password,
						reg: /^[A-Za-z]\w{5,15}$/,
						errorMsg: '请输入以字母开头6-16位密码'
					}
				};

				//验证表单
				if (!validForm.valid(o)) {
					return;
				}

				//验证通过
				this.$store.commit('upLoading', true);

				//复制userInfo
				let info = Object.assign({}, userInfo);
				info.appkey = this.appkey;

				//参数序列化
				let data = utils.queryString(info);

				this.axios({
					method: 'POST',
					url: '/login',
					data
				}).then(result => {
					this.$store.commit('upLoading', false);
					if (result.data.code == 200) {
						localStorage.setItem('CSTK', result.data.token);
						this.$router.push({
							name: 'My'
						});
					} else {
						this.$notify({
							type: 'warning',
							message: result.data.message
						})
						this.userInfo.password = '';
					}
				}).catch(err => {
					this.$store.commit('upLoading', false);
					console.log('err ==> ', err);
				})
			}
		}
	}
</script>

<style lang="less">
	.login {
		position: fixed;
		width: 100%;
		top: 0;
		bottom: 0;

		.header-title {
			color: #7186C7;
			font-weight: bold;
		}

		.content {
			flex: 1;
			margin: 0 30px;

			.logo {
				img {
					// width: 80px;
					// height: 80px;
				}
			}

			.margin {
				margin: 20px 0;
			}
		}
	}
</style>
