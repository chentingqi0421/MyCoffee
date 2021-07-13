<template>
	<div class="login flex">
		<nav-bar title="找回密码" />
		<div class="content" v-show="show">
			<div class="logo flex">
				<!-- <img src="../../assets/images/logo2.png" alt=""> -->
			</div>
			<wInput v-model="userInfo.phone" type="number" placeholder="手机号" :maxlength="3" class="margin"></wInput>
			<div>
				<wButton value="确 定" @click="verify"></wButton>
			</div>
		</div>
		<div class="content" v-show="!show">
			<div class="logo flex">
				<!-- <img src="../../assets/images/logo2.png" alt=""> -->
			</div>
			<div style="font-size: 14px;text-align:center;margin: 30px 0;">
				向邮箱{{userInfo.email}}发送验证码
			</div>
			<wInput v-model="userInfo.password" type="password" placeholder="密码" :maxlength="16" eye class="margin">
			</wInput>
			<wInput v-model="validCode" type="number" placeholder="验证码" :maxlength="6" vaild class="margin"
				@click="sendVaildCode"></wInput>
			<div>
				<wButton value="找回密码" @click="forget"></wButton>
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
					email: ''
				},
				show: true,
				validCode: '',
			}
		},
		methods: {
			//验证手机号
			verify() {
				let userInfo = this.userInfo;
				let o = {
					phone: {
						value: userInfo.phone,
						reg: /^1[3-9]\d{9}$/,
						errorMsg: '手机号格式不正确'
					},
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
					url: '/checkPhone',
					data
				}).then(result => {
					this.$store.commit('upLoading', false);
					if (result.data.code == 200) {
						this.userInfo.email = result.data.result[0].email;
						this.show = false;
					} else {
						this.$notify({
							type: 'warning',
							message: result.data.message
						})
						this.userInfo.phone = '';
					}
				}).catch(err => {
					this.$store.commit('upLoading', false);
					console.log('err ==> ', err);
				})
			},
			//发送验证码
			sendVaildCode() {
				//获取用户注册信息
				let userInfo = this.userInfo;

				//序列化参数
				let params = new URLSearchParams();
				params.append('email', userInfo.email);

				//发起请求
				this.axios({
					method: 'POST',
					url: '/emailValidCode',
					data: params
				}).then(result => {
					this.$store.commit('upSessionID', result.data.sessionID);
				}).catch(err => {
					console.log(err);
				})
			},
			//找回密码
			forget() {
				//获取用户注册信息
				let userInfo = this.userInfo;

				//验证注册表单
				let o = {
					password: {
						value: userInfo.password,
						reg: /^[A-Za-z]\w{5,15}$/,
						errorMsg: '请输入以字母开头6-16位密码'
					}
				};

				if (!validForm.valid(o)) {
					//验证不通过
					return;
				}

				//开启加载提示
				this.$store.commit('upLoading', true);

				//序列化参数
				let params = new URLSearchParams();
				params.append('sessionID', this.$store.state.sessionID);
				params.append('validCode', this.validCode);
				params.append('phone', userInfo.phone);
				params.append('password', userInfo.password);

				//发起请求
				this.axios({
					method: 'POST',
					url: '/retrievePassword',
					data: params
				}).then(result => {
					this.$store.commit('upLoading', false);
					if (result.data.code == 200) {
						this.$router.push({
							name: 'Login'
						});
						localStorage.setItem('CSTK', '');
					} else {
						this.$notify({
							type: 'warning',
							message: result.data.message
						})
					}
				}).catch(err => {
					this.$store.commit('upLoading', false);
					console.log(err);
				})

			},
		}
	}
</script>

<style lang="less">
	.login {
		position: fixed;
		width: 100%;
		top: 40px;
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
					width: 80px;
					height: 80px;
				}
			}

			.margin {
				margin: 20px 0;
			}
		}
	}
</style>
