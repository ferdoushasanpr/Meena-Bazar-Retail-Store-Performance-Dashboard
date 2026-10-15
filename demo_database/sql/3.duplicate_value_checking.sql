SELECT   [customer_id],
         COUNT(*) AS [duplicate_count]
FROM     dbo.DemoCustomers
GROUP BY [customer_id]
HAVING   COUNT(*) > 1;

SELECT   [email],
         COUNT(*) AS [duplicate_count]
FROM     dbo.DemoCustomers
GROUP BY [email]
HAVING   COUNT(*) > 1;

SELECT   [product_name],
         COUNT(*) AS [duplicate_count]
FROM     dbo.DemoProducts
GROUP BY [product_name]
HAVING   COUNT(*) > 1;

SELECT   [product_name],
         [brand],
         COUNT(*) AS [duplicate_count]
FROM     dbo.DemoProducts
GROUP BY [product_name], [brand]
HAVING   COUNT(*) > 1;

SELECT   [store_name],
         COUNT(*) AS [duplicate_count]
FROM     dbo.DemoStores
GROUP BY [store_name]
HAVING   COUNT(*) > 1;

SELECT   [order_id],
         COUNT(*) AS [duplicate_count]
FROM     dbo.DemoSales
GROUP BY [order_id]
HAVING   COUNT(*) > 1;

SELECT
    [customer_id],
    [store_id],
    [order_datetime],
    COUNT(*) AS [duplicate_count]
FROM dbo.DemoSales
WHERE [customer_id] IS NOT NULL
GROUP BY [customer_id], [store_id], [order_datetime]
HAVING COUNT(*) > 1;

SELECT [order_item_id], COUNT(*) AS [duplicate_count]
FROM dbo.DemoTransactions
GROUP BY [order_item_id]
HAVING COUNT(*) > 1;

SELECT
    order_id,
    product_id,
    COUNT(*) AS duplicate_count
FROM dbo.DemoTransactions
GROUP BY order_id, product_id
HAVING COUNT(*) > 1;