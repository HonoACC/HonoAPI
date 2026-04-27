import React, { useEffect, useState } from 'react';
import { API, showError, showSuccess } from '../helpers';
import { Card, Table, Button, Modal, Form, Space, Typography, Tag, Banner } from '@douyinfe/semi-ui';
import { IconSearch, IconPlus } from '@douyinfe/semi-icons';

const { Text } = Typography;

function Subordinates() {
  const [subordinates, setSubordinates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [rechargeModalVisible, setRechargeModalVisible] = useState(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [note, setNote] = useState('');
  const [quotaPool, setQuotaPool] = useState(0);

  const loadSubordinates = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/user/manager/subordinates');
      const { success, data, message } = res.data;
      if (success) {
        setSubordinates(data || []);
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
    loadSubordinates();
    loadQuotaPool();
  }, []);

  const handleAddSubordinate = async () => {
    if (!searchUsername.trim()) {
      showError('请输入用户名');
      return;
    }
    try {
      const res = await API.post('/api/user/manager/subordinate/add', { username: searchUsername.trim() });
      const { success, message } = res.data;
      if (success) {
        showSuccess('添加成功');
        setAddModalVisible(false);
        setSearchUsername('');
        loadSubordinates();
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
      const res = await API.post('/api/user/manager/subordinate/recharge', { user_id: selectedUser.id, amount: amount });
      const { success, message } = res.data;
      if (success) {
        showSuccess('充值成功');
        setRechargeModalVisible(false);
        setRechargeAmount('');
        setSelectedUser(null);
        loadSubordinates();
        loadQuotaPool();
      } else {
        showError(message);
      }
    } catch (error) {
      showError('充值失败');
    }
  };

  const handleUpdateNote = async () => {
    try {
      const res = await API.put('/api/user/manager/subordinate/note', { user_id: selectedUser.id, note: note });
      const { success, message } = res.data;
      if (success) {
        showSuccess('更新成功');
        setNoteModalVisible(false);
        setNote('');
        setSelectedUser(null);
        loadSubordinates();
      } else {
        showError(message);
      }
    } catch (error) {
      showError('更新失败');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '用户名', dataIndex: 'username', width: 150 },
    { title: '显示名称', dataIndex: 'display_name', width: 150 },
    { title: '剩余额度', dataIndex: 'quota', render: (quota) => <Text>{(quota / 500000).toFixed(2)} 元</Text> },
    { title: '已用额度', dataIndex: 'used_quota', render: (used_quota) => <Text>{(used_quota / 500000).toFixed(2)} 元</Text> },
    { title: '状态', dataIndex: 'status', width: 100, render: (status) => status === 1 ? <Tag color='green'>启用</Tag> : <Tag color='red'>禁用</Tag> },
    { title: '备注', dataIndex: 'note', width: 200, render: (note) => <Text ellipsis={{ showTooltip: true }}>{note || '-'}</Text> },
    { title: '操作', width: 200, render: (text, record) => (<Space><Button size='small' type='primary' onClick={() => { setSelectedUser(record); setRechargeModalVisible(true); }}>充值</Button><Button size='small' onClick={() => { setSelectedUser(record); setNote(record.note || ''); setNoteModalVisible(true); }}>备注</Button></Space>) }
  ];

  return (
    <>
      <div className='mt-[60px] px-2'>
        <Banner type='info' description={'当前可用额度池：' + (quotaPool / 500000).toFixed(2) + ' 元'} closeIcon={null} style={{ marginBottom: '20px' }} />
        <Card title='下级管理' headerExtraContent={<Button icon={<IconPlus />} type='primary' onClick={() => setAddModalVisible(true)}>添加下级</Button>}>
          <Table columns={columns} dataSource={subordinates} loading={loading} pagination={false} rowKey='id' />
        </Card>
      </div>
      <Modal title='添加下级用户' visible={addModalVisible} onOk={handleAddSubordinate} onCancel={() => { setAddModalVisible(false); setSearchUsername(''); }} okText='添加' cancelText='取消'><Form><Form.Input field='username' label='用户名' placeholder='请输入用户名' value={searchUsername} onChange={setSearchUsername} prefix={<IconSearch />} /></Form></Modal>
      <Modal title='充值额度' visible={rechargeModalVisible} onOk={handleRecharge} onCancel={() => { setRechargeModalVisible(false); setRechargeAmount(''); setSelectedUser(null); }} okText='确定' cancelText='取消'><Form><Form.Input field='amount' label='充值金额' placeholder='请输入充值金额（单位：分）' value={rechargeAmount} onChange={setRechargeAmount} type='number' /><Text type='tertiary' size='small'>提示：1元 = 500000 分，当前可用：{(quotaPool / 500000).toFixed(2)} 元</Text></Form></Modal>
      <Modal title='编辑备注' visible={noteModalVisible} onOk={handleUpdateNote} onCancel={() => { setNoteModalVisible(false); setNote(''); setSelectedUser(null); }} okText='保存' cancelText='取消'><Form><Form.TextArea field='note' label='备注' placeholder='请输入备注信息' value={note} onChange={setNote} rows={4} /></Form></Modal>
    </>
  );
}

export default Subordinates;
