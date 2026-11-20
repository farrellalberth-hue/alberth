/**
 * Transaction Lab: small, pure, browser-only business-domain model.
 * NOT a backend, payment system, or multi-user inventory implementation.
 * The separate Engineering Lab PostgreSQL prototype handles server-side persistence.
 */
export const STORAGE_KEY = 'alberth_recruiter_transaction_lab_v1';
export const MAX_LINES = 5;
export const MAX_QUANTITY = 20;
export const INITIAL_PRODUCTS = Object.freeze([
  { id: 'sku-a01', sku: 'AFH-001', name: 'Mechanical Keyboard', price: 875000, stock: 18 },
  { id: 'sku-a02', sku: 'AFH-002', name: 'Precision Mouse', price: 325000, stock: 32 },
  { id: 'sku-a03', sku: 'AFH-003', name: 'USB-C Dock', price: 649000, stock: 14 },
  { id: 'sku-a04', sku: 'AFH-004', name: 'Studio Lamp', price: 499000, stock: 20 },
]);

export class DomainError extends Error {
  constructor(message, code = 'INVALID_INPUT') {
    super(message);
    this.name = 'DomainError';
    this.code = code;
  }
}

export const formatMoney = (value) => new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
}).format(value);

/** Reproducible initial demo state; no real customer information. */
export function createInitialState() {
  return {
    version: 1,
    products: INITIAL_PRODUCTS.map((p) => ({ ...p })),
    orders: [],
    invoices: [],
    events: [],
  };
}

/** Checks requested lines BEFORE changing any state. Returns trustworthy totals. */
export function priceOrder(state, requestedLines) {
  if (!state || !Array.isArray(state.products)) throw new DomainError('Invalid inventory state. Reset the demo.', 'INVALID_STATE');
  if (!Array.isArray(requestedLines) || requestedLines.length < 1 || requestedLines.length > MAX_LINES) {
    throw new DomainError('Choose 1–5 distinct products.');
  }
  if (new Set(requestedLines.map((line) => line.productId)).size !== requestedLines.length) {
    throw new DomainError('Duplicate item. Add the quantity on one line.');
  }
  const items = requestedLines.map((line) => {
    if (!Number.isSafeInteger(line.qty) || line.qty < 1 || line.qty > MAX_QUANTITY) {
      throw new DomainError('Quantity must be a whole number between 1 and 20.');
    }
    const product = state.products.find((p) => p.id === line.productId);
    if (!product) throw new DomainError('Product was not found in this inventory.', 'PRODUCT_NOT_FOUND');
    if (product.stock < line.qty) {
      throw new DomainError(`Insufficient stock: ${product.name} has ${product.stock} unit(s) left.`, 'INSUFFICIENT_STOCK');
    }
    return { productId: product.id, sku: product.sku, name: product.name, qty: line.qty,
      unitPrice: product.price, amount: product.price * line.qty };
  });
  const total = items.reduce((sum, line) => sum + line.amount, 0);
  if (!Number.isSafeInteger(total) || total <= 0) throw new DomainError('Invalid order total.');
  return { items, total };
}

/** No partial mutation: failures leave original state untouched. */
export function createOrder(state, { customer, lines }, options = {}) {
  const normalizedCustomer = String(customer ?? '').trim();
  if (normalizedCustomer.length < 2 || normalizedCustomer.length > 60) {
    throw new DomainError('Customer name must be between 2 and 60 characters. Use fictional data.');
  }
  if (state.orders.length >= 30) throw new DomainError('Demo safety limit reached: 30 orders.', 'DEMO_LIMIT');
  const { items, total } = priceOrder(state, lines);
  const id = (options.idFactory ?? (() => crypto.randomUUID()))();
  const at = (options.clock ?? (() => new Date().toISOString()))();
  const order = { id, customer: normalizedCustomer, items, total, createdAt: at };
  const deductions = new Map(items.map((item) => [item.productId, item.qty]));
  const products = state.products.map((product) => ({
    ...product, stock: product.stock - (deductions.get(product.id) ?? 0),
  }));
  const events = [
    { id: `${id}-create`, orderId: id, type: 'ORDER_CREATED', at, detail: `Order created: ${normalizedCustomer}, ${formatMoney(total)}` },
    ...items.map((item) => ({ id: `${id}-${item.productId}`, orderId: id, type: 'STOCK_DEDUCTED', at,
      detail: `${item.name}: −${item.qty} unit(s)` })),
  ];
  return { state: { ...state, products, orders: [order, ...state.orders], events: [...events, ...state.events] }, order };
}

/** Generating an invoice twice for one order is intentionally idempotent. */
export function createInvoice(state, orderId, options = {}) {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) throw new DomainError('Order not found.', 'ORDER_NOT_FOUND');
  const existing = state.invoices.find((item) => item.orderId === orderId);
  if (existing) return { state, invoice: existing, alreadyExisted: true };
  const at = (options.clock ?? (() => new Date().toISOString()))();
  const invoice = { id: `INV-${order.id.slice(0, 8).toUpperCase()}`, orderId, amount: order.total, createdAt: at };
  const event = { id: `invoice-${order.id}`, orderId, type: 'INVOICE_CREATED', at,
    detail: `Invoice ${invoice.id} generated for ${formatMoney(invoice.amount)}` };
  return { state: { ...state, invoices: [invoice, ...state.invoices], events: [event, ...state.events] }, invoice,
    alreadyExisted: false };
}

/** Defensive hydration: localStorage is untrusted, so malformed data resets safely. */
export function hydrateState(raw) {
  try {
    const data = JSON.parse(raw);
    if (data.version !== 1 || !Array.isArray(data.products) || !Array.isArray(data.orders)
        || !Array.isArray(data.invoices) || !Array.isArray(data.events)
        || data.products.length !== INITIAL_PRODUCTS.length || data.orders.length > 30
        || data.invoices.length > 30 || data.events.length > 200) return createInitialState();
    if (data.products.some((p) => !INITIAL_PRODUCTS.some((x) => x.id === p.id)
        || !Number.isSafeInteger(p.stock) || p.stock < 0 || p.stock > 1000)) return createInitialState();
    return data;
  } catch { return createInitialState(); }
}