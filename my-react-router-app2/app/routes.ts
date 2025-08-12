import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("snake", "routes/snake.tsx"),
] satisfies RouteConfig;
