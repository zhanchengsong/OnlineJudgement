import { ENV } from './../core/env.config';

interface AuthConfig {
  CLIENT_ID: string;
  CLIENT_DOMAIN: string;
  AUDIENCE: string;
  REDIRECT: string;
  SCOPE: string;
  NAMESPACE:string
};

export const AUTH_CONFIG: AuthConfig = {
  CLIENT_ID: 'WmcMlWdwZz2ClNWyMH8VCo1AQCK6aPQo',
  CLIENT_DOMAIN: 'onlinecodingjudge.auth0.com', // e.g., you.auth0.com
  AUDIENCE: '', // e.g., http://localhost:8083/api/
  REDIRECT: `${ENV.BASE_URI}/callback`,
  SCOPE: 'openid profile email',
  NAMESPACE: 'http://newgrad-developer.com/roles'
};
