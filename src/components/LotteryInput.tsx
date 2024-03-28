// components/LotteryInput.js

import React, { Dispatch, SetStateAction } from "react";

interface LotteryInputProps {
  values: number[];
  setValues: Dispatch<SetStateAction<number[]>>;
  //onValuesChange: (values: number[]) => void; // 指定onValuesChange的类型
}

function LotteryInput({ values, setValues }: LotteryInputProps) {
  const handleChange = (index: number, type: number) => (event: any) => {
    const newValues = [...values];

    let value = 1;
    if (type == 0) {
      value = Math.max(1, Math.min(32, Number(event.target.value)));
    } else {
      value = Math.max(1, Math.min(16, Number(event.target.value)));
    }

    newValues[index] = value;
    setValues(newValues);
    //onValuesChange(newValues); // 调用父组件的回调函数
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="label">红球（前6位）:</label>
        <div className="flex space-x-2">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              type="text"
              className="input input-bordered w-16 text-center text-red-500"
              min="1"
              max="32"
              value={values[index]}
              onChange={handleChange(index, 0)}
            />
          ))}
        </div>
      </div>
      <div>
        <label className="label">蓝球（第7位）:</label>
        <input
          type="text"
          className="input input-bordered w-16 text-center text-blue-500"
          min="1"
          max="16"
          value={values[6]}
          onChange={handleChange(6, 1)}
        />
      </div>
    </div>
  );
}

export default LotteryInput;
