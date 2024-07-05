package handlers

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"io"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/lain0xn/challenge-8/payment"
	"github.com/lain0xn/challenge-8/services"
)

func ComputeHMAC(data []byte) string {
	h := hmac.New(sha256.New, []byte(payment.CHARGILIY_SECRET_KEY))
	h.Write(data)
	return hex.EncodeToString(h.Sum(nil))
}

func WebHook(c echo.Context) error {
	payload, err := io.ReadAll(c.Request().Body)
	signature := c.Request().Header.Get("signature")
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())

	}

	// If there is no signature, ignore the request
	if signature == "" {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())

	}

	// Calculate the signature
	computedSignature := ComputeHMAC(payload)
	// If the calculated signature doesn't match the received signature, ignore the request
	if !hmac.Equal([]byte(computedSignature), []byte(signature)) {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())

	}

	uid := c.Param("uid")
	cid := c.Param("cid")
	usrv := services.UserService{}
	err = usrv.Enroll(uid, cid)

	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	return c.String(http.StatusOK, "enrolled with success")

}
