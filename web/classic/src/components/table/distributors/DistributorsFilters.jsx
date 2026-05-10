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
import { Form, Button } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';

const DistributorsFilters = ({
  t,
  keyword,
  setKeyword,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  loadChildren,
  loading,
}) => {
  const handleReset = () => {
    setKeyword('');
    setRoleFilter('');
    setStatusFilter('');
    setTimeout(() => loadChildren(1), 100);
  };

  return (
    <Form
      allowEmpty={true}
      autoComplete='off'
      layout='horizontal'
      trigger='change'
      stopValidateWithError={false}
      className='w-full md:w-auto order-1 md:order-2'
      onSubmit={() => loadChildren(1)}
    >
      <div className='flex flex-col md:flex-row items-center gap-2 w-full md:w-auto'>
        <div className='relative w-full md:w-64'>
          <Form.Input
            field='keyword'
            value={keyword}
            onChange={setKeyword}
            prefix={<IconSearch />}
            placeholder={t('搜索用户名、邮箱或显示名')}
            showClear
            pure
            size='small'
          />
        </div>
        <div className='w-full md:w-40'>
          <Form.Select
            field='roleFilter'
            placeholder={t('角色')}
            value={roleFilter}
            onChange={(value) => {
              setRoleFilter(value || '');
              setTimeout(() => loadChildren(1), 100);
            }}
            className='w-full'
            showClear
            pure
            size='small'
            optionList={[
              { label: t('普通用户'), value: '1' },
              { label: t('分销商'), value: '7' },
              { label: t('高级分销商'), value: '8' },
            ]}
          />
        </div>
        <div className='w-full md:w-40'>
          <Form.Select
            field='statusFilter'
            placeholder={t('状态')}
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value || '');
              setTimeout(() => loadChildren(1), 100);
            }}
            className='w-full'
            showClear
            pure
            size='small'
            optionList={[
              { label: t('正常'), value: '1' },
              { label: t('禁用'), value: '2' },
            ]}
          />
        </div>
        <div className='flex gap-2 w-full md:w-auto'>
          <Button
            type='tertiary'
            htmlType='submit'
            loading={loading}
            className='flex-1 md:flex-initial md:w-auto'
            size='small'
          >
            {t('查询')}
          </Button>
          <Button
            type='tertiary'
            onClick={handleReset}
            className='flex-1 md:flex-initial md:w-auto'
            size='small'
          >
            {t('重置')}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default DistributorsFilters;
