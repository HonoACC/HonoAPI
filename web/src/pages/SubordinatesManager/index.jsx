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
import { renderGroup } from '../../helpers';

const { Text } = Typography;

// 根据用户分组和系统配置计算额度（元）
const calculateQuotaInYuan = (quotaTokens, userGroup) => {
  try {
    // 获取系统配置
    const quotaPerUnit = parseFloat(localStorage.getItem('quota_per_unit')) || 500000;
    const statusStr = localStorage.getItem('status');
    
    // 获取分组倍率
    let groupRatio = 1;
    if (statusStr) {
      const status = JSON.parse(statusStr);
      const groupRatioMap = status?.group_ratio ? JSON.parse(status.group_ratio) : {};
      groupRatio = groupRatioMap[userGroup] || 1;
    }
    
    // 计算：quota_in_yuan = (quota_tokens / quota_per_unit) * group_ratio
    const yuan = (quotaTokens / quotaPerUnit) * groupRatio;
    return yuan.toFixed(2);
  } catch (error) {
    console.error('计算额度失败', error);
    return '0.00';
  }
};

const SubordinatesManager = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [quotaPool, setQuotaPool] = useState(0);
  const [addUsername, setAddUsername] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [note, setNote] = useState('');

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

  const handleRecharge = async () => {
    const amount = parseInt(rechargeAmount);
    if (!amount || amount <= 0) {
      showError('请输入有效的充值金额');
      return;
    }
    if (amount > quotaPool) {
      showError('充值金额超过可用额度');
      return;
    }
    try {
      const res = await API.post('/api/user/manager/subordinate/recharge', { 
        user_id: selectedUser.id, 
        amount: amount 
      });
      const { success, message } = res.data;
      if (success) {
        showSuccess('充值成功');
        setShowRecharge(false);
        setRechargeAmount('');
        setSelectedUser(null);
        refresh();
      } else {
        showError(message);
      }
    } catch (error) {
      showError('充值失败');
    }
  };

  const handleUpdateNote = async () => {
    try {
      const res = await API.put('/api/user/manager/subordinate/note', { 
        user_id: selectedUser.id, 
        note: note 
      });
      const { success, message } = res.data;
      if (success) {
        showSuccess('更新成功');
        setShowNote(false);
        setNote('');
        setSelectedUser(null);
        refresh();
      } else {
        showError(message);
      }
    } catch (error) {
      showError('更新失败');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: t('用户名'), dataIndex: 'username', width: 150 },
    { title: t('显示名称'), dataIndex: 'display_name', width: 150 },
    { 
      title: t('剩余额度'), 
      dataIndex: 'quota', 
      render: (quota, record) => (
        <Text>{calculateQuotaInYuan(quota || 0, record.group || 'default')} 元</Text>
      )
    },
    { 
      title: t('已用额度'), 
      dataIndex: 'used_quota', 
      render: (used_quota, record) => (
        <Text>{calculateQuotaInYuan(used_quota || 0, record.group || 'default')} 元</Text>
      )
    },
    { 
      title: t('分组'), 
      dataIndex: 'group', 
      render: (group) => <div>{group ? renderGroup(group) : 'default'}</div> 
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
    {
      title: t('操作'),
      width: 200,
      render: (text, record) => (
        <Space>
          <Button
            size='small'
            type='primary'
            onClick={() => {
              setSelectedUser(record);
              setShowRecharge(true);
            }}
          >
            增加额度
          </Button>
          <Button
            size='small'
            onClick={() => {
              setSelectedUser(record);
              setNote(record.note || '');
              setShowNote(true);
            }}
          >
            修改备注
          </Button>
        </Space>
      )
    }
  ];

  // 计算可用额度池（元）
  const quotaPoolYuan = calculateQuotaInYuan(quotaPool, 'default');

  return (
    <div className='mt-[60px] px-2'>
      <div className='flex items-center gap-4 mb-4'>
        <Text strong size='large'>{t('下级管理')}</Text>
        <Text type='tertiary'>
          {t('当前可用额度池')}：{quotaPoolYuan} 元
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

      {/* 添加下级用户 Modal */}
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

      {/* 充值额度 Modal */}
      <Modal
        title='充值额度'
        visible={showRecharge}
        onOk={handleRecharge}
        onCancel={() => {
          setShowRecharge(false);
          setRechargeAmount('');
          setSelectedUser(null);
        }}
        okText='确定'
        cancelText='取消'
      >
        <Form>
          <Form.Input
            field='amount'
            label='充值金额'
            placeholder='请输入充值金额（单位：token）'
            value={rechargeAmount}
            onChange={setRechargeAmount}
            type='number'
          />
          <Text type='tertiary' size='small'>
            提示：当前可用额度池 {quotaPoolYuan} 元（{quotaPool} tokens）
          </Text>
        </Form>
      </Modal>

      {/* 编辑备注 Modal */}
      <Modal
        title='编辑备注'
        visible={showNote}
        onOk={handleUpdateNote}
        onCancel={() => {
          setShowNote(false);
          setNote('');
          setSelectedUser(null);
        }}
        okText='保存'
        cancelText='取消'
      >
        <Form>
          <Form.TextArea
            field='note'
            label='备注'
            placeholder='请输入备注信息'
            value={note}
            onChange={setNote}
            rows={4}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default SubordinatesManager;
