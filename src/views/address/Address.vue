<template>
	<div class="my-address">
		<nav-bar title="地址管理" pathName="My" />
		<van-address-list v-model="chosenAddressId" :list="list" default-tag-text="默认" @add="newAddress"
			@edit="editAddress">
			<van-empty description="您还没有地址信息" v-if="list == ''">
				<template #image>
					<img src="@/assets/images/address_empty.png" alt="">
				</template>
			</van-empty>
		</van-address-list>
	</div>
</template>

<script>
	import '@/assets/less/address.less'

	export default {
		data() {
			return {
				//选择地址的id
				chosenAddressId: '',

				//地址列表数据
				list: [],
			};
		},

		created() {
			//查询收货地址
			this.getReceiveAddress()
		},

		methods: {
			//查询收货地址
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
							if (v.province == v.city) {
								var address = v.city + v.county + v.addressDetail;
							} else {
								var address = v.province + v.city + v.county + v.addressDetail;
							}
							this.list.push({
								id: v.aid,
								name: v.name,
								tel: v.tel,
								address,
								isDefault: Boolean(v.isDefault)
							})
						})
					}
				}).catch(err => {
					this.$store.commit('upLoading', false);
					console.log('err ==> ', err);
				})

			},

			//新增地址
			newAddress() {
				this.$router.push({
					name: 'NewAddress'
				});
			},

			//编辑地址
			editAddress(item) {
				this.$router.push({
					name: 'NewAddress',
					query: {
						aid: item.id
					}
				});
			}
		}
	}
</script>
