<template>
  <div>
    <a-modal :title="title" v-model="currentIsVisible" @ok="modalAction" :okText="okText" :cancelText="cancelText">
      <a-form v-if="currentIsVisible">
        <template v-for="item in formItems">
          <a-form-item v-if="items[item].type" :key="item" :labelCol="labelCol" :wrapperCol="wrapperCol" :label="items[item].label">
            <template v-if="!items[item].readonly">
              <a-input v-if="items[item].type==='text'||items[item].type==='password'" :placeholder="items[item].placeholder" v-model="items[item].model" :type="items[item].type"></a-input>
              <a-select v-else style="width: 120px" @change="handleSelectChange">
                <a-select-option v-if="items[item].optionData" v-for="(option, index) in items[item].optionData" :key="index" :value="`${item},${option.val}`">{{option.text}}</a-select-option>
                <a-select-option v-if="items[item].optionIconData" :value="`${item},`">无</a-select-option>
                <a-select-option v-if="items[item].optionIconData" v-for="(option, index) in items[item].optionIconData" :key="index" :value="`${item},${option.val}`"><a-icon :type="option.val" />&nbsp;{{option.val}}</a-select-option>
              </a-select>
            </template>
            <template v-else>{{items[item].model}}</template>
          </a-form-item>
        </template>
      </a-form>
    </a-modal>
  </div>
</template>

<script>

export default {
  props: {
    title: {
      type: String
    },
    isVisible: {
      type: Boolean
    },
    items: {
      type: Object
    },
    okText: {
      type: String,
      default: '保存'
    },
    cancelText: {
      type: String,
      default: '取消'
    }
  },
  components: {},
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
      currentIsVisible: false
    }
  },
  computed: {
    formItems () {
      return Object.keys(this.items)
    }
  },
  watch: {
    isVisible (val) {
      this.currentIsVisible = val
    },
    currentIsVisible (val) {
      this.$emit('update:isVisible', val)
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
    init () { },
    modalAction () {
      let verifySuccess = true
      for (let i = 0, j = this.formItems.length; i < j; i++) {
        if (!this.items[this.formItems[i]].noVerify) {
          if (this.items[this.formItems[i]].model === '' && !this.items[this.formItems[i]].isNull) {
            verifySuccess = false
            this.$message.error(`${this.items[this.formItems[i]].placeholder}！`)
            break
          }
        }
      }

      if (verifySuccess) {
        this.$emit('on-action', this.items)
      }
    },
    handleSelectChange (value) {
      let itemSplit = value.split(',')
      this.items[itemSplit[0]].model = itemSplit[1]
    }
  }
}

</script>
