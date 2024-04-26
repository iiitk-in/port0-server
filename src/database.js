export default async function storeOTP(email, otp) {
  const info = await env.DB.prepare('INSERT INTO users (email, otp) VALUES (?1, ?2)')
    .bind(email, otp)
    .run();
  return info;
}
