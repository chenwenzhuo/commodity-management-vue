<template>
    <el-card class="box-card">
        <div slot="header" class="card-title">
            <el-button type="primary" icon="el-icon-plus" @click="handleAddRole">
                添加角色
            </el-button>
            <el-button type="primary" icon="el-icon-edit-outline"
                       :disabled="authBtnDisabled"
                       :style="{backgroundColor:authBtnDisabled?'#7b7b7b':'#1DA57A'}"
                       @click="handleUpdateRole">
                修改角色权限
            </el-button>
        </div>
        <!--row-class-name回调能获得rowIndex作为参数，在回调中将rowIndex存放到row对象中-->
        <el-table ref="roleTable" :data="roleData" border style="width: 100%"
                  highlight-current-row @row-click="handleRowClick"
                  :row-class-name="tableRowClassName">
            <el-table-column label="" width="45">
                <template v-slot="scope">
                    <el-radio :label="scope.$index" v-model="tableRadio">
                        <span></span><!--el-radio内容区域绑定一个空标签，否则label值会显示在radio按钮后，不美观-->
                    </el-radio>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="角色名称">
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间"
                             :formatter="(row)=>{return formatTime(row.create_time)}">
            </el-table-column>
            <el-table-column prop="auth_time" label="授权时间"
                             :formatter="(row)=>{return formatTime(row.auth_time)}">
            </el-table-column>
            <el-table-column prop="auth_name" label="授权人">
            </el-table-column>
        </el-table>
        <el-dialog title="添加角色" :visible="dialogVisible===1" width="40%">
            <el-form ref="addRoleForm" :model="addRoleForm"
                     :rules="{roleName:[{required:true,message:'角色名称不能为空'}]}">
                <el-form-item prop="roleName" label="角色名称">
                    <el-col :span="20">
                        <el-input placeholder="请输入角色名称" v-model="addRoleForm.roleName"/>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="hideDialog">取 消</el-button>
                <el-button type="primary" @click="handleAddRole">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="权限编辑" :visible="dialogVisible===2" width="40%">
            <el-form ref="modAuthForm">
                <el-form-item prop="roleName" label="角色名称">
                    <el-col :span="20">
                        <el-input disabled :value="selectedRow?selectedRow.name:''"/>
                    </el-col>
                </el-form-item>
                <el-form-item prop="menus" label="角色权限">
                    <el-col :span="20">
                        <el-tree show-checkbox default-expand-all check-on-click-node
                                 ref="authTree" :data="treeData" :props="treeProps" node-key="key"
                                 :expand-on-click-node="false">
                        </el-tree>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="hideDialog">取 消</el-button>
                <el-button type="primary" @click="handleUpdateRole">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
import {nextTick} from "vue";
import {mapState} from "vuex";

import ajaxMtd from '@/utils/ajax';
import {formatTime} from "@/utils/tools";

export default {
    name: "Role",
    data() {
        return {
            roleData: [],//角色表格数据
            tableRadio: '',//表格被选中行的索引
            selectedRow: null,//表格被选中行的数据
            dialogVisible: 0,//弹窗是否可见。0-不可见，1-添加角色，2-编辑权限
            addRoleForm: {roleName: ''},//添加角色表单数据
            modAuthForm: {roleName: '', menus: []},//编辑角色权限表单数据
            treeData: [//树形控件数据
                {label: "首页", key: '/home'},
                {
                    label: "商品", key: '/cate_prod', children: [
                        {label: "品类管理", key: '/category'},
                        {label: "商品管理", key: '/product'},
                    ]
                },
                {label: "用户管理", key: '/user'},
                {label: "角色管理", key: '/role'}
            ],
            treeProps: {children: 'children', label: 'label'}
        }
    },
    computed: {
        ...mapState(['logged_usr']),
        authBtnDisabled() {//编辑权限按钮是否禁用
            return this.tableRadio === '';
        }
    },
    methods: {
        formatTime,
        async reqRoles() {
            const response = await ajaxMtd('/manage/role/list');
            if (response.status === 0) {
                this.roleData = response.data;
            } else {
                this.$message.error('获取角色信息出错');
            }
        },
        handleRowClick(curRow) {
            console.log('----------------curRow', curRow);
            //若当前有一行被选中，且此次点击的是选中的行，则取消选中
            if (this.tableRadio !== '' && this.tableRadio === curRow.index) {
                this.$refs.roleTable.setCurrentRow();
                this.tableRadio = '';
                this.selectedRow = null;
            } else {//否则选中点击的行
                this.$refs.roleTable.setCurrentRow(curRow);
                this.tableRadio = curRow.index;
                this.selectedRow = curRow;
            }
        },
        tableRowClassName({row, rowIndex}) {
            row.index = rowIndex;
        },
        hideDialog() {
            this.dialogVisible = 0;
        },
        handleAddRole() {
            //dialogVisible为0，表示弹窗未打开，赋值为1打开弹窗
            if (this.dialogVisible === 0) {
                this.dialogVisible = 1;
                return;
            }
            //弹窗打开状态下，验证表单，发送请求
            this.$refs.addRoleForm.validate(async valid => {
                if (!valid)
                    return;
                const response = await ajaxMtd('/manage/role/add',
                    {roleName: this.addRoleForm.roleName}, 'POST');
                if (response.status === 0) {
                    this.reqRoles();//重新请求数据
                    this.$message.success('添加角色成功');
                    this.dialogVisible = 0;//关闭弹窗
                    this.$refs.addRoleForm.resetFields();//清空表单
                } else {
                    this.$message.error(response.msg);
                }
            });
        },
        async handleUpdateRole() {
            if (this.dialogVisible === 0) {
                this.dialogVisible = 2;//打开弹窗
                //修改dialogVisible后需要更新组件，通过nextTick在界面更新后再调用setCheckedKeys
                nextTick(() => this.$refs.authTree.setCheckedKeys(this.selectedRow.menus));
                return;
            }
            console.log('---------------tree checked keys', this.$refs.authTree.getCheckedKeys(true));
            const response = await ajaxMtd('/manage/role/update', {
                _id: this.selectedRow._id,
                menus: this.$refs.authTree.getCheckedKeys(true),
                auth_name: this.logged_usr.username
            }, 'POST');
            if (response.status === 0) {
                this.reqRoles();//重新请求角色数据
                this.dialogVisible = 0;
                this.$message.success('修改角色权限成功');
            } else {
                this.$message.error(response.msg);
            }
        },
    },
    mounted() {
        this.reqRoles();//组件挂载时获取角色信息
    }
}
</script>

<style scoped lang="less">
.box-card {
  height: 100%;
  overflow: scroll;

  .card-title {
    display: flex;
    justify-content: flex-end;

    .el-button {
      background-color: #1DA57A;
    }
  }
}
</style>