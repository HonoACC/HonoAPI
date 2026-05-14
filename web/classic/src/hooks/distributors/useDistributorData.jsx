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

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { API, showError, showSuccess } from '../../helpers';
import { ITEMS_PER_PAGE } from '../../constants';

export const useDistributorData = () => {
  const { t } = useTranslation();
  const [summary, setSummary] = useState(null);
  const [children, setChildren] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [bindVisible, setBindVisible] = useState(false);
  const [grantVisible, setGrantVisible] = useState(false);
  const [remarkVisible, setRemarkVisible] = useState(false);
  const [logsVisible, setLogsVisible] = useState(false);
  const [logsPage, setLogsPage] = useState(1);
  const [logsPageSize, setLogsPageSize] = useState(10);
  const [logsTotal, setLogsTotal] = useState(0);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsTargetUserId, setLogsTargetUserId] = useState('');
  const [currentChild, setCurrentChild] = useState(null);

  const setChildFormat = (items) => {
    setChildren((items || []).map((item) => ({ ...item, key: item.id })));
  };

  const loadSummary = async () => {
    const res = await API.get('/api/distributor/summary');
    const { success, message, data } = res.data;
    if (success) {
      setSummary(data);
    } else {
      showError(message);
    }
  };

  const loadChildren = async (page = activePage, size = pageSize) => {
    setLoading(true);
    const params = new URLSearchParams({ p: page, page_size: size });
    if (keyword) params.set('keyword', keyword);
    if (roleFilter) params.set('role', roleFilter);
    if (statusFilter) params.set('status', statusFilter);
    const res = await API.get(`/api/distributor/children?${params.toString()}`);
    const { success, message, data } = res.data;
    if (success) {
      setActivePage(data.page);
      setTotal(data.total);
      setChildFormat(data.items);
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const refresh = async () => {
    await Promise.all([loadSummary(), loadChildren(activePage, pageSize)]);
  };

  const searchBindableUsers = async (searchKeyword) => {
    try {
      const params = new URLSearchParams({ keyword: searchKeyword });
      const res = await API.get(
        `/api/distributor/search-bindable-users?${params.toString()}`,
        { disableDuplicate: true },
      );
      const { success, message, data } = res.data;
      if (success) return data || [];
      showError(message);
      return [];
    } catch (error) {
      showError(error);
      return [];
    }
  };

  const bindChild = async ({ childUserId, remark }) => {
    const res = await API.post('/api/distributor/bind', {
      parent_user_id: 0,
      child_user_id: childUserId,
      remark,
    });
    const { success, message } = res.data;
    if (success) {
      showSuccess(t('绑定成功'));
      setBindVisible(false);
      await refresh();
      return true;
    }
    showError(message);
    return false;
  };

  const grantQuota = async ({ targetUserId, amount, remark }) => {
    const res = await API.post('/api/distributor/grant-quota', {
      target_user_id: targetUserId,
      amount,
      remark,
    });
    const { success, message } = res.data;
    if (success) {
      showSuccess(t('额度添加成功'));
      setGrantVisible(false);
      await refresh();
      return true;
    }
    showError(message);
    return false;
  };

  const updateRemark = async ({ childUserId, remark }) => {
    const res = await API.put(`/api/distributor/relation/${childUserId}/remark`, {
      remark,
    });
    const { success, message } = res.data;
    if (success) {
      showSuccess(t('备注已更新'));
      setRemarkVisible(false);
      await refresh();
      return true;
    }
    showError(message);
    return false;
  };

  const setDistributorRole = async ({ userId, role }) => {
    const res = await API.post('/api/distributor/set-role', {
      user_id: userId,
      role,
    });
    const { success, message } = res.data;
    if (success) {
      showSuccess(t('角色已更新'));
      await refresh();
      return true;
    }
    showError(message);
    return false;
  };

  const loadLogs = async (targetUserId = '', page = 1, size = 10) => {
    setLogsLoading(true);
    const params = new URLSearchParams({ p: page, page_size: size });
    if (targetUserId) params.set('target_user_id', targetUserId);
    const res = await API.get(`/api/distributor/operation-logs?${params.toString()}`);
    const { success, message, data } = res.data;
    if (success) {
      setLogs((data.items || []).map((item, index) => ({
        ...item,
        key: `${item.log_type || 'log'}-${item.id || index}`,
      })));
      setLogsPage(data.page || page);
      setLogsTotal(data.total || 0);
    } else {
      showError(message);
    }
    setLogsLoading(false);
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    loadChildren(page, pageSize).then();
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setActivePage(1);
    loadChildren(1, size).then();
  };

  const openGrant = (child) => {
    setCurrentChild(child);
    setGrantVisible(true);
  };

  const openRemark = (child) => {
    setCurrentChild(child);
    setRemarkVisible(true);
  };

  const openLogs = async (child = null) => {
    setCurrentChild(child);
    const targetId = child?.id || '';
    setLogsTargetUserId(targetId);
    setLogsPage(1);
    await loadLogs(targetId, 1, logsPageSize);
    setLogsVisible(true);
  };

  const handleLogsPageChange = (page) => {
    setLogsPage(page);
    loadLogs(logsTargetUserId, page, logsPageSize);
  };

  const handleLogsPageSizeChange = (size) => {
    setLogsPageSize(size);
    setLogsPage(1);
    loadLogs(logsTargetUserId, 1, size);
  };

  useEffect(() => {
    refresh().then();
  }, []);

  return {
    t,
    summary,
    children,
    logs,
    logsLoading,
    logsPage,
    logsPageSize,
    logsTotal,
    loading,
    activePage,
    pageSize,
    total,
    keyword,
    setKeyword,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    bindVisible,
    setBindVisible,
    grantVisible,
    setGrantVisible,
    remarkVisible,
    setRemarkVisible,
    logsVisible,
    setLogsVisible,
    currentChild,
    loadChildren,
    refresh,
    searchBindableUsers,
    bindChild,
    grantQuota,
    updateRemark,
    setDistributorRole,
    openGrant,
    openRemark,
    openLogs,
    handlePageChange,
    handlePageSizeChange,
    handleLogsPageChange,
    handleLogsPageSizeChange,
  };
};
