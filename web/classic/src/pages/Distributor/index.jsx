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
import CardPro from '../../components/common/ui/CardPro';
import DistributorsActions from '../../components/table/distributors/DistributorsActions';
import DistributorsDescription from '../../components/table/distributors/DistributorsDescription';
import DistributorsFilters from '../../components/table/distributors/DistributorsFilters';
import DistributorsTable from '../../components/table/distributors/DistributorsTable';
import BindChildModal from '../../components/table/distributors/modals/BindChildModal';
import GrantQuotaModal from '../../components/table/distributors/modals/GrantQuotaModal';
import EditRemarkModal from '../../components/table/distributors/modals/EditRemarkModal';
import QuotaLogsModal from '../../components/table/distributors/modals/QuotaLogsModal';
import { useDistributorData } from '../../hooks/distributors/useDistributorData';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { createCardProPagination } from '../../helpers/utils';

const Distributor = () => {
  const data = useDistributorData();
  const isMobile = useIsMobile();

  return (
    <div className='mt-[60px] px-2'>
      <BindChildModal
        visible={data.bindVisible}
        onCancel={() => data.setBindVisible(false)}
        t={data.t}
        searchBindableUsers={data.searchBindableUsers}
        bindChild={data.bindChild}
      />
      <GrantQuotaModal
        visible={data.grantVisible}
        onCancel={() => data.setGrantVisible(false)}
        t={data.t}
        child={data.currentChild}
        summary={data.summary}
        grantQuota={data.grantQuota}
      />
      <EditRemarkModal
        visible={data.remarkVisible}
        onCancel={() => data.setRemarkVisible(false)}
        t={data.t}
        child={data.currentChild}
        updateRemark={data.updateRemark}
      />
      <QuotaLogsModal
        visible={data.logsVisible}
        onCancel={() => data.setLogsVisible(false)}
        t={data.t}
        logs={data.logs}
        loading={data.logsLoading}
        currentPage={data.logsPage}
        pageSize={data.logsPageSize}
        total={data.logsTotal}
        onPageChange={data.handleLogsPageChange}
        onPageSizeChange={data.handleLogsPageSizeChange}
      />
      <CardPro
        type='type1'
        descriptionArea={<DistributorsDescription t={data.t} summary={data.summary} />}
        actionsArea={
          <div className='flex flex-col md:flex-row justify-between items-center gap-2 w-full'>
            <DistributorsActions t={data.t} setBindVisible={data.setBindVisible} openLogs={data.openLogs} />
            <DistributorsFilters {...data} />
          </div>
        }
        paginationArea={createCardProPagination({
          currentPage: data.activePage,
          pageSize: data.pageSize,
          total: data.total,
          onPageChange: data.handlePageChange,
          onPageSizeChange: data.handlePageSizeChange,
          isMobile,
          t: data.t,
        })}
        t={data.t}
      >
        <DistributorsTable {...data} />
      </CardPro>
    </div>
  );
};

export default Distributor;
