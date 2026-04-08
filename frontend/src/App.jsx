import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import OrderForm from './components/OrderForm.jsx'
import OrderList from './components/OrderList.jsx'

function App() {
	const [refreshKey, setRefreshKey] = useState(0)
	const [statusToast, setStatusToast] = useState({ message: '', type: 'info' })
	const [addFlowInProgress, setAddFlowInProgress] = useState(false)
	const toastTimerRef = useRef(null)

	const showStatusToast = useCallback((message, type = 'info', duration = 1800) => {
		if (toastTimerRef.current) {
			clearTimeout(toastTimerRef.current)
		}

		if (!message) {
			setStatusToast({ message: '', type: 'info' })
			return
		}

		setStatusToast({ message, type })

		if (duration > 0) {
			toastTimerRef.current = setTimeout(() => {
				setStatusToast({ message: '', type: 'info' })
			}, duration)
		}
	}, [])

	useEffect(() => {
		return () => {
			if (toastTimerRef.current) {
				clearTimeout(toastTimerRef.current)
			}
		}
	}, [])

	const handleOrderCreateStart = useCallback(() => {
		setAddFlowInProgress(true)
		showStatusToast('Adding order...', 'info', 0)
	}, [showStatusToast])

	const handleOrderCreated = useCallback(() => {
		setRefreshKey((prev) => prev + 1)
	}, [])

	const handleFetchStart = useCallback(() => {
		if (addFlowInProgress) {
			return
		}

		showStatusToast('Fetching from database...', 'info', 0)
	}, [addFlowInProgress, showStatusToast])

	const handleFetchEnd = useCallback(() => {
		if (addFlowInProgress) {
			showStatusToast('Order added and stored in database', 'success', 2200)
			setAddFlowInProgress(false)
			return
		}

		showStatusToast('', 'info')
	}, [addFlowInProgress, showStatusToast])

	return (
		<div className="app-shell">
			{statusToast.message && (
				<div className={`status-toast status-${statusToast.type}`}>{statusToast.message}</div>
			)}
			<h1>Restaurant Order Tracker</h1>
			<OrderForm onOrderCreateStart={handleOrderCreateStart} onOrderCreated={handleOrderCreated} />
			<OrderList
				refreshKey={refreshKey}
				onFetchStart={handleFetchStart}
				onFetchEnd={handleFetchEnd}
			/>
		</div>
	)
}

export default App
