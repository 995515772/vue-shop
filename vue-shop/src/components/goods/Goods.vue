<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card>
			<el-row>
				<el-col :span="8" style="margin-right: 20px;">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList"><el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button></el-input>
				</el-col>
				<el-col :span="4"><el-button type="primary" @click="goodspage">添加商品</el-button></el-col>
			</el-row>
			<el-table :data="goodslist" border stripe>
				<el-table-column type="index" label="id"></el-table-column>
				<el-table-column label="商品名称" prop="goods_name"></el-table-column>
				<el-table-column label="商品价格" prop="goods_price" width="90px"></el-table-column>
				<el-table-column label="商品重量" prop="goods_weight" width="90px"></el-table-column>
				<el-table-column label="商品创建时间" prop="add_time" width="140px">
					<template slot-scope="scope">
						{{ scope.row.add_time | dateFormat }}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="160px">
					<template slot-scope="scope">
						<el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
						<el-button type="danger" size="mini" icon="el-icon-delete" @click="removeByid(scope.row)"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum"
				:page-sizes="[5,10, 15, 20]"
				:page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
			></el-pagination>
		</el-card>
	</div>
</template>

<script>
export default {
	data() {
		return {
			queryInfo: {
				query: '',
				pagenum: 1,
				pagesize: 10
			},
			goodslist: [],
			total: 0
		};
	},
	created() {
		this.getGoodsList();
	},
	methods: {
		async getGoodsList() {
			const { data: res } = await this.$http.get('goods', { params: this.queryInfo });
			if (res.meta.status != 200) {
				return this.$message.error('获取商品列表失败');
			}
			this.goodslist = res.data.goods;
			this.total = res.data.total;
		},
		handleSizeChange(newSize){
			this.queryInfo.pagesize = newSize
			this.getGoodsList();
		},
		handleCurrentChange(newPage){
			this.queryInfo.pagenum = newPage
			this.getGoodsList();
		},
		// 删除操作
		async removeByid(id) {
			const ss = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).catch(err => err);
			if(ss == "cancel"){
				return this.$message.info("取消删除")
			}
			console.log(ss,id.goods_id)
			const {data:res} = await this.$http.delete(`goods/${id.goods_id}`)
			if(res.meta.status != 200){
				return this.$message.error("删除失败")
			}
			this.$message.success("删除成功")
			this.getGoodsList();
		},
		// 添加
		goodspage(){
			this.$router.push("/goods/add")
		}
	}
};
</script>

<style></style>
