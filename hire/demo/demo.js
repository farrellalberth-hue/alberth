import { createInitialState, createOrder, createInvoice, hydrateState, priceOrder, formatMoney, STORAGE_KEY } from './model.mjs';

const $ = (selector) => document.querySelector(selector);
const create = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
};
let state = hydrateState(localStorage.getItem(STORAGE_KEY));
let basket = [];
const persist = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
const getProduct = (id) => state.products.find((p) => p.id === id);

const notify = (message, error = false) => {
  const box = $('#alert');
  box.textContent = message;
  box.className = `alert ${error ? 'is-error' : 'is-success'}`;
  box.hidden = false;
  box.setAttribute('role', error ? 'alert' : 'status');
  box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
};
const changeView = (id) => {
  document.querySelectorAll('[data-view]').forEach((view) => { view.hidden = view.dataset.view !== id; });
  document.querySelectorAll('[data-tab]').forEach((button) => {
    button.setAttribute('aria-pressed', button.dataset.tab === id ? 'true' : 'false');
  });
  const headings = { overview: ['Operations overview.', 'Create orders, generate invoices and inspect the stock effect.'],
    orders: ['Sales orders.', 'Every order and generated invoice in your current browser session.'],
    inventory: ['Inventory ledger.', 'Actual state changes computed by the business rule module.'],
    audit: ['Event history.', 'A chronological trace of successful demo transactions.'] };
  $('#page-title').textContent = headings[id][0];
  $('#page-subtitle').textContent = headings[id][1];
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
const renderBasket = () => {
  const list = $('#cart-items'); list.replaceChildren();
  $('#cart-count').textContent = `${basket.length} / 5`;
  if (!basket.length) list.append(create('p', 'empty', 'Add a product to begin.'));
  basket.forEach((line) => {
    const product = getProduct(line.productId);
    const row = create('div', 'cart-row');
    const label = create('div', 'cart-name'); label.append(create('strong', '', product?.name ?? 'Unknown'), create('small', '', `${line.qty} × ${formatMoney(product?.price ?? 0)}`));
    const amount = create('strong', 'cart-amount', formatMoney(line.qty * (product?.price ?? 0)));
    const remove = create('button', 'remove-item', '✕');
    remove.type = 'button'; remove.setAttribute('aria-label', `Remove ${product?.name ?? 'item'}`);
    remove.addEventListener('click', () => { basket = basket.filter((p) => p.productId !== line.productId); renderBasket(); });
    row.append(label, amount, remove); list.append(row);
  });
  const total = basket.reduce((sum, line) => sum + line.qty * (getProduct(line.productId)?.price ?? 0), 0);
  $('#order-total').textContent = formatMoney(total);
  $('#create-order').disabled = basket.length === 0;
};
const renderProductOptions = () => {
  const select = $('#product'); const keep = select.value; select.replaceChildren();
  state.products.forEach((product) => {
    const option = create('option', '', `${product.name} · ${product.stock} available`);
    option.value = product.id;
    select.append(option);
  });
  if (state.products.some((p) => p.id === keep)) select.value = keep;
};
const renderMetrics = () => {
  $('#metric-revenue').textContent = formatMoney(state.orders.reduce((sum, order) => sum + order.total, 0));
  $('#metric-orders').textContent = String(state.orders.length).padStart(2, '0');
  $('#metric-invoices').textContent = String(state.invoices.length).padStart(2, '0');
  $('#metric-units').textContent = String(state.orders.flatMap((o) => o.items).reduce((sum, i) => sum + i.qty, 0)).padStart(2, '0');
};
const renderStocks = () => {
  const preview = $('#stock-preview'); preview.replaceChildren();
  const tbody = $('#inventory-body'); tbody.replaceChildren();
  state.products.forEach((product) => {
    const initial =  ([18, 32, 14, 20])[state.products.findIndex((p) => p.id === product.id)];
    const group = create('div', 'stock-item');
    const title = create('div', 'stock-line');
    const labels = create('div'); labels.append(create('strong', '', product.name), create('small', '', product.sku));
    title.append(labels, create('b', '', `${product.stock} / ${initial}`));
    const bar = create('div', 'stock-bar');
    const fill = create('div', 'stock-fill'); fill.style.width = `${Math.max(0, product.stock / initial * 100)}%`;
    bar.append(fill); group.append(title, bar); preview.append(group);
    const tr = create('tr');
    [product.sku, product.name, formatMoney(product.price), String(product.stock)].forEach((v) => tr.append(create('td', '', v)));
    tbody.append(tr);
  });
};
const fmtDate = (iso) => new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
const renderEvents = () => {
  const preview = $('#activity-preview'); preview.replaceChildren();
  const audit = $('#audit-list'); audit.replaceChildren();
  $('#audit-empty').hidden = state.events.length > 0;
  state.events.slice(0, 3).forEach((event) => {
    const group = create('div', 'activity');
    group.append(create('span', 'activity-check', '✓'));
    const content = create('div'); content.append(create('strong', '', event.type.replaceAll('_', ' ')), create('p', '', event.detail), create('small', '', fmtDate(event.at)));
    group.append(content); preview.append(group);
  });
  state.events.forEach((event) => {
    const group = create('article', 'audit-row');
    const title = create('div', 'audit-title'); title.append(create('strong', '', event.type.replaceAll('_', ' ')), create('time', '', fmtDate(event.at)));
    const content = create('div', 'audit-content'); content.append(title, create('p', '', event.detail), create('code', '', `ORDER REF / ${event.orderId.slice(0, 8).toUpperCase()}`));
    group.append(create('span', 'audit-marker', '✓'), content); audit.append(group);
  });
};
const showInvoice = (invoice) => {
  const order = state.orders.find((o) => o.id === invoice.orderId);
  if (!order) return notify('Order not found.', true);
  $('#invoice-title').textContent = invoice.id;
  $('#invoice-customer').textContent = `Bill to ${order.customer} · ${fmtDate(invoice.createdAt)}`;
  const lines = $('#invoice-lines'); lines.replaceChildren();
  order.items.forEach((item) => {
    const group = create('div', 'invoice-line');
    group.append(create('span', '', `${item.name} × ${item.qty}`), create('strong', '', formatMoney(item.amount)));
    lines.append(group);
  });
  $('#invoice-total').textContent = formatMoney(invoice.amount);
  $('#invoice-dialog').showModal();
};
const renderOrders = () => {
  const tbody = $('#orders-body'); tbody.replaceChildren();
  $('#orders-empty').hidden = state.orders.length > 0;
  for (const order of state.orders) {
    const tr = create('tr');
    tr.append(create('td', 'mono', order.id.slice(0, 8).toUpperCase()), create('td', '', order.customer),
      create('td', '', order.items.map((l) => `${l.qty}× ${l.name}`).join(', ')), create('td', '', formatMoney(order.total)));
    const td = create('td');
    const existing = state.invoices.find((i) => i.orderId === order.id);
    const button = create('button', 'invoice-button', existing ? `View ${existing.id}` : '+ Generate invoice');
    button.type = 'button';
    button.addEventListener('click', () => {
      try {
        const result = createInvoice(state, order.id);
        state = result.state; persist(); renderAll(); showInvoice(result.invoice);
        if (!result.alreadyExisted) notify(`Invoice ${result.invoice.id} created and linked to its order.`);
      } catch (error) { notify(error.message, true); }
    });
    td.append(button); tr.append(td); tbody.append(tr);
  }
};
function renderAll() { renderProductOptions(); renderBasket(); renderMetrics(); renderStocks(); renderEvents(); renderOrders(); }

document.querySelectorAll('[data-tab]').forEach((button) => button.addEventListener('click', () => changeView(button.dataset.tab)));
document.querySelectorAll('[data-go]').forEach((button) => button.addEventListener('click', () => changeView(button.dataset.go)));
$('#add-item').addEventListener('click', () => {
  try {
    const line = { productId: $('#product').value, qty: Number($('#quantity').value) };
    priceOrder(state, [...basket, line]);
    basket.push(line); renderBasket();
    $('#alert').hidden = true;
  } catch (error) { notify(error.message, true); }
});
$('#order-form').addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    const result = createOrder(state, { customer: $('#customer').value, lines: basket });
    state = result.state; basket = []; persist(); renderAll(); changeView('orders');
    notify(`Order ${result.order.id.slice(0, 8).toUpperCase()} created. Inventory reduced and event log updated.`);
  } catch (error) { notify(error.message, true); }
});
$('#reset').addEventListener('click', () => {
  if (window.confirm('Reset all browser-local demo orders, invoices, and stock?')) {
    state = createInitialState(); basket = []; persist(); renderAll(); changeView('overview'); notify('Browser-only demo data reset.');
  }
});
$('#close-invoice').addEventListener('click', () => $('#invoice-dialog').close());
$('#invoice-dialog').addEventListener('click', (event) => { if (event.target === $('#invoice-dialog')) $('#invoice-dialog').close(); });
$('#print-invoice').addEventListener('click', () => window.print());
renderAll();