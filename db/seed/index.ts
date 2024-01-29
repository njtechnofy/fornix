import { logout } from "@/store";
import { faker } from "@faker-js/faker";
import { Q } from "@nozbe/watermelondb";
import { getDatabase } from "..";
import { COLLECTIONS } from "../db_utils";
import { AgentModel } from "../models_and_schemas/Agent";
import { AreaModel } from "../models_and_schemas/Area";
import { CustomerModel } from "../models_and_schemas/Customer";
import { CustomerPrincipalModel } from "../models_and_schemas/CustomerPrinicpal";
import { GreaterAreaModel } from "../models_and_schemas/GreaterArea";
import { InvoiceModel } from "../models_and_schemas/Invoice";
import { OrderModel } from "../models_and_schemas/Order";
import { PrincipalModel } from "../models_and_schemas/Principal";
import { ProductModel } from "../models_and_schemas/Product";
import { ProductOrderModel } from "../models_and_schemas/ProductOrder";

const defaultSeed = {
  customer: {
    name: "Nabua People's Mart",
    latitude: 13.40905,
    longitude: 123.3731,
    radius: 110,
  },
  greaterArea: {
    name: "Camarines Sur",
  },
  area: {
    name: "Nabua",
  },
  principal: {
    name: "Green Cross Incorporated",
    code: "GCI",
  },
  product: {
    name: "Green Cross 70% Alcohol",
    code: "70Q500",
  },
};

export async function seed(
  principalCount = 4,
  areaCountPerGreaterArea = 2,
  greaterAreaCount = 2,
  productCount = 3,
  customerCount = 32,
  orderCountPerCustomer = 20
) {
  const database = getDatabase();
  resetDB(false);

  const customerPerArea =
    customerCount / (areaCountPerGreaterArea * greaterAreaCount);

  const Customers = database.get<CustomerModel>(COLLECTIONS.CUSTOMERS);
  const Agents = database.get<AgentModel>(COLLECTIONS.AGENTS);
  const Orders = database.get<OrderModel>(COLLECTIONS.ORDERS);
  const Products = database.get<ProductModel>(COLLECTIONS.PRODUCTS);
  const Areas = database.get<AreaModel>(COLLECTIONS.AREAS);
  const Invoices = database.get<InvoiceModel>(COLLECTIONS.INVOICES);
  const GreaterAreas = database.get<GreaterAreaModel>(
    COLLECTIONS.GREATER_AREAS
  );
  const Principals = database.get<PrincipalModel>(COLLECTIONS.PRINCIPALS);
  const CustomerPrincipals = database.get<CustomerPrincipalModel>(
    COLLECTIONS.CUSTOMER_PRINCIPALS
  );
  const ProductOrders = database.get<ProductOrderModel>(
    COLLECTIONS.PRODUCT_ORDERS
  );

  try {
    await database.write(async () => {
      await Agents.create((a) => {
        a.name = "Nhiel Jeff Salvana";
        a.email = "njsalvana@gmail.com";
        a.mobile = "09568191325";
      });

      const greaterAreas = await Promise.all(
        Array.from(Array(greaterAreaCount).keys()).map((k) =>
          GreaterAreas.prepareCreate((g) => {
            g.name =
              k === 0
                ? defaultSeed.greaterArea.name
                : `RG:${faker.location.city()}`;
          })
        )
      );

      const areas = await Promise.all(
        greaterAreas.flatMap((ga, index) =>
          Array.from(Array(areaCountPerGreaterArea).keys()).map((k) =>
            Areas.create((a) => {
              a.name =
                index === 0 && k === 0
                  ? defaultSeed.area.name
                  : `RA:${faker.location.county()}`;
              a.greaterArea.id = ga.id;
            })
          )
        )
      );

      const customers = await Promise.all(
        areas.flatMap((a, index) =>
          Array.from(Array(customerPerArea).keys()).map((k) =>
            Customers.create((c) => {
              c.name =
                index === 0 && k === 0
                  ? "Nabua's People Mart"
                  : `RC:${faker.company.name()}`;
              c.latitude =
                index === 0 && k === 0
                  ? 13.40905
                  : 13.40905 + Math.random() * 0.06 * plusOrMinus();
              c.longitude =
                index === 0 && k === 0
                  ? 123.3731
                  : 123.3731 + Math.random() * 0.06 * plusOrMinus();
              c.area.id = c.id;
              c.radius = 100;
              c.area.id = a.id;
              c.mobileNumber = faker.phone.number();
              c.allPaid = Math.random() > 0.5;
              c.allDelivered = Math.random() > 0.5;
            })
          )
        )
      );

      const principals = await Promise.all(
        Array.from(Array(principalCount).keys()).map((k) =>
          Principals.create((p) => {
            const name = faker.company.name();
            const code = name
              .split(" ")
              .map((n) => n[0])
              .join("");
            p.name = k === 0 ? "Green Cross Incorporated" : name;
            p.code = k === 0 ? "GCI" : code;
          })
        )
      );

      const products = await Promise.all(
        principals.flatMap((pr, index) =>
          Array.from(Array(productCount).keys()).map((k) =>
            Products.create((p) => {
              (p.name =
                index === 0 && k === 0
                  ? defaultSeed.product.name
                  : faker.commerce.productName()),
                (p.code =
                  index === 0 && k === 0
                    ? defaultSeed.product.code
                    : faker.string.alphanumeric({
                        length: 6,
                        casing: "upper",
                      }));
              p.price = faker.number.int({
                min: 50,
                max: 500,
              });
              p.principal.id = pr.id;
            })
          )
        )
      );

      const ordersPromises: Promise<OrderModel>[] = [];
      const customerPrincipalPromises: Promise<CustomerPrincipalModel>[] = [];
      const productOrderPromises: Promise<ProductOrderModel>[] = [];
      const orderInvoicePromises: Promise<InvoiceModel>[] = [];
      const orderUpdatePromises: Promise<OrderModel>[] = [];

      //iterate customers
      customers.forEach((customer) => {
        principals.forEach((pr) => {
          customerPrincipalPromises.push(
            CustomerPrincipals.create((cp) => {
              cp.principal.id = pr.id;
              cp.customer.id = customer.id;
            })
          );
        });

        //seed customer orders
        for (let i = 0; i < orderCountPerCustomer; i++) {
          const createDate = faker.date.recent({
            days: Math.floor(Math.random() * 20 + 10),
            refDate: new Date(),
          });

          ordersPromises.push(
            Orders.create((o) => {
              o.createdAt = createDate.getTime();
              o.customer.id = customer.id;
              o.paid = customer.allPaid ? true : Math.random() > 0.5;
              o.customerName = customer.name;
              o.deliveredAt = customer.allDelivered
                ? faker.date
                    .soon({
                      days: Math.floor(Math.random() * 5 + 1),
                      refDate: createDate,
                    })
                    .getTime()
                : Math.random() > 0.5
                ? faker.date
                    .soon({
                      days: Math.floor(Math.random() * 5 + 1),
                      refDate: createDate,
                    })
                    .getTime()
                : undefined;
            })
          );
        }
      });

      const orders = await Promise.all(ordersPromises);

      for (const order of orders) {
        const numberOfProducts = Math.floor(Math.random() * 10) + 3;
        let total_price = 0;
        let _products: string[] = [];

        for (let i = 0; i < numberOfProducts; i++) {
          let product = randomElementFromArray(products);
          while (_products.includes(product.id)) {
            product = randomElementFromArray(products);
          }
          const qty = Math.floor((Math.random() + 0.5) * 50);
          const currentPrice = product.price * qty;
          total_price += currentPrice;
          _products.push(product.id);

          productOrderPromises.push(
            ProductOrders.create((po) => {
              po.customerName = order.customerName;
              po.productName = product.name;
              po.product.id = product.id;
              po.order.id = order.id;
              po.qty = qty;
              po.price = product.price;
            })
          );
        }
        orderUpdatePromises.push(
          order.update((o) => {
            o.total = total_price;
          })
        );

        if (order.paid) {
          let balance = total_price;

          while (balance > 0) {
            let partial = (Math.random() * balance) / 2;
            let paidAmount = partial < total_price / 5 ? balance : partial;

            orderInvoicePromises.push(
              Invoices.create((i) => {
                i.customerName = order.customerName;
                i.createdAt = faker.date
                  .soon({
                    days: Math.floor(Math.random() * 5 + 1),
                    refDate: new Date(order.createdAt),
                  })
                  .getTime();
                i.order.id = order.id;
                i.paidAmount = paidAmount;
              })
            );
            balance = balance - paidAmount;
          }
        } else if (Math.random() > 0.5) {
          orderInvoicePromises.push(
            Invoices.create((i) => {
              i.customerName = order.customerName;
              i.createdAt = faker.date
                .soon({
                  days: Math.floor(Math.random() * 5 + 1),
                  refDate: new Date(order.createdAt),
                })
                .getTime();
              i.order.id = order.id;
              i.paidAmount = (Math.random() * total_price) / 2;
            })
          );
        }
      }

      await Promise.all(
        [
          orderUpdatePromises,
          customerPrincipalPromises,
          productOrderPromises,
          orderInvoicePromises,
          orderUpdatePromises,
        ].flat()
      );
    });
    console.log("made it here!");
    await updateCustomerColumns();
  } catch (e) {
    console.error(e);
    resetDB();
  } finally {
    console.log("done seeding");
  }
}

export async function updateCustomerColumns() {
  const database = getDatabase();
  const Customers = database.get<CustomerModel>(COLLECTIONS.CUSTOMERS);
  const res = await Customers.query(
    Q.unsafeSqlQuery(`
      WITH TaggedCustomers AS (
        SELECT
            c.id,
            COALESCE(SUM(o.total), 0) as newTotal,
            COALESCE(SUM(i.paid_amount), 0) as newPaidAmount,
            CASE WHEN COALESCE(SUM(o.total), 0) = COALESCE(SUM(i.paid_amount), 0) THEN 1 ELSE 0 END AS allPaid,
            CASE WHEN COUNT(o.delivered_at) = COUNT(o.id) THEN 1 ELSE 0 END AS allDelivered
        FROM
            customers c
        LEFT JOIN
            orders o ON c.id = o.customer_id
        LEFT JOIN
            invoices i ON o.id = i.order_id
        WHERE 
            c.all_paid = 0 OR c.all_delivered = 0
        GROUP BY
            c.id
    )
    
    SELECT
        c.id,
        tc.allDelivered AS allDelivered,
        tc.allPaid AS allPaid,
        tc.newTotal AS newTotal,
        tc.newPaidAmount AS newPaidAmount
    FROM
        customers c
    LEFT JOIN
        orders o ON c.id = o.customer_id
    LEFT JOIN
        invoices i ON o.id = i.order_id
    LEFT JOIN
        TaggedCustomers tc ON c.id = tc.id 
    WHERE
        tc.allPaid = 1 OR tc.allDelivered = 1
    GROUP BY
        c.id;
      `)
  ).unsafeFetchRaw();
  try {
    console.log("writing updates", res.length, res);
    await database.write(async () => {
      const c_promises: Promise<CustomerModel>[] = [];
      const updateableIds: string[] = [];
      const newAllPaid: string[] = [];
      const newAllDelivered: string[] = [];
      res.forEach((r) => {
        updateableIds.push(r.id);
        if (r.allPaid) {
          newAllPaid.push(r.id);
        }
        if (r.allDelivered) {
          newAllDelivered.push(r.id);
        }
      });
      const customers = await Customers.query(
        Q.where("id", Q.oneOf(updateableIds))
      );
      console.log("new paid?", newAllPaid);
      for (const updatable of customers) {
        c_promises.push(
          updatable.update((u) => {
            u.allPaid = newAllPaid.includes(u.id);
            u.allDelivered = newAllDelivered.includes(u.id);
          })
        );
      }
      await Promise.all(c_promises);
      console.log("done updating yes!");
    });
  } catch (e) {
    console.error(e);
  }
}

function plusOrMinus() {
  return Math.random() < 0.5 ? -1 : 1;
}

export async function resetDB(shouldLogout: boolean = true) {
  const database = getDatabase();

  try {
    console.log("resetting DB");
    await database.write(async () => {
      await database.unsafeResetDatabase();
    });
    console.log("fetching db");
    if (shouldLogout) {
      logout();
    }
  } catch (e) {
    console.error(e);
  } finally {
    console.log("DB RESET FINISHED");
  }
}
// latitude: 13.40905,
// longitude: 123.3731,
export async function addCustomer() {
  const database = getDatabase();
  try {
    await database.write(async () => {
      const areas = await database
        .get<AreaModel>(COLLECTIONS.AREAS)
        .query()
        .fetch();
      await database.get<CustomerModel>("customers").create((c) => {
        c.name = `RC: ${faker.company.name()}`;
        c.latitude = 13.40905 + Math.random() * 0.06 * plusOrMinus();
        c.longitude = 123.3731 + Math.random() * 0.08 * plusOrMinus();
        c.radius = 110 + Math.random() * 20;
        c.area.id = randomElementFromArray(areas).id;
        c.mobileNumber = faker.phone.number();
      });
    });
  } catch (e) {
    console.error(e);
  }
}

export async function moveCustomer({
  latitude,
  longitude,
  id,
}: {
  latitude: number;
  longitude: number;
  id: string;
}) {
  const database = getDatabase();
  await database.write(async () => {
    const customer = await database
      .get<CustomerModel>(COLLECTIONS.CUSTOMERS)
      .find(id);

    await customer.update(() => {
      console.log("updating customer");
      customer.latitude = latitude;
      customer.longitude = longitude;
    });
  });
}

export async function createCustomer({
  latitude,
  longitude,
  name,
  radius,
}: {
  latitude: number;
  longitude: number;
  radius: number;

  name: string;
}) {
  const database = getDatabase();

  await database.write(async () => {
    await database
      .get<CustomerModel>(COLLECTIONS.CUSTOMERS)
      .create((customer) => {
        customer.name = name;
        customer.latitude = latitude;
        customer.longitude = longitude;
        customer.radius = radius;
      });
  });
}

function randomElementFromArray<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)];
}
