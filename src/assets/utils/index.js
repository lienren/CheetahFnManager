/*
 * @Author: Lienren
 * @Date: 2018-08-13 22:50:10
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-03-05 11:33:18
 */
'use strict'

import Common from './common.js'
import Http from './http.js'
import Store from './localStorage.js'
import Date from './date.js'
import Jwt from './jwt.js'

export default function (Vue) {
  if (!Vue.$utils) {
    Vue.$utils = {
      Common,
      Http,
      Store,
      Date,
      Jwt
    }
  } else {
    Vue.$utils = {
      Common,
      Http,
      Store,
      Date,
      Jwt
    }
  }

  Vue.mixin({
    created () {
      this.$utils = {
        Common,
        Http,
        Store,
        Date,
        Jwt
      }
    }
  })
}
