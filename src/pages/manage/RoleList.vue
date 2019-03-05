<template>
  <div>
    <h3>角色列表</h3>
    <iTable :toolbars="tableToolbars" :actionButtons="tableActionBtns" :columns="tableColumns" :dataSource="tableData" :pagination="tablePagination" :height="tableHeight" @on-change="handleTableChange"></iTable>
    <a-modal title="新增角色" v-model="createModalVisible" @ok="createModalAction" okText="保存" cancelText="取消">
      <a-form>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='角色名称'>
          <a-input placeholder='请输入角色名称' v-model="info.roleName"></a-input>
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
        roleName: ''
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
              roleName: '' }
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
          text: '设置菜单',
          purview: 'edit',
          style: { color: '#ff6900' },
          icon: 'edit',
          click: (e) => {
            this.$message.success('此功能还未开放！')
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
    },
    async fetch (param = {}) {
      this.tableData = []
      let result = await api.getAllRole(`?pageindex=${param.current}&pagesize=${param.pageSize}`)
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
      if (this.info.roleName === '') {
        this.$message.error('请填写角色名称！')
        return
      }

      let result = await api.createRole({
        'roleName': this.info.roleName
      })

      if (result) {
        this.$message.success('新增角色成功！')
        this.createModalVisible = false
        this.info = {
          id: 0,
          roleName: '' }
        this.fetch({
          ...this.tablePagination
        })
      }
    }
  }
}
</script>
