import { appSchema } from "@nozbe/watermelondb";
import { AgentModel, agentSchema } from "./Agent";
import { AreaModel, areaSchema } from "./Area";
import { CustomerModel, customerSchema } from "./Customer";
import {
  CustomerPrincipalModel,
  customerPrincipalSchema,
} from "./CustomerPrinicpal";
import { GreaterAreaModel, greaterAreaSchema } from "./GreaterArea";
import { InvoiceModel, invoiceSchema } from "./Invoice";
import { OrderModel, orderSchema } from "./Order";
import { PrincipalModel, principalSchema } from "./Principal";
import { ProductModel, productSchema } from "./Product";
import { ProductOrderModel, productOrderSchema } from "./ProductOrder";
// import { TaskModel, taskSchema } from "./Task";

export const modelClasses = [
  AgentModel,
  CustomerModel,
  ProductModel,
  OrderModel,
  ProductOrderModel,
  InvoiceModel,
  PrincipalModel,
  GreaterAreaModel,
  AreaModel,
  PrincipalModel,
  CustomerPrincipalModel,
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
  ],
});
