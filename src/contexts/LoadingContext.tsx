import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// 为context值定义一个接口
interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

// 使用接口作为createContext的泛型参数，并提供匹配的默认值
const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setIsLoading: () => {}, // 这里是一个不执行任何操作的函数，但它现在符合期望的类型
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  // 现在value对象的类型匹配了LoadingContext的期望类型
  const value = { isLoading, setIsLoading };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};
