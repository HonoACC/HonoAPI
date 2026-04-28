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
import { Typography } from '@douyinfe/semi-ui';
import { IconUserGroup } from '@douyinfe/semi-icons';
import { renderQuota } from '../../../helpers/render';

const { Text } = Typography;

const DistributorsDescription = ({ t, summary }) => {
  const items = [
    <strong key='distributable'>{`${t('可分配金额')}: ${renderQuota(summary?.distributable_quota || 0)}`}</strong>,
    `${t('下级总数')}: ${summary?.children_count || 0}`,
    `${t('普通下级')}: ${summary?.common_children_count || 0}`,
    `${t('分销商下级')}: ${summary?.distributor_children_count || 0}`,
    `${t('累计分配金额')}: ${renderQuota(summary?.allocated_quota || 0)}`,
  ];

  return (
    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-2 w-full'>
      <div className='flex items-center text-blue-500'>
        <IconUserGroup className='mr-2' />
        <Text>{t('分销管理')}</Text>
      </div>
      <Text type='tertiary' size='small' ellipsis={{ showTooltip: false }}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && ' ｜ '}
            {item}
          </React.Fragment>
        ))}
      </Text>
    </div>
  );
};

export default DistributorsDescription;
