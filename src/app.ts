import { startServer } from './server';

// Run the App!
const start = async () => {
  const server = await startServer({});
};

start().catch((error) => {
  setTimeout(start, 1000);
});
