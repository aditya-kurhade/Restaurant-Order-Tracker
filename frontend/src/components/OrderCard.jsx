import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function OrderCard({ order, onStatusUpdated }) {
  const [loading, setLoading] = useState(false)

  const handleNext = async () => {
    if (order.status === 'Completed') {
      return
    }

    try {
      setLoading(true)
      await fetch(`${API_URL}/orders/${order.id}`, {
        method: 'PUT',
      })
      onStatusUpdated()
    } catch (error) {
      console.error('Failed to update order:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <article className="order-card">
      <p>{order.customer_name}</p>
      <p>{order.item}</p>
      <p>{order.status}</p>
      <button type="button" onClick={handleNext} disabled={order.status === 'Completed' || loading}>
        {loading ? 'Updating...' : 'Next'}
      </button>
    </article>
  )
}

export default OrderCard