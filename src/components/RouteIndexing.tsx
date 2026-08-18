import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const privatePrefixes = ["/admin", "/portal"];
const privatePaths = ["/client-login", "/handbook-special"];

const RouteIndexing = () => {
  const { pathname } = useLocation();
  const shouldNoIndex = privatePaths.includes(pathname) || privatePrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!shouldNoIndex) return null;

  return (
    <Helmet>
      <meta name="robots" content="noindex, nofollow" />
      <meta name="googlebot" content="noindex, nofollow" />
    </Helmet>
  );
};

export default RouteIndexing;
