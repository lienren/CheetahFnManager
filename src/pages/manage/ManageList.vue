<template>
  <div>
    <h3>管理员列表</h3>
    <iTable :toolbars="tableToolbars" :actionButtons="tableActionBtns" :columns="tableColumns" :dataSource="tableData" :pagination="tablePagination" :height="tableHeight" @on-change="handleTableChange"></iTable>
    <a-modal title="设置角色" v-model="editRoleModalVisible" @ok="editRoleModalAction" okText="保存" cancelText="取消">
      <a-transfer v-if="editRoleModalVisible" :titles="['未选角色', '已选角色']" :dataSource="roles" :filterOption="filterOption" :targetKeys="managerRoles" @change="handleRoleChange" :render="item=>item.title">
      </a-transfer>
    </a-modal>
    <iFormBox title="新增管理员" :items="createInfo" :isVisible.sync="createModalVisible" @on-action="createModalAction"></iFormBox>
    <iFormBox title="修改管理员密码" :items="editPwdInfo" :isVisible.sync="editPwdModalVisible" @on-action="editPwdModalAction"></iFormBox>
  </div>
</template>

<script>

import api from '../../api/cheetah'
import { iTable, iFormBox } from '../../components/'

export default {
  components: {
    iTable,
    iFormBox
  },
  data () {
    return {
      tableColumns: [],
      tableData: [],
      tablePagination: {},
      tableToolbars: [],
      tableActionBtns: [],
      roles: [],
      managerRoles: [],
      createModalVisible: false,
      editPwdModalVisible: false,
      editRoleModalVisible: false,
      createInfo: {},
      editPwdInfo: {},
      editRoleInfo: {
        id: 0
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
          purview: 'create',
          click: () => {
            this.initInfo()
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
          purview: 'editrole',
          style: { color: '#1890ff' },
          icon: 'edit',
          click: async (e) => {
            let result = await api.getManagementRole({
              adminID: e.id
            })
            if (result && result.data) {
              this.managerRoles = result.data.map(m => {
                return `${m.id}`
              })
            } else {
              this.managerRoles = []
            }
            this.editRoleInfo.id = e.id
            this.editRoleModalVisible = true
          }
        },
        {
          model: 'button',
          text: '修改密码',
          icon: 'edit',
          purview: 'editpwd',
          click: (e) => {
            this.editPwdInfo.id.model = e.id
            this.editPwdInfo.loginName.model = e.name
            this.editPwdInfo.fullName.model = e.fullName
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
      this.getRoles()
      this.initInfo()
    },
    initInfo () {
      this.createInfo = {
        id: {
          model: 0
        },
        loginName: {
          type: 'text',
          label: '登录名',
          placeholder: '请输入登录名',
          model: ''
        },
        loginPwd: {
          type: 'password',
          label: '登录密码',
          placeholder: '请输入登录密码',
          model: ''
        },
        fullName: {
          type: 'text',
          label: '真实姓名',
          placeholder: '请输入真实姓名',
          model: ''
        },
        oldLoginPwd: '',
        newLoginPwd: ''
      }
      this.editPwdInfo = {
        id: {
          model: 0
        },
        loginName: {
          type: 'text',
          label: '登录名',
          placeholder: '请输入登录名',
          model: '',
          readonly: true
        },
        fullName: {
          type: 'text',
          label: '真实姓名',
          placeholder: '请输入真实姓名',
          model: '',
          readonly: true
        },
        oldLoginPwd: {
          type: 'password',
          label: '原密码',
          placeholder: '请输入原密码',
          model: ''
        },
        newLoginPwd: {
          type: 'password',
          label: '新密码',
          placeholder: '请输入新密码',
          model: ''
        }
      }
      this.editRoleInfo = {
        id: 0
      }
    },
    async fetch (param = {}) {
      this.tableData = []
      let result = await api.getAllManagement({
        pageindex: param.current,
        pagesize: param.pageSize
      })
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
    async getRoles () {
      let result = await api.getAllRole({
        pageindex: 1,
        pagesize: 99999999
      })
      if (result) {
        this.roles = result.data.map(r => {
          return {
            key: r.id.toString(),
            title: r.name,
            description: r.name
          }
        })
      }
    },
    handleTableChange (val) {
      this.tablePagination = val.pagination
      this.fetch({
        ...this.tablePagination
      })
    },
    filterOption (inputValue, option) {
      return option.title.indexOf(inputValue) > -1
    },
    async createModalAction (items) {
      let result = await api.createManagement({
        'adminName': items.loginName.model,
        'password': items.loginPwd.model,
        'fullName': items.fullName.model
      })

      if (result) {
        this.$message.success('新增管理员成功！')
        this.createModalVisible = false
        this.initInfo()
        this.fetch({
          ...this.tablePagination
        })
      }
    },
    async editPwdModalAction (items) {
      let result = await api.editManagementPwd(
        {
          adminID: items.id.model,
          old: items.oldLoginPwd.model,
          new: items.newLoginPwd.model
        }
      )

      if (result) {
        this.$message.success('密码修改成功！')
        this.editPwdModalVisible = false
        this.initInfo()
        this.fetch({
          ...this.tablePagination
        })
      }
    },
    handleRoleChange (targetKeys, direction, moveKeys) {
      this.managerRoles = targetKeys
    },
    async editRoleModalAction () {
      let $this = this
      this.$confirm({
        title: '提示',
        content: '您正在修改该管理员的角色，确认是否保存？',
        okText: '保存',
        cancelText: '取消',
        async onOk () {
          let result = await api.editManagementRole({
            adminID: $this.editRoleInfo.id,
            roles: $this.managerRoles.map(m => {
              return {
                roleID: m
              }
            })
          })
          if (result) {
            $this.editRoleModalVisible = false
            $this.$message.success('管理员角色修改成功，请联系管理员重新登录！')
          }
        },
        onCancel () {
        }
      })
    }
  }
}
</script>
