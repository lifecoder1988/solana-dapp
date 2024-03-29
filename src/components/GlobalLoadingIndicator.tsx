import { useLoading } from "../contexts/LoadingContext";

export const GlobalLoadingIndicator = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* 这里可以放置你的加载动画或图标 */}
      <span className="loading loading-infinity loading-lg"></span>
    </div>
  );
};
