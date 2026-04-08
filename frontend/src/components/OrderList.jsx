import { useCallback, useEffect, useState } from 'react'
import OrderCard from './OrderCard.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function OrderList({ refreshKey, onFetchStart, onFetchEnd }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchOrders = useCallback(async (options = {}) => {
    const { showLoader = true, showFetchToast = true } = options

    setError('')
    try {
      if (showLoader) {
        setLoading(true)
      }

      if (showFetchToast && onFetchStart) {
        onFetchStart()
      }

      const response = await fetch(`${API_URL}/orders`)

      if (!response.ok) {
        throw new Error('Request failed')
      }

      const data = await response.json()
      setOrders(data)
    } catch {
      setError('Failed to load orders')
    } finally {
      if (showLoader) {
        setLoading(false)
      }

      if (showFetchToast && onFetchEnd) {
        onFetchEnd()
      }
    }
  }, [onFetchEnd, onFetchStart])

  const refreshAfterCardAction = useCallback(() => {
    fetchOrders({ showLoader: false, showFetchToast: false })
  }, [fetchOrders])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders, refreshKey])

  const preparingOrders = orders.filter((order) => order.status === 'Preparing')
  const readyOrders = orders.filter((order) => order.status === 'Ready')
  const completedOrders = orders.filter((order) => order.status === 'Completed')
  const isEmpty = !loading && !error && orders.length === 0

  return (
    <section className="card">
      {loading && (
        <div className="orders-loader-wrap" aria-live="polite" aria-busy="true">
          <div className="circle-loader" aria-hidden="true" />
        </div>
      )}
      {error && <p className="error-text">{error}</p>}
      {isEmpty && <p className="empty-text">No orders yet.</p>}
      <div className="orders-grid" style={{ display: loading ? 'none' : 'grid' }}>
        <div>
          <h3>Preparing</h3>
          {preparingOrders.map((order) => (
            <OrderCard key={order.id} order={order} onStatusUpdated={refreshAfterCardAction} />
          ))}
        </div>
        <div>
          <h3>Ready</h3>
          {readyOrders.map((order) => (
            <OrderCard key={order.id} order={order} onStatusUpdated={refreshAfterCardAction} />
          ))}
        </div>
        <div>
          <h3>Completed</h3>
          {completedOrders.map((order) => (
            <OrderCard key={order.id} order={order} onStatusUpdated={refreshAfterCardAction} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default OrderList