export async function GET() {
  try {
    return new Response(JSON.stringify('Hello'), { status: 200 });
  } catch (e) {
    console.log('e', e);
    return new Response(JSON.stringify(e), { status: 500 });
  }
}
