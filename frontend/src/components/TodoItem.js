import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Grid from '@mui/material/Grid';
import useCompleteTodo from '../hooks/useCompleteTodo';
import useDeleteTodo from '../hooks/useDeleteTodo';

export default function TodoItem({ task, tasks, setTasks }) {
    const labelId = `checkbox-list-label-${task.id}`;
    const { handleCompleteTodo } = useCompleteTodo({ tasks, setTasks });
    const { handleDeleteTodo } = useDeleteTodo({ tasks, setTasks });

    return (
        <ListItem
            key={task.id}
        >
            <Grid container spacing={1}>
                <Grid item xs={12} sm={1}>
                    <ListItemIcon>
                        <Checkbox onClick={() => { handleCompleteTodo(task) }}
                            edge="start"
                            checked={task.completed}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': labelId }}
                        />
                    </ListItemIcon>
                </Grid>
                <Grid item xs={12} sm={7}>
                    <ListItemText id={labelId} primary={task.description} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Due date" value={task.dueDate ? dayjs(task.dueDate) : null} />
                    </LocalizationProvider>
                    <IconButton edge="end" aria-label="comments">
                        <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="comments" onClick={() => {
                        if (window.confirm("Are you sure you want to delete this task?")) {
                            handleDeleteTodo(task);
                        }
                    }}>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </ListItem>
    )
}