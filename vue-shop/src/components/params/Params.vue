<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>参数列表</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card>
			<el-alert title="警告提示的文案" type="warning" :closable="true" show-icon></el-alert>

			<el-row style="margin: 15px 0;">
				<el-col>
					<span style="margin-right: 15px;">选中商品分类:</span>
					<el-cascader v-model="selectCatekets" :options="catelist" :props="cateProps" @change="handleChange" expand-trigger="hover"></el-cascader>
				</el-col>
			</el-row>

			<el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
				<el-tab-pane label="动态参数" name="many">
					<el-button size="mini" type="primary" :disabled="isbenDaish" @click="addVisiible = true">动态参数</el-button>
					<el-table :data="manyTabData" border stripe>
						<el-table-column type="expand">
							<template slot-scope="scope">
								<el-tag @close="handleClose(index,scope.row)" v-for="(item, index) in scope.row.attr_vals" :key="index" closable style="margin-right: 10px;">{{ item }}</el-tag>

								<el-input style="width: 85px;"
									v-if="scope.row.inputVisible"
									v-model="scope.row.inputValue"
									ref="saveTagInput"
									size="small"
									@keyup.enter.native="handleInputConfirm(scope.row)"
									@blur="handleInputConfirm(scope.row)"
								></el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
							</template>
						</el-table-column>
						<el-table-column type="index" label="id"></el-table-column>
						<el-table-column label="参数名称" prop="attr_name"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button type="primary" icon="el-icon-edit" size="mini" @click="showDialog(scope.row.attr_id)">编辑</el-button>
								<el-button type="danger" icon="el-icon-delete" size="mini" @click="shanchu(scope.row.attr_id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>

				<el-tab-pane label="静态属性" name="only">
					<el-button size="mini" type="primary" :disabled="isbenDaish" @click="addVisiible = true">静态属性</el-button>

					<el-table :data="onlyTabData" border stripe>
						<el-table-column type="expand">
							<template slot-scope="scope">
								<el-tag @close="handleClose(index,scope.row)" v-for="(item, index) in scope.row.attr_vals" :key="index" closable style="margin-right: 10px;">{{ item }}</el-tag>
						
								<el-input style="width: 85px;"
									v-if="scope.row.inputVisible"
									v-model="scope.row.inputValue"
									ref="saveTagInput"
									size="small"
									@keyup.enter.native="handleInputConfirm(scope.row)"
									@blur="handleInputConfirm(scope.row)"
								></el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
							</template>
						</el-table-column>
						<el-table-column type="index" label="id"></el-table-column>
						<el-table-column label="属性名称" prop="attr_name"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button type="primary" icon="el-icon-edit" size="mini" @click="showDialog(scope.row.attr_id)">编辑</el-button>
								<el-button type="danger" icon="el-icon-delete" size="mini" @click="shanchu(scope.row.attr_id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-card>

		<el-dialog :title="'修改' + titletext" :visible.sync="etidVisiible" width="70%" @close="editDaisClose">
			<el-form :model="editForm" :rules="editFormrules" ref="editFormruleForm" label-width="100px">
				<el-form-item :label="titletext" prop="attr_name"><el-input v-model="editForm.attr_name"></el-input></el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="etidVisiible = false">取 消</el-button>
				<el-button type="primary" @click="setqueding">确 定</el-button>
			</span>
		</el-dialog>

		<el-dialog :title="'添加' + titletext" :visible.sync="addVisiible" width="70%" @close="addDaisClose">
			<el-form :model="addForm" :rules="addFormrules" ref="addFormruleForm" label-width="100px">
				<el-form-item :label="titletext" prop="attr_name"><el-input v-model="addForm.attr_name"></el-input></el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="addVisiible = false">取 消</el-button>
				<el-button type="primary" @click="addParamsus">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			catelist: [],
			cateProps: {
				value: 'cat_id',
				label: 'cat_name',
				children: 'children'
			},
			selectCatekets: [],
			activeName: 'many',
			manyTabData: [],
			onlyTabData: [],
			addVisiible: false,
			etidVisiible: false,
			inputVisible: false,
			inputValue:'',
			addForm: {},
			editForm: {
				attr_name: ''
			},
			addFormrules: {
				attr_name: [{ required: true, message: '请输入参数', trigger: 'blur' }]
			},
			editFormrules: {
				attr_name: [{ required: true, message: '请输入参数', trigger: 'blur' }]
			}
		};
	},
	created() {
		this.getCateList();
	},
	methods: {
		handleClose(index,row){
			row.attr_vals.splice(index,1)
			this.saveasug(row)
		},
		handleInputConfirm(row){
			if(row.inputValue.trim().length == 0){
				row.inputVisible = false
				row.inputValue = ""
				return 
			}else{
				row.attr_vals.push(row.inputValue)
				row.inputVisible = false
				this.saveasug(row)
			}
		},
		async saveasug(row){
			const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(" ")})
			if (res.meta.status != 200) {
				this.$message.error('修改参数项失败');
			}
		},
		showInput(row){
			row.inputVisible = true;
			this.$nextTick(_ => {
			  this.$refs.saveTagInput.$refs.input.focus();
			});
		},
		async shanchu(id) {
			const title = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).catch(err => err);
			if (title != 'confirm') {
				return this.$message.info('取消删除');
			}
			const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`);
			if (res.meta.status != 200) {
				this.$message.error('删除失败');
			}
			this.$message.success('删除成功');
			this.getParemsData();
		},
		setqueding() {
			this.$refs.editFormruleForm.validate(async vali => {
				if (!vali) return;
				console.log({ attr_name: this.addForm.attr_name, attr_sel: this.activeName });
				const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
					attr_name: this.editForm.attr_name,
					attr_sel: this.activeName
				});
				console.log(res);
				if (res.meta.status != 200) {
					this.$message.error('修改参数列表失败');
				}
				this.$message.success('修改参数列表成功');
				this.etidVisiible = false;
				this.getParemsData();
			});
		},
		async showDialog(id) {
			this.etidVisiible = true;
			const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, { params: { attr_sel: this.activeName } });
			if (res.meta.status != 200) {
				this.$message.error('修改参数列表失败');
			}
			this.editForm = res.data;
		},
		async getCateList() {
			const { data: res } = await this.$http.get('categories');
			if (res.meta.status != 200) {
				this.$message.error('获取商品分类失败');
			}
			this.catelist = res.data;
		},
		async getParemsData() {
			if (this.selectCatekets.length != 3) {
				this.selectCatekets = [];
				return;
			}
			const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } });
			if (res.meta.status != 200) {
				this.$message.error('获取参数列表失败');
			}
			res.data.forEach(item => {
				item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
				item.inputVisible = false;
				item.inputValue = ""
			});

			if (this.activeName == 'many') {
				this.manyTabData = res.data;
			} else {
				this.onlyTabData = res.data;
			}
		},
		handleChange() {
			this.getParemsData();
			if (this.selectCatekets.length !== 3) {
				this.selectCatekets = [];
				this.manyTabData = [];
				this.onlyTabData = [];
				return
			}
		},
		handleTabClick() {
			this.getParemsData();
		},
		addDaisClose() {
			this.$refs.addFormruleForm.resetFields();
		},
		editDaisClose() {
			this.$refs.editFormruleForm.resetFields();
		},
		addParamsus() {
			this.$refs.addFormruleForm.validate(async vali => {
				if (!vali) return;
				const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName });
				if (res.meta.status != 201) {
					this.$message.error('修改分类失败');
				}
				this.addVisiible = false;
				this.getParemsData();
			});
		}
	},
	computed: {
		isbenDaish() {
			if (this.selectCatekets.length != 3) {
				return true;
			} else {
				return false;
			}
		},
		cateId() {
			if (this.selectCatekets.length == 3) {
				return this.selectCatekets[2];
			} else {
				return this.selectCatekets;
			}
		},
		titletext() {
			if (this.activeName == 'many') {
				return '动态参数';
			} else {
				return '静态属性';
			}
		}
	}
};
</script>

<style></style>
