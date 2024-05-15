// /api/user/route.ts

export async function POST(req: Request) {
  console.log('TTTTTT');

  try {
    const backendUrl = process.env.BACKEND_URL;
    const response = await fetch(`${backendUrl}/api/v1/auth/userinfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: 'ninh123' }), // { "username": "le_thi_b" }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // console.log('🚀 ~ POST ~ response:', response);

    const data = await response.json();
    const response2 = await fetch(`${backendUrl}/api/v1/auth/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: 'ninh123', password: '123456' }), // { "username": "le_thi_b" }
    });
    if (!response2.ok) {
      throw new Error('Network response was not ok');
    }
    // console.log('🚀 ~ POST ~ response2:', response2);
    const data2 = await response2.json();
    const updatedData = {
      ...data,
      accessToken: data2.access_token,
    };

    console.log('🚀 ~ updatedData:', updatedData);
    return new Response(
      JSON.stringify({
        data: updatedData,
      })
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ message: error }), { status: 500 });
  }
}

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     try {
//       console.log('TTTTTT');
//       const response = await fetch(
//         'http://localhost:8081/api/v1/auth/userinfo',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ username: 'le_thi_b' }), // { "username": "le_thi_b" }
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       console.log('🚀 ~ POST ~ response:', response);

//       const data = await response.json();
//       console.log('🚀 ~ POST ~ data:', data);
//       return new Response(
//         JSON.stringify({
//           data: data,
//         })
//       );
//     } catch (error) {
//       console.error('Error:', error);
//       return new Response(JSON.stringify({ message: 'error' }), {
//         status: 500,
//       });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']); // Set allowed methods
//     res.status(405).end('Method Not Allowed'); // Return 405 status for other methods
//   }
// }
