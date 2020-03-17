<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card class="box-card">
			<el-row style="margin-bottom: 10px;">
				<el-col><el-button type="primary" @click="showCate">添加分类</el-button></el-col>
			</el-row>
			<el-row>
				<el-col>
					<tree-table border :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="id">
						
						<template slot="isok" slot-scope="scope">
							<i class="el-icon-circle-check" v-if="scope.row.cat_deleted == false" style="color: #01FF70;"></i>
							<i class="el-icon-circle-close" v-else></i>
						</template>
						
						
						<template slot="order" slot-scope="scope">
							<el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
							<el-tag type="success" size="mini" v-if="scope.row.cat_level == 1">二级</el-tag>
							<el-tag type="warning" size="mini" v-if="scope.row.cat_level == 2">三级</el-tag>
						</template>
						
						
						<template slot="opg" slot-scope="scope">
							<el-button type="primary" icon="el-icon-edit" size="mini" @click="bianji(scope.row)">编辑</el-button>
							<el-button type="danger" icon="el-icon-delete" size="mini" @click=shanchu(scope.row)>删除</el-button>
						</template>
						
					</tree-table>
					
					
					<el-pagination@size-change="handleSizeChange"   @current-change="handleCurrentChange":current-page="queryInfo.pagenum"
					  :page-sizes="[2, 5, 8, 10]"
					  :page-size="1"
					  layout="total, sizes, prev, pager, next, jumper"
					  :total="total">
					</el-pagination>
					
					
				</el-col>
			</el-row>
		</el-card>
	
		<!-- 添加分类对话框 -->
		<el-dialog title="添加分类" :visible.sync="addcate" width="70%">
			
		  <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
		    <el-form-item label="分类名称:" prop="cat_name">
		      <el-input v-model="addCateForm.cat_name"></el-input>
		    </el-form-item>
			
			<el-form-item label="父级分类:">
				<el-cascader  :clearable="true" :options="paraCateList" :props="cteatsadprops" @change="parengcheng" expand-trigger="hover" v-model="selectKeys"></el-cascader>
			</el-form-item>
			
		  </el-form>
		  
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addqingkong">取 消</el-button>
		    <el-button type="primary" @click="ADDcTASS">确 定</el-button>
		  </span>
		</el-dialog>
		
		<!-- 编辑分类对话框 -->
		<el-dialog title="修改" :visible.sync="setxianshiquxian" width="70%">
		
		<el-form :model="setbianji" :rules="setbianjiRules" ref="setbianjiruleForm" label-width="100px">
		  <el-form-item label="修改名称" prop="cat_name">
		    <el-input v-model="setbianji.cat_name"></el-input>
		  </el-form-item>
		</el-form>
		
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="setquxaokuan">取 消</el-button>
	    <el-button type="primary" @click="setquding">确 定</el-button>
	  </span>
	</el-dialog>
	
	
	
	
	<el-dialog  title="删除" :visible.sync="shanchuxianshi"  width="70%">
		<span>是否删除</span>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="shanchuquxiao">取 消</el-button>
	    <el-button type="primary" @click="shanchuqueding">确 定</el-button>
	  </span>
	</el-dialog>
	

	
	
	</div>
</template>

<script>
export default {
	data() {
		return {
			shanchuForm:{},
			shanchuxianshi:false,
			setxianshiquxian:false,
			bianjiuser:{},
			setbianji:{
				cat_name:''
			},
			addCateForm:{
				cat_pid:0,
				cat_name:'',
				cat_level:0
			},
			selectKeys:[],
			cteatsadprops:{
				value:'cat_id',
				label:'cat_name',
				children:'children'
			},
			setbianjiRules:{
				cat_name:[
					{ required: true, message: '请输入分类名称', trigger: 'blur' }
				]
			},
			addCateFormRules:{
				cat_name:[
					{ required: true, message: '请输入分类名称', trigger: 'blur' }
				]
			},
			queryInfo: {
				type: 3,
				pagenum: 1,
				pagesize: 5
			},
			catelist: [],
			addcate:false,
			total: 0,paraCateList:[],
			columns: [
				{ label: '分类名称', prop: 'cat_name' }, 
				{ label: '是否有效', type: 'template', template: 'isok' },
				{ label: '排序', type: 'template', template: 'order' },
				{ label: '操作', type: 'template', template: 'opg' },
			]
		};
	},
	created() {
		this.getCateList();
	},
	methods: {
		async shanchuqueding(){
			const { data: res } = await this.$http.delete("categories/"+this.shanchuForm.cat_id)
			if (res.meta.status != 200) {
				this.$message.error('删除分类失败');
			}
			this.$message.success('删除分类成功');
			this.getCateList();
			this.shanchuxianshi = false;
		},
		shanchu(a){
			this.shanchuxianshi = true;
			this.shanchuForm = a
		},
		shanchuquxiao(){
			this.shanchuxianshi = false;
		},
		bianji(a){
			this.bianjiuser = a;
			this.setxianshiquxian = true
			this.setbianji.cat_name = this.bianjiuser.cat_name
		},
		setquxaokuan(){
			this.$refs.setbianjiruleForm.resetFields()
			this.setxianshiquxian = false
		},
		setquding(){
			this.$refs.setbianjiruleForm.validate(async vali=>{
				if(!vali) return
				const { data: res } = await this.$http.put("categories/"+this.bianjiuser.cat_id,{cat_name :this.setbianji.cat_name})
				if (res.meta.status != 200) {
					this.$message.error('修改分类失败');
				}
				console.log(res)
				this.$message.success('修改分类成功');
				this.$refs.setbianjiruleForm.resetFields()
				this.setxianshiquxian = false
				this.getCateList();
			})
		},
		addqingkong(){
			this.selectKeys = [];
			this.addCateForm.cat_pid = 0
			this.addCateForm.cat_level = 0
			this.$refs.addCateFormRef.resetFields()
			this.addcate = false
		},
		ADDcTASS(){
			this.$refs.addCateFormRef.validate(async vali=>{
				if(!vali) return
				const { data: res } = await this.$http.post("categories",this.addCateForm)
				if (res.meta.status != 201) {
					this.$message.error('添加分类失败');
				}
				this.$message.success('添加分类成功');
				this.getCateList();
				this.addcate = false
				this.selectKeys = [];
				this.addCateForm.cat_pid = 0
				this.addCateForm.cat_level = 0
				this.$refs.addCateFormRef.resetFields()
			})
		},
		parengcheng(){
			if(this.selectKeys.length > 0){
				this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length-1]
				this.addCateForm.cat_level = this.selectKeys.length
				return 
			}else {
				this.addCateForm.cat_pid = 0
				this.addCateForm.cat_level = 0
			}
		},
		async getCateList() {
			const { data: res } = await this.$http.get('categories', { params: this.queryInfo });
			if (res.meta.status != 200) {
				this.$message.error('获取数据失败');
			}
			this.catelist = res.data.result;
			this.total = res.data.total;
		},
		handleSizeChange(newSize){
			this.queryInfo.pagesize = newSize;
			this.getCateList();
		},
		handleCurrentChange(newNum){
			this.queryInfo.pagenum = newNum;
			this.getCateList();
			
		},
		showCate(){
			this.addcate = true
			this.getparcateList()
		},
		async getparcateList(){
			const { data: res } = await this.$http.get("categories",{params: {type : 2}})
			if (res.meta.status != 200) {
				this.$message.error('获取分级分类失败');
			}
			 this.paraCateList = res.data
		}
	}
};
</script>

<style></style>
