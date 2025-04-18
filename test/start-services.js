const path = require('path');
const spawn = require('cross-spawn');

const services = {
  auth: {
    name: 'auth service',
    path: '../../auth-service/backend',
  },
  users: {
    name: 'users service',
    path: '../../users-service/backend',
  },
};

const targets = process.argv.slice(2);
const selected = targets.includes('all') ? Object.keys(services) : targets;

selected.forEach((key) => {
  const service = services[key];
  console.log(`🚀 Starting ${service.name}...`);

  const child = spawn('npm', ['run', 'start:dev'], {
    cwd: path.resolve(__dirname, service.path),
    stdio: 'inherit',
    shell: false
  });

  child.on('error', (err) => {
    console.error(`❌ Failed to start ${service.name}:`, err.message || err);
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      console.warn(`⚠️ ${service.name} exited with code ${code}`);
    }
  });
});
