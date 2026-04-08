import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function OrderCard({ order, onStatusUpdated }) {
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

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

  const handleDelete = async () => {
    if (order.status !== 'Completed') {
      return
    }

    try {
      setDeleting(true)
      const response = await fetch(`${API_URL}/orders/${order.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Request failed')
      }

      onStatusUpdated()
    } catch (error) {
      console.error('Failed to delete order:', error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <article className="order-card">
      <div className="card-top">
        <div>
          <p className="card-customer">{order.customer_name}</p>
          <p className="card-item">{order.item}</p>
        </div>
        <span className={`card-status status-${order.status.toLowerCase()}`}>
          {order.status}
        </span>
      </div>
      <div className="card-actions">
        <button type="button" className="btn-action" onClick={handleNext} disabled={order.status === 'Completed' || loading || deleting}>
          {loading ? 'Updating...' : 'Next'}
        </button>
        {order.status === 'Completed' && (
          <button
            type="button"
            className="btn-action btn-delete"
            onClick={handleDelete}
            disabled={deleting || loading}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>
    </article>
  )
}

export default OrderCard