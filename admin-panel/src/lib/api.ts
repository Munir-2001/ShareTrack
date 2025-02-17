// export const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// export async function fetchUsers() {
//   try {
//     const response = await fetch(`${API_URL}/users`);
//     if (!response.ok) throw new Error("Failed to fetch users");

//     return response.json();
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     return null;
//   }
// }

// export async function updateUserStatus(userId: string, isActive: boolean) {
//   try {
//     const response = await fetch(`${API_URL}/users/${userId}/status`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ isActive }),
//     });

//     if (!response.ok) throw new Error("Failed to update user status");

//     return response.json();
//   } catch (error) {
//     console.error("Error updating user status:", error);
//     return null;
//   }
// }

const API_URL = "http://localhost:5001/api/admin"; // ✅ Update with your backend URL

export const adminLogin = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Failed to login");
    }

    return data; // ✅ Returns { message: "Admin login successful", token: "JWT_TOKEN" }
  } catch (error) {
    console.error("❌ Admin login failed:", error);
    throw error;
  }
};

export async function fetchUsers() {
  try {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error("Failed to fetch users");

    return response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
}

export async function updateUserStatus(userId: string, isActive: boolean) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });

    if (!response.ok) throw new Error("Failed to update user status");

    return response.json();
  } catch (error) {
    console.error("Error updating user status:", error);
    return null;
  }
}