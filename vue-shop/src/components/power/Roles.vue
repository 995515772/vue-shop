<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card class="box-card">
			<el-row>
				<el-col><el-button type="primary" @click="addtanchu">添加角色</el-button></el-col>
			</el-row>

			<el-dialog title="添加角色" :visible.sync="addDataListShow" width="70%">
				<el-form :model="addForm" :rules="addrules" ref="addDataListShowRef" label-width="100px" class="demo-ruleForm">
					<el-form-item label="角色名称" prop="roleName"><el-input v-model="addForm.roleName"></el-input></el-form-item>
					<el-form-item label="角色描述" prop="roleDesc"><el-input v-model="addForm.roleDesc"></el-input></el-form-item>
				</el-form>

				<span slot="footer" class="dialog-footer">
					<el-button @click="addquxiao">取 消</el-button>
					<el-button type="primary" @click="addName">确 定</el-button>
				</span>
			</el-dialog>

			<el-dialog title="添加角色" :visible.sync="setDataListShow" width="70%">
				<el-form :model="setForm" :rules="setrules" ref="setDataListShowRef" label-width="100px" class="demo-ruleForm">
					<el-form-item label="角色名称" prop="roleName"><el-input v-model="setForm.roleName"></el-input></el-form-item>
					<el-form-item label="角色描述" prop="roleDesc"><el-input v-model="setForm.roleDesc"></el-input></el-form-item>
				</el-form>

				<span slot="footer" class="dialog-footer">
					<el-button @click="setquxiao">取 消</el-button>
					<el-button type="primary" @click="setName">确 定</el-button>
				</span>
			</el-dialog>

			<el-table :data="roleslist" stripe border>
				<el-table-column type="expand" label="id">
					<template slot-scope="scope">
						<el-row  v-for="(item, index) in scope.row.children" :key="index" style="border-bottom: 1px solid #ccc;" class="vcenter">
							<el-col :span="5">
								<el-tag style="margin: 10px 0;" closable @close="removeId(scope.row,item)">{{ item.authName }}</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<el-col :span="19">
								<el-row  v-for="(item2, index) in item.children" :key="index" class="vcenter">
									<el-col :span="6">
										<el-tag type="success" style="margin: 10px 0;" closable @close="removeId(scope.row,item2)">{{ item2.authName }}</el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>
									<el-col :span="18">
										<el-tag closable @close="removeId(scope.row,item3)" v-for="(item3, index) in item2.children" :key="index" type="warning" style="margin: 5px 0;">
											{{ item3.authName }}
										</el-tag>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column label="角色名称" prop="roleName"></el-table-column>
				<el-table-column label="角色描述" prop="roleDesc"></el-table-column>
				<el-table-column label="操作" width="300">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="settanchu(scope.row.id)">编辑</el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(scope.row.id)">删除</el-button>
						<el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetDialog(scope.row)">分配权限</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		
		
		
		
		<el-dialog title="分配权限" :visible.sync="setshowSetDialog" width="60%" @close="guanbi"  >
			
		  <el-tree :data="rightslist" :props="treeProps" show-checkbox default-expand-all :default-checked-keys="rightskeys" node-key="id" ref="treeRef"></el-tree>
		  
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="setshowSetDialog = false">取 消</el-button>
		    <el-button type="primary" @click="allot">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			roleslist: [],
			addForm: {
				roleName: '',
				roleDesc: ''
			},
			rightskeys:[],
			setshowSetDialog:false,
			addDataListShow: false,
			setDataListShow: false,
			rightslist:[],
			roleid:'',
			treeProps:{
				label:'authName',
				children:'children'
			},
			addrules: {
				roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }, { min: 3, max: 15, message: '用户名的长度在3~15个字符之间', trigger: 'blur' }],
				roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }, { min: 3, max: 15, message: '用户名的长度在3~15个字符之间', trigger: 'blur' }]
			},
			setForm: {
				roleName: '',
				roleDesc: ''
			},
			setFormid: 0,
			setrules: {
				roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }, { min: 3, max: 15, message: '用户名的长度在3~15个字符之间', trigger: 'blur' }],
				roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }, { min: 3, max: 15, message: '用户名的长度在3~15个字符之间', trigger: 'blur' }]
			}
		};
	},
	created() {
		this.getRolesList();
	},
	methods: {
		guanbi(){
			this.rightskeys = []
		},
		async allot(){
			const keys = [
				...this.$refs.treeRef.getCheckedKeys(),
				...this.$refs.treeRef.getHalfCheckedKeys()
			]
			const idstr = keys.join(",")
			const { data: res } = await this.$http.post(`roles/${this.roleid}/rights`,{rids:idstr})
			if(res.meta.status != 200) {
				return this.$message.error("分配权限失败")
			}
			this.$message.success("分配权限成功")
			this.getRolesList();
			this.setshowSetDialog = false
		},
		async showSetDialog(role){
			this.roleid = role.id
			const { data: res } = await this.$http.get("rights/tree")
			if(res.meta.status != 200){
				return this.$message.error("获取权限数据失败")
			}
			this.rightslist = res.data
			this.digui(role,this.rightskeys)
			this.setshowSetDialog = true
		},
		digui(node,arr){
			if(!node.children) {
				return arr.push(node.id)
			}
			node.children.forEach((item) => {
				this.digui(item,arr)
			})
		},
		async removeId(userid,rolid) {
			const ss = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).catch(err => err);
			if(ss == "cancel"){
				return this.$message.info("取消删除")
			}
			const { data: res } = await this.$http.delete(`roles/${userid.id}/rights/${rolid.id}`)
			if(res.meta.status != 200){
				return this.$message.error("删除权限失败")
			}
			userid.children = res.data
			this.$message.success("删除成功")
		},
		async getRolesList() {
			const { data: res } = await this.$http.get('roles');
			if (res.meta.status != 200) {
				this.$message.error('获取角色列表失败');
			}
			this.roleslist = res.data;
		},
		addtanchu() {
			this.addDataListShow = true;
		},
		addquxiao() {
			this.addDataListShow = false;
			this.$refs.addDataListShowRef.resetFields();
		},
		settanchu(id) {
			this.setDataListShow = true;
			this.setFormid = id;
		},
		setquxiao() {
			this.setDataListShow = false;
			this.$refs.setDataListShowRef.resetFields();
		},
		async remove(id) {
			const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).catch(err => err);
			if (confirmResult !== 'confirm') {
				return this.$message.info('已取消删除');
			}
			const { data: res } = await this.$http.delete('roles/' + id);
			if (res.meta.status !== 200) {
				return this.$message.error('删除用户失败！');
			}

			this.$message.success('删除用户成功！');
			this.getRolesList();
		},
		async setName() {
			this.$refs.setDataListShowRef.validate(async valid => {
				if (!valid) return;
				const { data: res } = await this.$http.put('roles/' + this.setFormid, { roleName: this.setForm.roleName, roleDesc: this.setForm.roleDesc });
				if (res.meta.status != 200) {
					return this.$message.error('修改用户失败');
				}
				this.$message.success('修改用户成功');
				this.getRolesList();
				this.setDataListShow = false;
			});
		},
		async addName() {
			this.$refs.addDataListShowRef.validate(async valid => {
				if (!valid) return;
				const { data: res } = await this.$http.post('roles', { roleName: this.addForm.roleName, roleDesc: this.addForm.roleDesc });
				if (res.meta.status != 201) {
					return this.$message.error('添加用户失败');
				}
				this.$message.success('添加用户成功');
				this.getRolesList();
				this.addDataListShow = false;
			});
		}
	}
};
</script>

<style></style>
