import { useLoading } from "../contexts/LoadingContext";

export const GlobalLoadingIndicator = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* 这里可以放置你的加载动画或图标 */}
      <div
        className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
        role="status"
      >
        <span className="visually-hidden"></span>
      </div>
    </div>
  );
};
