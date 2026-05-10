package service

import (
	"errors"
	"fmt"
	"strconv"
	"strings"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"

	"gorm.io/gorm"
)

type DistributorChild struct {
	Id                 int    `json:"id"`
	Username           string `json:"username"`
	DisplayName        string `json:"display_name"`
	Email              string `json:"email"`
	Role               int    `json:"role"`
	Status             int    `json:"status"`
	Quota              int    `json:"quota"`
	UsedQuota          int    `json:"used_quota"`
	AllocatedQuota     int    `json:"allocated_quota"`
	AllocatedAmount    int    `json:"allocated_amount"`
	RequestCount       int    `json:"request_count"`
	DistributableQuota int    `json:"distributable_quota"`
	ParentUserId       int    `json:"parent_user_id"`
	ParentUsername     string `json:"parent_username"`
	ChildUserId        int    `json:"child_user_id"`
	ChildUsername      string `json:"child_username"`
	LowerUsernames     string `json:"lower_usernames"`
	Remark             string `json:"remark"`
	CreatedAt          int64  `json:"created_at"`
	BoundAt            int64  `json:"bound_at"`
}

type DistributorBindableUser struct {
	Id                 int    `json:"id"`
	Username           string `json:"username"`
	DisplayName        string `json:"display_name"`
	Email              string `json:"email"`
	Role               int    `json:"role"`
	Status             int    `json:"status"`
	Quota              int    `json:"quota"`
	UsedQuota          int    `json:"used_quota"`
	DistributableQuota int    `json:"distributable_quota"`
}

type DistributorSummary struct {
	Role                     int `json:"role"`
	DistributableQuota       int `json:"distributable_quota"`
	ChildrenCount            int `json:"children_count"`
	CommonChildrenCount      int `json:"common_children_count"`
	DistributorChildrenCount int `json:"distributor_children_count"`
	AllocatedQuota           int `json:"allocated_quota"`
}

type DistributorQuotaLogItem struct {
	model.DistributorQuotaLog
	OperatorUsername string `json:"operator_username"`
	SourceUsername   string `json:"source_username"`
	TargetUsername   string `json:"target_username"`
}

type DistributorOperationLogItem struct {
	Id               int    `json:"id"`
	LogType          string `json:"log_type"`
	OperatorUserId   int    `json:"operator_user_id"`
	OperatorUsername string `json:"operator_username"`
	SourceUserId     int    `json:"source_user_id"`
	SourceUsername   string `json:"source_username"`
	TargetUserId     int    `json:"target_user_id"`
	TargetUsername   string `json:"target_username"`
	ParentUserId     int    `json:"parent_user_id"`
	ParentUsername   string `json:"parent_username"`
	ChildUserId      int    `json:"child_user_id"`
	ChildUsername    string `json:"child_username"`
	Amount           int    `json:"amount"`
	SourceBefore     int    `json:"source_before"`
	SourceAfter      int    `json:"source_after"`
	TargetBefore     int    `json:"target_before"`
	TargetAfter      int    `json:"target_after"`
	TargetQuotaType  string `json:"target_quota_type"`
	Action           string `json:"action"`
	Remark           string `json:"remark"`
	CreatedAt        int64  `json:"created_at"`
}

func GetDistributorSummary(operatorId, operatorRole int, parentUserId int) (*DistributorSummary, error) {
	parentId, err := resolveDistributorParent(operatorId, operatorRole, parentUserId)
	if err != nil {
		return nil, err
	}
	summary := &DistributorSummary{Role: operatorRole}
	if parentId > 0 {
		var parent model.User
		if err := model.DB.Where("id = ?", parentId).First(&parent).Error; err != nil {
			return nil, err
		}
		summary.Role = parent.Role
		summary.DistributableQuota = parent.DistributableQuota
		if parent.Role != common.RoleDistributorUser && parent.Role != common.RoleSeniorDistributorUser {
			return summary, nil
		}
	}
	relationQuery := model.DB.Where("parent_user_id = ?", parentId)
	if operatorRole == common.RoleRootUser && parentId == 0 {
		relationQuery = relationQuery.Where("created_by = ?", operatorId)
	}
	var relations []model.DistributorRelation
	if err := relationQuery.Find(&relations).Error; err != nil {
		return nil, err
	}
	childIds := make([]int, 0, len(relations))
	for _, relation := range relations {
		childIds = append(childIds, relation.ChildUserId)
	}
	summary.ChildrenCount = len(childIds)
	if len(childIds) > 0 {
		var users []model.User
		if err := model.DB.Where("id IN ?", childIds).Find(&users).Error; err != nil {
			return nil, err
		}
		for _, user := range users {
			if user.Role == common.RoleDistributorUser || user.Role == common.RoleSeniorDistributorUser {
				summary.DistributorChildrenCount++
			} else if user.Role == common.RoleCommonUser {
				summary.CommonChildrenCount++
			}
		}
	}
	var allocated int64
	query := model.DB.Model(&model.DistributorQuotaLog{}).Where("source_user_id = ?", parentId)
	if operatorRole != common.RoleRootUser {
		query = query.Where("operator_user_id = ?", operatorId)
	}
	if err := query.Select("COALESCE(SUM(amount), 0)").Scan(&allocated).Error; err != nil {
		return nil, err
	}
	summary.AllocatedQuota = int(allocated)
	return summary, nil
}

func ListDistributorChildren(operatorId, operatorRole, parentUserId int, keyword string, roleFilter, statusFilter int, startIdx, num int) ([]DistributorChild, int64, error) {
	parentId, err := resolveDistributorParent(operatorId, operatorRole, parentUserId)
	if err != nil {
		return nil, 0, err
	}
	if parentId > 0 {
		var parent model.User
		if err := model.DB.Where("id = ?", parentId).First(&parent).Error; err != nil {
			return nil, 0, err
		}
		if parent.Role != common.RoleDistributorUser && parent.Role != common.RoleSeniorDistributorUser {
			return []DistributorChild{}, 0, nil
		}
	} else if operatorRole != common.RoleRootUser {
		return []DistributorChild{}, 0, nil
	}
	query := model.DB.Table("distributor_relations AS dr").
		Select("u.id, u.username, u.display_name, u.email, u.role, u.status, u.quota, u.used_quota, COALESCE(system_logs.allocated_quota, 0) AS allocated_quota, COALESCE(distributable_logs.allocated_amount, 0) AS allocated_amount, u.request_count, u.distributable_quota, dr.parent_user_id, p.username AS parent_username, dr.child_user_id, u.username AS child_username, dr.remark, u.created_at, dr.created_at AS bound_at").
		Joins("JOIN users AS u ON u.id = dr.child_user_id").
		Joins("LEFT JOIN users AS p ON p.id = dr.parent_user_id").
		Joins("LEFT JOIN (?) AS system_logs ON system_logs.target_user_id = u.id", model.DB.Model(&model.DistributorQuotaLog{}).Select("target_user_id, COALESCE(SUM(amount), 0) AS allocated_quota").Where("target_quota_type = ?", model.DistributorQuotaTargetUserQuota).Group("target_user_id")).
		Joins("LEFT JOIN (?) AS distributable_logs ON distributable_logs.target_user_id = u.id", model.DB.Model(&model.DistributorQuotaLog{}).Select("target_user_id, COALESCE(SUM(amount), 0) AS allocated_amount").Where("target_quota_type = ?", model.DistributorQuotaTargetDistributable).Group("target_user_id"))
	if operatorRole != common.RoleRootUser || parentId > 0 {
		query = query.Where("dr.parent_user_id = ?", parentId)
	}
	if keyword = strings.TrimSpace(keyword); keyword != "" {
		like := "%" + keyword + "%"
		if id, err := strconv.Atoi(keyword); err == nil {
			query = query.Where("u.id = ? OR u.username LIKE ? OR u.email LIKE ? OR u.display_name LIKE ? OR p.id = ? OR p.username LIKE ?", id, like, like, like, id, like)
		} else {
			query = query.Where("u.username LIKE ? OR u.email LIKE ? OR u.display_name LIKE ? OR p.username LIKE ?", like, like, like, like)
		}
	}
	if roleFilter > 0 {
		query = query.Where("u.role = ?", roleFilter)
	}
	if statusFilter > 0 {
		query = query.Where("u.status = ?", statusFilter)
	}
	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	var children []DistributorChild
	if err := query.Order("dr.id desc").Limit(num).Offset(startIdx).Scan(&children).Error; err != nil {
		return nil, 0, err
	}
	if len(children) > 0 {
		userIds := make([]int, 0, len(children))
		for _, child := range children {
			userIds = append(userIds, child.Id)
		}
		var lowerRelations []struct {
			ParentUserId int
			Username     string
		}
		if err := model.DB.Table("distributor_relations AS dr").
			Select("dr.parent_user_id, u.username").
			Joins("JOIN users AS u ON u.id = dr.child_user_id").
			Where("dr.parent_user_id IN ?", userIds).
			Order("dr.id desc").
			Scan(&lowerRelations).Error; err != nil {
			return nil, 0, err
		}
		lowerMap := make(map[int][]string)
		for _, relation := range lowerRelations {
			lowerMap[relation.ParentUserId] = append(lowerMap[relation.ParentUserId], relation.Username)
		}
		for i := range children {
			children[i].LowerUsernames = strings.Join(lowerMap[children[i].Id], "、")
		}
	}
	return children, total, nil
}

func SearchBindableUsers(operatorId, operatorRole int, parentUserId int, keyword string, num int) ([]DistributorBindableUser, error) {
	keyword = strings.TrimSpace(keyword)
	if keyword == "" {
		return []DistributorBindableUser{}, nil
	}
	parentId, err := resolveDistributorParent(operatorId, operatorRole, parentUserId)
	if err != nil {
		return nil, err
	}
	if parentId > 0 {
		var parent model.User
		if err := model.DB.Where("id = ?", parentId).First(&parent).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, errors.New("上级分销商不存在")
			}
			return nil, err
		}
		if parent.Role != common.RoleDistributorUser && parent.Role != common.RoleSeniorDistributorUser {
			return []DistributorBindableUser{}, nil
		}
	} else if operatorRole != common.RoleRootUser {
		return nil, errors.New("请先输入上级分销商 ID")
	}
	query := model.DB.Model(&model.User{}).
		Where("role = ?", common.RoleCommonUser).
		Where("id <> ?", operatorId).
		Where("id NOT IN (?)", model.DB.Model(&model.DistributorRelation{}).Select("child_user_id"))
	like := "%" + keyword + "%"
	if id, err := strconv.Atoi(keyword); err == nil {
		query = query.Where("id = ? OR username LIKE ? OR email LIKE ? OR display_name LIKE ?", id, like, like, like)
	} else {
		query = query.Where("username LIKE ? OR email LIKE ? OR display_name LIKE ?", like, like, like)
	}
	var users []model.User
	if err := query.Order("id desc").Limit(num).Find(&users).Error; err != nil {
		return nil, err
	}
	items := make([]DistributorBindableUser, 0, len(users))
	for _, user := range users {
		items = append(items, DistributorBindableUser{Id: user.Id, Username: user.Username, DisplayName: user.DisplayName, Email: user.Email, Role: user.Role, Status: user.Status, Quota: user.Quota, UsedQuota: user.UsedQuota, DistributableQuota: user.DistributableQuota})
	}
	return items, nil
}

func SearchDistributorRoleCandidates(operatorId, operatorRole int, keyword string, num int) ([]DistributorBindableUser, error) {
	keyword = strings.TrimSpace(keyword)
	if keyword == "" {
		return []DistributorBindableUser{}, nil
	}
	if operatorRole != common.RoleRootUser {
		return nil, errors.New("只有超级管理员可以设置分销角色")
	}
	query := model.DB.Model(&model.User{}).
		Where("role IN ?", []int{common.RoleCommonUser, common.RoleDistributorUser, common.RoleSeniorDistributorUser}).
		Where("id <> ?", operatorId)
	like := "%" + keyword + "%"
	if id, err := strconv.Atoi(keyword); err == nil {
		query = query.Where("id = ? OR username LIKE ? OR email LIKE ? OR display_name LIKE ?", id, like, like, like)
	} else {
		query = query.Where("username LIKE ? OR email LIKE ? OR display_name LIKE ?", like, like, like)
	}
	var users []model.User
	if err := query.Order("id desc").Limit(num).Find(&users).Error; err != nil {
		return nil, err
	}
	items := make([]DistributorBindableUser, 0, len(users))
	for _, user := range users {
		items = append(items, DistributorBindableUser{Id: user.Id, Username: user.Username, DisplayName: user.DisplayName, Email: user.Email, Role: user.Role, Status: user.Status, Quota: user.Quota, UsedQuota: user.UsedQuota, DistributableQuota: user.DistributableQuota})
	}
	return items, nil
}

func BindDistributorChild(operatorId, operatorRole, parentUserId, childUserId int, remark string) error {
	return model.DB.Transaction(func(tx *gorm.DB) error {
		parentId, err := resolveDistributorParent(operatorId, operatorRole, parentUserId)
		if err != nil {
			return err
		}
		if parentId > 0 {
			var parent model.User
			if err := tx.Where("id = ?", parentId).First(&parent).Error; err != nil {
				return err
			}
			if parent.Role != common.RoleDistributorUser && parent.Role != common.RoleSeniorDistributorUser {
				return errors.New("上级必须是分销商或高级分销商")
			}
		} else if operatorRole != common.RoleRootUser {
			return errors.New("请先输入上级分销商 ID")
		}
		var child model.User
		if err := tx.Where("id = ?", childUserId).First(&child).Error; err != nil {
			return err
		}
		if err := validateBind(operatorId, operatorRole, parentId, &child); err != nil {
			return err
		}
		var count int64
		if err := tx.Model(&model.DistributorRelation{}).Where("child_user_id = ?", child.Id).Count(&count).Error; err != nil {
			return err
		}
		if count > 0 {
			return errors.New("该用户已经绑定上级")
		}
		relation := &model.DistributorRelation{ParentUserId: parentId, ChildUserId: child.Id, Remark: strings.TrimSpace(remark), CreatedBy: operatorId}
		if err := tx.Create(relation).Error; err != nil {
			return err
		}
		return tx.Create(&model.DistributorRelationLog{OperatorUserId: operatorId, ParentUserId: parentId, ChildUserId: child.Id, Action: model.DistributorRelationActionBind, Remark: relation.Remark}).Error
	})
}

func SetDistributorRole(operatorId, operatorRole, userId, targetRole int) error {
	if targetRole != common.RoleCommonUser && targetRole != common.RoleDistributorUser && targetRole != common.RoleSeniorDistributorUser {
		return errors.New("只能设置为普通用户、分销商或高级分销商")
	}
	return model.DB.Transaction(func(tx *gorm.DB) error {
		var user model.User
		if err := tx.Where("id = ?", userId).First(&user).Error; err != nil {
			return err
		}
		if user.Role == common.RoleRootUser || user.Role == common.RoleAdminUser {
			return errors.New("不能在分销管理中修改管理员角色")
		}
		var relation model.DistributorRelation
		if err := tx.Where("child_user_id = ?", userId).First(&relation).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return errors.New("只能修改直属下级角色")
			}
			return err
		}
		if operatorRole == common.RoleRootUser {
			if relation.ParentUserId != 0 && relation.CreatedBy != operatorId {
				return errors.New("只能修改自己添加的直属下级角色")
			}
		} else if operatorRole == common.RoleSeniorDistributorUser {
			if relation.ParentUserId != operatorId {
				return errors.New("只能修改直属下级角色")
			}
			if targetRole == common.RoleSeniorDistributorUser {
				return errors.New("高级分销商不能设置高级分销商")
			}
		} else {
			return errors.New("无权修改下级角色")
		}
		oldRole := user.Role
		if err := tx.Model(&model.User{}).Where("id = ?", userId).Update("role", targetRole).Error; err != nil {
			return err
		}
		remark := fmt.Sprintf("role:%d->%d", oldRole, targetRole)
		return tx.Create(&model.DistributorRelationLog{OperatorUserId: operatorId, ParentUserId: relation.ParentUserId, ChildUserId: userId, Action: model.DistributorActionSetRole, Remark: remark}).Error
	})
}

func UpdateDistributorRemark(operatorId, operatorRole, childUserId int, remark string) error {
	return model.DB.Transaction(func(tx *gorm.DB) error {
		var relation model.DistributorRelation
		if err := tx.Where("child_user_id = ?", childUserId).First(&relation).Error; err != nil {
			return err
		}
		if operatorRole != common.RoleRootUser && relation.ParentUserId != operatorId {
			return errors.New("无权修改该下级备注")
		}
		remark = strings.TrimSpace(remark)
		if err := tx.Model(&model.DistributorRelation{}).Where("id = ?", relation.Id).Update("remark", remark).Error; err != nil {
			return err
		}
		return tx.Create(&model.DistributorRelationLog{OperatorUserId: operatorId, ParentUserId: relation.ParentUserId, ChildUserId: relation.ChildUserId, Action: model.DistributorRelationActionUpdateRemark, Remark: remark}).Error
	})
}

func GrantDistributorQuota(operatorId, operatorRole, targetUserId, amount int, remark string) error {
	if amount <= 0 {
		return errors.New("额度必须大于 0")
	}
	return model.DB.Transaction(func(tx *gorm.DB) error {
		var operator, target model.User
		if err := tx.Where("id = ?", operatorId).First(&operator).Error; err != nil {
			return err
		}
		if err := tx.Where("id = ?", targetUserId).First(&target).Error; err != nil {
			return err
		}
		action, targetQuotaType, sourceBefore, sourceAfter, targetBefore, targetAfter, err := resolveQuotaFlow(tx, operatorRole, &operator, &target, amount)
		if err != nil {
			return err
		}
		if operatorRole != common.RoleRootUser {
			result := tx.Model(&model.User{}).Where("id = ? AND distributable_quota >= ?", operator.Id, amount).Update("distributable_quota", gorm.Expr("distributable_quota - ?", amount))
			if result.Error != nil {
				return result.Error
			}
			if result.RowsAffected != 1 {
				return errors.New("可分配额度不足")
			}
		}
		targetColumn := "quota"
		if targetQuotaType == model.DistributorQuotaTargetDistributable {
			targetColumn = "distributable_quota"
		}
		if err := tx.Model(&model.User{}).Where("id = ?", target.Id).Update(targetColumn, gorm.Expr(targetColumn+" + ?", amount)).Error; err != nil {
			return err
		}
		log := &model.DistributorQuotaLog{OperatorUserId: operatorId, SourceUserId: operator.Id, TargetUserId: target.Id, Amount: amount, SourceBefore: sourceBefore, SourceAfter: sourceAfter, TargetBefore: targetBefore, TargetAfter: targetAfter, TargetQuotaType: targetQuotaType, Action: action, Remark: strings.TrimSpace(remark)}
		if operatorRole == common.RoleRootUser {
			log.SourceUserId = 0
		}
		return tx.Create(log).Error
	})
}

func ListDistributorQuotaLogs(operatorId, operatorRole int, targetUserId int, action string, startTime, endTime int64, startIdx, num int) ([]DistributorQuotaLogItem, int64, error) {
	query := model.DB.Table("distributor_quota_logs AS l").
		Select("l.*, ou.username AS operator_username, su.username AS source_username, tu.username AS target_username").
		Joins("LEFT JOIN users AS ou ON ou.id = l.operator_user_id").
		Joins("LEFT JOIN users AS su ON su.id = l.source_user_id").
		Joins("LEFT JOIN users AS tu ON tu.id = l.target_user_id")
	if operatorRole != common.RoleRootUser {
		query = query.Where("l.operator_user_id = ? OR l.source_user_id = ? OR l.target_user_id IN (?)", operatorId, operatorId, model.DB.Model(&model.DistributorRelation{}).Select("child_user_id").Where("parent_user_id = ?", operatorId))
	}
	if targetUserId > 0 {
		query = query.Where("l.target_user_id = ?", targetUserId)
	}
	if action = strings.TrimSpace(action); action != "" {
		query = query.Where("l.action = ?", action)
	}
	if startTime > 0 {
		query = query.Where("l.created_at >= ?", startTime)
	}
	if endTime > 0 {
		query = query.Where("l.created_at <= ?", endTime)
	}
	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	var logs []DistributorQuotaLogItem
	if err := query.Order("l.id desc").Limit(num).Offset(startIdx).Scan(&logs).Error; err != nil {
		return nil, 0, err
	}
	return logs, total, nil
}

func ListDistributorOperationLogs(operatorId, operatorRole int, targetUserId int, action string, startTime, endTime int64, startIdx, num int) ([]DistributorOperationLogItem, int64, error) {
	quotaQuery := model.DB.Table("distributor_quota_logs AS l").
		Select("l.id, 'quota' AS log_type, l.operator_user_id, ou.username AS operator_username, l.source_user_id, su.username AS source_username, l.target_user_id, tu.username AS target_username, 0 AS parent_user_id, '' AS parent_username, 0 AS child_user_id, '' AS child_username, l.amount, l.source_before, l.source_after, l.target_before, l.target_after, l.target_quota_type, l.action, l.remark, l.created_at").
		Joins("LEFT JOIN users AS ou ON ou.id = l.operator_user_id").
		Joins("LEFT JOIN users AS su ON su.id = l.source_user_id").
		Joins("LEFT JOIN users AS tu ON tu.id = l.target_user_id")
	relationQuery := model.DB.Table("distributor_relation_logs AS l").
		Select("l.id, 'relation' AS log_type, l.operator_user_id, ou.username AS operator_username, 0 AS source_user_id, '' AS source_username, l.child_user_id AS target_user_id, cu.username AS target_username, l.parent_user_id, pu.username AS parent_username, l.child_user_id, cu.username AS child_username, 0 AS amount, 0 AS source_before, 0 AS source_after, 0 AS target_before, 0 AS target_after, '' AS target_quota_type, l.action, l.remark, l.created_at").
		Joins("LEFT JOIN users AS ou ON ou.id = l.operator_user_id").
		Joins("LEFT JOIN users AS pu ON pu.id = l.parent_user_id").
		Joins("LEFT JOIN users AS cu ON cu.id = l.child_user_id")

	if operatorRole != common.RoleRootUser {
		childSubQuery := model.DB.Model(&model.DistributorRelation{}).Select("child_user_id").Where("parent_user_id = ?", operatorId)
		quotaQuery = quotaQuery.Where("l.operator_user_id = ? OR l.source_user_id = ? OR l.target_user_id IN (?)", operatorId, operatorId, childSubQuery)
		relationQuery = relationQuery.Where("l.operator_user_id = ? OR l.parent_user_id = ? OR l.child_user_id IN (?)", operatorId, operatorId, childSubQuery)
	}
	if targetUserId > 0 {
		quotaQuery = quotaQuery.Where("l.target_user_id = ?", targetUserId)
		relationQuery = relationQuery.Where("l.child_user_id = ?", targetUserId)
	}
	if action = strings.TrimSpace(action); action != "" {
		quotaQuery = quotaQuery.Where("l.action = ?", action)
		relationQuery = relationQuery.Where("l.action = ?", action)
	}
	if startTime > 0 {
		quotaQuery = quotaQuery.Where("l.created_at >= ?", startTime)
		relationQuery = relationQuery.Where("l.created_at >= ?", startTime)
	}
	if endTime > 0 {
		quotaQuery = quotaQuery.Where("l.created_at <= ?", endTime)
		relationQuery = relationQuery.Where("l.created_at <= ?", endTime)
	}

	var quotaLogs []DistributorOperationLogItem
	if err := quotaQuery.Scan(&quotaLogs).Error; err != nil {
		return nil, 0, err
	}
	var relationLogs []DistributorOperationLogItem
	if err := relationQuery.Scan(&relationLogs).Error; err != nil {
		return nil, 0, err
	}
	logs := append(quotaLogs, relationLogs...)
	for i := 0; i < len(logs)-1; i++ {
		for j := i + 1; j < len(logs); j++ {
			if logs[i].CreatedAt < logs[j].CreatedAt || (logs[i].CreatedAt == logs[j].CreatedAt && logs[i].Id < logs[j].Id) {
				logs[i], logs[j] = logs[j], logs[i]
			}
		}
	}
	total := int64(len(logs))
	if startIdx >= len(logs) {
		return []DistributorOperationLogItem{}, total, nil
	}
	endIdx := startIdx + num
	if endIdx > len(logs) {
		endIdx = len(logs)
	}
	return logs[startIdx:endIdx], total, nil
}

func resolveDistributorParent(operatorId, operatorRole, parentUserId int) (int, error) {
	if operatorRole == common.RoleRootUser {
		if parentUserId <= 0 {
			return 0, nil
		}
		return parentUserId, nil
	}
	if !common.IsDistributorRole(operatorRole) {
		return 0, errors.New("无分销管理权限")
	}
	if parentUserId > 0 && parentUserId != operatorId {
		return 0, errors.New("不能管理其他分销商的下级")
	}
	return operatorId, nil
}

func bindableRoles(operatorRole int) []int {
	if operatorRole == common.RoleRootUser || operatorRole == common.RoleSeniorDistributorUser {
		return []int{common.RoleCommonUser, common.RoleDistributorUser}
	}
	return []int{common.RoleCommonUser}
}

func validateBind(operatorId, operatorRole, parentId int, child *model.User) error {
	if operatorId == child.Id {
		return errors.New("不能绑定自己")
	}
	if child.Role != common.RoleCommonUser {
		return errors.New("只能添加普通用户为下级")
	}
	if operatorRole == common.RoleRootUser {
		return nil
	}
	if parentId != operatorId {
		return errors.New("不能为其他分销商绑定下级")
	}
	if operatorRole != common.RoleDistributorUser && operatorRole != common.RoleSeniorDistributorUser {
		return errors.New("无分销管理权限")
	}
	return nil
}

func resolveQuotaFlow(tx *gorm.DB, operatorRole int, operator, target *model.User, amount int) (string, string, int, int, int, int, error) {
	if operatorRole == common.RoleRootUser {
		var count int64
		if err := tx.Model(&model.DistributorRelation{}).Where("child_user_id = ? AND (parent_user_id = 0 OR created_by = ?)", target.Id, operator.Id).Count(&count).Error; err != nil {
			return "", "", 0, 0, 0, 0, err
		}
		if count != 1 {
			return "", "", 0, 0, 0, 0, errors.New("只能给直属下级分配额度")
		}
		if target.Role == common.RoleDistributorUser || target.Role == common.RoleSeniorDistributorUser {
			return model.DistributorActionRootGrantDistributable, model.DistributorQuotaTargetDistributable, 0, 0, target.DistributableQuota, target.DistributableQuota + amount, nil
		}
		if target.Role == common.RoleCommonUser {
			return model.DistributorActionRootGrantUserQuota, model.DistributorQuotaTargetUserQuota, 0, 0, target.Quota, target.Quota + amount, nil
		}
		return "", "", 0, 0, 0, 0, errors.New("目标角色不能接收分销额度")
	}
	if !common.IsDistributorRole(operatorRole) || operator.Id == target.Id {
		return "", "", 0, 0, 0, 0, errors.New("无额度分配权限")
	}
	var count int64
	if err := tx.Model(&model.DistributorRelation{}).Where("parent_user_id = ? AND child_user_id = ?", operator.Id, target.Id).Count(&count).Error; err != nil {
		return "", "", 0, 0, 0, 0, err
	}
	if count != 1 {
		return "", "", 0, 0, 0, 0, errors.New("只能给直属下级分配额度")
	}
	if operator.DistributableQuota < amount {
		return "", "", 0, 0, 0, 0, errors.New("可分配额度不足")
	}
	sourceBefore := operator.DistributableQuota
	sourceAfter := operator.DistributableQuota - amount
	if operatorRole == common.RoleSeniorDistributorUser && target.Role == common.RoleDistributorUser {
		return model.DistributorActionSeniorGrantDistributor, model.DistributorQuotaTargetDistributable, sourceBefore, sourceAfter, target.DistributableQuota, target.DistributableQuota + amount, nil
	}
	if operatorRole == common.RoleSeniorDistributorUser && target.Role == common.RoleCommonUser {
		return model.DistributorActionSeniorGrantUserQuota, model.DistributorQuotaTargetUserQuota, sourceBefore, sourceAfter, target.Quota, target.Quota + amount, nil
	}
	if operatorRole == common.RoleDistributorUser && target.Role == common.RoleCommonUser {
		return model.DistributorActionDistributorGrantUserQuota, model.DistributorQuotaTargetUserQuota, sourceBefore, sourceAfter, target.Quota, target.Quota + amount, nil
	}
	return "", "", 0, 0, 0, 0, fmt.Errorf("不能给该角色分配额度")
}
