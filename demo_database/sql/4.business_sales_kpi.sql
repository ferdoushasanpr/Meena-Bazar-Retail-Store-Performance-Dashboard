-- ============================================================
-- 1. TOTAL TRANSACTIONS
-- ============================================================

SELECT COUNT([order_id]) AS [Total_Transactions]
FROM   [RetailStoreDB].[dbo].[DemoSales]
WHERE  [order_status] = 'Completed';


-- ============================================================
-- 2. TOTAL SALES
-- ============================================================

SELECT
    SUM([total_amount]) AS [Total_Sales]
FROM dbo.DemoSales
WHERE [order_status] = 'Completed';


-- ============================================================
-- 3. AVERAGE BASKET VALUE
-- ============================================================

SELECT ROUND(SUM([total_amount]) / COUNT([order_id]), 2) AS [Average_Basket_Value]
FROM   [RetailStoreDB].[dbo].[DemoSales]
WHERE  [order_status] = 'Completed';


-- ============================================================
-- 4. SALES BY STORE AND PRODUCT CATEGORY
-- ============================================================

SELECT
    st.store_id,
    st.store_name,
    p.category,
    SUM(t.line_net_amount + t.line_vat_amount)
        AS TotalSales,
    SUM(t.quantity) AS UnitsSold,
    COUNT(DISTINCT s.order_id) AS NumberOfTransactions
FROM dbo.DemoSales AS s
INNER JOIN dbo.DemoStores AS st
    ON s.store_id = st.store_id
INNER JOIN dbo.DemoTransactions AS t
    ON s.order_id = t.order_id
INNER JOIN dbo.DemoProducts AS p
    ON t.product_id = p.product_id
WHERE s.order_status = 'Completed'
GROUP BY
    st.store_id,
    st.store_name,
    p.category
ORDER BY
    st.store_name,
    TotalSales DESC;


-- ============================================================
-- 5. SALES PERFORMANCE BY STORE
-- ============================================================

SELECT   [s].[store_id],
         [st].[store_name],
         COUNT([s].[order_id]) AS [Total_Transactions],
         SUM([s].[total_amount]) AS [Total_Sales]
FROM     [RetailStoreDB].[dbo].[DemoSales] AS s
         INNER JOIN
         [RetailStoreDB].[dbo].[DemoStores] AS st
         ON [s].[store_id] = [st].[store_id]
GROUP BY [s].[store_id], [st].[store_name]
ORDER BY [s].[store_id];


-- ============================================================
-- 6. SALES PERFORMANCE BY PRODUCT
-- ============================================================

SELECT   [t].[product_id],
         [p].[product_name],
         COUNT([t].[product_id]) AS [Total_Transactions],
         SUM([line_net_amount]) AS [Total_Sales]
FROM     [RetailStoreDB].[dbo].[DemoTransactions] AS t
         INNER JOIN
         [RetailStoreDB].[dbo].[DemoProducts] AS p
         ON [t].[product_id] = [p].[product_id]
GROUP BY [t].[product_id], [p].[product_name];


-- ============================================================
-- 7. SALES PERFORMANCE BY PRODUCT CATEGORY
-- ============================================================

SELECT   [p].[category],
         COUNT([t].[product_id]) AS [Total_Transactions],
         SUM([line_net_amount]) AS [Total_Sales]
FROM     [RetailStoreDB].[dbo].[DemoTransactions] AS t
         INNER JOIN
         [RetailStoreDB].[dbo].[DemoProducts] AS p
         ON [t].[product_id] = [p].[product_id]
GROUP BY [p].[category];


-- ============================================================
-- 8. SALES PERFORMANCE BY BRAND
-- ============================================================

SELECT   [p].[brand],
         COUNT([t].[product_id]) AS [Total_Transactionss],
         SUM([line_net_amount]) AS [Total_Sales]
FROM     [RetailStoreDB].[dbo].[DemoTransactions] AS t
         INNER JOIN
         [RetailStoreDB].[dbo].[DemoProducts] AS p
         ON [t].[product_id] = [p].[product_id]
GROUP BY [p].[brand];


-- ============================================================
-- 9. DAILY SALES TREND
-- ============================================================

SELECT
    CAST(order_datetime AS DATE) AS SalesDate,
    SUM(total_amount) AS TotalSales,
    COUNT(*) AS NumberOfTransactions,
    AVG(total_amount) AS AverageBasketValue
FROM dbo.DemoSales
WHERE order_status = 'Completed'
GROUP BY CAST(order_datetime AS DATE)
ORDER BY SalesDate;


-- ============================================================
-- 10. YEARLY SALES TREND
-- ============================================================

SELECT   YEAR([order_datetime]) AS [YEAR],
         COUNT([order_id]) AS [Total_Sales],
         SUM([total_amount]) AS [Total_Revenue]
FROM     [RetailStoreDB].[dbo].[DemoSales]
GROUP BY YEAR([order_datetime]);


-- ============================================================
-- 11. MONTHLY SALES TREND
-- ============================================================

SELECT   YEAR([order_datetime]) AS [YEAR],
         DATENAME(MONTH, [order_datetime]) AS [MONTH],
         COUNT([order_id]) AS [Total_Sales],
         SUM([total_amount]) AS [Total_Revenue]
FROM     [RetailStoreDB].[dbo].[DemoSales]
GROUP BY YEAR([order_datetime]), MONTH([order_datetime]), DATENAME(MONTH, [order_datetime])
ORDER BY MONTH([order_datetime]);


-- ============================================================
-- 12. SALES KPI SUMMARY WITH DATE AND STORE FILTERS
-- ============================================================

DECLARE @StartDate DATE = '2025-01-01';
DECLARE @EndDate   DATE = '2025-02-01';
DECLARE @StoreID   NVARCHAR(50) = 'ST005';

SELECT
    SUM(s.total_amount) AS TotalSales,
    COUNT(*) AS NumberOfTransactions,
    AVG(s.total_amount) AS AverageBasketValue
FROM dbo.DemoSales AS s
WHERE s.order_status = 'Completed'
  AND s.order_datetime >= @StartDate
  AND s.order_datetime < @EndDate
  AND (
      @StoreID IS NULL
      OR s.store_id = @StoreID
  );


-- ============================================================
-- 13. DAILY SALES WITH DATE AND STORE FILTERS
-- ============================================================

SELECT
    CAST(s.order_datetime AS DATE) AS SalesDate,
    st.store_name,
    SUM(s.total_amount) AS TotalSales,
    COUNT(*) AS NumberOfTransactions,
    AVG(s.total_amount) AS AverageBasketValue
FROM dbo.DemoSales AS s
INNER JOIN dbo.DemoStores AS st
    ON s.store_id = st.store_id
WHERE s.order_status = 'Completed'
  AND s.order_datetime >= @StartDate
  AND s.order_datetime < @EndDate
  AND (
      @StoreID IS NULL
      OR s.store_id = @StoreID
  )
GROUP BY
    CAST(s.order_datetime AS DATE),
    st.store_name
ORDER BY
    SalesDate,
    st.store_name;


-- ============================================================
-- 14. SALES BY STORE AND CATEGORY WITH DATE FILTERS
-- ============================================================

SELECT
    st.store_name,
    p.category,
    SUM(t.line_net_amount + t.line_vat_amount)
        AS TotalSales,
    SUM(t.quantity) AS UnitsSold,
    COUNT(DISTINCT s.order_id) AS NumberOfTransactions
FROM dbo.DemoSales AS s
INNER JOIN dbo.DemoStores AS st
    ON s.store_id = st.store_id
INNER JOIN dbo.DemoTransactions AS t
    ON s.order_id = t.order_id
INNER JOIN dbo.DemoProducts AS p
    ON t.product_id = p.product_id
WHERE s.order_status = 'Completed'
  AND s.order_datetime >= @StartDate
  AND s.order_datetime < @EndDate
  AND (
      @StoreID IS NULL
      OR s.store_id = @StoreID
  )
GROUP BY
    st.store_name,
    p.category
ORDER BY
    st.store_name,
    TotalSales DESC;