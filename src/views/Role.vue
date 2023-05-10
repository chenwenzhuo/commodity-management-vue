<template>
    <el-card class="box-card">
        <div slot="header" class="card-title">
            <el-button type="primary" icon="el-icon-plus" @click="handleAddRole">
                添加角色
            </el-button>
            <el-button type="primary" icon="el-icon-edit-outline"
                       :disabled="authBtnDisabled"
                       :style="{backgroundColor:authBtnDisabled?'#7b7b7b':'#1DA57A'}">
                修改角色权限
            </el-button>
        </div>
        <!--row-class-name回调能获得rowIndex作为参数，在回调中将rowIndex存放到row对象中-->
        <el-table ref="roleTable" :data="roleData" height="680" border style="width: 100%"
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
            <el-table-column prop="create_time" label="创建时间">
            </el-table-column>
            <el-table-column prop="auth_time" label="授权时间">
            </el-table-column>
            <el-table-column prop="auth_name" label="授权人">
            </el-table-column>
        </el-table>
        <el-dialog title="添加角色" :visible="dialogVisible===1">
            <el-form ref="addRoleForm" :model="addRoleForm"
                     :rules="{roleName:[{required:true,message:'角色名称不能为空'}]}">
                <el-form-item prop="roleName" label="角色名称">
                    <el-input placeholder="请输入角色名称" v-model="addRoleForm.roleName"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="hideDialog">取 消</el-button>
                <el-button type="primary" @click="handleAddRole">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
import ajaxMtd from '@/utils/ajax';

export default {
    name: "Role",
    data() {
        return {
            roleData: [],//角色表格数据
            tableRadio: '',//表格被选中行的索引
            dialogVisible: 0,//弹窗是否可见。0-不可见，1-添加角色，2-编辑权限
            addRoleForm: {roleName: ''},//添加角色表单数据
        }
    },
    computed: {
        authBtnDisabled() {//编辑权限按钮是否禁用
            return this.tableRadio === '';
        }
    },
    methods: {
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
            } else {//否则选中点击的行
                this.$refs.roleTable.setCurrentRow(curRow);
                this.tableRadio = curRow.index;
            }
        },
        tableRowClassName({row, rowIndex}) {
            row.index = rowIndex;
        },
        hideDialog() {
            this.dialogVisible = 0;
        },
        handleAddRole() {
            if (this.dialogVisible === 0) {
                this.dialogVisible = 1;
                return;
            }
            this.dialogVisible = 0;
        }
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