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
import { API, showError, showSuccess } from '../../helpers';
import UsersDescription from '../../components/table/users/UsersDescription';
import UsersFilters from '../../components/table/users/UsersFilters';
import UsersActions from '../../components/table/users/UsersActions';
import UsersTable from '../../components/table/users/UsersTable';
import EditUserModal from '../../components/table/users/modals/EditUserModal';
import { useTranslation } from 'react-i18next';
import { Modal, Form, Input } from '@douyinfe/semi-ui';

const SubordinatesManager = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchGroup, setSearchGroup] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [quotaPool, setQuotaPool] = useState(0);
  const [addUsername, setAddUsername] = useState('');

  const loadUsers = async (startIdx) => {
    setLoading(true);
    try {
      const res = await API.get(`/api/user/manager/subordinates`);
      const { success, data, message } = res.data;
      if (success) {
        const usersWithRelation = data || [];
        setUsers(usersWithRelation);
        setUserCount(usersWithRelation.length);
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
    loadUsers(0);
    loadQuotaPool();
  }, []);

  const refresh = async () => {
    await loadUsers((activePage - 1) * pageSize);
    await loadQuotaPool();
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    loadUsers((page - 1) * pageSize);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setActivePage(1);
    loadUsers(0);
  };

  const handleRow = (record, index) => {
    return {
      onClick: (event) => {
        setEditingUser(record);
        setShowEditUser(true);
      },
    };
  };

  const handleAddSubordinate = async () => {
    if (!addUsername.trim()) {
      showError('请输入用户名');
      return;
    }
    try {
      const res = await API.post('/api/user/manager/subordinate/add', { username: addUsername.trim() });
      const { success, message } = res.data;
      if (success) {
        showSuccess('添加成功');
        setShowAddUser(false);
        setAddUsername('');
        refresh();
      } else {
        showError(message);
      }
    } catch (error) {
      showError('添加失败');
    }
  };

  const manageUser = async (username, action, value) => {
    // 下级管理不支持这些操作
    return;
  };

  const resetUserPasskey = async (userId) => {
    // 下级管理不支持
    return;
  };

  const resetUserTwoFA = async (userId) => {
    // 下级管理不支持
    return;
  };

  // 过滤用户（本地过滤）
  const filteredUsers = users.filter((user) => {
    if (searchKeyword && !user.username.includes(searchKeyword) && !user.display_name?.includes(searchKeyword)) {
      return false;
    }
    if (searchGroup && user.group !== searchGroup) {
      return false;
    }
    return true;
  });

  return (
    <div className='mt-[60px] px-2'>
      <UsersDescription 
        title="下级管理" 
        quotaPool={quotaPool}
        showQuotaPool={true}
        t={t}
      />
      <UsersFilters
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        searchGroup={searchGroup}
        setSearchGroup={setSearchGroup}
        refresh={refresh}
        t={t}
      />
      <UsersActions
        setShowAddUser={setShowAddUser}
        addButtonText="添加下级"
        isSubordinateMode={true}
        t={t}
      />
      <UsersTable
        users={filteredUsers}
        loading={loading}
        activePage={activePage}
        pageSize={pageSize}
        userCount={filteredUsers.length}
        compactMode={false}
        handlePageChange={handlePageChange}
        handlePageSizeChange={handlePageSizeChange}
        handleRow={handleRow}
        setEditingUser={setEditingUser}
        setShowEditUser={setShowEditUser}
        manageUser={manageUser}
        refresh={refresh}
        resetUserPasskey={resetUserPasskey}
        resetUserTwoFA={resetUserTwoFA}
        currentUserRole={5}
        quotaPool={quotaPool}
        t={t}
        isSubordinateMode={true}
      />
      {showEditUser && (
        <EditUserModal
          editingUser={editingUser}
          showEditUser={showEditUser}
          setShowEditUser={setShowEditUser}
          refresh={refresh}
          isSubordinateMode={true}
        />
      )}
      <Modal
        title="添加下级用户"
        visible={showAddUser}
        onOk={handleAddSubordinate}
        onCancel={() => {
          setShowAddUser(false);
          setAddUsername('');
        }}
        okText="添加"
        cancelText="取消"
      >
        <Form>
          <Form.Input
            field="username"
            label="用户名"
            placeholder="请输入用户名"
            value={addUsername}
            onChange={setAddUsername}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default SubordinatesManager;
