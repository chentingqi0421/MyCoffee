<template>
	<div class="receive">
		<nav-bar title="优惠券" />
		<!-- <bg-box>
			<div class="wrap">
				<img v-show="redShow" @click="receiveCoupon" class="auto-img"
					src="../assets/images/bg_red_envelopes.png" alt="">
			</div>
		</bg-box> -->

		<!-- <van-coupon-cell
		  :coupons="coupons"
		  :chosen-coupon="chosenCoupon"
		  @click="showList = true"
		/> -->

		<!-- <van-swipe-cell>
			<template #left>
				<van-button square type="primary" text="选择" />
			</template>
			<van-cell :border="false" title="单元格" value="内容" />
			<template #right>
				<van-button square type="danger" text="删除" />
				<van-button square type="primary" text="收藏" />
			</template>
		</van-swipe-cell> -->

		<van-coupon-list v-model="code" v-show="!redShow" :coupons="coupons" :disabled-coupons="disabledCoupons"
			:chosen-coupon="chosenCoupon" @change="onChange" @exchange="onExchange" :show-close-button="false"
			:exchange-button-disabled="true" :show-exchange-bar="false" />
	</div>
</template>

<script>
	const coupon = {
		// id: 1,
		condition: '无使用门槛\n最多优惠12元',
		reason: '已使用',
		value: 150,
		name: '优惠券名称',
		startAt: 1489104000,
		endAt: 1514592000,
		valueDesc: '7',
		unitDesc: '折',
		// description: 'dd'
	};

	export default {
		data() {
			return {
				redShow: false,
				chosenCoupon: -1,
				coupons: [coupon, coupon],
				disabledCoupons: [coupon],
				code: ''
			}
		},
		methods: {
			receiveCoupon() {
				this.redShow = false;
			},
			onChange() {

			},
			onExchange() {
				console.log('code')
				console.log(this.code)
			}
		}
	}
</script>

<style lang="less">
	.receive {
		.van-coupon-list {
			top: 44px;

			.van-coupon-list__bottom {
				display: none;
			}

			.van-coupon__corner {
				display: none;
			}
		}

		.wrap {
			min-height: 200px;
			// re
			// img{}
		}
	}
</style>
