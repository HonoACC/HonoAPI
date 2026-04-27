package model

import (
	"gorm.io/gorm"
)

// UserManagerRelation 用户管理员与下级用户的关系表
type UserManagerRelation struct {
	Id        int            `json:"id" gorm:"primaryKey"`
	ManagerId int            `json:"manager_id" gorm:"index;not null"` // UserManager 的 ID
	UserId    int            `json:"user_id" gorm:"index;not null"`    // 下级用户 ID
	Note      string         `json:"note" gorm:"type:text"`            // 备注信息
	CreatedAt int64          `json:"created_at" gorm:"bigint"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

func (r *UserManagerRelation) Insert() error {
	var err error
	err = DB.Create(r).Error
	return err
}

func GetUserManagerRelation(managerId int, userId int) (*UserManagerRelation, error) {
	var relation UserManagerRelation
	err := DB.Where("manager_id = ? AND user_id = ?", managerId, userId).First(&relation).Error
	return &relation, err
}

func GetUserManagerSubordinates(managerId int) ([]*User, error) {
	var users []*User
	err := DB.Table("users").
		Joins("INNER JOIN user_manager_relations ON users.id = user_manager_relations.user_id").
		Where("user_manager_relations.manager_id = ? AND user_manager_relations.deleted_at IS NULL", managerId).
		Find(&users).Error
	return users, err
}

func UpdateUserManagerRelationNote(managerId int, userId int, note string) error {
	return DB.Model(&UserManagerRelation{}).
		Where("manager_id = ? AND user_id = ?", managerId, userId).
		Update("note", note).Error
}

func DeleteUserManagerRelation(managerId int, userId int) error {
	return DB.Where("manager_id = ? AND user_id = ?", managerId, userId).
		Delete(&UserManagerRelation{}).Error
}
