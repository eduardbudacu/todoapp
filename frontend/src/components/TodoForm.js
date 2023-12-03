import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import usePostTodo from '../hooks/usePostTodo';
export default function TodoForm({tasks, setTasks}) {
    const { isLoading, handleSubmit } = usePostTodo({tasks, setTasks});
    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="todo"
                        label="Todo"
                        name="todo"
                        autoFocus
                        placeholder="Press [Enter] to save"
                        disabled={isLoading}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}