import { HttpsCallableResult } from 'firebase/functions';
import { PropsWithChildren } from 'react';

export default function CommandButton({
  onClickHandler,
  children,
}: PropsWithChildren<{
  onClickHandler: () => Promise<HttpsCallableResult<string>>;
}>) {
  return (
    <button onClick={() => onClickHandler()} style={{ maxWidth: 200 }}>
      {children}
    </button>
  );
}
