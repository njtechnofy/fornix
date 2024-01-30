import { appSchema } from "@nozbe/watermelondb";
import { AgentModel, agentSchema } from "./Agent";
import { AreaModel, areaSchema } from "./Area";
import { CustomerModel, customerSchema } from "./Customer";
import {
  CustomerPrincipalModel,
  customerPrincipalSchema,
} from "./CustomerPrincipal";
import { GreaterAreaModel, greaterAreaSchema } from "./GreaterArea";
import { InvoiceModel, invoiceSchema } from "./Invoice";
import { OrderModel, orderSchema } from "./Order";
import { PrincipalModel, principalSchema } from "./Principal";
import { ProductModel, productSchema } from "./Product";
import { ProductOrderModel, productOrderSchema } from "./ProductOrder";
import { TaskModel, taskSchema } from "./Tasks";
// import { TaskModel, taskSchema } from "./Task";

export const MODELS_HASH = {
  agents: AgentModel,
  customers: CustomerModel,
  products: ProductModel,
  orders: OrderModel,
  product_orders: ProductOrderModel,
  invoices: InvoiceModel,
  principals: PrincipalModel,
  greater_areas: GreaterAreaModel,
  areas: AreaModel,
  customer_principals: CustomerPrincipalModel,
  tasks: TaskModel,
};

export const modelClasses = [
  GreaterAreaModel,
  AgentModel,
  CustomerModel,
  PrincipalModel,
  CustomerPrincipalModel,
  ProductModel,
  OrderModel,
  ProductOrderModel,
  InvoiceModel,
  AreaModel,
  TaskModel,
];

export const schema = appSchema({
  version: 1,
  tables: [
    agentSchema,
    customerSchema,
    orderSchema,
    productOrderSchema,
    productSchema,
    invoiceSchema,
    principalSchema,
    areaSchema,
    greaterAreaSchema,
    customerPrincipalSchema,
    taskSchema,
  ],
});
