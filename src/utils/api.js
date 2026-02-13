const API = import.meta.env.VUE_APP_API;

export const loginRequest = (user) => {
  return new Promise ((resolve, reject) => {
    fetch(`${API}/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((result) => resolve(result.data.user_token))
      .catch((error) => reject(error));
  });
}
