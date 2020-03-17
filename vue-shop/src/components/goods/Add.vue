<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>添加商品</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片区域 -->
		<el-card>
			<el-alert title="添加商品" type="info" center show-icon></el-alert>

			<!-- 进度条 -->
			<el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
				<el-step title="基本信息"></el-step>
				<el-step title="商品参数"></el-step>
				<el-step title="商品属性"></el-step>
				<el-step title="商品图片"></el-step>
				<el-step title="商品内容"></el-step>
				<el-step title="完成"></el-step>
			</el-steps>

			<!-- tab栏区域 -->
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
				<el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabeave" @tab-click="tabClickd">
					<el-tab-pane label="基本信息" name="0">
						<el-form-item label="商品名称" prop="goods_name"><el-input v-model="addForm.goods_name"></el-input></el-form-item>
						<el-form-item label="商品价格" prop="goods_price"><el-input v-model="addForm.goods_price" type="number"></el-input></el-form-item>
						<el-form-item label="商品重量" prop="goods_weight"><el-input v-model="addForm.goods_weight"></el-input></el-form-item>
						<el-form-item label="商品数量" prop="goods_number"><el-input v-model="addForm.goods_number" type="number"></el-input></el-form-item>
						<el-form-item label="商品分类" prop="goods_cat">
							<el-cascader expand-trigger="hover" v-model="addForm.goods_cat" :options="catelist" @change="handleChange" :props="cateProps"></el-cascader>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品参数" name="1">
						<el-form-item :label="item.attr_name" v-for="(item, index) in manyTabData" :key="index">
							<el-checkbox-group v-model="item.attr_vals"><el-checkbox :label="k" v-for="(k, i) in item.attr_vals" :key="i" border></el-checkbox></el-checkbox-group>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品属性" name="2">
						<el-form-item v-for="(item, index) in onlyTabData" :key="index" :label="item.attr_name"><el-input v-model="item.attr_vals"></el-input></el-form-item>
					</el-tab-pane>

					<el-tab-pane label="商品图片" name="3">
						<el-upload :on-success="handleSuccess" :headers="headObj" :action="uploadUrl" :on-preview="handlepreview" :on-remove="handleRrmove" list-type="picture">
							<el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
					</el-tab-pane>

					<el-tab-pane label="商品内容" name="4">
						<quill-editor v-model="addForm.goods_introduce"></quill-editor>
						<el-button type="primary" style="margin-top: 15px;" @click="add">添加商品</el-button>
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</el-card>
		
		
		
		<el-dialog title="图片预览" width="50%" :visible.sync="previewVisible">
			<img :src="previewPath">
		</el-dialog>
		
		
	</div>
</template>

<script>
	import _ from 'lodash'
export default {
	data() {
		return {
			activeIndex: '0',
			addForm: {
				goods_name: '',
				goods_price: 0,
				goods_weight: '',
				goods_number: 0,
				goods_cat: [],
				pics:[],
				goods_introduce:'',
				attrs:[]
			},
			addFormRules: {
				goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
				goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
				goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
				goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
				goods_cat: [{ required: true, message: '请输入商品数量', trigger: 'blur' }]
			},
			catelist: [],
			cateProps: {
				label: 'cat_name',
				value: 'cat_id',
				children: 'children'
			},
			manyTabData: [],
			onlyTabData: [],
			uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
			headObj:{
				Authorization:window.sessionStorage.getItem("token")
			},
			previewPath:'',
			previewVisible:false
		};
	},
	created() {
		this.getCateList();
	},
	methods: {
		//获取所有商品分类数据
		async getCateList() {
			const { data: res } = await this.$http.get('categories');
			if (res.meta.status != 200) {
				return this.$message.error('获取商品分类数据失败');
			}
			this.catelist = res.data;
		},
		// 级联选择器触发函数
		handleChange() {
			if (this.addForm.goods_cat.length != 3) {
				this.addForm.goods_cat = [];
			}
		},
		// 即将离开的标签页
		beforeTabeave(action, odtion) {
			if ((odtion = '0' && this.addForm.goods_cat.length != 3)) {
				this.$message.error('请填写信息');
				return false;
			}
		},
		async tabClickd() {
			if (this.activeIndex == '1') {
				const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } });
				if (res.meta.status != 200) {
					return this.$message.error('获取动态参数失败');
				}
				res.data.forEach(item => {
					item.attr_vals = item.attr_vals == 0 ? [] : item.attr_vals.split(' ');
				});
				this.manyTabData = res.data;
				console.log(this.manyTabData);
			} else if (this.activeIndex == '2') {
				const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } });
				if (res.meta.status != 200) {
					return this.$message.error('获取静态参数失败');
				}
				this.onlyTabData = res.data;
			}
		},
		handlepreview(file) {
			this.previewPath = file.response.data.url
			this.previewVisible = true
		},
		handleRrmove(file) {
			const filePath = file.response.data.tmp_path;
			const i = this.addForm.pics.findIndex(x => 
				x.pic == filePath
			)
			this.addForm.pics.splice(i,1)
		},
		handleSuccess(res){
			const picInof = {
				pic:res.data.tmp_path
			}
			this.addForm.pics.push(picInof)
		},
		async add(){
			this.$refs.addFormRef.validate(vali => {
				if(!vali) return this.$message.error("请填写商品信息")
			})
			const form = _.cloneDeep(this .addForm)
			form.goods_cat = form .goods_cat.join(",")
			this.manyTabData.forEach((item) => {
				const newInfo = {
					attr_id:item.attr_id,
attr_value:item.attr_value.join(" ")
				}
				this.addForm.attrs.push(newInfo)
			})
			this.onlyTabData.forEach((item) => {
				const newInfo = {
					attr_id:item.attr_id,
					attr_value:item.attr_value
				}
				this.addForm.attrs.push(newInfo)
			})
			form.attrs = this.addForm.attrs
			const { data: res } = await this.$http.post("goods",form)
			if (res.meta.status != 201) {
				return this.$message.error('添加商品失败');
			}
			this.$message.success('添加商品成功');
			this.$router.push("/goods")
		}
	},
	computed: {
		// 计算id
		cateId() {
			if (this.addForm.goods_cat.length == 3) {
				return this.addForm.goods_cat[2];
			} else {
				return null;
			}
		}
	}
};
</script>

<style scoped="scoped">
.el-steps {
	margin: 10px 0;
}
.el-dialog__body {
	width: 100%;
	height: 100%;
}
.el-dialog__body img {
	width: 100%;
	height: 100%;
}
.quill-editor {
	height: 260px;
	margin-bottom: 70px;
}
</style>
