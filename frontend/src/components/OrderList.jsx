import { useEffect, useState } from 'react'
import OrderCard from './OrderCard.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function OrderList({ refreshKey }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchOrders = async () => {
    setError('')
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/orders`)

      if (!response.ok) {
        throw new Error('Request failed')
      }

      const data = await response.json()
      setOrders(data)
    } catch (error) {
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [refreshKey])

  const preparingOrders = orders.filter((order) => order.status === 'Preparing')
  const readyOrders = orders.filter((order) => order.status === 'Ready')
  const completedOrders = orders.filter((order) => order.status === 'Completed')
  const isEmpty = !loading && !error && orders.length === 0

  return (
    <section className="card">
      <h2>Orders</h2>
      {loading && <p>Loading orders...</p>}
      {error && <p className="error-text">{error}</p>}
      {isEmpty && <p className="empty-text">No orders yet.</p>}
      <div className="orders-grid">
        <div>
          <h3>Preparing</h3>
          {preparingOrders.map((order) => (
            <OrderCard key={order.id} order={order} onStatusUpdated={fetchOrders} />
          ))}
        </div>
        <div>
          <h3>Ready</h3>
          {readyOrders.map((order) => (
            <OrderCard key={order.id} order={order} onStatusUpdated={fetchOrders} />
          ))}
        </div>
        <div>
          <h3>Completed</h3>
          {completedOrders.map((order) => (
            <OrderCard key={order.id} order={order} onStatusUpdated={fetchOrders} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default OrderList