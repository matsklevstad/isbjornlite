// frontend/utils/apiClient.ts
export async function fetchUsers() {
  const response = await fetch("http://localhost:3001/users"); // GET /users
  if (!response.ok) {
    throw new Error(`Error! status: ${response.status}`);
  }
  return response.json();
}

export async function createUser(name: string, email: string) {
  const response = await fetch("http://localhost:3001/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });

  if (!response.ok) {
    throw new Error(`Error! status: ${response.status}`);
  }
  return response.json();
}
