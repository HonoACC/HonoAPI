package controller

import (
	"strconv"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/service"

	"github.com/gin-gonic/gin"
)

type distributorBindRequest struct {
	ParentUserId int    `json:"parent_user_id"`
	ChildUserId  int    `json:"child_user_id"`
	Remark       string `json:"remark"`
}

type distributorGrantQuotaRequest struct {
	TargetUserId int    `json:"target_user_id"`
	Amount       int    `json:"amount"`
	Remark       string `json:"remark"`
}

type distributorRemarkRequest struct {
	Remark string `json:"remark"`
}

type distributorSetRoleRequest struct {
	UserId int `json:"user_id"`
	Role   int `json:"role"`
}

func GetDistributorSummary(c *gin.Context) {
	parentUserId, _ := strconv.Atoi(c.Query("parent_user_id"))
	summary, err := service.GetDistributorSummary(c.GetInt("id"), c.GetInt("role"), parentUserId)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, summary)
}

func GetDistributorChildren(c *gin.Context) {
	pageInfo := common.GetPageQuery(c)
	parentUserId, _ := strconv.Atoi(c.Query("parent_user_id"))
	role, _ := strconv.Atoi(c.Query("role"))
	status, _ := strconv.Atoi(c.Query("status"))
	children, total, err := service.ListDistributorChildren(c.GetInt("id"), c.GetInt("role"), parentUserId, c.Query("keyword"), role, status, pageInfo.GetStartIdx(), pageInfo.GetPageSize())
	if err != nil {
		common.ApiError(c, err)
		return
	}
	pageInfo.SetTotal(int(total))
	pageInfo.SetItems(children)
	common.ApiSuccess(c, pageInfo)
}

func SearchDistributorBindableUsers(c *gin.Context) {
	parentUserId, _ := strconv.Atoi(c.Query("parent_user_id"))
	users, err := service.SearchBindableUsers(c.GetInt("id"), c.GetInt("role"), parentUserId, c.Query("keyword"), 20)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, users)
}

func SearchDistributorRoleCandidates(c *gin.Context) {
	users, err := service.SearchDistributorRoleCandidates(c.GetInt("id"), c.GetInt("role"), c.Query("keyword"), 20)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, users)
}

func BindDistributorChild(c *gin.Context) {
	var req distributorBindRequest
	if err := common.DecodeJson(c.Request.Body, &req); err != nil {
		common.ApiError(c, err)
		return
	}
	if err := service.BindDistributorChild(c.GetInt("id"), c.GetInt("role"), req.ParentUserId, req.ChildUserId, req.Remark); err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, nil)
}

func GrantDistributorQuota(c *gin.Context) {
	var req distributorGrantQuotaRequest
	if err := common.DecodeJson(c.Request.Body, &req); err != nil {
		common.ApiError(c, err)
		return
	}
	if err := service.GrantDistributorQuota(c.GetInt("id"), c.GetInt("role"), req.TargetUserId, req.Amount, req.Remark); err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, nil)
}

func SetDistributorRole(c *gin.Context) {
	var req distributorSetRoleRequest
	if err := common.DecodeJson(c.Request.Body, &req); err != nil {
		common.ApiError(c, err)
		return
	}
	if err := service.SetDistributorRole(c.GetInt("id"), c.GetInt("role"), req.UserId, req.Role); err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, nil)
}

func UpdateDistributorRemark(c *gin.Context) {
	childUserId, err := strconv.Atoi(c.Param("child_user_id"))
	if err != nil {
		common.ApiError(c, err)
		return
	}
	var req distributorRemarkRequest
	if err := common.DecodeJson(c.Request.Body, &req); err != nil {
		common.ApiError(c, err)
		return
	}
	if err := service.UpdateDistributorRemark(c.GetInt("id"), c.GetInt("role"), childUserId, req.Remark); err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, nil)
}

func GetDistributorQuotaLogs(c *gin.Context) {
	GetDistributorOperationLogs(c)
}

func GetDistributorOperationLogs(c *gin.Context) {
	pageInfo := common.GetPageQuery(c)
	targetUserId, _ := strconv.Atoi(c.Query("target_user_id"))
	startTime, _ := strconv.ParseInt(c.Query("start_time"), 10, 64)
	endTime, _ := strconv.ParseInt(c.Query("end_time"), 10, 64)
	logs, total, err := service.ListDistributorOperationLogs(c.GetInt("id"), c.GetInt("role"), targetUserId, c.Query("action"), startTime, endTime, pageInfo.GetStartIdx(), pageInfo.GetPageSize())
	if err != nil {
		common.ApiError(c, err)
		return
	}
	pageInfo.SetTotal(int(total))
	pageInfo.SetItems(logs)
	common.ApiSuccess(c, pageInfo)
}
