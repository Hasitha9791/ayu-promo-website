// vercel-middleware for basic auth protection
// Add this as middleware.js in your project root

export function middleware(request) {
  const basicAuth = request.headers.get('authorization');
  const url = request.nextUrl;

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    // Set your username and password here
    if (user === 'ayu' && pwd === 'AyuHealth2024!') {
      return Response.next();
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Ayu Health Suite - Secure Area"',
    },
  });
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};
