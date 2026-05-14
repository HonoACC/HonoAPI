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
import { Tag, Button, Space, Modal, Tooltip, Popover, Progress, Typography, Dropdown } from '@douyinfe/semi-ui';
import { IconMore } from '@douyinfe/semi-icons';
import { renderQuota } from '../../../helpers/render';
import { isRoot, isSeniorDistributorRole } from '../../../helpers';

const roleTag = (role, t) => {
  if (role === 8) return <Tag color='cyan' shape='circle'>{t('高级分销商')}</Tag>;
  if (role === 7) return <Tag color='green' shape='circle'>{t('分销商')}</Tag>;
  if (role === 1) return <Tag color='blue' shape='circle'>{t('普通用户')}</Tag>;
  return <Tag color='grey' shape='circle'>{role}</Tag>;
};

const roleText = (role, t) => {
  if (role === 8) return t('高级分销商');
  if (role === 7) return t('分销商');
  if (role === 1) return t('普通用户');
  return role;
};

const statusTag = (status, t) => {
  if (status === 1) return <Tag color='green' shape='circle'>{t('正常')}</Tag>;
  return <Tag color='red' shape='circle'>{t('禁用')}</Tag>;
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

const relationTag = (record, t) => {
  const parentText = record.parent_user_id === 0
    ? t('超级管理员')
    : (record.parent_username || '-');
  return (
    <Tag color='white' shape='circle' className='!text-xs'>
      {parentText}
    </Tag>
  );
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
    title: t('角色'),
    dataIndex: 'role',
    key: 'role',
    render: (role) => roleTag(role, t),
  },
  {
    title: (
      <Tooltip content={t('已分配金额：给下级分销商分配的可分发额度，可用与下级分发系统额度或可分发金额。')}>
        <span>{t('剩余/已分配金额')}</span>
      </Tooltip>
    ),
    dataIndex: 'allocated_amount',
    key: 'allocated_amount',
    render: (_, record) => {
      if (!isDistributor(record.role)) return '-';
      const { Paragraph } = Typography;
      const remain = parseInt(record.distributable_quota) || 0;
      const total = parseInt(record.allocated_amount) || 0;
      const percent = total > 0 ? (remain / total) * 100 : 0;
      const popoverContent = (
        <div className='text-xs p-2'>
          <Paragraph copyable={{ content: renderQuota(remain) }}>
            {t('剩余')}: {renderQuota(remain)}
          </Paragraph>
          <Paragraph copyable={{ content: renderQuota(total) }}>
            {t('已分配')}: {renderQuota(total)}
          </Paragraph>
        </div>
      );
      return (
        <Popover content={popoverContent} position='top'>
          <Tag color='white' shape='circle'>
            <div className='flex flex-col items-end'>
              <span className='text-xs leading-none'>{`${renderQuota(remain)} / ${renderQuota(total)}`}</span>
              <Progress
                percent={percent}
                aria-label='allocated amount usage'
                format={() => `${percent.toFixed(0)}%`}
                style={{ width: '100%', marginTop: '1px', marginBottom: 0 }}
              />
            </div>
          </Tag>
        </Popover>
      );
    },
  },
  {
    title: (
      <Tooltip content={t('已分配额度：给普通用户分配的系统额度，可用于大模型调用。')}>
        <span>{t('剩余/总额度')}</span>
      </Tooltip>
    ),
    dataIndex: 'allocated_quota',
    key: 'allocated_quota',
    render: (_, record) => {
      const remain = parseInt(record.quota) || 0;
      const used = parseInt(record.used_quota) || 0;
      const total = used + remain;
      const allocated = parseInt(record.allocated_quota) || 0;
      if (total === 0 && allocated === 0) return '-';
      const { Paragraph } = Typography;
      const percent = total > 0 ? (remain / total) * 100 : 0;
      const popoverContent = (
        <div className='text-xs p-2'>
          <Paragraph copyable={{ content: renderQuota(remain) }}>
            {t('剩余')}: {renderQuota(remain)}
          </Paragraph>
          <Paragraph copyable={{ content: renderQuota(allocated) }}>
            {t('已分配')}: {renderQuota(allocated)}
          </Paragraph>
          <Paragraph copyable={{ content: renderQuota(total) }}>
            {t('总额度')}: {renderQuota(total)}
          </Paragraph>
        </div>
      );
      return (
        <Popover content={popoverContent} position='top'>
          <Tag color='white' shape='circle'>
            <div className='flex flex-col items-end'>
              <span className='text-xs leading-none'>{`${renderQuota(remain)} / ${renderQuota(total)}`}</span>
              <Progress
                percent={percent}
                aria-label='quota usage'
                format={() => `${percent.toFixed(0)}%`}
                style={{ width: '100%', marginTop: '1px', marginBottom: 0 }}
              />
            </div>
          </Tag>
        </Popover>
      );
    },
  },
  {
    title: t('上级'),
    key: 'relation',
    render: (_, record) => relationTag(record, t),
  },
  {
    title: t('状态'),
    dataIndex: 'status',
    key: 'status',
    render: (status) => statusTag(status, t),
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
    width: 150,
    render: (_, record) => {
      const moreMenu = [
        {
          node: 'item',
          name: t('记录'),
          onClick: () => openLogs(record),
        },
        {
          node: 'item',
          name: t('备注'),
          onClick: () => openRemark(record),
        },
        ...(setDistributorRole && canSetSenior() && record.role !== 8
          ? [{ node: 'item', name: t('设为高级分销商'), onClick: () => confirmSetRole({ t, record, role: 8, setDistributorRole }) }]
          : []),
        ...(setDistributorRole && canSetDistributor() && record.role !== 7
          ? [{ node: 'item', name: t('设为分销商'), onClick: () => confirmSetRole({ t, record, role: 7, setDistributorRole }) }]
          : []),
        ...(setDistributorRole && canSetDistributor() && record.role !== 1
          ? [{ node: 'item', name: t('设为普通用户'), onClick: () => confirmSetRole({ t, record, role: 1, setDistributorRole }) }]
          : []),
      ];

      return (
        <Space>
          <Button size='small' type='tertiary' onClick={() => openGrant(record)}>
            {isDistributor(record.role) ? t('添加分销金额') : t('添加用户额度')}
          </Button>
          <Dropdown
            trigger='click'
            position='bottomRight'
            menu={moreMenu}
          >
            <Button size='small' type='tertiary' icon={<IconMore />} />
          </Dropdown>
        </Space>
      );
    },
  },
  ];

  return isRoot() ? columns : columns.filter((column) => column.key !== 'relation');
};
