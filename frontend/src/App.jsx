import { useState } from 'react'
import './App.css'
import OrderForm from './components/OrderForm.jsx'
import OrderList from './components/OrderList.jsx'

function App() {
	const [refreshKey, setRefreshKey] = useState(0)

	const handleOrderCreated = () => {
		setRefreshKey((prev) => prev + 1)
	}

	return (
		<div className="app-shell">
			<h1>Restaurant Order Tracker</h1>
			<OrderForm onOrderCreated={handleOrderCreated} />
			<OrderList refreshKey={refreshKey} />
		</div>
	)
}

export default App
