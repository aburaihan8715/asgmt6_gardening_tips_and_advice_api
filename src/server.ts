import mongoose from 'mongoose';
import { app } from './app';
import config from './config';
import { Server } from 'http';
// import seedSuperAdmin from './super-admin';

let server: Server;

async function main() {
  try {
    const { ConnectionStates } = await mongoose.connect(
      config.database_url_atlas as string,
    );

    if (ConnectionStates.connected) {
      console.log('Db is connected');
      // CREATE SUPER ADMIN
      // await seedSuperAdmin();
    }

    app.listen(config.port, () => {
      console.log(`App is listening at http://localhost:${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

process.on('unhandledRejection', () => {
  console.log(`😈 unhandledRejection is detected , shutting down ...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});

// ============End=============
