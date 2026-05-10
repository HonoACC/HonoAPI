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
import { Modal, InputNumber, Typography, TextArea } from '@douyinfe/semi-ui';
import { renderQuota, getCurrencyConfig } from '../../../../helpers/render';
import { displayAmountToQuota } from '../../../../helpers/quota';

const GrantQuotaModal = ({ visible, onCancel, t, child, summary, grantQuota }) => {
  const [amount, setAmount] = useState(0);
  const [remark, setRemark] = useState('');

  useEffect(() => {
    if (visible) {
      setAmount(0);
      setRemark('');
    }
  }, [visible]);

  const quotaAmount = displayAmountToQuota(amount);

  const submit = async () => {
    await grantQuota({ targetUserId: child.id, amount: quotaAmount, remark });
  };

  return (
    <Modal title={t('添加额度')} visible={visible} onCancel={onCancel} onOk={submit} okButtonProps={{ disabled: !child || quotaAmount <= 0 }}>
      {child && (
        <div className='flex flex-col gap-3'>
          <Typography.Text>{t('目标用户')}：{child.username}</Typography.Text>
          <Typography.Text>{t('当前可分配金额')}：{renderQuota(summary?.distributable_quota || 0)}</Typography.Text>
          <InputNumber
            min={1}
            value={amount}
            onChange={(value) => setAmount(value === '' || value == null ? 0 : value)}
            precision={2}
            step={1}
            prefix={getCurrencyConfig().symbol}
            style={{ width: '100%' }}
            placeholder={t('请输入添加金额')}
          />
          <TextArea value={remark} onChange={setRemark} placeholder={t('备注')} autosize />
        </div>
      )}
    </Modal>
  );
};

export default GrantQuotaModal;
