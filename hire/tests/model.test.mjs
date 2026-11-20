import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, createOrder, createInvoice, priceOrder, hydrateState, DomainError } from '../demo/model.mjs';
const idFactory = () => 'ab1284fe-aaaa-4000-8888-bbbbbbbbbbbb';
const clock = () => '2026-11-21T00:00:00.000Z';
const request = { customer: 'Demo Customer', lines: [{ productId: 'sku-a01', qty: 2 }, { productId: 'sku-a02', qty: 3 }] };

test('prices multiple order lines correctly', () => {
  const { items, total } = priceOrder(createInitialState(), request.lines);
  assert.equal(total, 2 * 875000 + 3 * 325000);
  assert.deepEqual(items.map((item) => item.amount), [1750000, 975000]);
});
test('order creation deducts exactly the ordered inventory', () => {
  const initial = createInitialState();
  const { state, order } = createOrder(initial, request, { idFactory, clock });
  assert.equal(order.total, 2725000);
  assert.equal(state.products[0].stock, 16);
  assert.equal(state.products[1].stock, 29);
  assert.equal(initial.products[0].stock, 18, 'original state must remain unchanged');
  assert.deepEqual(state.events.map((e) => e.type), ['ORDER_CREATED', 'STOCK_DEDUCTED', 'STOCK_DEDUCTED']);
});
test('rejects zero, negative, fractional, and excessive quantities', () => {
  for (const qty of [0, -1, 1.1, 21, Number.NaN]) {
    assert.throws(() => priceOrder(createInitialState(), [{ productId: 'sku-a01', qty }]), DomainError);
  }
});
test('prevents duplicate line items and unknown SKUs', () => {
  assert.throws(() => priceOrder(createInitialState(), [
    { productId: 'sku-a01', qty: 1 }, { productId: 'sku-a01', qty: 1 }]), /Duplicate/);
  assert.throws(() => priceOrder(createInitialState(), [{ productId: 'bad', qty: 1 }]), /not found/);
});
test('rejects overselling without changing state', () => {
  const initial = createInitialState();
  assert.throws(() => createOrder(initial, { customer: 'Test', lines: [{ productId: 'sku-a01', qty: 19 }] }), /Insufficient/);
  assert.equal(initial.orders.length, 0);
  assert.equal(initial.products[0].stock, 18);
});
test('rejects empty baskets and invalid customer names', () => {
  assert.throws(() => createOrder(createInitialState(), { customer: 'Test', lines: [] }), /1–5/);
  assert.throws(() => createOrder(createInitialState(), { customer: ' ', lines: request.lines }), /Customer/);
});
test('creates linked invoices only once even after repeated clicks', () => {
  const first = createOrder(createInitialState(), request, { idFactory, clock });
  const a = createInvoice(first.state, first.order.id, { clock });
  const b = createInvoice(a.state, first.order.id, { clock });
  assert.equal(a.invoice.amount, first.order.total);
  assert.equal(a.state.invoices.length, 1);
  assert.equal(b.state.invoices.length, 1);
  assert.equal(b.alreadyExisted, true);
  assert.strictEqual(b.state, a.state);
});
test('cannot invoice a nonexistent order', () => {
  assert.throws(() => createInvoice(createInitialState(), 'fake-id'), /not found/);
});
test('malformed or suspicious local storage state safely resets', () => {
  assert.equal(hydrateState('{invalid').orders.length, 0);
  const invalid = createInitialState(); invalid.products[0].stock = -100;
  assert.equal(hydrateState(JSON.stringify(invalid)).products[0].stock, 18);
});
test('enforces a finite per-session demo order limit', () => {
  const state = createInitialState();
  state.orders = Array.from({ length: 30 }, (_, i) => ({ id: String(i) }));
  assert.throws(() => createOrder(state, request, { idFactory, clock }), /30 orders/);
});

test('default browser/native ID factory generates an order ID', () => {
  const result = createOrder(createInitialState(), request);
  assert.match(result.order.id, /^[a-f0-9-]{36}$/i);
});