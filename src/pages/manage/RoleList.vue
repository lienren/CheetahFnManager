<template>
  <div class="page-main">
    <h3>角色列表</h3>
    <iTable :toolbars="tableToolbars" :actionButtons="tableActionBtns" :columns="tableColumns" :dataSource="tableData" :pagination="tablePagination" :height="tableHeight" @on-change="handleTableChange"></iTable>
    <a-modal title="设置权限" width="750px" v-model="editPermissionModalVisible" @ok="editPermissionModalAction" okText="保存" cancelText="取消">
      <a-form>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="设置权限">
          <a-transfer v-if="editPermissionModalVisible" :titles="['未选权限', '已选权限']" :dataSource="permissions" :filterOption="filterOption" :targetKeys="rolePermissions" @change="handlePermissionChange" :render="item=>item.title"></a-transfer>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="设置菜单">
          <a-tree v-if="editPermissionModalVisible" checkable :treeData="menus" :defaultCheckedKeys="roleMenus" @check="handleMenuChange">
          </a-tree>
        </a-form-item>
      </a-form>
    </a-modal>
    <iFormBox title="新增角色" :items="info" :isVisible.sync="createModalVisible" @on-action="createModalAction"></iFormBox>
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
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 14
      },
      tableColumns: [],
      tableData: [],
      tablePagination: {},
      tableToolbars: [],
      tableActionBtns: [],
      createModalVisible: false,
      editPwdModalVisible: false,
      editPermissionModalVisible: false,
      info: {},
      permissions: [],
      rolePermissions: [],
      editPermissionInfo: {
        id: 0
      },
      menus: [],
      roleMenus: []
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
          title: '角色名称',
          dataIndex: 'name',
          width: '15%'
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
          text: '设置权限',
          purview: 'editpermission',
          style: { color: '#1890ff' },
          icon: 'edit',
          click: async (e) => {
            this.rolePermissions = []
            this.roleMenus = []
            let result = await api.getRolePermission({
              roleID: e.id
            })
            if (result && result.data) {
              this.rolePermissions = result.data.map(m => {
                return `${m.id}`
              })
            } else {
              this.rolePermissions = []
            }

            result = await api.getRolePage({
              roleID: e.id
            })
            if (result && result.data) {
              for (let i = 0, j = result.data.length; i < j; i++) {
                if ((result.data[i].children && result.data[i].children.length > 0) || result.data[i].permission) {
                  if (result.data[i].permission) {
                    this.roleMenus = this.roleMenus.concat(result.data[i].permission.split(',').map(m => {
                      return `${result.data[i].id}-${m}`
                    }))
                  }

                  for (let x = 0, y = result.data[i].children.length; x < y; x++) {
                    if (result.data[i].children[x].permission) {
                      this.roleMenus = this.roleMenus.concat(result.data[i].children[x].permission.split(',').map(m => {
                        return `${result.data[i].children[x].id}-${m}`
                      }))
                    } else {
                      this.roleMenus.push(`${result.data[i].children[x].id}`)
                    }
                  }
                } else {
                  this.roleMenus.push(`${result.data[i].id}`)
                }
              }
            } else {
              this.roleMenus = []
            }
            this.editPermissionModalVisible = true
            this.editPermissionInfo.id = e.id
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
              let result = await api.delRole({
                roleID: e.id
              })
              if (result) {
                this.$message.success('角色删除成功！')
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
      this.getPermissions()
      this.getMenus()
      this.initInfo()
    },
    initInfo () {
      this.info = {
        id: {
          model: 0
        },
        roleName: {
          type: 'text',
          label: '角色名称',
          placeholder: '请输入角色名称',
          model: ''
        }
      }
    },
    async getPermissions () {
      let result = await api.getAllPermission({
        pageindex: 1,
        pagesize: 99999999
      })
      if (result) {
        this.permissions = result.data.map(p => {
          return {
            key: p.id.toString(),
            title: p.name,
            description: p.name
          }
        })
      }
    },
    async getMenus () {
      let result = await api.getAllPage({
        pageindex: 1,
        pagesize: 99999999
      })
      if (result && result.data) {
        let levelMenu = function (data, parentId) {
          let l = []
          for (let i = 0, j = data.length; i < j; i++) {
            if (parseInt(parentId) === parseInt(data[i].parentId)) {
              let buttonPermission = data[i].buttonPermission ? data[i].buttonPermission.split(',').map(b => {
                return {
                  title: `功能按钮-${b.split('|')[0]}`,
                  key: `${data[i].id}-${b.split('|')[1]}`
                }
              }) : []
              l.push({
                title: data[i].name,
                key: `${data[i].id}`,
                children: levelMenu(data, data[i].id).concat(buttonPermission)
              })
            }
          }
          return l
        }

        this.menus = levelMenu(result.data, 0)
      }
    },
    async fetch (param = {}) {
      this.tableData = []
      let result = await api.getAllRole({
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
    filterOption (inputValue, option) {
      return option.title.indexOf(inputValue) > -1
    },
    handleTableChange (val) {
      this.tablePagination = val.pagination
      this.fetch({
        ...this.tablePagination
      })
    },
    async createModalAction (items) {
      let result = await api.createRole({
        'roleName': items.roleName.model
      })

      if (result) {
        this.$message.success('新增角色成功！')
        this.createModalVisible = false
        this.initInfo()
        this.fetch({
          ...this.tablePagination
        })
      }
    },
    handlePermissionChange (targetKeys, direction, moveKeys) {
      this.rolePermissions = targetKeys
    },
    async editPermissionModalAction () {
      let $this = this
      this.$confirm({
        title: '提示',
        content: '您正在修改该角色的权限和菜单，确认是否保存？',
        okText: '保存',
        cancelText: '取消',
        async onOk () {
          let dataRoleMenus = []
          for (let i = 0, j = $this.roleMenus.length; i < j; i++) {
            if ($this.roleMenus[i].indexOf('-') === -1) {
              dataRoleMenus.push({
                pageID: $this.roleMenus[i],
                permission: ''
              })
            }
          }
          for (let i = 0, j = $this.roleMenus.length; i < j; i++) {
            if ($this.roleMenus[i].indexOf('-') > -1) {
              let find = dataRoleMenus.find(f => {
                return parseInt(f.pageID) === parseInt($this.roleMenus[i].split('-')[0])
              })
              if (find) {
                find.permission += find.permission === '' ? `${$this.roleMenus[i].split('-')[1]}` : `,${$this.roleMenus[i].split('-')[1]}`
              }
            }
          }

          let result = await api.editRolePermission({
            roleID: $this.editPermissionInfo.id,
            permissions: $this.rolePermissions.map(m => {
              return {
                permissionID: m
              }
            })
          })
          if (result) {
            result = await api.editRolePage({
              roleID: $this.editPermissionInfo.id,
              pages: dataRoleMenus
            })

            if (result) {
              $this.editPermissionModalVisible = false
              $this.$message.success('角色权限菜单修改成功，请联系相关角色管理员重新登录！')
            }
          }
        },
        onCancel () {
        }
      })
    },
    handleMenuChange (checkedKeys, info) {
      this.roleMenus = checkedKeys.concat(info.halfCheckedKeys)
    }
  }
}
</script>

<style scoped>
  .page-main {
    background-color: #fff;
    padding: 20px;
    border-radius: 2px;
  }
</style>
