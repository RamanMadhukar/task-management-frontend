import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { connectSocket, disconnectSocket, getSocket, SOCKET_EVENTS } from '../utils/socket'
import { socketTaskCreated, socketTaskUpdated, socketTaskDeleted } from '../app/slices/taskSlice'
import { addNotification } from '../app/slices/notificationsSlice'

export const useSocket = () => {
    const dispatch = useDispatch()
    const { token, user } = useSelector((s) => s.auth)
    const socketRef = useRef(null)

    useEffect(() => {
        if (!token || !user) return

        const socket = connectSocket(token)
        socketRef.current = socket

        // Join user's personal room
        socket.emit(SOCKET_EVENTS.JOIN_ROOM, `user:${user.id || user._id}`)

        // ── Task events ──────────────────────────────────────
        socket.on(SOCKET_EVENTS.TASK_CREATED, (task) => {
            dispatch(socketTaskCreated(task))
            // Only notify if someone else created it
            if (task.createdBy?._id !== (user.id || user._id)) {
                const msg = `New task "${task.title}" was created`
                dispatch(addNotification({ type: 'task_created', message: msg, taskId: task._id }))
                toast(msg, { icon: '✅', duration: 4000 })
            }
        })

        socket.on(SOCKET_EVENTS.TASK_UPDATED, (task) => {
            dispatch(socketTaskUpdated(task))
        })

        socket.on(SOCKET_EVENTS.TASK_DELETED, ({ id }) => {
            dispatch(socketTaskDeleted(id))
        })

        socket.on(SOCKET_EVENTS.TASK_ASSIGNED, (data) => {
            const msg = `You were assigned to "${data.task?.title}"`
            dispatch(addNotification({ type: 'task_assigned', message: msg, taskId: data.task?._id }))
            toast(msg, { icon: '📋', duration: 5000 })
            dispatch(socketTaskUpdated(data.task))
        })

        socket.on(SOCKET_EVENTS.NOTIFICATION, (notification) => {
            dispatch(addNotification(notification))
        })

        socket.on('connect_error', () => {
            // Silent fail — app works without socket
        })

        return () => {
            socket.off(SOCKET_EVENTS.TASK_CREATED)
            socket.off(SOCKET_EVENTS.TASK_UPDATED)
            socket.off(SOCKET_EVENTS.TASK_DELETED)
            socket.off(SOCKET_EVENTS.TASK_ASSIGNED)
            socket.off(SOCKET_EVENTS.NOTIFICATION)
        }
    }, [token, user, dispatch])

    // Disconnect on logout
    useEffect(() => {
        if (!token) disconnectSocket()
    }, [token])

    return { socket: socketRef.current }
}

export const useSocketStatus = () => {
    const socket = getSocket()
    return socket?.connected || false
}