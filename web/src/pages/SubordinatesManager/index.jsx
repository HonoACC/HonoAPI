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

import React, { useEffect, useState } from 'react';
import { API, showError, showSuccess } from '../../helpers';
import { useTranslation } from 'react-i18next';
import { Modal, Form, Card, Table, Button, Space, Typography, Tag } from '@douyinfe/semi-ui';
import { IconPlus } from '@douyinfe/semi-icons';
import { renderGroup, renderQuota } from '../../helpers';

const { Text } = Typography;

const SubordinatesManager = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [quotaPool, setQuotaPool] = useState(0);
  const [addUsername, setAddUsername] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/user/manager/subordinates');
      const { success, data, message } = res.data;
      if (success) {
        setUsers(data || []);
      } else {
        showError(message);
      }
    } catch (error) {
      showError('加载失败');
    }
    setLoading(false);
  };

  const loadQuotaPool = async () => {
    try {
      const res = await API.get('/api/user/self');
      const { success, data } = res.data;
      if (success && data) {
        setQuotaPool(data.quota_pool || 0);
      }
    } catch (error) {
      console.error('加载额度池失败', error);
    }
  };

  useEffect(() => {
    loadUsers();
    loadQuotaPool();
  }, []);

  const refresh = async () => {
    await loadUsers();
    await loadQuotaPool();
  };

  const handleAddSubordinate = async () => {
    if (!addUsername.trim()) {
      showError('请输入用户名');
      return;
    }
    try {
      const res = await API.post('/api/user/manager/subordinate/add', { username: addUsername.trim() });
      const { success, message } = res.data;
      if (success) {
        showSuccess('添加成功');
        setShowAddUser(false);
        setAddUsername('');
        refresh();
      } else {
        showError(message);
      }
    } catch (error) {
      showError('添加失败');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: t('用户名'), dataIndex: 'username', width: 150 },
    { title: t('显示名称'), dataIndex: 'display_name', width: 150 },
    { 
      title: t('剩余额度'), 
      dataIndex: 'quota', 
      render: (quota) => <Text>{renderQuota(quota)}</Text> 
    },
    { 
      title: t('已用额度'), 
      dataIndex: 'used_quota', 
      render: (used_quota) => <Text>{renderQuota(used_quota)}</Text> 
    },
    { 
      title: t('分组'), 
      dataIndex: 'group', 
      render: (group) => <div>{renderGroup(group)}</div> 
    },
    { 
      title: t('状态'), 
      dataIndex: 'status', 
      width: 100, 
      render: (status) => status === 1 ? <Tag color='green'>{t('已启用')}</Tag> : <Tag color='red'>{t('已禁用')}</Tag> 
    },
    { 
      title: t('备注'), 
      dataIndex: 'note', 
      width: 200, 
      render: (note) => <Text ellipsis={{ showTooltip: true }}>{note || '-'}</Text> 
    },
  ];

  return (
    <div className='mt-[60px] px-2'>
      <div className='flex items-center gap-4 mb-4'>
        <Text strong size='large'>{t('下级管理')}</Text>
        <Text type='tertiary'>
          {t('当前可用额度池')}：{renderQuota(quotaPool)}
        </Text>
      </div>
      <Card 
        title={t('下级用户列表')} 
        headerExtraContent={
          <Button 
            icon={<IconPlus />} 
            type='primary' 
            onClick={() => setShowAddUser(true)}
          >
            {t('添加下级')}
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={users} 
          loading={loading} 
          pagination={false} 
          rowKey='id' 
        />
      </Card>
      <Modal
        title={t('添加下级用户')}
        visible={showAddUser}
        onOk={handleAddSubordinate}
        onCancel={() => {
          setShowAddUser(false);
          setAddUsername('');
        }}
        okText={t('添加')}
        cancelText={t('取消')}
      >
        <Form>
          <Form.Input
            field="username"
            label={t('用户名')}
            placeholder={t('请输入用户名')}
            value={addUsername}
            onChange={setAddUsername}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default SubordinatesManager;
