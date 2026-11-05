import { cn } from '../lib/cn';

type AvatarProps = {
  src: string;
  alt: string;
  className?: string;
};

export function Avatar(props: AvatarProps) {
  return (
    <img
      src={`${props.src}${props.src.includes('?') ? '&' : '?'}s=96`}
      alt={props.alt}
      loading="lazy"
      onError={(event) => {
        event.currentTarget.src = `${import.meta.env.BASE_URL}logo.svg`;
      }}
      className={cn('shrink-0 rounded-full bg-surface-2 ring-1 ring-line', props.className)}
    />
  );
}
