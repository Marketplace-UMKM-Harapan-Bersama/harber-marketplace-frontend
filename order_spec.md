// api spec order
// endpoint: api/orders
{
  "user_id": <integer>,
  "seller_id": <integer>,
  "total_amount": <integer>,
  "shipping_cost": <integer>,
  "payment_method": "<string>",
  "shipping_address": "<string>",
  "shipping_city": "<string>",
  "shipping_province": "<string>",
  "shipping_postal_code": "<string>",
  "items": [
    {
      "product_id": <integer>,
      "price": <integer>,
      "quantity": <integer>
    },
    ...
  ]
}

contoh isi
[
  {
    "user_id": 1,
    "seller_id": 3,
    "total_amount": 275000,
    "shipping_cost": 15000,
    "payment_method": "bank_transfer",
    "shipping_address": "Jl. Mangga",
    "shipping_city": "Bandung",
    "shipping_province": "Jawa Barat",
    "shipping_postal_code": "40123",
    "items": [
      {
        "product_id": 5,
        "price": 75000,
        "quantity": 1
      }
    ]
  },
  {
    "user_id": 1,
    "seller_id": 4,
    "total_amount": 350000,
    "shipping_cost": 20000,
    "payment_method": "cod",
    "shipping_address": "Jl. Kenanga",
    "shipping_city": "Jakarta",
    "shipping_province": "DKI Jakarta",
    "shipping_postal_code": "10110",
    "items": [
      {
        "product_id": 6,
        "price": 300000,
        "quantity": 1
      },
      {
        "product_id": 7,
        "price": 50000,
        "quantity": 1
      }
    ]
  }
]


// contoh Response
//
{
  "message": "Order created successfully",
  "orders": [
    {
      "user_id": ...,
      "seller_id": ...,
      ...
    },
    ...
  ]
}
