import { renderHook } from "@testing-library/react";
import { useAppSelector } from "../../../store/hooks/useAppSelector";
import { useSelector } from "react-redux";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

describe("useAppSelector", () => {
  it("should call useSelector with the provided selector and return its value", () => {
    const mockSelector = jest.fn((state) => state.value);
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => selector({ value: 42 }));
    const { result } = renderHook(() => useAppSelector(mockSelector));
    expect(result.current).toBe(42);
    expect(mockSelector).toHaveBeenCalledWith({ value: 42 });
    expect(useSelector).toHaveBeenCalled();
  });
});
