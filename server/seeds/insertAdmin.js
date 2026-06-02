const pool = require('../db/database');
const bcrypt = require('bcrypt');

async function main() {
  const hashedPassword = await bcrypt.hash('adminpassword', 10);

  await pool.query(
    `INSERT INTO users (email, password, name, is_admin) VALUES ($1, $2, $3, $4)`,
    ['admin@email.com', hashedPassword, 'Admin User', 1]
  );

  console.log('✅ Admin user inserted!');
  await pool.end();
}

main().catch((err) => {
  console.error('❌ Failed to insert admin:', err.message);
  process.exit(1);
});
