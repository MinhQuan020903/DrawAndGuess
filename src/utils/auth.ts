export default async function apiAuthSignIn(
  credentials: Record<'username' | 'password', string> | undefined
) {
  console.log(
    '🚀 ~ file: auth.ts ~ line 1 ~ apiAuthSignIn ~ credentials',
    credentials
  );
  try {
    const backendUrl = process.env.BACKEND_URL;
    console.log('🚀 ~ backendUrl:', backendUrl);
    const response = await fetch(
      `http://localhost:8081/api/v1/auth/authenticate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials?.username,
          password: credentials?.password,
        }),
      }
    );

    //if 401 unauthorized
    if (!response.ok) {
      return new Error('Invalid credentials');
    }

    const data = await response.json();
    console.log('🚀 ~ data:', data);
    //verify jwt access token
    // const decoded = jwt.verify(data.accessToken, process.env.JWT_SECRET);
    if (data.error) {
      return {
        error: data.error,
      };
    }

    const userID = data.userID;
    // return data.data;
    return { ...data, userID };
  } catch (error) {
    return { error: error.message };
  }
}
