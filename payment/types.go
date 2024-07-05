package payment

type CheckoutResponse struct {
	Livemode               bool   `json:"livemode"`
	ID                     string `json:"id"`
	Entity                 string `json:"entity"`
	Amount                 int    `json:"amount"`
	Currency               string `json:"currency"`
	Fees                   int    `json:"fees"`
	PassFeesToCustomer     int    `json:"pass_fees_to_customer"`
	Status                 string `json:"status"`
	Locale                 string `json:"locale"`
	Description            any    `json:"description"`
	Metadata               any    `json:"metadata"`
	SuccessURL             string `json:"success_url"`
	FailureURL             any    `json:"failure_url"`
	PaymentMethod          any    `json:"payment_method"`
	InvoiceID              any    `json:"invoice_id"`
	CustomerID             any    `json:"customer_id"`
	PaymentLinkID          any    `json:"payment_link_id"`
	CreatedAt              int    `json:"created_at"`
	UpdatedAt              int    `json:"updated_at"`
	ShippingAddress        any    `json:"shipping_address"`
	CollectShippingAddress int    `json:"collect_shipping_address"`
	CheckoutURL            string `json:"checkout_url"`
}

type WebhookPayload struct {
	ID       string `json:"id"`
	Entity   string `json:"entity"`
	Livemode string `json:"livemode"`
	Type     string `json:"type"`
	Data     struct {
		ID                 string      `json:"id"`
		Entity             string      `json:"entity"`
		Fees               int         `json:"fees"`
		Amount             int         `json:"amount"`
		Locale             string      `json:"locale"`
		Status             string      `json:"status"`
		Metadata           interface{} `json:"metadata"`
		CreatedAt          int         `json:"created_at"`
		InvoiceID          interface{} `json:"invoice_id"`
		UpdatedAt          int         `json:"updated_at"`
		CustomerID         string      `json:"customer_id"`
		Description        interface{} `json:"description"`
		FailureURL         interface{} `json:"failure_url"`
		SuccessURL         string      `json:"success_url"`
		PaymentMethod      interface{} `json:"payment_method"`
		PaymentLinkID      interface{} `json:"payment_link_id"`
		PassFeesToCustomer int         `json:"pass_fees_to_customer"`
		URL                string      `json:"url"`
	} `json:"data"`
	CreatedAt int `json:"created_at"`
	UpdatedAt int `json:"updated_at"`
}
