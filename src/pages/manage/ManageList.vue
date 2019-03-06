<template>
  <div>
    <h3>管理员列表</h3>
    <iTable :toolbars="tableToolbars" :actionButtons="tableActionBtns" :columns="tableColumns" :dataSource="tableData" :pagination="tablePagination" :height="tableHeight" @on-change="handleTableChange"></iTable>
    <a-modal title="新增管理员" v-model="createModalVisible" @ok="createModalAction" okText="保存" cancelText="取消">
      <a-form>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='登录名'>
          <a-input placeholder='请输入登录名' v-model="info.loginName"></a-input>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='登录密码'>
          <a-input placeholder='请输入登录密码' v-model="info.loginPwd" type="password">
          </a-input>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='真实姓名'>
          <a-input placeholder='请输入真实姓名' v-model="info.fullName">
          </a-input>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal title="修改管理员密码" v-model="editPwdModalVisible" @ok="editPwdModalAction" okText="保存" cancelText="取消">
      <a-form>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='登录名'>
          {{info.loginName}}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='真实姓名'>
          {{info.fullName}}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='原密码'>
          <a-input placeholder='请输入原密码' v-model="info.oldLoginPwd" type="password"></a-input>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='新密码'>
          <a-input placeholder='请输入新密码' v-model="info.newLoginPwd" type="password"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>

import api from '../../api/cheetah'
import { iTable } from '../../components/'

export default {
  components: {
    iTable
  },
  data () {
    return {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 14
      },
      wrapperButtonCol: {
        span: 14, offset: 4
      },
      tableColumns: [],
      tableData: [],
      tablePagination: {},
      tableToolbars: [],
      tableActionBtns: [],
      createModalVisible: false,
      editPwdModalVisible: false,
      info: {
        id: 0,
        loginName: '',
        loginPwd: '',
        fullName: '',
        oldLoginPwd: '',
        newLoginPwd: ''
      }
    }
  },
  computed: {
    tableHeight () {
      return this.$utils.Common.getWidthHeight().height - 188
    }
  },
  created () { },
  beforeDestroy () { },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init () {
      // 功能按钮
      this.tableToolbars = [
        {
          model: 'button',
          icon: 'reload',
          text: '刷新',
          click: () => {
            this.$message.success('刷新成功!')
            this.fetch({
              ...this.tablePagination
            })
          }
        },
        {
          model: 'button',
          icon: 'edit',
          text: '新增',
          click: () => {
            this.info = {
              id: 0,
              loginName: '',
              loginPwd: '',
              fullName: '',
              oldLoginPwd: '',
              newLoginPwd: '' }
            this.createModalVisible = true
          }
        }
      ]
      // 列头
      this.tableColumns = [
        {
          title: '编号',
          dataIndex: 'id',
          width: '10%'
        },
        {
          title: '登录名',
          dataIndex: 'name',
          width: '15%'
        }, {
          title: '真实姓名',
          dataIndex: 'fullName',
          width: '20%'
        }, {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: '20%'
        }
      ]
      // 操作按钮
      this.tableActionBtns = [
        {
          model: 'button',
          text: '设置角色',
          purview: 'edit',
          style: { color: '#ff6900' },
          icon: 'edit',
          click: (e) => {
            this.$message.success('此功能还未开放！')
          }
        },
        {
          model: 'button',
          text: '修改密码',
          icon: 'edit',
          purview: 'edit',
          click: (e) => {
            this.info = {
              id: e.id,
              loginName: e.name,
              fullName: e.fullName }
            this.editPwdModalVisible = true
          }
        },
        {
          model: 'button',
          text: '删除',
          purview: 'delete',
          style: { color: '#ff0000' },
          icon: 'edit',
          confirm: {
            title: '确认要删除吗？',
            confirm: async (e) => {
              let result = await api.delManagement({
                adminID: e.id
              })
              if (result) {
                this.$message.success('管理员删除成功！')
                this.fetch({
                  ...this.tablePagination
                })
              }
            },
            cancel: (e) => { }
          }
        }
      ]
      // 分页
      this.tablePagination = {
        pageSize: 20,
        current: 1,
        total: 200
      }
      this.fetch({
        ...this.tablePagination
      })
    },
    async fetch (param = {}) {
      this.tableData = []
      let result = await api.getAllManagement(`?pageindex=${param.current}&pagesize=${param.pageSize}`)
      if (result) {
        result.data.forEach(item => {
          this.tableData.push({
            key: item.id,
            ...item
          })
        })
        this.tablePagination = {
          pageSize: param.pageSize,
          current: param.current,
          total: 0
        }
      }
    },
    handleTableChange (val) {
      this.tablePagination = val.pagination
      this.fetch({
        ...this.tablePagination
      })
    },
    async createModalAction () {
      if (this.info.loginName === '') {
        this.$message.error('请填写帐号信息！')
        return
      }

      if (this.info.loginPwd === '') {
        this.$message.error('请填写密码！')
        return
      }

      if (this.info.fullName === '') {
        this.$message.error('请填写真实姓名！')
        return
      }

      let result = await api.createManagement({
        'adminName': this.info.loginName,
        'password': this.info.loginPwd,
        'fullName': this.info.fullName
      })

      if (result) {
        this.$message.success('新增管理员成功！')
        this.createModalVisible = false
        this.info = {
          id: 0,
          loginName: '',
          loginPwd: '',
          fullName: '',
          oldLoginPwd: '',
          newLoginPwd: '' }
        this.fetch({
          ...this.tablePagination
        })
      }
    },
    async editPwdModalAction () {
      if (this.info.oldLoginPwd === '') {
        this.$message.error('请填写帐号原密码！')
        return
      }

      if (this.info.newLoginPwd === '') {
        this.$message.error('请填写帐号新密码！')
        return
      }

      let result = await api.editManagementPwd(
        {
          adminID: this.info.id,
          old: this.info.oldLoginPwd,
          new: this.info.newLoginPwd
        }
      )

      if (result) {
        this.$message.success('密码修改成功！')
        this.editPwdModalVisible = false
        this.info = {
          id: 0,
          loginName: '',
          loginPwd: '',
          fullName: '',
          oldLoginPwd: '',
          newLoginPwd: '' }
        this.fetch({
          ...this.tablePagination
        })
      }
    }
  }
}
</script>
