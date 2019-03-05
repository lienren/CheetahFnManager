/*
 * @Author: Lienren
 * @Date: 2019-03-05 10:48:19
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-03-05 18:37:54
 */
'use strict'

import Vue from 'vue'

// Pany320121#

export default {
  getVerificationCode (body, op = {}) {
    return Vue.$utils.Http.post(`/cheetah/verificationCode/get`, { ...body }, op)
  },
  login (body, op = {}) {
    return Vue.$utils.Http.post(`/cheetah/login`, { ...body }, op)
  },
  getAllManagement (param, op = {}) {
    return Vue.$utils.Http.get(`/cheetah/management/admin/getAll${param}`, op)
  },
  createManagement (body, op = {}) {
    return Vue.$utils.Http.post(`/cheetah/management/admin/add`, { ...body }, op)
  },
  editManagementPwd (body, op = {}) {
    return Vue.$utils.Http.post(`/cheetah/management/admin/changePassword`, { ...body }, op)
  },
  delManagement (body, op = {}) {
    return Vue.$utils.Http.post(`/cheetah/management/admin/delete`, { ...body }, op)
  },
  getAllRole (param, op = {}) {
    return Vue.$utils.Http.get(`/cheetah/management/role/getAll${param}`, op)
  },
  delRole (body, op = {}) {
    return Vue.$utils.Http.post(`/cheetah/management/role/delete`, { ...body }, op)
  },
  createRole (body, op = {}) {
    return Vue.$utils.Http.post(`/cheetah/management/role/add`, { ...body }, op)
  },
  getAllPermission (param, op = {}) {
    return Vue.$utils.Http.get(`/cheetah/management/permission/getAll${param}`, op)
  },
  delPermission (body, op = {}) {
    return Vue.$utils.Http.post(`/cheetah/management/permission/delete`, { ...body }, op)
  },
  createPermission (body, op = {}) {
    return Vue.$utils.Http.post(`/cheetah/management/permission/add`, { ...body }, op)
  },
  editPermission (body, op = {}) {
    return Vue.$utils.Http.post(`/cheetah/management/permission/modify`, { ...body }, op)
  }
}
