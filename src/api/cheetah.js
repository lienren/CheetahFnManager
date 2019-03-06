/*
 * @Author: Lienren
 * @Date: 2019-03-05 10:48:19
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-03-06 18:04:25
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
  getAllManagement (body, op = {}) {
    return Vue.$utils.Http.post(`/cheetah/management/admin/getAll`, {...body}, op)
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
  editManagementRole (body, op = {}) {
    return Vue.$utils.Http.post(`/cheetah/management/admin/addRole`, { ...body }, op)
  },
  getManagementRole (body, op = {}) {
    return Vue.$utils.Http.post(`/cheetah/management/admin/getAdminRoles`, { ...body }, op)
  },
  getAllRole (body, op = {}) {
    return Vue.$utils.Http.post(`/cheetah/management/role/getAll`, {...body}, op)
  },
  delRole (body, op = {}) {
    return Vue.$utils.Http.post(`/cheetah/management/role/delete`, { ...body }, op)
  },
  createRole (body, op = {}) {
    return Vue.$utils.Http.post(`/cheetah/management/role/add`, { ...body }, op)
  },
  getAllPermission (body, op = {}) {
    return Vue.$utils.Http.post(`/cheetah/management/permission/getAll`, {...body}, op)
  },
  delPermission (body, op = {}) {
    return Vue.$utils.Http.post(`/cheetah/management/permission/delete`, { ...body }, op)
  },
  createPermission (body, op = {}) {
    return Vue.$utils.Http.post(`/cheetah/management/permission/add`, { ...body }, op)
  },
  editPermission (body, op = {}) {
    return Vue.$utils.Http.post(`/cheetah/management/permission/modify`, { ...body }, op)
  },
  getAllPage (body, op = {}) {
    return Vue.$utils.Http.post(`/cheetah/management/page/getAll`, { ...body }, op)
  },
  createPage (body, op = {}) {
    return Vue.$utils.Http.post(`/cheetah/management/page/add`, { ...body }, op)
  },
  editPage (body, op = {}) {
    return Vue.$utils.Http.post(`/cheetah/management/page/modify`, { ...body }, op)
  },
  delPage (body, op = {}) {
    return Vue.$utils.Http.post(`/cheetah/management/page/delete`, { ...body }, op)
  }
}
