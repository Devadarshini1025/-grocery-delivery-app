{tab === 'orders' && (
  <div className="space-y-4">
    {orders.map((o) => (
      <div key={o._id} className="bg-white rounded-lg p-5">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-kraft-200">
          <div>
            <p className="font-medium">Order #{o._id.slice(-6)} &mdash; {o.user?.name}</p>
            <p className="text-sm text-ink-600">
              ₹{o.totalPrice.toFixed(2)} &middot; {o.paymentMethod.toUpperCase()}
            </p>
          </div>
          <select
            value={o.status}
            onChange={(e) => handleStatusChange(o._id, e.target.value)}
            className="border border-kraft-300 rounded px-3 py-1.5 text-sm"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
        </div>

        {/* Ordered products list — this was missing before */}
        <div className="py-3 divide-y divide-kraft-100">
          {o.items?.map((item, idx) => (
            <div key={idx} className="py-2 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded border border-kraft-200" />
                )}
                <span className="font-medium">{item.name}</span>
                <span className="text-ink-600">× {item.quantity}</span>
              </div>
              <span className="font-semibold">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        {o.shippingAddress && (
          <div className="pt-2 border-t border-kraft-200 text-xs text-ink-600">
            <span className="font-semibold text-ink-900">Deliver to: </span>
            {o.shippingAddress.street}, {o.shippingAddress.city}, {o.shippingAddress.zipCode}
          </div>
        )}
      </div>
    ))}
    {orders.length === 0 && <p className="text-ink-600 text-sm">No orders yet.</p>}
  </div>
)}