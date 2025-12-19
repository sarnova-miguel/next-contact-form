import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignUpForm } from '../signup-form';
import { createContact } from '@/server/contact';

// Mock the server action
jest.mock('@/server/contact', () => ({
  createContact: jest.fn(),
}));

// Mock the toast notifications
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('SignUpForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the form with all fields', () => {
      render(<SignUpForm />);

      expect(screen.getByRole('region', { name: /sign up form/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it('should render submit and reset buttons', () => {
      render(<SignUpForm />);

      expect(screen.getByRole('button', { name: /submit newsletter signup form/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reset form to clear all fields/i })).toBeInTheDocument();
    });

    it('should render the form title and description', () => {
      render(<SignUpForm />);

      expect(screen.getByText('Sign Up Form')).toBeInTheDocument();
      expect(screen.getByText(/join our newsletter to get the latest news and discounts/i)).toBeInTheDocument();
    });

    it('should render character counter for message field', () => {
      render(<SignUpForm />);

      expect(screen.getByText('0/1000 characters')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show validation error for name less than 2 characters when submitting', async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'A');

      // Try to submit to trigger validation
      const submitButton = screen.getByRole('button', { name: /submit newsletter signup form/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Name must be at least 2 characters.')).toBeInTheDocument();
      });
    });

    it('should show validation error for name more than 50 characters when submitting', async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.click(nameInput);
      await user.paste('A'.repeat(51));

      // Try to submit to trigger validation
      const submitButton = screen.getByRole('button', { name: /submit newsletter signup form/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Name must be at most 50 characters.')).toBeInTheDocument();
      });
    });

    it('should show validation error for invalid email when submitting', async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'invalid-email');

      // Try to submit to trigger validation
      const submitButton = screen.getByRole('button', { name: /submit newsletter signup form/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
      });
    });

    it('should show validation error for phone less than 7 characters when submitting', async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      const phoneInput = screen.getByLabelText(/phone/i);
      await user.type(phoneInput, '12345');

      // Try to submit to trigger validation
      const submitButton = screen.getByRole('button', { name: /submit newsletter signup form/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Phone Number must be at least 7 characters.')).toBeInTheDocument();
      });
    });

    it('should show validation error for phone more than 10 characters when submitting', async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      const phoneInput = screen.getByLabelText(/phone/i);
      await user.type(phoneInput, '12345678901');

      // Try to submit to trigger validation
      const submitButton = screen.getByRole('button', { name: /submit newsletter signup form/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Phone Number must be at most 10 characters.')).toBeInTheDocument();
      });
    });

    it('should show validation error for message more than 1000 characters when submitting', async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      const messageInput = screen.getByLabelText(/message/i);
      // Use paste instead of type for performance with large strings
      await user.click(messageInput);
      await user.paste('A'.repeat(1001));

      // Try to submit to trigger validation
      const submitButton = screen.getByRole('button', { name: /submit newsletter signup form/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Message must be at most 1000 characters.')).toBeInTheDocument();
      }, { timeout: 10000 });
    });
  });

  describe('User Interactions', () => {
    it('should update character counter when typing in message field', async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      const messageInput = screen.getByLabelText(/message/i);
      await user.type(messageInput, 'Hello World');

      await waitFor(() => {
        expect(screen.getByText(/11\/1000 characters/i)).toBeInTheDocument();
      });
    });

    it('should reset form when reset button is clicked', async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      // Fill in the form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone/i), '1234567890');
      await user.type(screen.getByLabelText(/message/i), 'Test message');

      // Click reset button
      const resetButton = screen.getByRole('button', { name: /reset form to clear all fields/i });
      await user.click(resetButton);

      // Check that all fields are cleared
      await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toHaveValue('');
        expect(screen.getByLabelText(/email/i)).toHaveValue('');
        expect(screen.getByLabelText(/phone/i)).toHaveValue('');
        expect(screen.getByLabelText(/message/i)).toHaveValue('');
      });
    });

    it('should have proper accessibility attributes', () => {
      render(<SignUpForm />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const phoneInput = screen.getByLabelText(/phone/i);
      const messageInput = screen.getByLabelText(/message/i);

      expect(nameInput).toHaveAttribute('aria-required', 'true');
      expect(emailInput).toHaveAttribute('aria-required', 'true');
      expect(phoneInput).toHaveAttribute('aria-required', 'true');
      expect(messageInput).toHaveAttribute('aria-required', 'false');
    });
  });

  describe('Form Submission', () => {
    it('should have submit button enabled with valid data', async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      // Fill in the form with valid data
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone/i), '1234567890');
      await user.type(screen.getByLabelText(/message/i), 'Test message');

      // Submit button should be enabled
      const submitButton = screen.getByRole('button', { name: /submit newsletter signup form/i });
      expect(submitButton).not.toBeDisabled();
    });

    it('should not submit form with invalid data', async () => {
      const user = userEvent.setup();
      const mockCreateContact = createContact as jest.MockedFunction<typeof createContact>;

      render(<SignUpForm />);

      // Fill in the form with invalid email
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'invalid-email');
      await user.type(screen.getByLabelText(/phone/i), '1234567890');

      // Try to submit the form
      const submitButton = screen.getByRole('button', { name: /submit newsletter signup form/i });
      await user.click(submitButton);

      // createContact should not be called
      await waitFor(() => {
        expect(mockCreateContact).not.toHaveBeenCalled();
      });

      // Error message should be displayed
      expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    });

    it('should show validation errors when submitting empty form', async () => {
      const user = userEvent.setup();
      const mockCreateContact = createContact as jest.MockedFunction<typeof createContact>;

      render(<SignUpForm />);

      // Try to submit empty form
      const submitButton = screen.getByRole('button', { name: /submit newsletter signup form/i });
      await user.click(submitButton);

      // createContact should not be called
      expect(mockCreateContact).not.toHaveBeenCalled();

      // Validation errors should be displayed
      await waitFor(() => {
        expect(screen.getByText('Name must be at least 2 characters.')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in name field', async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      // Fill in the form with special characters
      await user.type(screen.getByLabelText(/name/i), "O'Brien-Smith");
      await user.type(screen.getByLabelText(/email/i), 'obrien@example.com');
      await user.type(screen.getByLabelText(/phone/i), '1234567890');

      // Check that the values are accepted
      expect(screen.getByLabelText(/name/i)).toHaveValue("O'Brien-Smith");
      expect(screen.getByLabelText(/email/i)).toHaveValue('obrien@example.com');
      expect(screen.getByLabelText(/phone/i)).toHaveValue('1234567890');
    });

    it('should accept maximum length inputs without validation errors', async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      const maxName = 'A'.repeat(50);

      // Fill in the form with maximum length name
      await user.click(screen.getByLabelText(/name/i));
      await user.paste(maxName);
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/phone/i), '1234567890');

      // Check that no validation errors appear
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText(/name must be at most 50 characters/i)).not.toBeInTheDocument();
      });
    });

    it('should handle minimum valid length inputs', async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      // Fill in the form with minimum valid lengths
      await user.type(screen.getByLabelText(/name/i), 'AB'); // 2 characters (minimum)
      await user.type(screen.getByLabelText(/email/i), 'a@b.co'); // valid email
      await user.type(screen.getByLabelText(/phone/i), '1234567'); // 7 characters (minimum)

      // Tab away to trigger validation
      await user.tab();

      // Check that no validation errors appear
      await waitFor(() => {
        expect(screen.queryByText(/name must be at least 2 characters/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/phone number must be at least 7 characters/i)).not.toBeInTheDocument();
      });
    });

    it('should handle email with various valid formats', async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      const validEmails = [
        'test@example.com',
        'user.name@example.co.uk',
        'user+tag@example.com',
      ];

      for (const email of validEmails) {
        const emailInput = screen.getByLabelText(/email/i);
        await user.clear(emailInput);
        await user.type(emailInput, email);
        await user.tab();

        // Should not show validation error
        await waitFor(() => {
          expect(screen.queryByText('Please enter a valid email address.')).not.toBeInTheDocument();
        });
      }
    });
  });
});

