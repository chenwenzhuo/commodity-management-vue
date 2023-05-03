<template>
  <el-card class="box-card">
    <div slot="header" class="card-title">
      <span>一级分类列表</span>
      <el-button type="primary" icon="el-icon-plus">
        添加分类
      </el-button>
    </div>
    <el-table
        :data="categoryData"
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
          <el-button>查看子分类</el-button>
          <el-button>删除分类</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改分类名称" :visible="dialogVisible===1" width="30%">
      <el-form ref="modifyCateForm" :model="modCateForm" :rules="modCateFormRules">
        <el-form-item prop="cateName" label="分类名称">
          <el-input v-model="modCateForm.newCateName" auto-complete="off" style="width: 300px"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=0">取 消</el-button>
        <el-button type="primary" @click="modifyCateName">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import ajaxMtd from '@/utils/ajax';

export default {
  name: "Category",
  data() {
    const validateNewCateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('分类名称不能为空'));
      } else {
        callback();
      }
    };
    return {
      parentCateId: '0',//当前展示的分类的父分类id，默认展示一级分类，父分类id为0
      categoryData: [],//表格数据
      dialogVisible: 0,//弹窗是否可见。0-不可见
      targetCateId: '',//待修改/删除的分类id
      modCateForm: {newCateName: ''},
      modCateFormRules: {cateName: [{validator: validateNewCateName, trigger: 'blur'}]}
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
      this.categoryData = response.data;
    },
    handleModifyCateName(row) {
      this.targetCateId = row._id;
      this.dialogVisible = 1;
    },
    modifyCateName() {
      console.log('------------this.$refs', this.$refs.modifyCateForm.validate)
      this.$refs.modifyCateForm.validate(async valid => {
        if (!valid) {
          return;
        }
        const response = await ajaxMtd('/manage/category/update', {
          categoryId: this.targetCateId,
          categoryName: this.modCateForm.newCateName
        }, 'POST');
        if (response.status !== 0) {
          this.$message.error('修改分类名称出错！');
          return;
        }
        this.reqCategories();//修改成功，重新查询数据
        this.dialogVisible = 0;
        this.targetCateId = '';
        this.modCateForm = {newCateName: ''};
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
}
</style>
