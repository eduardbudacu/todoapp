import 'dotenv/config';
import app from './server';

app.listen(process.env.PORT, () => {
  console.log(`Server started http://127.0.0.1:${process.env.PORT}`);
});
