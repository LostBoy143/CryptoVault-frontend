const API_BASE = "http://localhost:5000/api";

export async function signupUser(userData) {
  const res = await fetch(
    `${API_BASE}/auth/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }
  );
  return res.json();
}

export async function loginUser(userData) {
  const res = await fetch(
    `${API_BASE}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }
  );
  return res.json();
}

export async function fetchProfile(token) {
  const res = await fetch(
    `${API_BASE}/user/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.json();
}
