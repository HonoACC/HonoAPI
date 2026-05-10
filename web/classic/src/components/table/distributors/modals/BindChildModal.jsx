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
import { Modal, Input, Button, Typography, Spin, Empty, Space, Tag, TextArea, Toast } from '@douyinfe/semi-ui';

const BindChildModal = ({ visible, onCancel, t, searchBindableUsers, bindChild }) => {
  const [keyword, setKeyword] = useState('');
  const [remark, setRemark] = useState('');
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async () => {
    if (loading) return;
    const text = keyword.trim();
    if (!text) {
      Toast.warning(t('请输入关键词'));
      return;
    }
    setLoading(true);
    setSelected(null);
    try {
      const result = await searchBindableUsers(text);
      setUsers(result || []);
      setSearched(true);
    } catch (error) {
      Toast.error(t('搜索失败，请稍后重试'));
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!selected) return;
    const success = await bindChild({ childUserId: selected.id, remark });
    if (success) {
      setKeyword('');
      setRemark('');
      setUsers([]);
      setSelected(null);
      setSearched(false);
    }
  };

  const closeModal = () => {
    setKeyword('');
    setRemark('');
    setUsers([]);
    setSelected(null);
    setSearched(false);
    onCancel();
  };

  return (
    <Modal title={t('添加下级')} visible={visible} onCancel={closeModal} onOk={submit} okButtonProps={{ disabled: !selected }}>
      <div className='flex gap-2 mb-3'>
        <Input value={keyword} onChange={setKeyword} placeholder={t('输入用户名、邮箱或用户 ID 搜索')} onEnterPress={search} />
        <Button htmlType='button' onClick={search} loading={loading}>{t('搜索')}</Button>
      </div>
      <Spin spinning={loading}>
        <div className='flex flex-col gap-2 max-h-[320px] overflow-y-auto'>
          {users.length === 0 ? (
            <Empty
              description={
                searched
                  ? t('未找到可绑定普通用户，请确认用户存在、角色为普通用户且尚未绑定上级')
                  : t('请输入关键词搜索可绑定用户')
              }
            />
          ) : (
            users.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelected(item)}
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
                  <Tag>{item.role === 7 ? t('分销商') : t('普通用户')}</Tag>
                  {selected?.id === item.id && <Tag color='green'>{t('已选择')}</Tag>}
                </Space>
              </div>
            ))
          )}
        </div>
      </Spin>
      <TextArea className='mt-3' value={remark} onChange={setRemark} placeholder={t('备注')} autosize />
    </Modal>
  );
};

export default BindChildModal;
