<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>订单管理</el-breadcrumb-item>
			<el-breadcrumb-item>订单列表</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card>
			<el-row>
				<el-col :span="8">
					<el-input placeholder="请输入内容"><el-button slot="append" icon="el-icon-search"></el-button></el-input>
				</el-col>
			</el-row>
			<el-row>
				<el-table :data="orderslist" stripe border>
					<el-table-column type="index" label="id"></el-table-column>
					<el-table-column prop="order_number" label="订单编号"></el-table-column>
					<el-table-column prop="order_price" label="订单价格"></el-table-column>
					<el-table-column label="付款方式">
						<template slot-scope="scope">
							<el-tag type="danger" v-if="scope.row.order_pay == '0'">未付款</el-tag>
							<el-tag type="success"  v-if="scope.row.order_pay == '1'">支付宝</el-tag>
							<el-tag type="success"  v-if="scope.row.order_pay == '2'">微信</el-tag>
							<el-tag type="success"  v-if="scope.row.order_pay == '3'">银行卡</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="是否发货">
						<template slot-scope="scope">
							<el-tag type="success" v-if="scope.row.is_send == '是'">已发货</el-tag>
							<el-tag type="danger" v-if="scope.row.is_send == '否'">未发货</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="下单时间">
						<template slot-scope="scope">
							{{ scope.row.create_time | dateFormat }}
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="primary" size="mini" icon="el-icon-edit" @click="setdingdan(scope.row)"></el-button>
							<el-button type="warning" size="mini" icon="el-icon-s-tools" @click="showpageBox"></el-button>
						</template>
					</el-table-column>
				</el-table>

				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="queryInfo.pagenum"
					:page-sizes="[2, 5, 8, 10]"
					:page-size="queryInfo.pagesize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total"
				></el-pagination>
			</el-row>
		</el-card>

		<el-dialog title="物流进度" :visible.sync="papresVisible" width="50%">
			<el-timeline>
				<el-timeline-item v-for="(item, index) in progesdInfo" :key="index" :timestamp="item.time">{{ item.context }}</el-timeline-item>
			</el-timeline>
		</el-dialog>
		
		
		
		
		
		
		<el-dialog title="修改订单" :visible.sync="setVisible" width="50%">
			<el-form :model="setruleForm" :rules="setruleFormrules" ref="setruleFormruleForm">
			  <el-form-item label="是否发货" prop="is_send">
			    <el-input v-model="setruleForm.is_send"></el-input>
			  </el-form-item>
			  <el-form-item label="支付方式" prop="order_pay">
			    <el-input v-model="setruleForm.order_pay"></el-input>
			  </el-form-item>
			  <el-form-item label="订单价格" prop="order_price">
			    <el-input v-model="setruleForm.order_price"></el-input>
			  </el-form-item>
			  <el-form-item label="支付状态" prop="pay_status">
			    <el-input v-model="setruleForm.pay_status"></el-input>
			  </el-form-item>
			  <el-button type="info" @click="setquxian">取消</el-button>
			  <el-button type="primary" @click="setqueding">确定</el-button>
			  </el-form>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			queryInfo: {
				query: '',
				pagenum: 1,
				pagesize: 5
			},
			setruleForm:{},
			setruleFormrules:{
				is_send:[{ required: true, message: '请输入活动名称', trigger: 'blur' }],
				order_pay:[{ required: true, message: '请输入活动名称', trigger: 'blur' }],
				order_price:[{ required: true, message: '请输入活动名称', trigger: 'blur' }],
				pay_status:[{ required: true, message: '请输入活动名称', trigger: 'blur' }]
			},
			total: 0,
			orderslist: [],
			papresVisible: false,
			setVisible: false,
			progesdInfo: []
		};
	},
	created() {
		this.getOrdersList();
	},
	methods: {
		async getOrdersList() {
			const { data: res } = await this.$http.get('orders', { params: this.queryInfo });
			if (res.meta.status != 200) {
				return this.$message.error('获取订单数据失败');
			}
			this.total = res.data.total;
			this.orderslist = res.data.goods;
		},
		handleSizeChange(newSize) {
			this.queryInfo.pagesize = newSize;
			this.getOrdersList();
		},
		handleCurrentChange(newNum) {
			this.queryInfo.pagenum = newNum;
			this.getOrdersList();
		},
		async showpageBox() {
			const { data: res } = await this.$http.get('/kuaidi/1106975712662');
			if (res.meta.status != 200) {
				return this.$message.error('获取物流信息失败');
			}
			this.progesdInfo = res.data;
			this.papresVisible = true;
		},
		async setdingdan(row){
			this.setVisible = true;
			const { data: res } = await this.$http.get(`/orders/${row.order_id}`);
			if (res.meta.status != 200) {
				return this.$message.error('获取物流信息失败');
			}
			this.setruleForm = res.data
			if(this.setruleForm.order_pay == "0"){
				this.setruleForm.order_pay = "未付款"
			}else if(this.setruleForm.order_pay == "1"){
				this.setruleForm.order_pay = "支付宝"
			}else if(this.setruleForm.order_pay == "2"){
				this.setruleForm.order_pay = "微信"
			}else if(this.setruleForm.order_pay == "3"){
				this.setruleForm.order_pay = "银行卡"
			}
		},
		setquxian(){
			this.$message.info("取消修改")
			this.setVisible = false;
		},
		setqueding(){
			this.$refs.setruleFormruleForm.validate(async vali=>{
				if(!vali)return this.$message.error("请填写信息")
				let idsend = null;
				if(this.setruleForm.is_send == "是"){
					idsend = 1
				}else if(this.setruleForm.is_send == "否"){
					idsend = 0
				}
				
				let order_pay = null;
				if(this.setruleForm.order_pay == "未付款"){
					order_pay = 1
				}else if(this.setruleForm.order_pay == "支付宝"){
					order_pay = 2
				}else if(this.setruleForm.order_pay == "微信"){
					order_pay = 3
				}else if(this.setruleForm.order_pay == "银行卡"){
					order_pay = 4
				}
				console.log(this.setruleForm.pay_status)
				const { data: res } = await this.$http.put(`/orders/${this.setruleForm.order_id}`,{is_send:idsend,
				order_pay:order_pay,
				order_price:this.setruleForm.order_price,
				order_number:this.setruleForm.order_number
				});
				if (res.meta.status != 201) {
					return this.$message.error('获取物流信息失败');
				}
				this.setVisible = false;
				this.getOrdersList();
				console.log(this.setruleForm.pay_status)
			})
		}
	}
};
</script>

<style></style>
