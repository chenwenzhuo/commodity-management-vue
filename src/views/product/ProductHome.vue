<template>
    <el-card class="box-card">
        <div slot="header" class="card-title">
            <div class="search-prod">
                <el-select v-model="searchMtd">
                    <el-option value="prodName" label="按名称搜索">按名称搜索</el-option>
                    <el-option value="prodDesc" label="按描述搜索">按描述搜索</el-option>
                </el-select>
                <el-input v-model="searchKey" placeholder="请输入关键字"/>
                <el-button type="primary" @click="handleSearchClick">搜索</el-button>
            </div>
            <el-button type="primary" icon="el-icon-plus">添加商品</el-button>
        </div>
        <el-table :data="productData" border style="width: 100%"
                  :header-cell-style="{'text-align':'center'}">
            <el-table-column prop="name" label="商品名称" min-width="20%">
            </el-table-column>
            <el-table-column prop="desc" label="商品描述" min-width="40%">
            </el-table-column>

            <el-table-column label="价格" min-width="10%" align="center">
                <template v-slot="scope">¥{{ scope.row.price }}</template>
            </el-table-column>

            <el-table-column label="状态" min-width="10%" align="center">
                <template v-slot="scope">
                    {{ scope.row.status === 1 ? "在售" : "已下架" }}
                </template>
            </el-table-column>

            <el-table-column label="操作" min-width="20%" align="center">
                <template v-slot="scope">
                    <el-button @click="handleDetailClick(scope.row)">详情</el-button>
                    <el-button>修改</el-button>
                    <el-button @click="handleUpdateStatus(scope.row)">
                        {{ scope.row.status === 1 ? "下架" : "上架" }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination hide-on-single-page :current-page="pageNum" :page-size="pageSize"
                       layout="prev, pager, next, sizes" :total="totalProducts"
                       :page-sizes="[5,10,20]" style="float: right"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange">
        </el-pagination>
    </el-card>
</template>

<script>
import ajaxMtd from '@/utils/ajax';

export default {
    name: "ProductHome",
    data() {
        return {
            searchMtd: 'prodName',//搜索商品的方式
            searchKey: '',//搜索商品的关键词
            pageNum: 1,
            pageSize: 5,
            totalProducts: 0,//商品总数
            productData: [],//商品数据
        }
    },
    methods: {
        async reqProducts() {
            const response = await ajaxMtd('/manage/product/list', {
                pageNum: this.pageNum, pageSize: this.pageSize
            });
            if (response.status === 0) {
                this.productData = response.data.list;
                this.totalProducts = response.data.total;
            } else {
                this.$message.error('查询商品信息出错');
            }
        },
        async searchProducts() {
            const response = await ajaxMtd('/manage/product/search', {
                pageNum: this.pageNum, pageSize: this.pageSize,
                searchType: this.searchMtd,
                productName: this.searchKey, productDesc: this.searchKey
            });
            if (response.status !== 0) {//查询出错，弹窗提示
                this.$message.error(response.msg());
                return;
            }
            //查询成功，更新数据
            this.productData = response.data.list;
            this.totalProducts = response.data.total;
        },
        handleSearchClick() {
            this.pageNum = 1;//每次搜索，都将当前页码设为1
            if (!this.searchKey) {//未输入关键词时，查询全部商品信息
                this.reqProducts();
                return;
            }
            this.searchProducts();//搜索商品信息
        },
        handleSizeChange(value) {
            this.pageSize = value;
            //有搜索关键词，则搜索商品，否则直接查询
            if (this.searchKey) {
                this.searchProducts();
            } else {
                this.reqProducts();
            }
        },
        handleCurrentChange(value) {
            this.pageNum = value;
            //有搜索关键词，则搜索商品，否则直接查询
            if (this.searchKey) {
                this.searchProducts();
            } else {
                this.reqProducts();
            }
        },
        handleDetailClick(row) {
            this.$router.push({
                path: '/product/detail',
                query: row
            });
        },
        async handleUpdateStatus(row) {
            const response = await ajaxMtd('/manage/product/updateStatus', {
                productId: row._id,
                status: (row.status === 1 ? 2 : 1)
            }, 'POST');
            if (response.status === 0) {
                this.$message.success(`${row.status === 1 ? '下架' : '上架'}成功`);
                this.reqProducts();//更新状态后重新查询商品信息
            } else {
                this.$message.error(`${row.status === 1 ? '下架' : '上架'}出错`);
            }
        }
    },
    mounted() {
        this.reqProducts();//组件挂载时查询商品信息
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

    .search-prod {
      width: 400px;
      display: flex;

      .el-input {
        width: 70%;
        margin: 0 10px;
      }
    }

    .el-button {
      background-color: #3d986e;
      border-color: #3d986e;
    }
  }

  .el-table {
    .el-button {
      margin: 0 10px;
      padding: 0;
      border: 0;
      background-color: rgba(255, 255, 255, 0);
      color: #1DA57A;
      cursor: pointer;
    }
  }
}
</style>
