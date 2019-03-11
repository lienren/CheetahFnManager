<template>
  <div>
    <h3>菜单列表</h3>
    <iTable :toolbars="tableToolbars" :actionButtons="tableActionBtns" :columns="tableColumns" :dataSource="tableData" :pagination="tablePagination" :height="tableHeight" @on-change="handleTableChange"></iTable>
    <iFormBox title="新增菜单" :items="createInfo" :isVisible.sync="createModalVisible" @on-action="createModalAction"></iFormBox>
    <iFormBox title="修改菜单" :items="editInfo" :isVisible.sync="editModalVisible" @on-action="editModalAction"></iFormBox>
  </div>
</template>

<script>

import api from '../../api/cheetah'
import { iTable, iFormBox } from '../../components/'
import icons from './icons.json'

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
          title: '页面名称',
          dataIndex: 'name',
          width: '15%'
        }, {
          title: '页面地址',
          dataIndex: 'url',
          width: '20%'
        }, {
          title: '父级编号',
          dataIndex: 'parentId',
          width: '15%'
        }, {
          title: '功能按钮',
          dataIndex: 'buttonPermission',
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
            this.editInfo.pageName.model = e.name
            this.editInfo.url.model = e.url
            this.editInfo.parentID.model = e.parentId
            this.editInfo.icon.model = e.icon
            this.editInfo.buttonPermission.model = e.buttonPermission
            this.editInfo.position.model = e.position
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
              let result = await api.delPage({
                pageID: e.id
              })
              if (result) {
                this.$message.success('菜单删除成功！')
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
    async initInfo () {
      let result = await api.getAllPage({
        pageindex: 1,
        pagesize: 99999999
      })
      let parentMenuList = []
      parentMenuList.push({
        text: '无',
        val: '0'
      })
      if (result && result.data) {
        result.data.forEach(m => {
          if (parseInt(m.parentId) === 0) {
            parentMenuList.push({
              text: m.name,
              val: m.id
            })
          }
        })
      }

      this.createInfo = {
        id: {
          model: 0
        },
        pageName: {
          type: 'text',
          label: '页面名称',
          placeholder: '请输入页面名称',
          model: ''
        },
        url: {
          type: 'text',
          label: '页面地址',
          placeholder: '请输入页面地址',
          model: ''
        },
        parentID: {
          type: 'select',
          label: '父级菜单',
          placeholder: '请输入父级菜单',
          model: '',
          optionData: parentMenuList
        },
        icon: {
          type: 'select',
          label: '图标',
          placeholder: '请选择图标',
          model: '',
          optionIconData: icons,
          isNull: true
        },
        buttonPermission: {
          type: 'text',
          label: '功能按钮',
          placeholder: '请输入功能按钮',
          model: '',
          isNull: true
        },
        position: {
          type: 'text',
          label: '菜单排序',
          placeholder: '请输入菜单排序（数字）',
          model: '',
          isNull: true
        }
      }
      this.editInfo = {
        id: {
          model: 0
        },
        pageName: {
          type: 'text',
          label: '页面名称',
          placeholder: '请输入页面名称',
          model: '',
          readonly: true
        },
        url: {
          type: 'text',
          label: '页面地址',
          placeholder: '请输入页面地址',
          model: ''
        },
        parentID: {
          type: 'select',
          label: '父级菜单',
          placeholder: '请输入父级菜单',
          model: '',
          optionData: parentMenuList
        },
        icon: {
          type: 'select',
          label: '图标',
          placeholder: '请选择图标',
          model: '',
          optionIconData: icons,
          isNull: true
        },
        buttonPermission: {
          type: 'text',
          label: '功能按钮',
          placeholder: '请输入功能按钮',
          model: '',
          isNull: true
        },
        position: {
          type: 'text',
          label: '菜单排序',
          placeholder: '请输入菜单排序（数字）',
          model: '',
          isNull: true
        }
      }
    },
    async fetch (param = {}) {
      this.tableData = []
      let result = await api.getAllPage({
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
      let result = await api.createPage({
        pageName: items.pageName.model,
        url: items.url.model,
        parentID: items.parentID.model,
        icon: items.icon.model,
        buttonPermission: items.buttonPermission.model,
        position: items.position.model
      })

      if (result) {
        this.$message.success('新增菜单成功！')
        this.createModalVisible = false
        this.initInfo()
        this.fetch({
          ...this.tablePagination
        })
      }
    },
    async editModalAction (items) {
      let result = await api.editPage({
        pageID: items.id.model,
        url: items.url.model,
        parentID: items.parentID.model,
        icon: items.icon.model,
        buttonPermission: items.buttonPermission.model,
        position: items.position.model
      })

      if (result) {
        this.$message.success('菜单修改成功！')
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
