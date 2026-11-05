import type { ComponentProps } from 'react';
import { type ButtonSize, type ButtonVariant, buttonClasses } from '../lib/button-classes';
import { cn } from '../lib/cn';

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button(props: ButtonProps) {
  const { variant, size, className, type, ...rest } = props;

  return <button type={type ?? 'button'} className={cn(buttonClasses(variant, size), className)} {...rest} />;
}
