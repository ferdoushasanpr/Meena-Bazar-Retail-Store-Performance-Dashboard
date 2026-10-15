SELECT COUNT(*) AS [total_rows],
count([customer_id]) AS [total_customer_id],
       count([first_name]) AS [total_first_name],
       count([last_name]) AS [total_last_name],
       count([email]) AS [total_email],
       count([city]) AS [total_city],
       count([signup_date]) AS [total_signup_date],
       count([loyalty_tier]) AS [total_loyalty_tier],
       count([customer_segment]) AS [total_customer_segment]
FROM   [RetailStoreDB].[dbo].[DemoCustomers];


SELECT COUNT(*) AS [total_rows],
       COUNT([product_id]) AS [total_product_id],
       COUNT([product_name]) AS [total_product_name],
       COUNT([category]) AS [total_category],
       COUNT([brand]) AS [total_brand],
       COUNT([unit_cost]) AS [total_unit_cost],
       COUNT([unit_price]) AS [total_unit_price],
       COUNT([vat_rate]) AS [total_vat_rate]
FROM [RetailStoreDB].[dbo].[DemoProducts];


SELECT COUNT(*) AS [total_rows],
       COUNT([store_id]) AS [total_store_id],
       COUNT([store_name]) AS [total_store_name],
       COUNT([city]) AS [total_city]
FROM [RetailStoreDB].[dbo].[DemoStores];


SELECT COUNT(*) AS [total_rows],
       COUNT([order_id]) AS [total_order_id],
       COUNT([order_datetime]) AS [total_order_datetime],
       COUNT([store_id]) AS [total_store_id],
       COUNT([customer_id]) AS [total_customer_id],
       COUNT([order_channel]) AS [total_order_channel],
       COUNT([payment_method]) AS [total_payment_method],
       COUNT([order_status]) AS [total_order_status],
       COUNT([subtotal]) AS [total_subtotal],
       COUNT([discount_total]) AS [total_discount_total],
       COUNT([vat_total]) AS [total_vat_total],
       COUNT([delivery_fee]) AS [total_delivery_fee],
       COUNT([total_amount]) AS [total_total_amount]
FROM [RetailStoreDB].[dbo].[DemoSales];


SELECT COUNT(*) AS [total_rows],
       COUNT([order_item_id]) AS [total_order_item_id],
       COUNT([order_id]) AS [total_order_id],
       COUNT([product_id]) AS [total_product_id],
       COUNT([quantity]) AS [total_quantity],
       COUNT([unit_price]) AS [total_unit_price],
       COUNT([discount_amount]) AS [total_discount_amount],
       COUNT([line_net_amount]) AS [total_line_net_amount],
       COUNT([line_vat_amount]) AS [total_line_vat_amount]
FROM [RetailStoreDB].[dbo].[DemoTransactions];