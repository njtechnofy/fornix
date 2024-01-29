import { ColumnSchema } from "@nozbe/watermelondb";

export enum COLLECTIONS {
  AGENTS = "agents",
  CUSTOMERS = "customers",
  ORDERS = "orders",
  PRODUCTS = "products",
  PRODUCT_ORDERS = "product_orders",
  PRINCIPALS = "principals",
  INVOICES = "invoices",
  GREATER_AREAS = "greater_areas",
  AREAS = "areas",
  CUSTOMER_PRINCIPALS = "customer_principals",
  TASKS = "tasks",
}

// AgentModel,
// CustomerModel,
// ProductModel,
// OrderModel,
// ProductOrderModel,
// InvoiceModel,
// PrincipalModel,
// GreaterAreaModel,
// AreaModel,
// PrincipalModel,
// CustomerPrincipalModel,
// TaskModel,

export const dateSchemaColumns = [
  { name: "created_at", type: "number" },
  { name: "updated_at", type: "number" },
] as const;

export const nameWithDateSchemaColumns = [
  { name: "name", type: "string" },
  ...dateSchemaColumns,
] satisfies ColumnSchema[];
