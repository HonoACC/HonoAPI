package model

const (
	DistributorQuotaTargetDistributable = "distributable_quota"
	DistributorQuotaTargetUserQuota     = "quota"

	DistributorActionRootGrantDistributable    = "root_grant_distributable_quota"
	DistributorActionRootGrantUserQuota        = "root_grant_user_quota"
	DistributorActionSeniorGrantDistributor    = "senior_grant_distributor_quota"
	DistributorActionSeniorGrantUserQuota      = "senior_grant_user_quota"
	DistributorActionDistributorGrantUserQuota = "distributor_grant_user_quota"
	DistributorActionSetRole                   = "set_role"

	DistributorRelationActionBind         = "bind"
	DistributorRelationActionUpdateRemark = "update_remark"
)

type DistributorRelation struct {
	Id           int    `json:"id" gorm:"primaryKey"`
	ParentUserId int    `json:"parent_user_id" gorm:"index"`
	ChildUserId  int    `json:"child_user_id" gorm:"uniqueIndex"`
	Remark       string `json:"remark" gorm:"type:text"`
	CreatedBy    int    `json:"created_by"`
	CreatedAt    int64  `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt    int64  `json:"updated_at" gorm:"autoUpdateTime"`
}

type DistributorQuotaLog struct {
	Id              int    `json:"id" gorm:"primaryKey"`
	OperatorUserId  int    `json:"operator_user_id" gorm:"index"`
	SourceUserId    int    `json:"source_user_id" gorm:"index"`
	TargetUserId    int    `json:"target_user_id" gorm:"index"`
	Amount          int    `json:"amount"`
	SourceBefore    int    `json:"source_before"`
	SourceAfter     int    `json:"source_after"`
	TargetBefore    int    `json:"target_before"`
	TargetAfter     int    `json:"target_after"`
	TargetQuotaType string `json:"target_quota_type" gorm:"type:varchar(32)"`
	Action          string `json:"action" gorm:"type:varchar(64);index"`
	Remark          string `json:"remark" gorm:"type:text"`
	CreatedAt       int64  `json:"created_at" gorm:"autoCreateTime;index"`
}

type DistributorRelationLog struct {
	Id             int    `json:"id" gorm:"primaryKey"`
	OperatorUserId int    `json:"operator_user_id" gorm:"index"`
	ParentUserId   int    `json:"parent_user_id" gorm:"index"`
	ChildUserId    int    `json:"child_user_id" gorm:"index"`
	Action         string `json:"action" gorm:"type:varchar(64);index"`
	Remark         string `json:"remark" gorm:"type:text"`
	CreatedAt      int64  `json:"created_at" gorm:"autoCreateTime;index"`
}
