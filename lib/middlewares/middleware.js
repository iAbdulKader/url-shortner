import nextConnect from 'next-connect';
import cors from 'cors';

const middleware = nextConnect();

middleware
  .use(cors())

export default middleware;