import List from '@mui/material/List';
import TodoItem from './TodoItem';

export default function TodoList({items, tasks, setTasks}) {
    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {items.map(task => (
                <TodoItem task={task} tasks={tasks} setTasks={setTasks} />
            ))}
        </List>
    )
}