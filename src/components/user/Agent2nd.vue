<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>二级代理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card class="box-card">
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="输入姓名进行搜索"
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
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加二级代理</el-button
          >
        </el-col>
      </el-row>
      <!--用户列表区域-->
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column prop="id" label="用户id"></el-table-column>
        <el-table-column prop="username" label="登录名"></el-table-column>
        <el-table-column prop="password" label="登录密码"></el-table-column>
        <el-table-column prop="name" label="真实姓名"></el-table-column>
        <el-table-column prop="idnum" label="身份证号"></el-table-column>
        <el-table-column prop="phonenum" label="手机号"></el-table-column>
        <el-table-column
          prop="belong_agent1"
          label="所属一级代理ID/姓名"
        ></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
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
                @click="showEditDialog(scope.$index)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮-->
            <el-tooltip
              effect="dark"
              content="删除用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(scope.row.id)"
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
    <!--添加用户对话框-->
    <el-dialog
      title="添加二级代理用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!--内容主体区域-->
      <el-form
        :model="addUserForm"
        :rules="addUserFormRules"
        ref="addUserFormRef"
        label-width="130px"
      >
        <el-form-item label="登录名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input
            type="password"
            v-model="addUserForm.password"
            prefix-icon="iconfont icon-3702mima"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="name">
          <el-input v-model="addUserForm.name"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idnum">
          <el-input v-model="addUserForm.idnum"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phonenum">
          <el-input v-model="addUserForm.phonenum"></el-input>
        </el-form-item>
        <el-form-item label="所属一级代理ID" prop="belong_agent1_id">
          <el-input v-model="addUserForm.belong_agent1_id"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改用户对话框-->
    <el-dialog
      title="修改二级代理信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="130px"
      >
        <el-form-item label="二级代理ID" prop="id">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input
            type="password"
            v-model="editForm.password"
            prefix-icon="iconfont icon-3702mima"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idnum">
          <el-input v-model="editForm.idnum"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phonenum">
          <el-input v-model="editForm.phonenum"></el-input>
        </el-form-item>
        <el-form-item label="所属一级代理ID" prop="belong_agent1_id">
          <el-input v-model="editForm.belong_agent1_id"></el-input>
        </el-form-item>
      </el-form>
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
    // 自定义身份证号校验规则
    var checkIdNo = (rule, value, callback) => {
      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (value === '' || value === undefined || value === null) {
        callback()
      } else {
        if (!reg.test(value) && value !== '') {
          callback(new Error('请输入正确的身份证号码'))
        } else {
          callback()
        }
      }
    }
    // 自定义密码校验规则
    var checkPsdReg = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入登录密码'))
      }
      if (
        !/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}$/.test(
          value
        )
      ) {
        callback(
          new Error(
            '请输入6-20位英文字母、数字或者符号，且字母、数字和标点符号至少包含两种'
          )
        )
      } else {
        callback()
      }
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
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 添加用户的表单数据
      addUserForm: {
        username: '',
        password: '',
        name: '',
        idnum: '',
        phonenum: '',
        belong_agent1_id: null
      },
      // 修改用户的表单数据
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        username: [
          { required: true, message: '请输入用户登录名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [{ required: true, validator: checkPsdReg, trigger: 'blur' }],
        name: [
          { required: true, message: '请输入用户真实姓名', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        idnum: [
          { required: true, message: '请输入用户身份证号码', trigger: 'blur' },
          { validator: checkIdNo, trigger: 'blur' }
        ],
        phonenum: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        belong_agent1_id: [
          { required: true, message: '请输入所属一级代理ID', trigger: 'blur' }
        ]
      },
      // 添加表单的验证规则对象
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户登录名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [{ required: true, validator: checkPsdReg, trigger: 'blur' }],
        name: [
          { required: true, message: '请输入用户真实姓名', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        idnum: [
          { required: true, message: '请输入用户身份证号码', trigger: 'blur' },
          { validator: checkIdNo, trigger: 'blur' }
        ],
        phonenum: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        belong_agent1_id: [
          { required: true, message: '请输入所属一级代理ID', trigger: 'blur' }
        ]
      },
      username: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http({
        url: '/cu_admin/user/get2agentinfo.asp',
        method: 'get',
        params: this.queryInfo
      })
      // if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userlist = res.data
      this.total = res.totalpage
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值的改变
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
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
    },
    // 添加用户
    addUser () {
      // 预校验
      this.$refs.addUserFormRef.validate(async (valid, field) => {
        if (!valid) {
          const arr = Object.keys(field)
          return this.$message.error({
            message: field[arr[0]][0].message,
            duration: 1500
          })
        }
        // 可以发起网络请求
        const { data: res } = await this.$http.post(
          '/cu_admin/user/add2agent.asp',
          this.addUserForm
        )
        if (res !== 'success') {
          return this.$message.error(res)
        }
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        // 重新获取用户列表
        this.getUserList()
      })
    },
    // 展示编辑用户信息对话框
    showEditDialog (id) {
      this.editForm = this.userlist[id]
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
          '/cu_admin/user/modify2agentinfo.asp',
          this.editForm
        )
        if (res !== 'success') {
          return this.$message.error(res)
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
        // 提示修改成功
        this.$message.success('更新用户信息成功')
      })
    },
    // 删除用户弹出确认对话框
    async removeUserById (id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => {
        // 可直接简写为.catch(err => err)
        return err
      })
      // 若用户点击确认，返回字符串：confirm
      // 若用户点击取消，返回字符串：cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.get(
        '/cu_admin/user/delete2agent.asp?id=' + id
      )
      if (res !== 'success') {
        return this.$message.error('删除代理失败')
      }
      this.$message.success('删除代理成功')
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped></style>
