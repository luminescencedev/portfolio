import AnimatedRoutes from "./AnimatedRoutes";
import { useLocomotiveScroll } from "./hooks/useLocomotiveScroll";

export default function Root() {
  useLocomotiveScroll();
  return <AnimatedRoutes />;
}
