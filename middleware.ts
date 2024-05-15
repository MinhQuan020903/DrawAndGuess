import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    console.log('psaddddddddddddddddjqwjdriwijq');
    console.log(request.nextauth.token);
    if (
      request.nextUrl.pathname.startsWith('/api/admin') &&
      request.nextauth.token?.role !== 'admin'
    ) {
      return NextResponse.redirect(new URL('/', request.url));

      //rewrite means redirect to the url but the url shown will still be the same before
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log(token);
        return !!token; //have to be boolean
        //the function middleware above will run only if the authorized function return true
        // it if is false, will be redirected to the page in the pages object
      },
    },
  }
);

export function middleware(req: NextRequest, event: NextFetchEvent) {
  try {
    const token = req.cookies.get('next-auth.session-token');
    console.log('🚀 ~ middleware ~ token:', token);

    if (!token?.value) {
      // Authentication failed
      return NextResponse.redirect(new URL('/auth/login', req.url)); // Redirect to login
    }

    // Authentication successful, continue to the requested page
    return NextResponse.next();
  } catch (error) {
    // Handle authentication errors
    console.error('Authentication error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during authentication.' },
      { status: 401 }
    );
  }
}
export const config = {};
//authorization is done in the middleware
