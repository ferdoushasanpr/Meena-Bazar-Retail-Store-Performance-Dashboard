-- =============================================
-- 1. Create DemoCustomers Table
-- =============================================
CREATE TABLE [dbo].[DemoCustomers]
(
    [customer_id] NVARCHAR(50) NOT NULL,
    [first_name] NVARCHAR(50) NOT NULL,
    [last_name] NVARCHAR(50) NOT NULL,
    [email] NVARCHAR(50) NOT NULL,
    [city] NVARCHAR(50) NOT NULL,
    [signup_date] DATE NOT NULL,
    [loyalty_tier] NVARCHAR(50) NOT NULL,
    [customer_segment] NVARCHAR(50) NOT NULL,

    CONSTRAINT [PK_DemoCustomers]
        PRIMARY KEY CLUSTERED ([customer_id] ASC)
);


-- =============================================
-- 2. Create DemoProducts Table
-- =============================================
CREATE TABLE [dbo].[DemoProducts]
(
    [product_id] NVARCHAR(50) NOT NULL,
    [product_name] NVARCHAR(50) NOT NULL,
    [category] NVARCHAR(50) NOT NULL,
    [brand] NVARCHAR(50) NOT NULL,
    [unit_cost] FLOAT NOT NULL,
    [unit_price] FLOAT NOT NULL,
    [vat_rate] FLOAT NOT NULL,

    CONSTRAINT [PK_DemoProducts]
        PRIMARY KEY CLUSTERED ([product_id] ASC)
);


-- =============================================
-- 3. Create DemoStores Table
-- =============================================
CREATE TABLE [dbo].[DemoStores]
(
    [store_id] NVARCHAR(50) NOT NULL,
    [store_name] NVARCHAR(50) NOT NULL,
    [city] NVARCHAR(50) NOT NULL,

    CONSTRAINT [PK_DemoStores]
        PRIMARY KEY CLUSTERED ([store_id] ASC)
);


-- =============================================
-- 4. Create DemoSales Table
-- =============================================
CREATE TABLE [dbo].[DemoSales]
(
    [order_id] NVARCHAR(50) NOT NULL,
    [order_datetime] DATETIME2(7) NOT NULL,
    [store_id] NVARCHAR(50) NOT NULL,
    [customer_id] NVARCHAR(50) NULL,
    [order_channel] NVARCHAR(50) NOT NULL,
    [payment_method] NVARCHAR(50) NOT NULL,
    [order_status] NVARCHAR(50) NOT NULL,
    [subtotal] FLOAT NOT NULL,
    [discount_total] FLOAT NOT NULL,
    [vat_total] FLOAT NOT NULL,
    [delivery_fee] FLOAT NOT NULL,
    [total_amount] FLOAT NOT NULL,

    CONSTRAINT [PK_DemoSales]
        PRIMARY KEY CLUSTERED ([order_id] ASC),

    CONSTRAINT [FK_DemoSales_DemoCustomers]
        FOREIGN KEY ([customer_id])
        REFERENCES [dbo].[DemoCustomers] ([customer_id]),

    CONSTRAINT [FK_DemoSales_DemoStores]
        FOREIGN KEY ([store_id])
        REFERENCES [dbo].[DemoStores] ([store_id])
);


-- =============================================
-- 5. Create DemoTransactions Table
-- =============================================
CREATE TABLE [dbo].[DemoTransactions]
(
    [order_item_id] NVARCHAR(50) NOT NULL,
    [order_id] NVARCHAR(50) NOT NULL,
    [product_id] NVARCHAR(50) NOT NULL,
    [quantity] TINYINT NOT NULL,
    [unit_price] FLOAT NOT NULL,
    [discount_amount] FLOAT NOT NULL,
    [line_net_amount] FLOAT NOT NULL,
    [line_vat_amount] FLOAT NOT NULL,

    CONSTRAINT [PK_DemoTransactions]
        PRIMARY KEY CLUSTERED ([order_item_id] ASC),

    CONSTRAINT [FK_DemoTransactions_DemoProducts]
        FOREIGN KEY ([product_id])
        REFERENCES [dbo].[DemoProducts] ([product_id]),

    CONSTRAINT [FK_DemoTransactions_DemoSales]
        FOREIGN KEY ([order_id])
        REFERENCES [dbo].[DemoSales] ([order_id])
);