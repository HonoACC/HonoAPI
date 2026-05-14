/*
Copyright (C) 2025 QuantumNous

This file is part of HonoAPI.

HonoAPI is licensed under a dual-license model:
1. GNU Affero General Public License v3.0 (AGPL-3.0) for open-source use.
2. A commercial license for proprietary use.

You may use this file under the terms of the AGPL-3.0 license unless you have
obtained a commercial license. See the LICENSE file for more details.

For commercial licensing inquiries, contact: quantumnous@gmail.com
*/
import React from 'react';
import { Empty } from '@douyinfe/semi-ui';
import { IllustrationNoResult, IllustrationNoResultDark } from '@douyinfe/semi-illustrations';
import CardTable from '../../common/ui/CardTable';
import { createDistributorColumns } from './DistributorsColumnDefs';

const DistributorsTable = (props) => {
  const columns = createDistributorColumns(props);
  return (
    <CardTable
      columns={columns}
      dataSource={props.children}
      loading={props.loading}
      rowKey='id'
      scroll={{ x: 'max-content' }}
      pagination={false}
      hidePagination={true}
      empty={
        <Empty
          image={<IllustrationNoResult style={{ width: 150, height: 150 }} />}
          darkModeImage={<IllustrationNoResultDark style={{ width: 150, height: 150 }} />}
          description={props.t('搜索无结果')}
          style={{ padding: 30 }}
        />
      }
      className='overflow-hidden'
      size='middle'
    />
  );
};

export default DistributorsTable;
