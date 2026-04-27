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
import { Modal, Form, InputNumber, Typography } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import { API, showError, showSuccess } from '../../../../helpers';
import { renderQuota } from '../../../../helpers';

const AddQuotaModal = ({ visible, handleClose, user, quotaPool, refresh }) => {
  const { t } = useTranslation();
  const { Text } = Typography;
  const [loading, setLoading] = useState(false);
  const [formApi, setFormApi] = useState(null);

  const handleSubmit = async () => {
    const values = formApi.getValues();
    const quota = parseInt(values.quota);

    if (!quota || quota <= 0) {
      showError(t('请输入有效的额度'));
      return;
    }

    if (quota > quotaPool) {
      showError(t('额度不足，当前可用额度池：') + renderQuota(quotaPool));
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/api/user/manage', {
        id: user.id,
        action: 'add_quota',
        quota: quota,
      });

      const { success, message } = res.data;
      if (success) {
        showSuccess(t('额度添加成功'));
        handleClose();
        refresh();
      } else {
        showError(message);
      }
    } catch (error) {
      showError(t('操作失败'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t('为用户添加额度')}
      visible={visible}
      onOk={handleSubmit}
      onCancel={handleClose}
      confirmLoading={loading}
      okText={t('确定')}
      cancelText={t('取消')}
    >
      <Form
        getFormApi={(api) => setFormApi(api)}
        labelPosition='left'
        labelAlign='right'
        labelWidth={120}
      >
        <Form.Input
          field='username'
          label={t('用户名')}
          disabled
          initValue={user?.username}
        />
        <Form.Input
          field='current_quota'
          label={t('当前剩余额度')}
          disabled
          initValue={renderQuota(user?.quota || 0)}
        />
        <div style={{ marginBottom: 16, paddingLeft: 120 }}>
          <Text type='tertiary'>
            {t('可用额度池')}: <Text strong>{renderQuota(quotaPool)}</Text>
          </Text>
        </div>
        <Form.InputNumber
          field='quota'
          label={t('添加额度')}
          placeholder={t('请输入要添加的额度')}
          min={1}
          max={quotaPool}
          style={{ width: '100%' }}
          rules={[
            { required: true, message: t('请输入额度') },
            {
              type: 'number',
              min: 1,
              message: t('额度必须大于0'),
            },
            {
              validator: (rule, value) => {
                if (value > quotaPool) {
                  return Promise.reject(t('超出可用额度池'));
                }
                return Promise.resolve();
              },
            },
          ]}
        />
      </Form>
    </Modal>
  );
};

export default AddQuotaModal;
