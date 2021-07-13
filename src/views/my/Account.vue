<template>
	<div class="account">
		<!-- <nav-bar title="个人资料" /> -->
		<van-nav-bar left-text="返回" title="个人资料" left-arrow :fixed="true" @click-left="back" :style="{top:availTop}">
		</van-nav-bar>

		<bg-box>
			<van-cell title="头像">
				<div class="avatar fr">
					<img class="auto-img" :src="userInfo.userImg" alt="">
					<van-uploader class="uploader-box" :after-read="uploadUserImg" />
				</div>
			</van-cell>
			<van-cell title="昵称">
				<div class="fr">
					<input class="nickname" type="text" v-model="userInfo.nickName" />
				</div>
			</van-cell>
			<van-cell title="手机号">
				<div class="fr">{{userInfo.phone}}</div>
			</van-cell>
			<van-cell title="邮箱">
				<div class="fr">{{userInfo.email}}</div>
			</van-cell>
			<div class="desc-box">
				<div class="desc-title">个性签名</div>
				<div>
					<textarea v-model="userInfo.desc" class="text-area" placeholder="这家伙很懒，什么都没有留下"></textarea>
				</div>
			</div>
		</bg-box>

	</div>
</template>

<script>
	import '@/assets/less/account.less'

	import {
		utils
	} from '@/assets/js/utils'

	export default {

		data() {
			return {
				userInfo: {},
				maxSize: 1 * 1024 * 1024,
				availTop: 0,
			};
		},

		created() {
			this.getUserInfo();
			this.availTop = this.$store.state.availTop;
		},

		methods: {
			back() {
				this.modifyUserInfo('nickName', '/updateNickName');
				this.modifyUserInfo('desc', '/updateDesc');
				this.$router.go(-1);
			},
			//获取个人资料
			getUserInfo() {
				//获取token字符串
				let tokenString = localStorage.getItem('CSTK');
				if (!tokenString) {
					return;
				}

				this.$store.commit('upLoading', true);

				this.axios({
					method: 'GET',
					url: '/findAccountInfo',
					params: {
						appkey: this.appkey,
						tokenString
					}
				}).then(result => {
					this.$store.commit('upLoading', false);
					if (result.data.code == 200) {
						this.userInfo = result.data.result[0];

					}

				}).catch(err => {
					this.$store.commit('upLoading', false);
					console.log('err ==> ', err);
				})
			},

			//上传头像
			uploadUserImg(file) {
				//获取token字符串
				let tokenString = localStorage.getItem('CSTK');
				if (!tokenString) {
					return;
				}

				//获取文件类型
				let type = file.file.type.split('/')[1];
				let imgTypes = ['png', 'gif', 'jpg', 'jpeg'];
				if (imgTypes.indexOf(type) === -1) {
					this.$notify({
						message: '图片类型只支持' + imgTypes.join(','),
						color: '#fff',
						background: '#7186C7',
					});

					return
				}

				//大小
				if (this.maxSize < file.file.size) {
					this.$notify({
						message: '上传文件大小不能超过' + this.maxSize / 1024 + 'KB',
						color: '#fff',
						background: '#7186C7',
					});
					return;
				}

				//获取base64
				let base64 = file.content;
				let param = new URLSearchParams();
				param.append('appkey', this.appkey);
				param.append('tokenString', tokenString);
				param.append('imgType', type);
				param.append('serverBase64Img', base64);

				this.$store.commit('upLoading', true);

				this.axios({
					method: 'POST',
					url: '/updateAvatar',
					data: param
				}).then(result => {
					this.$store.commit('upLoading', false);
					if (result.data.code == 200) {
						this.userInfo.userImg = result.data.userImg;
						location.reload();
					}
				}).catch(err => {
					this.$store.commit('upLoading', false);
					console.log('err ==> ', err);
				})
			},

			//修改用户信息
			modifyUserInfo(key, url) {
				//获取token字符串
				let tokenString = localStorage.getItem('CSTK');
				if (!tokenString) {
					return;
				}

				//参数序列化
				let data = utils.queryString({
					appkey: this.appkey,
					tokenString,
					[key]: this.userInfo[key]
				})

				this.$store.commit('upLoading', true);

				this.axios({
					method: 'POST',
					url,
					data
				}).then(result => {
					this.$store.commit('upLoading', false);
					// this.$toast(result.data.message);

				}).catch(err => {
					this.$store.commit('upLoading', false);
					console.log('err ==> ', err);
				})
			}

		}
	}
</script>
