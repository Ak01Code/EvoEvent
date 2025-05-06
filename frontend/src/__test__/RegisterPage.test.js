/* eslint-env jest */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"; // Add this import for toBeInTheDocument matcher
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the API module instead of axios directly
jest.mock("../lib/api", () => {
  return {
    __esModule: true,
    default: {
      post: jest.fn(),
    },
  };
});

// Import the actual API to be able to mock it
import api from "../lib/api";
import Register from "../Pages/Register";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  Link: ({ to, children, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

// Mock toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("Register Page with react-hook-form and axios", () => {
  const mockNavigate = jest.fn();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const renderWithProviders = (ui) => {
    return render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    mockNavigate.mockClear();
    jest.clearAllMocks();
  });

  it("shows validation errors when inputs are empty", async () => {
    renderWithProviders(<Register />);

    // Get the form and submit it directly, bypassing the button click
    const form = screen.getByRole("form");
    fireEvent.submit(form);

    // Wait for validation errors to appear
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    const passwordErrors = await screen.findAllByText(/password is required/i);
    expect(passwordErrors.length).toBeGreaterThan(0);
  });

  it("shows error for invalid email", async () => {
    renderWithProviders(<Register />);

    // Use an invalid email format
    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: "invalidEmail" },
    });

    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: "123456" },
    });

    // Submit the form
    const form = screen.getByRole("form");
    fireEvent.submit(form);

    // Check for the validation error with findByText instead of getByText
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
  });

  it("redirects to /login on successful register", async () => {
    api.post.mockResolvedValue({
      status: 201,
    });

    renderWithProviders(<Register />);
    fireEvent.change(screen.getByPlaceholderText(/Your full name/i), {
      target: { value: "jay" },
    });
    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: "jay@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "123456" },
    });

    // Submit the form
    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
