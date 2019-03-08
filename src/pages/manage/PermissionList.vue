<template>
  <div>
    <h3>权限接口列表</h3>
    <iTable :toolbars="tableToolbars" :actionButtons="tableActionBtns" :columns="tableColumns" :dataSource="tableData" :pagination="tablePagination" :height="tableHeight" @on-change="handleTableChange"></iTable>
    <iFormBox title="新增权限接口" :items="createInfo" :isVisible.sync="createModalVisible" @on-action="createModalAction"></iFormBox>
    <iFormBox title="修改权限接口" :items="editInfo" :isVisible.sync="editModalVisible" @on-action="editModalAction"></iFormBox>
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
      createModalVisible: false,
      editModalVisible: false,
      createInfo: {},
      editInfo: {}
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
          title: '权限名称',
          dataIndex: 'name',
          width: '15%'
        }, {
          title: '权限值',
          dataIndex: 'permission',
          width: '20%'
        }, {
          title: '权限组',
          dataIndex: 'permissionGroup',
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
          text: '修改',
          icon: 'edit',
          purview: 'edit',
          click: (e) => {
            this.editInfo.id.model = e.id
            this.editInfo.name.model = e.name
            this.editInfo.permission.model = e.permission
            this.editInfo.permissionGroup.model = e.permissionGroup
            this.editModalVisible = true
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
              let result = await api.delPermission({
                permissionID: e.id
              })
              if (result) {
                this.$message.success('权限删除成功！')
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
      this.initInfo()
    },
    initInfo () {
      this.createInfo = {
        id: {
          model: 0
        },
        name: {
          type: 'text',
          label: '权限名称',
          placeholder: '请输入权限名称',
          model: ''
        },
        permission: {
          type: 'text',
          label: '权限值',
          placeholder: '请输入权限值',
          model: ''
        },
        permissionGroup: {
          type: 'text',
          label: '权限组',
          placeholder: '请输入权限组',
          model: ''
        }
      }
      this.editInfo = {
        id: {
          model: 0
        },
        name: {
          type: 'text',
          label: '权限名称',
          placeholder: '请输入权限名称',
          model: '',
          readonly: true
        },
        permission: {
          type: 'text',
          label: '权限值',
          placeholder: '请输入权限值',
          model: ''
        },
        permissionGroup: {
          type: 'text',
          label: '权限组',
          placeholder: '请输入权限组',
          model: ''
        }
      }
    },
    async fetch (param = {}) {
      this.tableData = []
      let result = await api.getAllPermission({
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
    handleTableChange (val) {
      this.tablePagination = val.pagination
      this.fetch({
        ...this.tablePagination
      })
    },
    async createModalAction (items) {
      let result = await api.createPermission({
        'permissionName': items.name.model,
        'permission': items.permission.model,
        'group': items.permissionGroup.model
      })

      if (result) {
        this.$message.success('新增权限成功！')
        this.createModalVisible = false
        this.initInfo()
        this.fetch({
          ...this.tablePagination
        })
      }
    },
    async editModalAction (items) {
      let result = await api.editPermission({
        permissionID: items.id.model,
        permissionName: items.name.model,
        permission: items.permission.model,
        group: items.permissionGroup.model
      })

      if (result) {
        this.$message.success('权限修改成功！')
        this.editModalVisible = false
        this.initInfo()
        this.fetch({
          ...this.tablePagination
        })
      }
    }
  }
}
</script>
