import { type ReactNode } from "react";

type ShaderEffectProps = {
  children?: ReactNode;
};

const ShaderEffect = ({ children }: ShaderEffectProps) => {
  return <div>{children}</div>;
};

export default ShaderEffect;
