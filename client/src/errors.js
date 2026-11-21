// Turns any Axios error into a list of messages we can show the user
export function getErrors(err) {
  const data = err.response?.data;
  if (data?.errors?.length) return data.errors; // Joi list from the server
  if (data?.message) return [data.message];
  return ['Cannot reach the server. Is it running?'];
}
