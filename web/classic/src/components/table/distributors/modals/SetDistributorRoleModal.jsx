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

import React, { useState } from 'react';
import { Modal, Input, Button, Typography, Spin, Empty, Space, Tag, Select } from '@douyinfe/semi-ui';

const roleText = (role, t) => {
  if (role === 8) return t('高级分销商');
  if (role === 7) return t('分销商');
  if (role === 1) return t('普通用户');
  return role;
};

const SetDistributorRoleModal = ({ visible, onCancel, t, searchRoleCandidates, setDistributorRole }) => {
  const [keyword, setKeyword] = useState('');
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [targetRole, setTargetRole] = useState(8);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    setUsers(await searchRoleCandidates(keyword));
    setLoading(false);
  };

  const submit = async () => {
    if (!selected || !targetRole) return;
    const ok = await setDistributorRole({ userId: selected.id, role: Number(targetRole) });
    if (ok) {
      setKeyword('');
      setUsers([]);
      setSelected(null);
      setTargetRole(8);
    }
  };

  return (
    <Modal
      title={t('设置分销角色')}
      visible={visible}
      onCancel={onCancel}
      onOk={submit}
      okButtonProps={{ disabled: !selected || !targetRole }}
    >
      <Typography.Text type='secondary'>
        {t('超级管理员可在这里搜索用户，并将其设置为高级分销商、分销商或普通用户。')}
      </Typography.Text>
      <div className='flex gap-2 my-3'>
        <Input value={keyword} onChange={setKeyword} placeholder={t('输入用户名、邮箱或用户 ID 搜索')} onEnterPress={search} />
        <Button onClick={search} loading={loading}>{t('搜索')}</Button>
      </div>
      <Spin spinning={loading}>
        <div className='flex flex-col gap-2 max-h-[260px] overflow-y-auto'>
          {users.length === 0 ? (
            <Empty description={t('请输入关键词搜索用户')} />
          ) : (
            users.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelected(item);
                  setTargetRole(item.role === 8 ? 7 : 8);
                }}
                className='flex items-center justify-between rounded-lg border px-3 py-2 cursor-pointer'
                style={{
                  borderColor:
                    selected?.id === item.id
                      ? 'var(--semi-color-primary)'
                      : 'var(--semi-color-border)',
                  background:
                    selected?.id === item.id
                      ? 'var(--semi-color-fill-0)'
                      : 'var(--semi-color-bg-0)',
                }}
              >
                <div className='flex flex-col'>
                  <Typography.Text strong>{item.username}</Typography.Text>
                  <Typography.Text type='tertiary'>
                    ID: {item.id} · {item.email || item.display_name || '-'}
                  </Typography.Text>
                </div>
                <Space>
                  <Tag>{roleText(item.role, t)}</Tag>
                  {selected?.id === item.id && <Tag color='green'>{t('已选择')}</Tag>}
                </Space>
              </div>
            ))
          )}
        </div>
      </Spin>
      <div className='mt-3'>
        <Typography.Text>{t('目标角色')}</Typography.Text>
        <Select
          className='mt-2'
          value={targetRole}
          onChange={setTargetRole}
          style={{ width: '100%' }}
          optionList={[
            { label: t('高级分销商'), value: 8 },
            { label: t('分销商'), value: 7 },
            { label: t('普通用户'), value: 1 },
          ]}
        />
      </div>
    </Modal>
  );
};

export default SetDistributorRoleModal;
