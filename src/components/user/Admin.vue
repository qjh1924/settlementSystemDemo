<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>超级管理员</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card class="box-card">
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--用户列表区域-->
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column prop="id" label="用户ID"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="password" label="密码"></el-table-column>
        <el-table-column prop="phonenum" label="电话"></el-table-column>
        <el-table-column label="操作" width="180">
          <template>
            <!-- 修改按钮-->
            <el-tooltip
              effect="dark"
              content="编辑用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog()"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页模块-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!--修改用户对话框-->
    <el-dialog
      title="修改超级用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户ID" prop="id">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phonenum">
          <el-input v-model="editForm.phonenum"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 自定义手机号校验规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        // 合法的手机号
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 10
      },
      userlist: [],
      total: 0,
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 修改用户的表单数据
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        phonenum: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get(
        '/cu_admin/user/getadmininfo.asp'
      )
      // if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userlist = res
      this.total = res.length
    },
    // 展示编辑用户信息对话框
    showEditDialog () {
      this.editForm = this.userlist[0]
      this.editDialogVisible = true
    },
    // 修改用户信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async (valid, field) => {
        if (!valid) {
          const arr = Object.keys(field)
          return this.$message.error({
            message: field[arr[0]][0].message,
            duration: 1500
          })
        }
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.post(
          '/cu_admin/user/modifysuperuserinfo.asp',
          this.editForm
        )
        if (res !== 'success') {
          return this.$message.error({
            message: '修改超级用户信息失败',
            duration: 1500
          })
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
        // 提示修改成功
        this.$message.success('修改超级用户信息成功')
      })
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      // this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值的改变
    handleCurrentChange (newPage) {
      // this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      // 重置表单内容
      this.$refs.addUserFormRef.resetFields()
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed () {
      // 重置表单内容
      this.$refs.editFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped></style>
