<template>
	<div class="login flex">
		<nav-bar title="注 册" />
		<div class="content">
			<div class="logo flex">
				<img class="margin" src="../../assets/images/logo.png" alt="">
			</div>
			<wInput v-model="userInfo.nickName" type="text" placeholder="昵称" :maxlength="10" class="margin"></wInput>
			<wInput v-model="userInfo.phone" type="number" placeholder="手机号" :maxlength="11" class="margin"></wInput>
			<wInput v-model="userInfo.password" type="password" placeholder="密码" :maxlength="16" class="margin" eye></wInput>
			<wInput v-model="userInfo.email" type="email" placeholder="邮箱" class="margin"></wInput>
			<wButton value="注 册" @click="register"></wButton>
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
					nickName: '',
					phone: '',
					password: '',
					email: '',
				}
			}
		},
		methods: {
			//注册
			register() {
				//获取用户注册信息
				let userInfo = this.userInfo;

				//验证注册表单
				let o = {
					phone: {
						value: userInfo.phone,
						reg: /^1[3-9]\d{9}$/,
						errorMsg: '手机号格式不正确'
					},
					nickName: {
						value: userInfo.nickName,
						reg: /^[\w\u4e00-\u9fa5]{1,10}$/,
						errorMsg: '昵称格式不正确'
					},
					password: {
						value: userInfo.password,
						reg: /^[A-Za-z]\w{5,15}$/,
						errorMsg: '请输入以字母开头6-16位密码'
					},
					email: {
						value: userInfo.email,
						reg: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
						errorMsg: '邮箱格式不正确'
					},
				};

				if (!validForm.valid(o)) {
					//验证不通过
					return;
				}

				//发起请求
				//开启加载提示
				this.$store.commit('upLoading', true);

				//序列化参数
				//复制对象
				let info = Object.assign({}, userInfo);
				info.appkey = this.appkey;
				let data = utils.queryString(info);

				this.axios({
					method: 'POST',
					//请求参数
					url: '/register',
					data
				}).then(result => {
					//关闭加载提示
					this.$store.commit('upLoading', false);
					//如果注册成功
					if (result.data.code == 200) {
						//清空注册表单的数据
						for (let key in userInfo) {
							userInfo[key] = '';
						}
						
						this.$router.push({
							name: 'Login'
						});
					} else {
						//如果注册失败,则提示
						this.$notify({
							type: 'warning',
							message: result.data.message
						})
					}
				}).catch(err => {
					this.$store.commit('upLoading', false);
					console.log('出错了 err ==> ', err);
				})
			},
		}
	}
</script>

<style lang="less">
	.login {
		position: fixed;
		width: 100%;
		top: 0;
		bottom: 0;

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
