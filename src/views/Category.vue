<template>
  <el-card class="box-card">
    <div slot="header" class="card-title">
      <span v-if="parentCateId==='0'">一级分类列表</span>
      <div v-else>
        <button class="op-btn cust-table-title" @click="backToMainList">一级分类列表</button>
        <i class="el-icon-right"></i>
        <span class="cust-table-title">{{ parentCateName }}</span>
      </div>
      <el-button type="primary" icon="el-icon-plus" @click="handleAddCate">
        添加分类
      </el-button>
    </div>
    <el-table
        :data="parentCateId==='0'?categoryData:subCategoryData"
        height="680"
        border
        style="width: 100%">
      <el-table-column
          prop="name"
          label="分类名称"
          width="640">
      </el-table-column>
      <el-table-column
          prop="address"
          label="操作">
        <template v-slot="scope">
          <el-button @click="handleModifyCateName(scope.row)">修改分类名称</el-button>
          <!--仅当展示一级分类时，显示查看子分类按钮-->
          <el-button v-if="parentCateId==='0'" @click="handleViewSubCate(scope.row)">查看子分类</el-button>
          <el-button @click="handleDeleteCate(scope.row)">删除分类</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改分类名称" :visible="dialogVisible===1" width="30%">
      <el-form ref="modifyCateForm" :model="modCateForm" :rules="modCateFormRules">
        <el-form-item prop="newCateName" label="分类名称">
          <el-input v-model="modCateForm.newCateName" auto-complete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=0">取 消</el-button>
        <el-button type="primary" @click="modifyCateName">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加分类" :visible="dialogVisible===2" width="30%">
      <el-form ref="addCateForm" :model="addCateForm" :rules="addCateFormRules">
        <el-form-item prop="parentId" label="所属分类">
          <el-select v-model="addCateForm.parentId" placeholder="请选择" style="width: 320px">
            <el-option key="0" label="一级分类" value="0">
            </el-option>
            <el-option v-for="item in categoryData" :key="item._id"
                       :label="item.name" :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="categoryName" label="分类名称">
          <el-input v-model="addCateForm.categoryName" auto-complete="off" style="width: 320px"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=0">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import ajaxMtd from '@/utils/ajax';

export default {
  name: "Category",
  data() {
    return {
      parentCateId: '0',//当前展示的分类的父分类id，默认展示一级分类，父分类id为0
      parentCateName: '',//当前展示的分类的父分类名称
      categoryData: [],//一级分类表格数据
      subCategoryData: [],//二级分类表格数据
      dialogVisible: 0,//弹窗是否可见。0-不可见
      targetCategory: null,//待修改/删除的分类信息
      modCateForm: {newCateName: ''},
      modCateFormRules: {newCateName: [{required: true, message: '请输入分类名称', trigger: 'blur'}]},
      addCateForm: {parentId: '', categoryName: ''},
      addCateFormRules: {
        parentId: [{required: true, message: '请选择所属分类', trigger: 'blur'}],
        categoryName: [{required: true, message: '请输入分类名称', trigger: 'blur'}]
      }
    }
  },
  methods: {
    async reqCategories() {
      //查询分类列表
      const response = await ajaxMtd('/manage/category/list', {parentId: this.parentCateId});
      if (response.status !== 0) {//获取分类失败
        this.$message.error('获取商品分类信息失败');
        return;
      }
      //获取分类成功，更新数据
      if (this.parentCateId === '0') {
        this.categoryData = response.data;
      } else {
        this.subCategoryData = response.data;
      }
    },
    handleModifyCateName(row) {
      this.targetCategory = row;
      this.dialogVisible = 1;
    },
    modifyCateName() {
      this.$refs.modifyCateForm.validate(async valid => {
        if (!valid) {
          return;
        }
        const response = await ajaxMtd('/manage/category/update', {
          categoryId: this.targetCategory._id,
          categoryName: this.modCateForm.newCateName
        }, 'POST');
        if (response.status !== 0) {
          this.$message.error('修改分类名称出错！');
          return;
        }
        this.reqCategories();//修改成功，重新查询数据
        this.dialogVisible = 0;
        this.targetCategory = null;
        this.modCateForm = {newCateName: ''};
      })
    },
    handleDeleteCate(row) {
      this.targetCategory = row;//保存待删除的分类id
      this.$confirm('确认删除当前分类？', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(async () => {
        //点击确认的回调
        const response = await ajaxMtd('/manage/category/delete', {
          categoryId: this.targetCategory._id
        }, 'POST');
        if (response.status === 0) {
          this.$message.success('删除分类成功！');
          this.targetCategory = null;
          this.reqCategories();//删除成功后重新查询数据
        } else {
          this.$message.error('删除分类失败，请稍后重试！');
        }
      }).catch(() => {
        //点击取消的回调
        this.targetCategory = null;
      });
    },
    handleViewSubCate(row) {
      this.targetCategory = row;
      this.parentCateId = row._id;
      this.parentCateName = row.name;
      //查询子分类数据
      this.reqCategories();
    },
    backToMainList() {
      this.parentCateId = '0';
      this.parentCateName = '';
      this.reqCategories();
    },
    handleAddCate() {
      this.dialogVisible = 2;
    },
    addCate() {
      this.$refs.addCateForm.validate(async valid => {
        if (!valid) {
          return;
        }
        const response = await ajaxMtd('/manage/category/add', {
          parentId: this.addCateForm.parentId,
          categoryName: this.addCateForm.categoryName
        }, 'POST');
        if (response.status === 0) {
          this.$message.success('添加分类成功');
          this.reqCategories();
          this.dialogVisible = 0;
        } else {
          this.$message.error('添加分类失败');
        }
      })
    }
  },
  mounted() {
    //组件挂载时发送请求查询分类数据
    this.reqCategories();
  }
}
</script>

<style scoped lang="less">
.box-card {
  height: 100%;
  overflow: scroll;

  .card-title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .el-button {
      background-color: #3d986e;
      border-color: #3d986e;
    }
  }

  .el-table {
    .el-button {
      margin: 0 18px;
      padding: 0;
      border: 0;
      background-color: rgba(255, 255, 255, 0);
      color: #1DA57A;
      cursor: pointer;
    }
  }

  .cust-table-title {
    font-size: 18px;
    margin: 0;
  }
}
</style>
