import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("list", "routes/list.tsx"),
  route("amzn", "routes/amzn.tsx")
] satisfies RouteConfig;
