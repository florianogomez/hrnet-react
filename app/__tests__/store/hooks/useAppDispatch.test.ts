import { renderHook } from "@testing-library/react";
import { useAppDispatch } from "../../../store/hooks/useAppDispatch";
import { useDispatch } from "react-redux";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

describe("useAppDispatch", () => {
  it("should return the typed dispatch function from react-redux", () => {
    const mockDispatch = jest.fn();
    ((useDispatch as unknown) as jest.Mock).mockReturnValue(mockDispatch);
    const { result } = renderHook(() => useAppDispatch());
    expect(result.current).toBe(mockDispatch);
    expect(useDispatch).toHaveBeenCalled();
  });
});
