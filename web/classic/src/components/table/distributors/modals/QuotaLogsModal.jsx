/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React from 'react';
import { Modal, Table, Tag } from '@douyinfe/semi-ui';
import { renderQuota } from '../../../../helpers/render';

const roleName = (role, t) => {
  const map = {
    1: t('普通用户'),
    7: t('分销商'),
    8: t('高级分销商'),
  };
  return map[role] || role || '-';
};

const parseRoleRemark = (remark) => {
  const match = /^role:(\d+)->(\d+)$/.exec(remark || '');
  if (!match) return null;
  return { before: Number(match[1]), after: Number(match[2]) };
};

const actionText = (record, t) => {
  const action = record.action;
  const map = {
    root_grant_distributable_quota: t('超级管理员添加可分配金额'),
    root_grant_user_quota: t('超级管理员添加系统额度'),
    senior_grant_distributor_quota: t('高级分销商添加可分配金额'),
    senior_grant_user_quota: t('高级分销商添加系统额度'),
    distributor_grant_user_quota: t('分销商添加系统额度'),
    bind: t('添加下级'),
    update_remark: t('更新备注'),
  };
  if (action === 'set_role') {
    const parsed = parseRoleRemark(record.remark);
    if (parsed) {
      return `${t('调整角色')}: ${roleName(parsed.before, t)} → ${roleName(parsed.after, t)}`;
    }
    return t('调整角色');
  }
  return map[action] || action || '-';
};

const amountText = (record) => {
  if (record.log_type !== 'quota' || !record.amount) return '-';
  return renderQuota(record.amount);
};

const targetText = (record) => {
  if (record.log_type === 'relation') {
    return record.child_username || record.target_username || '-';
  }
  return record.target_username || '-';
};

const relationText = (record, t) => {
  if (record.log_type !== 'relation') return '-';
  const parent = record.parent_user_id === 0
    ? t('超级管理员')
    : (record.parent_username || '-');
  const child = record.child_username || record.target_username || '-';
  return `${parent} → ${child}`;
};

const remarkText = (record) => {
  if (record.action === 'set_role') return '-';
  return record.remark || '-';
};

const QuotaLogsModal = ({ visible, onCancel, t, logs, loading, currentPage, pageSize, total, onPageChange, onPageSizeChange }) => {
  const columns = [
    { title: t('时间'), dataIndex: 'created_at', render: (v) => new Date(v * 1000).toLocaleString() },
    {
      title: t('类别'),
      dataIndex: 'log_type',
      render: (v) => <Tag>{v === 'relation' ? t('关系/角色') : t('额度/金额')}</Tag>,
    },
    { title: t('操作者'), dataIndex: 'operator_username', render: (v) => v || '-' },
    { title: t('目标用户'), render: (_, record) => targetText(record) },
    { title: t('上级/下级'), render: (_, record) => relationText(record, t) },
    { title: t('金额/额度'), render: (_, record) => amountText(record) },
    { title: t('操作'), dataIndex: 'action', render: (_, record) => actionText(record, t) },
    { title: t('备注'), dataIndex: 'remark', render: (_, record) => remarkText(record) },
  ];

  return (
    <Modal title={t('操作记录')} visible={visible} onCancel={onCancel} footer={null} width={1100}>
      <Table
        columns={columns}
        dataSource={logs}
        loading={loading}
        rowKey='key'
        scroll={{ x: 'max-content' }}
        pagination={total > 0 ? {
          currentPage,
          pageSize,
          total,
          onPageChange,
          onPageSizeChange,
          pageSizeOpts: [10, 20, 50],
          showSizeChanger: true,
          showTotal: true,
          formatPageText: (page) => `${t('第')} ${page.currentStart}-${page.currentEnd} ${t('条，共')} ${total} ${t('条')}`,
        } : false}
      />
    </Modal>
  );
};

export default QuotaLogsModal;
