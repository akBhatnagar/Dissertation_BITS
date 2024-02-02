
const authenticated = false;
function requireAuth(nextState, replace, next) {
    if (!authenticated) {
      replace({
        pathname: "/",
        state: {nextPathname: nextState.location.pathname}
      });
    }
    next();
  }
