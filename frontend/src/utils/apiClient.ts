// -----------------------------------------
//                  USERS
// -----------------------------------------
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

// -----------------------------------------
//                   BEERS
// -----------------------------------------

// Fetch all beers (GET /beers)
export async function fetchBeers() {
  const response = await fetch("http://localhost:3001/beers");
  if (!response.ok) {
    throw new Error(`Error fetching beers. Status: ${response.status}`);
  }
  return response.json();
}

// Fetch a single beer by ID (GET /beers/:id)
export async function fetchBeer(id: string) {
  const response = await fetch(`http://localhost:3001/beers/${id}`);
  if (!response.ok) {
    throw new Error(`Error fetching beer. Status: ${response.status}`);
  }
  return response.json();
  // Returns { success: true, data: beerObject }
}

// Create a new beer (POST /beers)
export async function createBeer(newBeer: {
  name: string;
  type?: string;
  alcoholContent?: number;
  brewery?: string;
  // ...any other fields in your Beer model
}) {
  const response = await fetch("http://localhost:3001/beers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newBeer),
  });

  if (!response.ok) {
    throw new Error(`Error creating beer. Status: ${response.status}`);
  }
  return response.json();
  // Returns { success: true, data: createdBeer }
}

// Delete a beer by ID (DELETE /beers/:id)
export async function deleteBeer(id: string) {
  const response = await fetch(`http://localhost:3001/beers/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Error deleting beer. Status: ${response.status}`);
  }
  return response.json();
  // Returns { success: true, data: {} }
}
