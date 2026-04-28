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
import { Tag, Button, Space, Modal, Tooltip } from '@douyinfe/semi-ui';
import { renderQuota } from '../../../helpers/render';
import { isRoot, isSeniorDistributorRole } from '../../../helpers';

const roleText = (role, t) => {
  if (role === 8) return t('高级分销商');
  if (role === 7) return t('分销商');
  if (role === 1) return t('普通用户');
  return role;
};

const statusTag = (status, t) => {
  if (status === 1) return <Tag color='green'>{t('正常')}</Tag>;
  return <Tag color='red'>{t('禁用')}</Tag>;
};

const canSetSenior = () => isRoot();
const canSetDistributor = () => isRoot() || isSeniorDistributorRole();
const isDistributor = (role) => role === 7 || role === 8;

const confirmSetRole = ({ t, record, role, setDistributorRole }) => {
  Modal.confirm({
    title: t('确认修改角色'),
    content: `${t('确定要将用户')}「${record.username}」${t('设为')}${roleText(role, t)}？`,
    okText: t('确认'),
    cancelText: t('取消'),
    onOk: () => setDistributorRole({ userId: record.id, role }),
  });
};

const relationText = (record, t) => {
  const parentText = record.parent_user_id === 0
    ? t('超级管理员')
    : (record.parent_username || '-');
  return <span>{parentText}</span>;
};

export const createDistributorColumns = ({ t, openGrant, openRemark, openLogs, setDistributorRole }) => {
  const columns = [
  {
    title: t('用户'),
    dataIndex: 'username',
    key: 'username',
    render: (username) => <span className='font-medium'>{username}</span>,
  },
  {
    title: t('上级'),
    key: 'relation',
    render: (_, record) => relationText(record, t),
  },
  {
    title: t('角色'),
    dataIndex: 'role',
    key: 'role',
    render: (role) => <Tag>{roleText(role, t)}</Tag>,
  },
  {
    title: t('状态'),
    dataIndex: 'status',
    key: 'status',
    render: (status) => statusTag(status, t),
  },
  {
    title: (
      <Tooltip content={t('已分配金额：给下级分销商分配的可分发额度，可用与下级分发系统额度或可分发金额。')}>
        <span>{t('已分配金额')}</span>
      </Tooltip>
    ),
    dataIndex: 'allocated_amount',
    key: 'allocated_amount',
    render: (quota, record) => (isDistributor(record.role) ? renderQuota(quota || 0) : '-'),
  },
  {
    title: (
      <Tooltip content={t('已分配额度：给普通用户分配的系统额度，可用于大模型调用。')}>
        <span>{t('已分配额度')}</span>
      </Tooltip>
    ),
    dataIndex: 'allocated_quota',
    key: 'allocated_quota',
    render: (quota, record) => (record.role === 1 ? renderQuota(quota || 0) : '-'),
  },
  {
    title: t('备注'),
    dataIndex: 'remark',
    key: 'remark',
    render: (remark) => remark || '-',
  },
  {
    title: t('操作'),
    key: 'actions',
    fixed: 'right',
    render: (_, record) => (
      <Space wrap>
        <Button size='small' type='tertiary' onClick={() => openGrant(record)}>
          {isDistributor(record.role) ? t('添加金额') : t('添加额度')}
        </Button>
        <Button size='small' type='tertiary' onClick={() => openRemark(record)}>
          {t('备注')}
        </Button>
        <Button size='small' type='tertiary' onClick={() => openLogs(record)}>
          {t('记录')}
        </Button>
        {setDistributorRole && canSetSenior() && record.role !== 8 && (
          <Button size='small' type='tertiary' onClick={() => confirmSetRole({ t, record, role: 8, setDistributorRole })}>
            {t('设为高级分销商')}
          </Button>
        )}
        {setDistributorRole && canSetDistributor() && record.role !== 7 && (
          <Button size='small' type='tertiary' onClick={() => confirmSetRole({ t, record, role: 7, setDistributorRole })}>
            {t('设为分销商')}
          </Button>
        )}
        {setDistributorRole && canSetDistributor() && record.role !== 1 && (
          <Button size='small' type='tertiary' onClick={() => confirmSetRole({ t, record, role: 1, setDistributorRole })}>
            {t('设为普通用户')}
          </Button>
        )}
      </Space>
    ),
  },
  ];

  return isRoot() ? columns : columns.filter((column) => column.key !== 'relation');
};
