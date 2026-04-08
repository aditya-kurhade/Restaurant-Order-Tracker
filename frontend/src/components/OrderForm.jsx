import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function OrderForm({ onOrderCreateStart, onOrderCreated }) {
  const [customerName, setCustomerName] = useState('')
  const [item, setItem] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const trimmedCustomerName = customerName.trim()
    const trimmedItem = item.trim()

    if (!trimmedCustomerName || !trimmedItem) {
      setError('Please enter customer name and item')
      return
    }

    try {
      if (onOrderCreateStart) {
        onOrderCreateStart()
      }

      setLoading(true)
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: trimmedCustomerName,
          item: trimmedItem,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || 'Request failed')
      }

      setCustomerName('')
      setItem('')
      if (onOrderCreated) {
        onOrderCreated()
      }
    } catch (error) {
      setError(error.message || 'Failed to create order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card">
      <h2>Add Order</h2>
      <form className="stack" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Customer name"
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Item"
          value={item}
          onChange={(event) => setItem(event.target.value)}
          required
        />
        <button type="submit" disabled={loading || !customerName.trim() || !item.trim()}>
          {loading ? 'Adding...' : 'Add Order'}
        </button>
      </form>
      {error && <p className="error-text">{error}</p>}
    </section>
  )
}

export default OrderForm