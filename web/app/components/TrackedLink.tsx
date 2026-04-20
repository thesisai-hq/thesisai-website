'use client';

import { AnchorHTMLAttributes } from 'react';
import { trackWebEvent } from './track';

interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  eventName: string;
  eventProps?: Record<string, unknown>;
}

export default function TrackedLink({
  eventName,
  eventProps,
  onClick,
  ...rest
}: TrackedLinkProps) {
  return (
    <a
      {...rest}
      onClick={(event) => {
        trackWebEvent(eventName, eventProps);
        onClick?.(event);
      }}
    />
  );
}
