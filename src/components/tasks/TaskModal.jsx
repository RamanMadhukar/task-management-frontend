import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { createTask, updateTask } from '../../app/slices/taskSlice'
import { Modal, InputField, Textarea, Select } from '../ui'
import toast from 'react-hot-toast'

export default function TaskModal({ isOpen, onClose, task = null }) {
    const dispatch = useDispatch()
    const { user } = useSelector((s) => s.auth)
    const { items: users } = useSelector((s) => s.users)
    const isEdit = !!task

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            title: task?.title || '',
            description: task?.description || '',
            status: task?.status || 'todo',
            priority: task?.priority || 'medium',
            assignee: task?.assignee?._id || '',
            dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
            tags: task?.tags?.join(', ') || '',
        },
    })

    useEffect(() => {
        if (isOpen) {
            reset({
                title: task?.title || '',
                description: task?.description || '',
                status: task?.status || 'todo',
                priority: task?.priority || 'medium',
                assignee: task?.assignee?._id || '',
                dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
                tags: task?.tags?.join(', ') || '',
            })
        }
    }, [isOpen, task, reset])

    const onSubmit = async (values) => {
        const payload = {
            ...values,
            tags: values.tags ? values.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
            assignee: values.assignee || undefined,
            dueDate: values.dueDate || undefined,
        }

        try {
            if (isEdit) {
                await dispatch(updateTask({ id: task._id, ...payload })).unwrap()
                toast.success('Task updated!')
            } else {
                await dispatch(createTask(payload)).unwrap()
                toast.success('Task created!')
            }
            onClose()
        } catch (e) {
            toast.error(e || 'Something went wrong')
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Task' : 'Create Task'} size="lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <InputField
                    label="Title *"
                    placeholder="Task title"
                    error={errors.title?.message}
                    {...register('title', { required: 'Title is required', minLength: { value: 2, message: 'Min 2 chars' } })}
                />

                <Textarea
                    label="Description"
                    placeholder="What needs to be done?"
                    {...register('description')}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Select label="Status" {...register('status')}>
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Done</option>
                    </Select>

                    <Select label="Priority" {...register('priority')}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        label="Due Date"
                        type="date"
                        {...register('dueDate')}
                    />

                    {user?.role === 'admin' && (
                        <Select label="Assign To" {...register('assignee')}>
                            <option value="">Unassigned</option>
                            {users.map((u) => (
                                <option key={u._id} value={u._id}>{u.name}</option>
                            ))}
                        </Select>
                    )}
                </div>

                <InputField
                    label="Tags (comma separated)"
                    placeholder="frontend, bug, urgent"
                    {...register('tags')}
                />

                <div className="flex gap-3 pt-2 justify-end">
                    <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Saving…
                            </span>
                        ) : isEdit ? 'Save Changes' : 'Create Task'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}