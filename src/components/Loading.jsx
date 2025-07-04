import { Spinner } from "@heroui/react";

const Loading = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-20 flex h-[100dvh] items-center justify-center bg-default-50">
      <Spinner />
    </div>
  );
};

export default Loading;
